import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.ergast_service import ErgastService
from app.services.fastf1_service import FastF1Service

def inspect():
    print("--- Inspecting Ergast Standings ---")
    ergast = ErgastService()
    standings = ergast.get_driver_standings(2025) # Using 2024 to ensure data if 2025 is empty, or 2023?
    # Actually, user used 2025 in other scripts. If 2025 is empty, I'll try 2024.
    if not standings:
        print("2025 empty, trying 2024...")
        standings = ergast.get_driver_standings(2024)
    
    if standings:
        print("First row keys:", standings[0].keys())
        print("First row sample:", standings[0])
    else:
        print("No standings data found.")

    print("\n--- Inspecting FastF1 Schedule ---")
    fastf1 = FastF1Service()
    schedule = fastf1.get_schedule(2025)
    if not schedule:
        print("2025 schedule empty, trying 2024...")
        schedule = fastf1.get_schedule(2024)
    
    if schedule:
        # Schedule is a list of dicts (records)
        print("First event keys:", schedule[0].keys())
        print("First event sample:", schedule[0])
    else:
        print("No schedule data found.")

if __name__ == "__main__":
    inspect()
