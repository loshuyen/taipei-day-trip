from fastapi import *
from fastapi.responses import JSONResponse
from typing import Annotated
from models.attraction import AttractionModel
from views.attraction import *
from utils import cache

router = APIRouter()

def arrange_data(attraction_data: tuple, image_urls: list) -> dict:
	attraction_url = []
	for url in image_urls:
		attraction_url.append(url[0])
	data = {}
	data["id"] = attraction_data[0]
	data["name"] = attraction_data[1]
	data["category"] = attraction_data[2]
	data["description"] = attraction_data[3]
	data["address"] = attraction_data[4]
	data["transport"] = attraction_data[5]
	data["mrt"] = attraction_data[6]
	data["lat"] = attraction_data[7]
	data["lng"] = attraction_data[8]
	data["images"] = attraction_url
	return data

@router.get("/api/attractions")
async def get_attraction_list(page: Annotated[int, Query(ge=0)], keyword: str | None = None) -> Data:
	try:
		attractions = AttractionModel.get_attractions(keyword, page)
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
			image_urls = AttractionModel.get_images_by_attraction_id(attractions[i][0])
			attraction_data = arrange_data(attractions[i], image_urls)
			response["data"].append(attraction_data)
		return response
	except:
		return JSONResponse(
		status_code=500,
		content={"error": True, "message": "伺服器內部錯誤"}
		)

@router.get("/api/attraction/{attractionId}")
async def get_attraction(attractionId: int) -> AttractionResponse:
	try:
		attraction_data = cache.get_attraction(attractionId)
		if not attraction_data:
			attration_info = AttractionModel.get_attraction_by_id(attractionId)
			if not attration_info:
				return JSONResponse(
					status_code=400,
					content={"error": True, "message": "景點編號不正確"}
				)
			image_urls = AttractionModel.get_images_by_attraction_id(attractionId)
			attraction_data = arrange_data(attration_info, image_urls)
			cache.set_attraction(attractionId, attraction_data)
		return {"data": attraction_data}
	except Exception as e:
		print(e)
		return JSONResponse(
				status_code=500,
				content={"error": True, "message": "伺服器內部錯誤"}
			)