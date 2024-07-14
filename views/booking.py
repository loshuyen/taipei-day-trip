from pydantic import BaseModel
from datetime import date
from views.attraction import AttractionBase

class BookingBase(BaseModel):
    attraction: AttractionBase
    date: str
    time: str
    price: int

class BookingInfo(BaseModel):
    data: BookingBase | None

class BookingNew(BaseModel):
    attractionId: int
    date: str
    time: str
    price: int

class AttBase(BaseModel):
    id: int
    name: str
    address: str

class Booking(BaseModel):
    attraction: AttBase
    date: str
    time: str
    price: int
    is_paid: int
    created_time: str

class AllBooking(BaseModel):
    data: list[Booking] | None