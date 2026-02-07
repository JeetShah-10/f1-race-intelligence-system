import os
import sys
import asyncio
import fastf1
import pandas as pd
from datetime import datetime
from dotenv import load_dotenv

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Load .env
env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
load_dotenv(env_path)

from app.services.database_service import DatabaseService

# Configuration
YEARS_TO_INGEST = [2025]
CACHE_DIR = os.path.join(os.path.dirname(__file__), '..', 'cache', 'fastf1')

def setup_fastf1():
    os.makedirs(CACHE_DIR, exist_ok=True)
    fastf1.Cache.enable_cache(CACHE_DIR)
    print(f"FastF1 Cache enabled: {CACHE_DIR}")

def ingest_metadata():
    print("Starting Metadata Ingestion...")
    setup_fastf1()
    
    db = DatabaseService()
    if not db.supabase:
        print("Database connection failed.")
        return

    for year in YEARS_TO_INGEST:
        print(f"\nProcessing Season {year}...")
        
        # 1. Ingest Season
        try:
            db.supabase.table("seasons").upsert({"year": year, "url": f"https://en.wikipedia.org/wiki/{year}_Formula_One_World_Championship"}).execute()
            print("   Season record updated.")
        except Exception as e:
            print(f"   Failed to upsert season: {e}")

        # 2. Get Schedule
        try:
            schedule = fastf1.get_event_schedule(year)
        except Exception as e:
            print(f"   Failed to fetch schedule: {e}")
            continue

        # Filter for official races only
        races = schedule[schedule['Session5'] == 'Race'] # Session5 is typically the race
        
        for i, row in races.iterrows():
            round_num = row['RoundNumber']
            race_name = row['EventName']
            circuit_name = row['Location'] # FastF1 uses Location as Circuit Name mostly
            country = row['Country']
            date = row['Session5Date']
            
            # Simple slug generation
            circuit_id = "".join(filter(str.isalnum, circuit_name.lower()))
            race_id = f"{year}_{round_num}_{circuit_id}"
            
            print(f"   R{round_num}: {race_name} @ {circuit_name}")

            # 3. Ingest Circuit
            circuit_data = {
                "circuit_id": circuit_id,
                "name": circuit_name,
                "location": row['Location'],
                "country": country,
                "lat": row.get('Latitude', 0.0), # Might not be available in all versions
                "lng": row.get('Longitude', 0.0)
            }
            try:
                # Remove NaN/NaT values
                clean_circuit = {k: v for k, v in circuit_data.items() if pd.notna(v)}
                db.supabase.table("circuits").upsert(clean_circuit).execute()
            except Exception as e:
                print(f"      Circuit insert error: {e}")

            # 4. Ingest Race
            race_data = {
                "race_id": race_id,
                "year": int(year),
                "round": int(round_num),
                "circuit_id": circuit_id,
                "name": race_name,
                "date": date.strftime('%Y-%m-%d'),
                "time": date.strftime('%H:%M:%S')
            }
            try:
                db.supabase.table("races").upsert(race_data).execute()
            except Exception as e:
                print(f"      Race insert error: {e}")

            # 5. Ingest Drivers & Teams (From Session Load)
            # Use specific events to capture all drivers (e.g., Round 1 and mid-season updates?)
            # Loading every session is SLOW. Let's do it for every race to be safe, or just first and last?
            # For "All Data", we should process every race.
            try:
                session = fastf1.get_session(year, round_num, 'R')
                session.load(telemetry=False, weather=False, messages=False) # Lightweight load
                
                results = session.results
                if results is None or results.empty:
                    print("      No results found.")
                    continue

                drivers_to_upsert = []
                teams_to_upsert = []

                for _, d_row in results.iterrows():
                    # Teams
                    team_name = d_row['TeamName']
                    team_id = "".join(filter(str.isalnum, str(team_name).lower()))
                    if team_name and team_id:
                        teams_to_upsert.append({
                            "team_id": team_id,
                            "name": team_name,
                            "nationality": "Unknown" # Not in FastF1 easily
                        })

                    # Drivers
                    driver_code = d_row['Abbreviation']
                    if not driver_code: continue
                    
                    # DEBUG: Check columns if likely to fail
                    driver_id = f"{d_row['FirstName']}_{d_row['LastName']}".lower().replace(" ", "_")
                    drivers_to_upsert.append({
                        "driver_id": driver_id,
                        "code": driver_code,
                        "number": int(d_row['DriverNumber']) if str(d_row['DriverNumber']).isdigit() else None,
                        "forename": d_row['FirstName'],
                        "surname": d_row['LastName'],
                        "nationality": d_row['CountryCode'] # Approx
                    })

                # Bulk Upsert (Deduplicated dicts)
                # Helper to dedup list of dicts by a key
                def dedup(l, key):
                    seen = set()
                    new_l = []
                    for d in l:
                        if d[key] not in seen:
                            seen.add(d[key])
                            new_l.append(d)
                    return new_l

                unique_teams = dedup(teams_to_upsert, 'team_id')
                unique_drivers = dedup(drivers_to_upsert, 'driver_id')

                if unique_teams:
                    db.supabase.table("teams").upsert(unique_teams).execute()
                if unique_drivers:
                    db.supabase.table("drivers").upsert(unique_drivers).execute()
                
                print(f"      Synced {len(unique_drivers)} drivers, {len(unique_teams)} teams.")

            except Exception as e:
                print(f"      Driver/Team ingest error: {e}")

    print("\nMetadata Ingestion Complete!")

if __name__ == "__main__":
    ingest_metadata()
