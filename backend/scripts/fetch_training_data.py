# backend/scripts/fetch_training_data.py
"""
Multi-circuit, multi-year data ingestion pipeline using FastF1.

Fetches lap times, sector times, tyre data, and weather for all GPs
across multiple seasons and saves as per-circuit parquet files.

Usage:
    python scripts/fetch_training_data.py [--years 2021,2022,2023,2024] [--circuits bahrain,jeddah]
"""

import fastf1
import pandas as pd
import os
import sys
import argparse
from datetime import datetime

#  Setup Paths 
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT_DIR, 'cache', 'fastf1')
DATA_DIR = os.path.join(ROOT_DIR, 'data', 'raw')

# Enable Cache
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
fastf1.Cache.enable_cache(CACHE_DIR)

#  Columns to Extract 
COLUMNS_TO_KEEP = [
    'Time', 'Driver', 'DriverNumber', 'LapTime', 'LapNumber', 'Stint',
    'PitOutTime', 'PitInTime',
    'Sector1Time', 'Sector2Time', 'Sector3Time',
    'SpeedI1', 'SpeedI2', 'SpeedFL', 'SpeedST',
    'Compound', 'TyreLife', 'FreshTyre',
    'Team', 'TrackStatus', 'Position',
    'Year', 'Round', 'CircuitKey',
    'Rainfall', 'AirTemp', 'TrackTemp',
]

# Default years to fetch
DEFAULT_YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025]


def get_schedule(year: int) -> pd.DataFrame:
    """Get the event schedule for a given year."""
    try:
        schedule = fastf1.get_event_schedule(year)
        return schedule
    except Exception as e:
        print(f"   Could not get schedule for {year}: {e}")
        return pd.DataFrame()


def fetch_session_data(year: int, gp_name: str, session_type: str = 'R') -> pd.DataFrame:
    """Fetch and process a single session."""
    try:
        session = fastf1.get_session(year, gp_name, session_type)
        session.load()

        laps = session.laps.copy()
        
        # Add metadata
        laps['Year'] = year
        laps['Round'] = gp_name
        laps['CircuitKey'] = getattr(session.event, 'EventName', gp_name).lower().replace(' ', '_')
        
        # Try to get weather data
        try:
            weather = session.weather_data
            if weather is not None and len(weather) > 0:
                # Get average weather for the session
                avg_rain = weather['Rainfall'].any() if 'Rainfall' in weather.columns else False
                avg_air = weather['AirTemp'].mean() if 'AirTemp' in weather.columns else None
                avg_track = weather['TrackTemp'].mean() if 'TrackTemp' in weather.columns else None
                laps['Rainfall'] = avg_rain
                laps['AirTemp'] = avg_air
                laps['TrackTemp'] = avg_track
            else:
                laps['Rainfall'] = False
                laps['AirTemp'] = None
                laps['TrackTemp'] = None
        except Exception:
            laps['Rainfall'] = False
            laps['AirTemp'] = None
            laps['TrackTemp'] = None

        # Filter to available columns
        available = [c for c in COLUMNS_TO_KEEP if c in laps.columns]
        return laps[available]
        
    except Exception as e:
        print(f"   Error loading {year} {gp_name}: {e}")
        return pd.DataFrame()


def fetch_all_data(years: list, circuit_filter: list = None) -> dict:
    """
    Fetch data for all GPs across given years.
    Returns dict of {circuit_key: DataFrame}.
    """
    all_data = {}
    total_laps = 0
    
    for year in years:
        print(f"\n{'='*60}")
        print(f" Processing {year} Season")
        print(f"{'='*60}")
        
        schedule = get_schedule(year)
        if schedule.empty:
            continue
        
        # Filter to actual race rounds (exclude testing)
        rounds = schedule[schedule['EventFormat'] != 'testing'] if 'EventFormat' in schedule.columns else schedule
        
        for _, event in rounds.iterrows():
            gp_name = event.get('EventName', event.get('OfficialEventName', 'Unknown'))
            
            # Apply circuit filter if specified
            if circuit_filter:
                circuit_key = gp_name.lower().replace(' ', '_')
                if not any(f.lower() in circuit_key for f in circuit_filter):
                    continue
            
            print(f"\n    {gp_name} {year}...", end=" ")
            
            df = fetch_session_data(year, gp_name, 'R')
            
            if df.empty:
                continue
            
            circuit_key = df['CircuitKey'].iloc[0] if 'CircuitKey' in df.columns else gp_name.lower().replace(' ', '_')
            
            if circuit_key not in all_data:
                all_data[circuit_key] = []
            
            all_data[circuit_key].append(df)
            laps_count = len(df)
            total_laps += laps_count
            print(f" {laps_count} laps")
    
    print(f"\n{'='*60}")
    print(f" Total: {total_laps} laps across {len(all_data)} circuits")
    print(f"{'='*60}")
    
    return all_data


def save_data(all_data: dict):
    """Save per-circuit parquet files and a combined file."""
    timestamp = datetime.now().strftime("%Y%m%d")
    
    combined_frames = []
    
    for circuit_key, frames in all_data.items():
        combined = pd.concat(frames, ignore_index=True)
        combined_frames.append(combined)
        
        # Save per-circuit
        filename = f"{circuit_key}_laps.parquet"
        filepath = os.path.join(DATA_DIR, filename)
        combined.to_parquet(filepath, index=False)
        print(f"   {filename}: {len(combined)} laps")
    
    # Save combined dataset
    if combined_frames:
        full_dataset = pd.concat(combined_frames, ignore_index=True)
        combined_path = os.path.join(DATA_DIR, f"all_circuits_laps_{timestamp}.parquet")
        full_dataset.to_parquet(combined_path, index=False)
        print(f"\n   Combined: {combined_path} ({len(full_dataset)} total laps)")


def main():
    parser = argparse.ArgumentParser(description='Fetch F1 training data from FastF1')
    parser.add_argument('--years', type=str, default=','.join(map(str, DEFAULT_YEARS)),
                        help='Comma-separated years (default: 2021,2022,2023,2024)')
    parser.add_argument('--circuits', type=str, default=None,
                        help='Comma-separated circuit name filters (default: all)')
    
    args = parser.parse_args()
    years = [int(y.strip()) for y in args.years.split(',')]
    circuits = [c.strip() for c in args.circuits.split(',')] if args.circuits else None
    
    print(f" F1 Data Ingestion Pipeline")
    print(f"   Years: {years}")
    print(f"   Circuits: {circuits or 'ALL'}")
    print(f"   Cache: {CACHE_DIR}")
    print(f"   Output: {DATA_DIR}")
    
    all_data = fetch_all_data(years, circuits)
    
    if all_data:
        save_data(all_data)
        print("\n Data ingestion complete!")
    else:
        print("\n[!] No data fetched.")


if __name__ == "__main__":
    main()
