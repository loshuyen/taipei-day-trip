from pydantic import BaseModel, EmailStr
from views.attraction import AttractionBase

class Contact(BaseModel):
    name: str
    email: EmailStr
    phone: str

class Trip(BaseModel):
    attraction: AttractionBase
    date: str
    time: str

class OrderBase(BaseModel):
    price: int
    trip: Trip
    contact: Contact

class Order(BaseModel):
    prime: str
    order: OrderBase

class PaymentBase(BaseModel):
    status: int
    message: str

class PaymentData(BaseModel):
    number: str
    payment: PaymentBase

class PaymentResult(BaseModel):
    data: PaymentData

class OrderPaidData(OrderBase):
    number: str
    status: int

class OrderPaid(BaseModel):
    data: OrderPaidData | None

class AttBase(BaseModel):
    id: int
    name : str
    address: str

class BookingBase(BaseModel):
    id: int
    attraction: AttBase
    date: str
    time: str

class OderAllBase(BaseModel):
    number: str
    price: int
    booking: BookingBase
    contact: Contact
    status: int
    created_time: str

class OderAll(BaseModel):
    data: list[OderAllBase] | None