import pandas as pd
import numpy as np

def calculate_tyre_age(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate tyre age for each lap.
    Resets to 0 when 'FreshTyre' is True or a pit stop occurs.
    """
    # FastF1 usually provides TyreLife, but we can double check logic
    # or ensure it handles missing values.
    # For MVP, we trust FastF1's 'TyreLife' column if present.
    if 'TyreLife' in laps.columns:
        laps['TyreAge'] = laps['TyreLife'].fillna(0)
    else:
        # Fallback logic if needed (simple counter resets on Stint change)
        laps['TyreAge'] = laps.groupby(['Driver', 'Stint']).cumcount() + 1
        
    return laps

def calculate_fuel_penalty(laps: pd.DataFrame, total_laps: int = 57) -> pd.DataFrame:
    """
    Calculate fuel penalty.
    Approx 0.035s per lap of fuel burned.
    FuelPenalty = (TotalLaps - CurrentLap) * 0.035
    """
    # Inverse: Heavier at start.
    # Time = BaseTime + FuelPenalty + TyreDeg
    # FuelPenalty is high at Lap 1, 0 at Lap 57.
    fuel_cost_per_lap = 0.035 # seconds
    
    laps['FuelLoad'] = total_laps - laps['LapNumber']
    laps['FuelPenalty'] = laps['FuelLoad'] * fuel_cost_per_lap
    
    return laps

def encode_compounds(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Map tyre compounds to integers.
    """
    # Soft=1, Medium=2, Hard=3, Inter=4, Wet=5
    compound_map = {
        'SOFT': 1, 'MEDIUM': 2, 'HARD': 3, 
        'INTERMEDIATE': 4, 'WET': 5,
        'UNKNOWN': 0, 'TEST_UNKNOWN': 0
    }
    
    laps['CompoundIndex'] = laps['Compound'].map(compound_map).fillna(0)
    return laps

def prepare_features(laps: pd.DataFrame, total_race_laps: int = 57) -> pd.DataFrame:
    """
    Master feature engineering function.
    """
    df = laps.copy()
    
    # Filter valid laps
    # Remove out laps (TyreLife=1 but sector 1 is huge?), SC laps, etc.
    # For now, simplistic filtering
    df = df[df['TrackStatus'] == '1'] # Green flag only
    
    df = calculate_tyre_age(df)
    df = calculate_fuel_penalty(df, total_race_laps)
    df = encode_compounds(df)
    
    return df
