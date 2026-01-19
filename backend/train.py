# backend/train.py
import pandas as pd
from app.processing.data_processing import get_ml_ready_data
from app.ml.pace_model import PaceModel

# Assume data is in a CSV file called 'laps.csv'
try:
    laps_df = pd.read_csv('laps.csv')
except FileNotFoundError:
    print("laps.csv not found. Please provide the data in this file.")
    exit()


# Process data
ml_data = get_ml_ready_data(laps_df)

# Train models
pace_model = PaceModel()
pace_model.train_baseline_model(ml_data)
pace_model.fit_degradation_model(ml_data)

print("Models trained successfully.")
