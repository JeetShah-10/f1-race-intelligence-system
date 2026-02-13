"""
Race Predictor Service - Full ML-Powered Prediction Flow

This is the coordinator for POST /api/predict/event (Flow B).
Previously broken: no pace_model injection -> Method C GLM fallback -> 1000s+ gaps.

Now fixed:
  1. Loads PaceModel via PredictionService (same as simulate.py Flow A)
  2. Uses ML-based qualifying with proper Q1->Q2->Q3 elimination
  3. Injects pace_model into SimulationContext -> Method A/B now runs
  4. Compound-specific degradation slopes from ML model
  5. Deterministic results (seeded RNG per circuit)
  6. All 22 drivers with correct ID mapping

Source of truth for driver roster: frontend/src/data/f1-data.ts
"""

import random
from typing import Dict, Any, List, Tuple

from app.services.qualifying_service import QualifyingService
from app.services.season_config_service import SeasonConfigService
from app.services.prediction_service import PredictionService
from app.services.driver_mapping import (
    to_ml_driver_sector, to_ml_team_sector,
    to_ml_driver_baseline, to_ml_team_baseline,
)
from app.simulation.race_engine import RaceEngine
from app.simulation.simulation_context import SimulationContext
from app.analysis.race_analyzer import RaceAnalyzer
from app.schemas.simulation import DriverInput
from app.schemas.ml_simulation_handoff import MLHandoff


