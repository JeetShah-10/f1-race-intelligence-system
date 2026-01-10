import joblib
import pandas as pd
from typing import Dict, Any

# Load the model and encoders
model = joblib.load("app/models/f1_model.pkl")
encoders = joblib.load("app/models/encoders.pkl")

def predict_race(grid: int, driverId: int, constructorId: int, circuitId: int, year: int) -> Dict[str, Any]:
    """
    Predicts the outcome of a race based on the input features.

    Args:
        grid (int): The starting grid position.
        driverId (int): The ID of the driver.
        constructorId (int): The ID of the constructor.
        circuitId (int): The ID of the circuit.
        year (int): The year of the race.

    Returns:
        dict: A dictionary containing the prediction and confidence score.
    """
    # Create a DataFrame from the input data
    input_data = pd.DataFrame({
        'grid': [grid],
        'driverId': [driverId],
        'constructorId': [constructorId],
        'circuitId': [circuitId],
        'year': [year]
    })

    # Encode the categorical features
    for col, encoder in encoders.items():
        if col in input_data.columns:
            # Use a try-except block to handle unseen labels
            try:
                input_data[col] = encoder.transform(input_data[col])
            except ValueError:
                # If the label is unseen, we can either assign a default value
                # or return an error. For simplicity, we'll assign -1.
                input_data[col] = -1

    # Make the prediction
    prediction = model.predict(input_data)[0]
    confidence = model.predict_proba(input_data)[0].max()

    return {
        "top3_prediction": bool(prediction),
        "confidence": confidence
    }

