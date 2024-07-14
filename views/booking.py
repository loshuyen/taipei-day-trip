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

class Booking(BaseModel):
    id: int
    attraction_name: str
    date: str
    time: str
    price: int
    is_paid: int
    created_time: str

class AllBooking(BaseModel):
    data: list[Booking] | None