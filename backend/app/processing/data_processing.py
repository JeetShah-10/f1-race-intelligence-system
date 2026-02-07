# c:\Users\DEV\OneDrive\Pictures\Desktop\F1 Meow\backend\app\processing\data_processing.py
import pandas as pd

# TODO: Integrate with data loading logic.
# This might come from a library like fastf1, or a database, or a file.
# For now, this function assumes a DataFrame-like object is passed in.

def clean_laps(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Applies mandatory filters to the laps data.
    """
    laps = laps[
        (laps['IsAccurate'] == True) &
        (~laps['PitInLap']) &
        (~laps['PitOutLap']) &
        (~laps['Deleted']) &
        (~laps['TrackStatus'].isin(['2','4','5','6']))
    ]
    return laps

def get_ml_ready_data(session_laps: pd.DataFrame) -> pd.DataFrame:
    """
    Produces a single clean DataFrame that is ML-ready and Simulation-ready.
    """
    # Apply mandatory filters
    laps = clean_laps(session_laps)

    # Required columns
    required_columns = [
        "Driver",
        "Team",
        "LapNumber",
        "LapTime",
        "Sector1Time",
        "Sector2Time",
        "Sector3Time",
        "Compound",
        "TyreLife",
        "FreshTyre",
        "Stint",
        "TrackTemp",
        "AirTemp",
        "SpeedST",
        "SpeedFL",
        "SessionType",
        "GridPosition",
        "Position",
        "SpeedI1",
        "SpeedI2"
    ]
    
    # Select and reorder columns, fill missing optional columns with None
    for col in required_columns:
        if col not in laps.columns:
            laps[col] = None

    processed_df = laps[required_columns]

    # Convert LapTime to seconds
    if pd.api.types.is_timedelta64_dtype(processed_df['LapTime']):
        processed_df['LapTime'] = processed_df['LapTime'].dt.total_seconds()
    
    # Convert Sector times to seconds if they are timedeltas
    for col in ['Sector1Time', 'Sector2Time', 'Sector3Time']:
        if pd.api.types.is_timedelta64_dtype(processed_df[col]):
            processed_df[col] = processed_df[col].dt.total_seconds()


    return processed_df
