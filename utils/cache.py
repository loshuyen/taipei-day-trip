import redis
import json
from decimal import Decimal

r = redis.Redis(host="localhost", port=6379, decode_responses=True)
r.flushall()

def convert_decimal_to_float(obj):
    if isinstance(obj, Decimal):
        return float(obj)

def set_attraction(id, attraction: dict) -> bool:
    attraction = json.dumps(attraction, default=convert_decimal_to_float)
    is_set = r.set(f"attraction_{id}", attraction)
    return is_set

def get_attraction(id) -> dict:
    attraction = r.get(f"attraction_{id}")
    if attraction:
        attraction = json.loads(attraction)
    return attraction