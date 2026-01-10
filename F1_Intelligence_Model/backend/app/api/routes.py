from fastapi import APIRouter
from app.models.schemas import PredictionRequest, PredictionResponse, Driver, DriversResponse
from app.services.prediction_service import predict_race

router = APIRouter()

@router.get("/")
def root():
    return {"message": "Welcome to the F1 Intelligence Model API!"}

@router.get("/health")
def health_check():
    return {"status": "ok"}

@router.post("/predict", response_model=PredictionResponse)
def predict(data: PredictionRequest):
    result = predict_race(
        grid=data.grid,
        driverId=data.driverId,
        constructorId=data.constructorId,
        circuitId=data.circuitId,
        year=data.year
    )
    return result

@router.get("/drivers", response_model=DriversResponse)
def get_drivers():
    """
    Returns a list of F1 drivers.
    """
    mock_drivers = [
        Driver(id=1, name="Max Verstappen", team="Red Bull"),
        Driver(id=2, name="Lewis Hamilton", team="Mercedes"),
        Driver(id=3, name="Lando Norris", team="McLaren"),
        Driver(id=4, name="Charles Leclerc", team="Ferrari"),
        Driver(id=5, name="Carlos Sainz", team="Ferrari"),
    ]
    return {"drivers": mock_drivers}
