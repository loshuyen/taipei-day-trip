from fastapi import APIRouter, Depends
from typing import Annotated
from fastapi.responses import JSONResponse
from routers.user import get_auth_user, UserOutput
from views.booking import *
from models.booking import BookingModel

router = APIRouter()

@router.get("/api/booking")
def get_booking_info(user: Annotated[UserOutput, Depends(get_auth_user)]) -> BookingInfo:
    if not user:
        return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    booking = BookingModel.get_unpaid_booking(user["id"])
    if not booking:
        return {"data": None}
    return {
        "data":{
            "attraction": {
                "id": booking["attraction_id"],
                "name": booking["attraction_name"],
                "address": booking["address"],
                "image": booking["image"]
            },
            "date": booking["date"],
            "time": booking["time"],
            "price": booking["price"],
        }
    }

@router.post("/api/booking")
def create_booking(input: BookingNew, user: Annotated[UserOutput, Depends(get_auth_user)]):
    try:
        if not user:
            return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
        input = input.model_dump()
        for value in input.values():
            if not value:
                return JSONResponse(status_code=400, content={"error": True, "message": "建立失敗，輸入不正確或其他原因"})
        BookingModel.create_booking(input["attractionId"], user["id"], input["date"], input["time"], input["price"])
        return {"ok": True}
    except:
        return JSONResponse(status_code=500, content={"error": True, "message": "伺服器內部錯誤"})

@router.delete("/api/booking")
def delete_booking(user: Annotated[UserOutput, Depends(get_auth_user)]):
    if not user:
            return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    BookingModel.delete_unpaid_booking(user["id"])
    return {"ok": True}

    
    