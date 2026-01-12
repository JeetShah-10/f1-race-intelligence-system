from pydantic import BaseModel
from typing import List

# Schema for the prediction endpoint
class PredictionRequest(BaseModel):
    grid: int
    driverId: int
    constructorId: int
    circuitId: int
    year: int

class PredictionResponse(BaseModel):
    top3_prediction: bool
    confidence: float

# Schema for the drivers endpoint
class Driver(BaseModel):
    id: int
    name: str
    team: str

class DriversResponse(BaseModel):
    drivers: List[Driver]
