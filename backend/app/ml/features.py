import pandas as pd
import numpy as np


def calculate_tyre_age(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate tyre age for each lap.
    Resets to 0 when 'FreshTyre' is True or a pit stop occurs.
    """
    if 'TyreLife' in laps.columns:
        laps['TyreAge'] = laps['TyreLife'].fillna(0)
    else:
        # Fallback: simple counter resets on Stint change
        laps['TyreAge'] = laps.groupby(['Driver', 'Stint']).cumcount() + 1

    return laps


def calculate_fuel_load(laps: pd.DataFrame, total_laps: int = 57) -> pd.DataFrame:
    """
    Calculate explicit fuel load in kg.
    
    F1 cars start with ~110kg of fuel and burn ~1.6kg per lap.
    FuelLoad = max(0, start_fuel - (LapNumber - 1) * burn_rate)
    """
    start_fuel = 110.0     # kg
    burn_rate = 1.6        # kg per lap

    laps['FuelLoad'] = np.maximum(
        0.0,
        start_fuel - (laps['LapNumber'] - 1) * burn_rate
    )
    return laps


def calculate_fuel_penalty(laps: pd.DataFrame, total_laps: int = 57) -> pd.DataFrame:
    """
    Calculate fuel penalty (legacy method - kept for compatibility).
    FuelPenalty  (TotalLaps - CurrentLap) * 0.035s
    """
    fuel_cost_per_lap = 0.035  # seconds
    laps['FuelLoad_laps'] = total_laps - laps['LapNumber']
    laps['FuelPenalty'] = laps['FuelLoad_laps'] * fuel_cost_per_lap
    return laps


def calculate_traffic_index(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Calculate traffic index for each lap.
    
    TrafficIndex measures how much traffic a driver is in:
    - 0.0 = Clear air (gap to car ahead > 3s or in P1)
    - 1.0 = Maximum traffic (within 1s of car ahead)
    
    Computed from position changes and gap to car ahead.
    Uses a simple proxy: position relative to total cars,
    weighted by whether lapping in a pack.
    """
    if 'Position' not in laps.columns:
        laps['TrafficIndex'] = 0.0
        return laps

    # Group by race (Year + Round + LapNumber) to find gaps
    laps = laps.sort_values(['Year', 'Round', 'LapNumber', 'Position'])

    # For each lap in a race, calculate the gap to the car directly ahead
    traffic_indices = []
    
    for (year, round_name, lap_num), group in laps.groupby(['Year', 'Round', 'LapNumber']):
        group = group.sort_values('Position')
        n_cars = len(group)

        for i, (idx, row) in enumerate(group.iterrows()):
            if i == 0:
                # Leader - clear air
                traffic_indices.append(0.0)
            else:
                # Simple traffic proxy based on position density
                # Cars in the midfield have higher traffic index
                pos = row['Position']
                
                # Midfield clustering model
                mid = n_cars / 2
                distance_from_mid = abs(pos - mid) / mid  # 0 at middle, 1 at extremes
                base_traffic = max(0.0, 1.0 - distance_from_mid)
                
                # Scale: top 5 and last 5 tend to have less traffic
                if pos <= 3 or pos >= n_cars - 2:
                    base_traffic *= 0.3
                
                traffic_indices.append(round(min(1.0, base_traffic), 3))

    laps['TrafficIndex'] = traffic_indices
    return laps


def encode_compounds(laps: pd.DataFrame) -> pd.DataFrame:
    """Map tyre compounds to integers."""
    compound_map = {
        'SOFT': 1, 'MEDIUM': 2, 'HARD': 3,
        'INTERMEDIATE': 4, 'WET': 5,
        'UNKNOWN': 0, 'TEST_UNKNOWN': 0
    }
    laps['CompoundIndex'] = laps['Compound'].map(compound_map).fillna(0)
    return laps


def add_circuit_feature(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Ensure CircuitKey is present and cleaned.
    This becomes a categorical feature for multi-circuit models.
    """
    if 'CircuitKey' not in laps.columns:
        # Fallback: use Round name
        if 'Round' in laps.columns:
            laps['CircuitKey'] = laps['Round'].astype(str).str.lower().str.replace(' ', '_')
        else:
            laps['CircuitKey'] = 'unknown'
    else:
        laps['CircuitKey'] = laps['CircuitKey'].astype(str).str.lower().str.replace(' ', '_')

    return laps


def melt_sector_times(laps: pd.DataFrame) -> pd.DataFrame:
    """
    Transform sector-time columns (Sector1Time, Sector2Time, Sector3Time)
    into a long format with columns: Sector (1/2/3) and SectorTime (seconds).
    
    This triples the number of rows but enables sector-level model training.
    Each row represents one sector of one lap for one driver.
    """
    # Ensure sector times are in seconds
    for col in ['Sector1Time', 'Sector2Time', 'Sector3Time']:
        if col in laps.columns and hasattr(laps[col].iloc[0], 'total_seconds'):
            laps[col] = laps[col].apply(lambda x: x.total_seconds() if pd.notna(x) else None)

    # Keep all non-sector columns
    id_cols = [c for c in laps.columns if c not in ['Sector1Time', 'Sector2Time', 'Sector3Time']]

    sectors = []
    for sector_num, col_name in enumerate(['Sector1Time', 'Sector2Time', 'Sector3Time'], 1):
        if col_name not in laps.columns:
            continue
        chunk = laps[id_cols + [col_name]].copy()
        chunk['Sector'] = sector_num
        chunk = chunk.rename(columns={col_name: 'SectorTime'})
        # Drop rows with missing sector times
        chunk = chunk.dropna(subset=['SectorTime'])
        sectors.append(chunk)

    if sectors:
        return pd.concat(sectors, ignore_index=True)
    return pd.DataFrame()


def prepare_features(laps: pd.DataFrame, total_race_laps: int = 57) -> pd.DataFrame:
    """
    Master feature engineering function.
    Produces clean data ready for model training.
    """
    df = laps.copy()

    # Filter valid laps - green flag only
    if 'TrackStatus' in df.columns:
        df = df[df['TrackStatus'] == '1']

    df = calculate_tyre_age(df)
    df = calculate_fuel_load(df, total_race_laps)
    df = calculate_fuel_penalty(df, total_race_laps)
    df = encode_compounds(df)
    df = add_circuit_feature(df)
    df = calculate_traffic_index(df)

    return df


def prepare_sector_features(laps: pd.DataFrame, total_race_laps: int = 57) -> pd.DataFrame:
    """
    Feature engineering for sector-time model.
    
    Returns a DataFrame in long format with one row per sector per lap,
    including all features needed for the sector model:
      CircuitKey, Compound, TyreAge, FuelLoad, TrafficIndex, Sector, Driver, Team
    """
    df = prepare_features(laps, total_race_laps)
    df = melt_sector_times(df)
    return df
