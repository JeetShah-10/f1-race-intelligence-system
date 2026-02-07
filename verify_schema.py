import sys
import os

# Add backend to path so we can import app modules
sys.path.append(os.path.abspath("backend"))

from app.schemas.simulation import DriverInput, SimulationResult, SimulationRequest
from app.simulation.race_engine import RaceEngine
from app.simulation.simulation_context import SimulationContext
from app.schemas.ml_simulation_handoff import MLHandoff

def verify_schema():
    print("Verifying RaceEngine output against SimulationResult schema...")

    # 1. Create Dummy Data
    driver_input = DriverInput(
        driver="VER",
        team="Red Bull",
        grid_position=1,
        compound="SOFT",
        tyre_life=0,
        avg_lap_time=None,
        std_lap_time=None,
        num_laps=0,
        finished=0
    )

    ml_handoff = MLHandoff(
        driver_id="VER",
        baseline_lap_time=80.0,
        tyre_degradation_slope=0.1
    )

    ctx = SimulationContext(
        drivers=[driver_input],
        weather="Sunny",
        circuit="Monaco",
        lap_count=5,
        ml_handoff=[ml_handoff]
    )

    # 2. Run Race Engine
    engine = RaceEngine(ctx)
    result_dict = engine.run()

    print("Race Engine Output:", result_dict)

    # 3. Validate against Schema
    try:
        validated_result = SimulationResult(**result_dict)
        print("\n✅ Validation Successful!")
        print(validated_result.model_dump_json(indent=2))
    except Exception as e:
        print("\n❌ Validation Failed!")
        print(e)
        sys.exit(1)

if __name__ == "__main__":
    verify_schema()
