from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Annotated
from routers.user import get_auth_user, UserOutput
from views.order import Order, PaymentResult, OrderPaid, OderAll
from models.order import OrderModel
from models.booking import BookingModel
from datetime import datetime
import requests
import json
import os

router = APIRouter()

@router.post("/api/orders")
def create_new_order(order: Order, user: Annotated[UserOutput, Depends(get_auth_user)]) -> PaymentResult:
    if not user:
        return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    try:
      order_number = datetime.now().strftime("%Y%m%d-%H%M%S-") + str(user["id"])
      booking_id = BookingModel.get_unpaid_booking(user["id"])["booking_id"]
      OrderModel.create_order(
          order_id=order_number,
          attraction_id=order.order.trip.attraction.id, 
          attraction_name=order.order.trip.attraction.name,
          attraction_address=order.order.trip.attraction.address,
          user_id=user["id"], 
          booking_id=booking_id,
          date=order.order.trip.date, 
          time=order.order.trip.time, 
          price=order.order.price, 
          is_paid=0, 
          contact_name=order.order.contact.name, 
          contact_email=order.order.contact.email, 
          contact_phone=order.order.contact.phone
          )
      url = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime"
      headers = {
          "Content-Type": "application/json",
          "x-api-key": os.getenv("TAPPAY_PARTNER_KEY")
      }
      data = {
            "prime": order.prime,
            "partner_key": os.getenv("TAPPAY_PARTNER_KEY"),
            "merchant_id": os.getenv("TAPPAY_MERCHANT_ID"),
            "amount": order.order.price,
            "order_number": order_number,
            "details": "guided tour",
            "cardholder": {
                "phone_number": "+886923456789",
                "name": "王小明",
                "email": "LittleMing@Wang.com",
            }
      }
      response = requests.post(url, headers=headers, data=json.dumps(data))
      result = response.json()
      response_data = {
              "number": result["order_number"],
              "payment": {
                  "status": result["status"],
                  "message": result["msg"]
              }
          }
      if result["status"] != 0:
          return {"data": response_data}
      elif result["status"] == 0:
          OrderModel.mark_as_paid(user_id=user["id"], order_id=result["order_number"])
          response_data["payment"]["message"] = "付款成功"
          return {"data": response_data}
      else:
          return JSONResponse(status_code=400, content={"error": True, "message": "訂單建立失敗，輸入不正確或其他原因"})
    except Exception as e:
          print(e)
          return JSONResponse(status_code=500, content={"error": True, "message": "伺服器內部錯誤"})
    
@router.get("/api/order")
def get_order_by_number(number: str, user: Annotated[UserOutput, Depends(get_auth_user)]) -> OrderPaid:
    if not user:
        return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    order = OrderModel.get_order_by_id(number)
    return order

@router.get("/api/orders/all")
def get_all_orders(user: Annotated[UserOutput, Depends(get_auth_user)]) -> OderAll:
    if not user:
        return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    orders = OrderModel.get_all_orders(user["id"])
    return orders