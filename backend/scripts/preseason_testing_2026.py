import sys
import os
import random
from typing import List, Dict
from tabulate import tabulate

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from app.services.qualifying_service import QualifyingService
from app.services.race_predictor_service import RacePredictorService
# from app.config.database import SEASON_CONFIG_2026

def run_preseason_test():
    print("\n🏁 STARTING 2026 PRE-SEASON TESTING (BAHRAIN) 🏁")
    print("===================================================")
    
    # 1. Setup
    quali_service = QualifyingService()
    circuit_id = "bahrain"
    
    # 2. Calibration Check (Theoretical Pace)
    print("\n📊 TEST SESSION 1: PACE CALIBRATION")
    print("   (Simulating 100 Qualifying Laps per Driver to find average theoretical pace)")
    
    drivers = quali_service.get_2026_drivers()
    pace_data = {d['id']: [] for d in drivers}
    
    for _ in range(50): # 50 iterations
        grid = quali_service.predict_grid(circuit_id, weather="dry")
        for pos in grid:
            d_id = pos['driver_id']
            # We don't have raw lap time in grid output easily accessible as a float for averaging?
            # Actually, predict_grid returns dicts like {'driver_id': 'ver', 'qualifying_time': 90.123}
            # Let's verify the schema of grid output.
            if 'qualifying_time' in pos:
                pace_data[d_id].append(pos['qualifying_time'])
    
    # Calculate Averages
    results = []
    for d in drivers:
        d_id = d['id']
        times = pace_data.get(d_id, [])
        if not times: continue
        avg_time = sum(times) / len(times)
        results.append({
            "driver": d_id,
            "team": d['team'],
            "avg_time": avg_time
        })
    
    # Sort by time
    results.sort(key=lambda x: x['avg_time'])
    
    # Display Hierarchy
    print("\n🏆 PEFORMANCE HIERARCHY (One Lap Pace)")
    print(tabulate(results, headers="keys", floatfmt=".3f"))
    
    # Verify Gaps
    ver_time = results[0]['avg_time']
    audi = next((r for r in results if r['team'] == 'audi'), None)
    cadillac = next((r for r in results if r['team'] == 'cadillac'), None)
    
    if audi:
         gap = audi['avg_time'] - ver_time
         print(f"\n🔍 AUDI GAP: +{gap:.3f}s (Target: ~1.5s - 2.0s from pole)")
    
    if cadillac:
         gap = cadillac['avg_time'] - ver_time
         print(f"🔍 CADILLAC GAP: +{gap:.3f}s (Target: ~2.0s+ from pole)")

    # 3. Race Simulation (Long Run)
    print("\n🏎️ TEST SESSION 2: RACE SIMULATION (57 Laps)")
    predictor = RacePredictorService()
    race_result = predictor.predict_event_2026(circuit_id, weather="dry")
    
    print(f"\n   Winner: {race_result['race_result']['results'][0]['driver_id'].upper()}")
    print(f"   Analysis:\n   {race_result['analysis'].splitlines()[0]}...") # First line of analysis

    # 4. Save Report
    report_path = "backend/2026_preseason_report.md"
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# 2026 Pre-Season Testing Report (Bahrain)\n\n")
        f.write("## 1. Performance Calibration\n")
        f.write(tabulate(results, headers="keys", floatfmt=".3f", tablefmt="github"))
        f.write("\n\n## 2. Methodology\n")
        f.write("- Track: Bahrain International Circuit\n")
        f.write("- Conditions: Dry, 30°C\n")
        f.write("- Iterations: 50 Quali Simulations\n")
    
    print(f"\n✅ Testing Complete. Report saved to {report_path}")

if __name__ == "__main__":
    run_preseason_test()
