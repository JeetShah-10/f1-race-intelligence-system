from typing import Dict, Any, List
from app.services.qualifying_service import QualifyingService
from app.services.season_config_service import SeasonConfigService
from app.simulation.race_engine import RaceEngine
from app.simulation.simulation_context import SimulationContext
from app.analysis.race_analyzer import RaceAnalyzer # Import
from app.schemas.simulation import DriverInput, SimulationResult, SimulationRequest
from app.schemas.ml_simulation_handoff import MLHandoff

class RacePredictorService:
    """
    Coordinator service for 2026 Race Predictions.
    Orchestrates:
    1. Qualifying (Grid Generation)
    2. ML Parameter Handoff (Pace/Degradation)
    3. Race Simulation (Deep Physics + Events)
    """

    def __init__(self):
        self.qualifying_service = QualifyingService()
        self.season_config = SeasonConfigService()
        self.analyzer = RaceAnalyzer()

    def predict_event_2026(self, circuit_id: str, weather: str = "dry", lap_count: int = 57) -> Dict[str, Any]:
        """
        Runs a full event cycle for a 2026 race.
        """
        print(f"🔮 Predicting 2026 Event at {circuit_id} ({weather})")

        # 1. Run Qualifying
        grid = self.qualifying_service.predict_grid(circuit_id)
        
        # 2. Prepare Simulation Inputs
        driver_inputs = []
        ml_handoffs = []
        
        for d in grid:
            # 2a. Create Driver Input
            di = DriverInput(
                driver=d["driver_id"],
                team=d["team"],
                grid_position=d["position"],
                compound="MEDIUM",
                tyre_life=0,
                avg_lap_time=None,
                std_lap_time=None,
                num_laps=0,
                finished=0
            )
            driver_inputs.append(di)
            
            # 2b. Generate Pace Parameters (ML Handoff)
            # Logic: Quali Time + Fuel/Race Pace Delta + Degradation
            quali_time = d["qualifying_time"]
            
            # Simple assumption: Race pace is ~4-5s slower than quali pace due to fuel/tyres
            race_pace_base = quali_time + 5.0
            
            # Deg slope: Soft=0.15, Med=0.1, Hard=0.05
            # We assume Medium start.
            deg_slope = 0.1
            
            # Fetch specific modifiers if needed
            # (Already handled in Quali for base pace, but deg might differ)
            
            handoff = MLHandoff(
                driver_id=d["driver_id"],
                baseline_lap_time=race_pace_base,
                tyre_degradation_slope=deg_slope
            )
            ml_handoffs.append(handoff)

        # 3. Initialize Context
        ctx = SimulationContext(
            circuit=circuit_id,
            year=2026,
            drivers=driver_inputs,
            weather=weather,
            track_temp=25.0, # Average
            air_temp=20.0,
            lap_count=lap_count,
            ml_handoff=ml_handoffs
        )

        # 4. Run Simulation
        engine = RaceEngine(ctx)
        sim_result = engine.run()
        
        
        # 5. Build Analysis/Report
        analysis_report = self.analyzer.analyze_event(sim_result)
        
        return {
            "metadata": {
                "season": 2026,
                "circuit": circuit_id,
                "weather": weather,
                "laps": lap_count
            },
            "grid": grid,
            "race_result": sim_result,
            "analysis": analysis_report
        }
