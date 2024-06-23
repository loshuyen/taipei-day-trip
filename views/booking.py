from pydantic import BaseModel
from datetime import date
from views.attraction import AttractionBase

class BookingBase(BaseModel):
    attraction: AttractionBase
    date: date
    time: str
    price: int

class BookingInfo(BaseModel):
    data: BookingBase | None

class BookingNew(BaseModel):
    attractionId: int
    date: date
    time: str
    price: int