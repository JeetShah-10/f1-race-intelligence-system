from fastapi import APIRouter
from app.schemas.simulation import SimulationRequest
from app.services.prediction_service import RaceRankPredictor

router = APIRouter()
predictor = RaceRankPredictor()

@router.post("/simulate/race")
def simulate_race(payload: SimulationRequest):
    result_df = predictor.predict(
        [driver.dict() for driver in payload.drivers]
    )

    return {
        "results": result_df.to_dict(orient="records")
    }