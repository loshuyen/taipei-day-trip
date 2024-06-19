from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
from typing import Annotated
from pydantic import BaseModel, EmailStr
from mysql.connector import pooling
import os, dotenv
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import hashlib
import jwt
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import datetime, time

dotenv.load_dotenv()

dbconfig = {
  "database": "tdtDB",
  "user": "root",
  "password": os.getenv("MYSQL_PASSWORD"),
  "host": "localhost"
}
pool = pooling.MySQLConnectionPool(pool_name = "mypool", pool_size = 10, **dbconfig)

app=FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./static/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")

class Attraction(BaseModel):
	id: int
	name: str
	category: str
	description: str
	address: str
	transport: str
	mrt: str | None = None
	lat: float
	lng: float
	images: list[str]

class Data(BaseModel):
	nextPage: int | None
	data: list[Attraction]

class Error(BaseModel):
	error: bool
	message: str

class AttractionResponse(BaseModel):
	data: Attraction

class Mrt(BaseModel):
	data: list[str]

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
def get_current_user(credentials: HTTPAuthorizationCredentials= Depends(security)):
	try:
		token = credentials.credentials
		user = jwt.decode(token, os.getenv("TOKEN_SECRET_KEY"), algorithms="HS256")
		return user
	except:
		return None

@app.get("/api/attractions")
async def get_attraction_list(page: Annotated[int, Query(ge=0)], keyword: str | None = None) -> Data:
	try:
		db = pool.get_connection()
		cursor = db.cursor()
		if not keyword:
			sql_statement = "SELECT * FROM attraction LIMIT 13 OFFSET %s"
			vals = (page * 12, )
		else:	
			sql_statement = "SELECT * FROM attraction WHERE mrt=%s OR name LIKE %s LIMIT 13 OFFSET %s"
			vals = (keyword, '%' + keyword + '%', page * 12, )
		cursor.execute(sql_statement, vals)
		attractions = cursor.fetchall()
		response = {}
		response["data"] = []
		if len(attractions) == 0:
			response["nextPage"] = None
			return response
		if len(attractions) <= 12:
			response["nextPage"] = None
		else:
			response["nextPage"] = page + 1
		for i in range(min(12, len(attractions))):
			attraction_data = {}
			attraction_url = []
			cursor.execute("SELECT url FROM image WHERE attraction_id = %s", (attractions[i][0], ))
			urls = cursor.fetchall()
			for url in urls:
				attraction_url.append(url[0])
			attraction_data["id"] = attractions[i][0]
			attraction_data["name"] = attractions[i][1]
			attraction_data["category"] = attractions[i][2]
			attraction_data["description"] = attractions[i][3]
			attraction_data["address"] = attractions[i][4]
			attraction_data["transport"] = attractions[i][5]
			attraction_data["mrt"] = attractions[i][6]
			attraction_data["lat"] = attractions[i][7]
			attraction_data["lng"] = attractions[i][8]
			attraction_data["images"] = attraction_url
			response["data"].append(attraction_data)
		return response
	except:
		return JSONResponse(
		status_code=500,
		content={"error": True, "message": "伺服器內部錯誤"}
		)
	finally:
		cursor.close()
		db.close()

@app.get("/api/attraction/{attractionId}")
async def get_attraction(attractionId: int) -> AttractionResponse:
	try:
		db = pool.get_connection()
		cursor = db.cursor()
		cursor.execute("SELECT * FROM attraction WHERE id=%s", (attractionId, ))
		attration_info = cursor.fetchone()
		if not attration_info:
			return JSONResponse(
				status_code=400,
				content={"error": True, "message": "景點編號不正確"}
			)
		attraction_data = {}
		attraction_url = []
		cursor.execute("SELECT url FROM image WHERE attraction_id=%s", (attractionId, ))
		urls = cursor.fetchall()
		for url in urls:
			attraction_url.append(url[0])
		attraction_data["id"] = attration_info[0]
		attraction_data["name"] = attration_info[1]
		attraction_data["category"] = attration_info[2]
		attraction_data["description"] = attration_info[3]
		attraction_data["address"] = attration_info[4]
		attraction_data["transport"] = attration_info[5]
		attraction_data["mrt"] = attration_info[6]
		attraction_data["lat"] = attration_info[7]
		attraction_data["lng"] = attration_info[8]
		attraction_data["images"] = attraction_url
		return {"data": attraction_data}
	except:
		return JSONResponse(
				status_code=500,
				content={"error": True, "message": "伺服器內部錯誤"}
			)
	finally:
		cursor.close()
		db.close()

