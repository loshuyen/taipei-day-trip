from fastapi import APIRouter
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from db_config import pool

router = APIRouter()

class Mrt(BaseModel):
	data: list[str]

@router.get("/api/mrts")
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