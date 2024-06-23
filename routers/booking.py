from fastapi import APIRouter, Depends
from typing import Annotated
from routers.user import get_auth_user, UserOutput
from views.booking import *

router = APIRouter()

@router.get("/api/booking")
def get_booking_info(user: Annotated[UserOutput, Depends(get_auth_user)]) -> BookingInfo:
    pass

@router.post("/api/booking")
def create_booking(requestBody: BookingNew, user: Annotated[UserOutput, Depends(get_auth_user)]):
    pass

@router.delete("/api/booking")
def delete_booking(user: Annotated[UserOutput, Depends(get_auth_user)]):
    pass