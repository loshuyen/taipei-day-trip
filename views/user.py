from pydantic import BaseModel, EmailStr

class UserInput(BaseModel):
	name: str
	email: EmailStr
	password: str

class UserOutput(BaseModel):
	id: int
	name: str
	email: EmailStr

class UserResponse(BaseModel):
	data: UserOutput | None = None

class UserSignin(BaseModel):
	email: EmailStr
	password: str