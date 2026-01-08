from pydantic import BaseModel
from typing import List

# Schema for the prediction endpoint
class PredictionRequest(BaseModel):
    track: str
    weather: str
    laps: int

class PredictionResponse(BaseModel):
    winner: str
    confidence: float

# Schema for the drivers endpoint
class Driver(BaseModel):
    id: int
    name: str
    team: str

class DriversResponse(BaseModel):
    drivers: List[Driver]