@app.get("/api/mrts")
async def get_all_mrt() -> Mrt:
	try:
		db = pool.get_connection()
		cursor = db.cursor()
		cursor.execute("SELECT mrt, COUNT(*) FROM attraction GROUP BY mrt ORDER BY COUNT(*) DESC")
		mrts = cursor.fetchall()
		data = []
		for mrt in mrts:
			if not mrt[0]:
				continue
			data.append(mrt[0])
		return {"data": data}
	except:
		return JSONResponse(
				status_code=500,
				content={"error": True, "message": "伺服器內部錯誤"}
			)
	finally:
		cursor.close()
		db.close()

@app.post("/api/user")
def signup(user: UserInput):
	try:
		db = pool.get_connection()
		cursor = db.cursor()
		cursor.execute("SELECT name FROM user WHERE email=%s;", (user.email, ))
		exist_user = cursor.fetchone()
		if exist_user:
			return JSONResponse(status_code=400, content={"error": True, "message": "註冊失敗，重複的Email"})
		hash = hashlib.sha256()
		password = user.password + os.getenv("HASH_SECRET")
		hash.update(password.encode("utf-8"))
		hashed_password = hash.hexdigest()
		cursor.execute("INSERT INTO user (name, email, password) VALUES (%s, %s, %s);", (user.name, user.email, hashed_password))
		db.commit()
		return JSONResponse(status_code=200, content={"ok": True})
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "伺服器內部錯誤"})
	finally:
		cursor.close()
		db.close()

@app.get("/api/user/auth")
def get_signedin_user(user: Annotated[UserOutput, Depends(get_current_user)]) -> UserResponse:
	try:
		db = pool.get_connection()
		cursor = db.cursor()
		cursor.execute("SELECT * FROM user WHERE email=%s and name=%s;", (user["email"], user["name"]))
		user_info = cursor.fetchone()
		if not user_info:
			return {"data": None}
		return {"data": user}
	except:
		return {"data": None}
	finally:
		cursor.close()
		db.close()

@app.put("/api/user/auth")
def signin(user: UserSignin):
	try:
		hash = hashlib.sha256()
		password = user.password + os.getenv("HASH_SECRET")
		hash.update(password.encode("utf-8"))
		hashed_password = hash.hexdigest()
		db = pool.get_connection()
		cursor = db.cursor()
		cursor.execute("SELECT * FROM user WHERE email=%s and password=%s;", (user.email, hashed_password))
		user_info = cursor.fetchone()
		if not user_info:
			return JSONResponse(status_code=400, content={"error": True, "message": "登入失敗，Email、密碼錯誤或尚未註冊"})
		userObj = UserOutput(id=user_info[0], name=user_info[1], email=user_info[2]).model_dump()
		current_utc_time = datetime.datetime.now()
		future_utc_time = current_utc_time + datetime.timedelta(days=7)
		future_unix_timestamp = int(time.mktime(future_utc_time.timetuple()))
		userObj["exp"] = future_unix_timestamp
		token = jwt.encode(userObj, os.getenv("TOKEN_SECRET_KEY"), algorithm="HS256")
		return JSONResponse(status_code=200, content={"token": token})
	except:
		return JSONResponse(status_code=500, content={"error": True, "message": "伺服器內部錯誤"})
	finally:
		cursor.close()
		db.close()