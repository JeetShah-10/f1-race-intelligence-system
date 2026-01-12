from fastapi import APIRouter
from app.services.prediction_service import predict, PredictionInput, PredictionOutput

router = APIRouter()

@router.post("/predict", response_model=PredictionOutput)
def post_predict(input: PredictionInput):
    """Make a prediction."""
    return predict(input)
