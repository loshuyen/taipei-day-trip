from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Annotated
from routers.user import get_auth_user, UserOutput
from views.order import Order, PaymentResult, OrderPaid

router = APIRouter()

@router.post("/api/orders")
def create_new_order(order: Order, user: Annotated[UserOutput, Depends(get_auth_user)]) -> PaymentResult:
    if not user:
        return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    
@router.get("/api/order/{orderNumber}")
def get_order(orderNumber: str, user: Annotated[UserOutput, Depends(get_auth_user)]) -> OrderPaid:
    if not user:
        return JSONResponse(status_code=403, content={"error": True, "message": "未登入系統，拒絕存取"})
    