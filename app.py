from fastapi import *
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from routers import user, attraction, mrt, booking, order

app=FastAPI()
app.mount("/static", StaticFiles(directory="static"), name="static")

app.include_router(user.router, tags=["User"])
app.include_router(attraction.router, tags=["Attraction"])
app.include_router(mrt.router, tags=["MRT Station"])
app.include_router(booking.router, tags=["Booking"])
app.include_router(order.router, tags=["Order"])

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
@app.get("/record", include_in_schema=False)
async def record(request: Request):
	return FileResponse("./static/record.html", media_type="text/html")
@app.get("/profile", include_in_schema=False)
async def profile(request: Request):
	return FileResponse("./static/profile.html", media_type="text/html")