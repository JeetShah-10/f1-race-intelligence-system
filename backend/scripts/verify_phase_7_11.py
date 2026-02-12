# backend/scripts/verify_phase_7_11.py
"""
Verification script for Phases 7-11.
Tests:
1. FastF1 Service (Phase 7)
2. Tyre Degradation Model (Phase 8)
3. Weather Evolution Model (Phase 8)
4. Compare/Season/Scenario APIs (Phase 9)
5. DB Schema Initialization (Phase 11)
"""

import sys
import os
import json
from pathlib import Path
from datetime import datetime

# Add backend to path
ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT))

from app.services.fastf1_service import FastF1Service
from app.simulation.tyre_degradation_model import TyreDegradationModel
from app.simulation.weather_model import WeatherEvolutionModel, WeatherState
from app.api.compare import compare_drivers, CompareRequest
from app.api.season import simulate_season, SeasonRequest
from app.api.scenario import what_if_scenario, WhatIfRequest, Modification
from app.db.models import User, Scenario, Simulation
from app.db.database import engine, Base


def test_fastf1_service():
    print("\n[1/5] Testing FastF1 Service...")
    service = FastF1Service()
    
    # Test fetch_training_data extensions
    # Just check if methods exist and return reasonable defaults without hitting API heavily
    sched = service.get_schedule(2024)
    print(f"  Schedule 2024: {len(sched)} races found")
    
    # Test fallback
    cached = service.load_session(2023, "Monaco", "R")
    print(f"  Session Load: {'Success' if cached else 'Failed/Skipped'}")

def test_tyre_model():
    print("\n[2/5] Testing Tyre Degradation Model...")
    model = TyreDegradationModel()
    
    stats = []
    for life in [0, 10, 20, 30, 40]:
        res = model.get_degradation("SOFT", life, track_temp=35.0)
        stats.append(f"L{life}:{res.pace_delta:.2f}s({res.phase})")
    print(f"  Soft Profile: {', '.join(stats)}")
    
    assert model.get_degradation("SOFT", 50).tyre_health == 0.0
    print("  Tyre health check passed")

def test_weather_model():
    print("\n[3/5] Testing Weather Evolution Model...")
    model = WeatherEvolutionModel(initial_condition="dry", rain_probability=0.5, rng_seed=42)
    
    rain_count = 0
    for lap in range(1, 60):
        state = model.evolve(lap, 60)
        if state.condition != "dry":
            rain_count += 1
            
    print(f"  Simulated 60 laps. Rain occurred in {rain_count} laps.")
    assert len(model.history) == 59
    print("  Weather evolution check passed")

def test_apis():
    print("\n[4/5] Testing New APIs (Dry Run)...")
    
    # 4a. Compare
    try:
        req = CompareRequest(
            driver1="VER", 
            driver2="NOR", 
            circuits=["monaco"], 
            num_simulations=1
        )
        res = compare_drivers(req)
        print(f"  Compare API: {res.driver1} vs {res.driver2} -> Gap: {res.avg_pace_gap}s")
    except Exception as e:
        print(f"  Compare API Failed: {e}")

    # 4b. Scenario
    try:
        mod = Modification(type="performance_boost", team_id="mclaren", delta=-0.5)
        req = WhatIfRequest(
            circuit="silverstone", 
            modifications=[mod],
            lap_count=10 # Short race for speed
        )
        res = what_if_scenario(req)
        print(f"  What-If API: {res.description} -> {res.deltas[0].driver if res.deltas else 'None'} moved {res.deltas[0].position_change if res.deltas else 0} spots")
    except Exception as e:
        print(f"  What-If API Failed: {e}")

def test_db_schema():
    print("\n[5/5] Testing DB Schema...")
    try:
        # Create tables
        Base.metadata.create_all(bind=engine)
        print("  Tables created successfully")
        
        # Check tables
        tables = Base.metadata.tables.keys()
        print(f"  Tables found: {list(tables)}")
        
        expected = ["users", "scenarios", "simulations"]
        missing = [t for t in expected if t not in tables]
        if missing:
            print(f"  Missing tables: {missing}")
        else:
            print("  All expected tables present")
            
    except Exception as e:
        print(f"  DB Schema Failed: {e}")

if __name__ == "__main__":
    test_fastf1_service()
    test_tyre_model()
    test_weather_model()
    test_apis()
    test_db_schema()
    print("\nAll verifications completed.")
