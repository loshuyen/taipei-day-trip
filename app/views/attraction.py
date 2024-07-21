from pydantic import BaseModel

class AttractionBase(BaseModel):
	id: int
	name: str
	address: str
	image: str | None

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
	
class AttractionResponse(BaseModel):
	data: Attraction

class Data(BaseModel):
	nextPage: int | None
	data: list[Attraction]