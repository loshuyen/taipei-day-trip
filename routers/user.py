from fastapi import *
from fastapi.responses import JSONResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Annotated
from pydantic import BaseModel, EmailStr
import os
import jwt
import datetime
from models.user import UserModel

router = APIRouter()

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

security = HTTPBearer(auto_error=False)
def get_auth_user(credentials: HTTPAuthorizationCredentials= Depends(security)):
	try:
		token = credentials.credentials
		decode_data = jwt.decode(token, os.getenv("TOKEN_SECRET_KEY"), algorithms="HS256")
		username_from_db = UserModel.get_username_by_email(decode_data["email"])
		if username_from_db[0] == decode_data["name"]:
			return decode_data
		return None
	except:
		return None
	
@router.post("/api/user")
def signup(user: UserInput):
	try:
		exist_user = UserModel.get_username_by_email(user.email)
		if exist_user:
			return JSONResponse(status_code=400, content={"error": True, "message": "註冊失敗，重複的Email"})
		UserModel.insert_new_user(user.name, user.email, user.password)
		return JSONResponse(status_code=200, content={"ok": True})
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "伺服器內部錯誤"})

@router.get("/api/user/auth")
def get_signedin_user(user: Annotated[UserOutput, Depends(get_auth_user)]) -> UserResponse:
	return {"data": user}

@router.put("/api/user/auth")
def signin(user: UserSignin):
	try:
		user_info = UserModel.get_user_by_email_password(user.email, user.password)
		if not user_info:
			return JSONResponse(status_code=400, content={"error": True, "message": "登入失敗，Email、密碼錯誤或尚未註冊"})
		user_obj = UserOutput(id=user_info[0], name=user_info[1], email=user_info[2]).model_dump()
		current_utc_time = datetime.datetime.now()
		future_utc_time = current_utc_time + datetime.timedelta(days=7)
		future_unix_timestamp = int(datetime.datetime.timestamp(future_utc_time))
		user_obj["exp"] = future_unix_timestamp
		token = jwt.encode(user_obj, os.getenv("TOKEN_SECRET_KEY"), algorithm="HS256")
		return JSONResponse(status_code=200, content={"token": token})
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "伺服器內部錯誤"})