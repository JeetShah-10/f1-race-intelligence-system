import fastf1
import pandas as pd
import os
from datetime import datetime

# Configuration
YEARS = [2021, 2022, 2023]
GP_NAME = 'Bahrain'
SESSION_TYPE = 'R' # Race

# Setup Paths
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CACHE_DIR = os.path.join(ROOT_DIR, 'cache', 'fastf1')
DATA_DIR = os.path.join(ROOT_DIR, 'data', 'raw')

# Enable Cache
fastf1.Cache.enable_cache(CACHE_DIR)

def fetch_data():
    print(f"🏎️  Starting Data Fetch for {GP_NAME} ({YEARS})")
    
    all_laps = []
    
    for year in YEARS:
        try:
            print(f"\nProcessing {year} {GP_NAME}...")
            session = fastf1.get_session(year, GP_NAME, SESSION_TYPE)
            session.load()
            
            # Extract Laps
            laps = session.laps
            
            # Add Metadata
            laps['Year'] = year
            laps['Round'] = GP_NAME
            
            # Select relevant columns to keep file size manageable and data clean
            # We assume standard columns exist based on our probe
            cols_to_keep = [
                'Time', 'Driver', 'DriverNumber', 'LapTime', 'LapNumber', 'Stint', 
                'PitOutTime', 'PitInTime', 'Sector1Time', 'Sector2Time', 'Sector3Time',
                'SpeedI1', 'SpeedI2', 'SpeedFL', 'SpeedST', 'Compound', 'TyreLife',
                'FreshTyre', 'Team', 'TrackStatus', 'Position', 'Year', 'Round'
            ]
            
            # Filter available columns
            available_cols = [c for c in cols_to_keep if c in laps.columns]
            laps_filtered = laps[available_cols].copy()
            
            # Convert Timedelta to total seconds for parquet compatibility/easier ML
            # (Parquet handles timedeltas, but float seconds is often safer for immediate ML loading)
            # Actually, let's keep native types for now, pandas parquet engine handles it.
            
            all_laps.append(laps_filtered)
            print(f"✅ Loaded {len(laps_filtered)} laps.")
            
        except Exception as e:
            print(f"❌ Error loading {year}: {e}")
    
    if all_laps:
        # Concatenate
        full_dataset = pd.concat(all_laps, ignore_index=True)
        
        # Save
        timestamp = datetime.now().strftime("%Y%m%d")
        filename = f"{GP_NAME}_2021_2023_laps.parquet"
        filepath = os.path.join(DATA_DIR, filename)
        
        full_dataset.to_parquet(filepath, index=False)
        print(f"\n💾 Saved {len(full_dataset)} total laps to: {filepath}")
    else:
        print("\n⚠️  No data fetched.")

if __name__ == "__main__":
    fetch_data()