class RacePredictorService:
    """
    Coordinator service for 2026 Race Predictions.
    Orchestrates:
    1. ML-based Qualifying (Q1->Q2->Q3, 22 drivers)
    2. ML Parameter Handoff (Pace/Degradation per compound)
    3. Race Simulation with PaceModel injection
    """

    def __init__(self):
        self.qualifying_service = QualifyingService()
        self.season_config = SeasonConfigService()
        self.prediction_service = PredictionService()
        self.analyzer = RaceAnalyzer()

    def predict_event_2026(
        self,
        circuit_id: str,
        weather: str = "dry",
        lap_count: int = 57,
    ) -> Dict[str, Any]:
        """
        Runs a full event cycle for a 2026 race with 22 drivers.
        """
        print(f"[RacePredictorService] Predicting 2026 event at {circuit_id} ({weather})")

        # Deterministic RNG per circuit for reproducible results
        rng = random.Random(hash(f"2026_{circuit_id}_{weather}"))

        # Get ML models
        pace_model = self.prediction_service.get_pace_model()

        #  1. ML-Based Qualifying 
        grid = self._run_ml_qualifying(circuit_id, weather, pace_model, rng)

        #  2. Prepare Simulation Inputs 
        driver_inputs = []
        ml_handoffs = []

        # Starting compound based on weather
        if weather.upper() in ("WET", "RAIN"):
            start_compound = "WET"
        elif weather.upper() == "DAMP":
            start_compound = "INTERMEDIATE"
        else:
            start_compound = "MEDIUM"

        for d in grid:
            di = DriverInput(
                driver=d["driver_id"],
                team=d["team"],
                grid_position=d["position"],
                compound=start_compound,
                tyre_life=0,
            )
            driver_inputs.append(di)

            # ML-derived handoff data
            ml_driver = to_ml_driver_sector(d["driver_id"])
            ml_team = to_ml_team_sector(d["team"])

            baseline_lap_time = pace_model.predict_lap_time(
                driver=ml_driver,
                compound=start_compound,
                tyre_life=1,
                team=ml_team,
                speed_st=320.0,
                speed_fl=300.0,
                lap_number=1,
            )

            deg_slope = pace_model.get_degradation_slope(
                driver=ml_driver,
                compound=start_compound,
            )

            handoff = MLHandoff(
                driver_id=d["driver_id"],
                baseline_lap_time=baseline_lap_time,
                tyre_degradation_slope=deg_slope,
            )
            ml_handoffs.append(handoff)

        #  3. Build Context WITH pace_model 
        ctx = SimulationContext(
            circuit=circuit_id,
            year=2026,
            drivers=driver_inputs,
            weather=weather,
            track_temp=25.0,
            air_temp=20.0,
            lap_count=lap_count,
            ml_handoff=ml_handoffs,
            pace_model=pace_model,  # <- THE FIX: Now Method A/B runs instead of C
        )

        #  4. Run Simulation 
        engine = RaceEngine(ctx)
        sim_result = engine.run()

        #  5. Analysis 
        analysis_report = self.analyzer.analyze_event(sim_result)

        return {
            "metadata": {
                "season": 2026,
                "circuit": circuit_id,
                "weather": weather,
                "laps": lap_count,
                "total_drivers": len(grid),
                "ml_powered": True,
            },
            "grid": grid,
            "race_result": sim_result,
            "analysis": analysis_report,
        }

    def _run_ml_qualifying(
        self,
        circuit_id: str,
        weather: str,
        pace_model,
        rng: random.Random,
    ) -> List[Dict[str, Any]]:
        """
        ML-based qualifying with Q1->Q2->Q3 elimination.
        Uses PaceModel.predict_lap_time() per driver with proper ID mapping.
        
        Replicates the same logic as qualifying.py API but seeded and consistent.
        """
        # Get the 22-driver roster
        roster = self.qualifying_service.get_2026_drivers()
        
        # Qualifying adjustment: ML models predict RACE pace, quali is ~3.5s faster
        QUALI_ADJUSTMENT = -3.5
        
        # Track evolution per session
        EVOLUTION = {"Q1": 0.0, "Q2": -0.2, "Q3": -0.4}
        
        results_map = {}
        for d in roster:
            results_map[d["id"]] = {
                "driver_id": d["id"],
                "team": d["team"],
                "q1": None,
                "q2": None,
                "q3": None,
                "best": None,
            }

        def simulate_quali_lap(driver_id: str, team: str, session: str) -> float:
            """Predict a single qualifying lap using ML model."""
            ml_driver = to_ml_driver_sector(driver_id)
            ml_team = to_ml_team_sector(team)
            
            base_time = pace_model.predict_lap_time(
                driver=ml_driver,
                compound="SOFT",
                tyre_life=1,
                team=ml_team,
                speed_st=320.0,
                speed_fl=300.0,
                lap_number=1,
            )
            
            evolution = EVOLUTION[session]
            variance = rng.uniform(-0.1, 0.2)
            
            return base_time + QUALI_ADJUSTMENT + evolution + variance

        #  Q1: All 22 drivers 
        q1_times = []
        for d in roster:
            time = simulate_quali_lap(d["id"], d["team"], "Q1")
            q1_times.append((d, time))
            results_map[d["id"]]["q1"] = round(time, 3)
            results_map[d["id"]]["best"] = round(time, 3)

        q1_sorted = sorted(q1_times, key=lambda x: x[1])
        q2_drivers = [x[0] for x in q1_sorted[:15]]  # Top 15 advance

        #  Q2: Top 15 
        q2_times = []
        for d in q2_drivers:
            time = simulate_quali_lap(d["id"], d["team"], "Q2")
            q2_times.append((d, time))
            results_map[d["id"]]["q2"] = round(time, 3)
            if time < results_map[d["id"]]["best"]:
                results_map[d["id"]]["best"] = round(time, 3)

        q2_sorted = sorted(q2_times, key=lambda x: x[1])
        q3_drivers = [x[0] for x in q2_sorted[:10]]  # Top 10 advance

        #  Q3: Top 10 
        q3_times = []
        for d in q3_drivers:
            time = simulate_quali_lap(d["id"], d["team"], "Q3")
            q3_times.append((d, time))
            results_map[d["id"]]["q3"] = round(time, 3)
            if time < results_map[d["id"]]["best"]:
                results_map[d["id"]]["best"] = round(time, 3)

        q3_sorted = sorted(q3_times, key=lambda x: x[1])

        #  Final Classification 
        final_order = []
        # P1-P10: Q3 order
        final_order.extend(q3_sorted)
        # P11-P15: Q2 eliminated (made Q2 but not Q3)
        q2_eliminated = [x for x in q2_sorted if x[0] not in q3_drivers]
        final_order.extend(q2_eliminated)
        # P16-P22: Q1 eliminated 
        q1_eliminated = [x for x in q1_sorted if x[0] not in q2_drivers]
        final_order.extend(q1_eliminated)

        pole_time = results_map[final_order[0][0]["id"]]["best"]

        grid = []
        for i, (driver, _) in enumerate(final_order):
            d_res = results_map[driver["id"]]
            grid.append({
                "driver_id": driver["id"],
                "team": driver["team"],
                "position": i + 1,
                "qualifying_time": d_res["best"],
                "q1_time": d_res["q1"],
                "q2_time": d_res["q2"],
                "q3_time": d_res["q3"],
                "gap_to_pole": round(d_res["best"] - pole_time, 3),
            })

        print(f"[Qualifying] Grid: {', '.join(d['driver_id'].upper() for d in grid[:5])}...")
        return grid
