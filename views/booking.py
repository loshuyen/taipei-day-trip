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