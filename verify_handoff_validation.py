import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

import unittest
from app.simulation.simulation_context import SimulationContext
from app.schemas.ml_simulation_handoff import MLHandoff
from app.schemas.simulation import DriverInput

class TestMLHandoffValidation(unittest.TestCase):
    def setUp(self):
        self.valid_driver_input = DriverInput(
            driver="VER", 
            team="Red Bull", 
            compound="Soft", 
            tyre_life=0,
            grid_position=1,
            avg_lap_time=75.0,
            std_lap_time=0.5,
            num_laps=50,
            finished=1
        )
        self.base_context_args = {
            "drivers": [self.valid_driver_input],
            "weather": "sunny",
            "circuit": "monaco",
            "lap_count": 50
        }

    def test_valid_handoff(self):
        handoff = MLHandoff(driver_id="VER", baseline_lap_time=75.0, tyre_degradation_slope=0.1)
        context = SimulationContext(**self.base_context_args, ml_handoff=[handoff])
        self.assertIsInstance(context, SimulationContext)
        print("✅ Correctly accepted valid handoff.")

    def test_missing_baseline_lap_time(self):
        # baseline_lap_time is required by Pydantic, but if we construct manually and bypass types or pass invalid data...
        # actually Pydantic might catch None if type checking is strict, but let's test our logic for logical validation
        # Pydantic < 2.0 or default might allow None if Optional, but it is float in schema.
        # However, checking passing <= 0
        handoff = MLHandoff(driver_id="VER", baseline_lap_time=-1.0, tyre_degradation_slope=0.1)
        with self.assertRaises(ValueError) as cm:
            SimulationContext(**self.base_context_args, ml_handoff=[handoff])
        self.assertIn("baseline_lap_time must be positive", str(cm.exception))
        print("✅ Correctly rejected negative baseline_lap_time.")

    def test_negative_degradation(self):
        handoff = MLHandoff(driver_id="VER", baseline_lap_time=75.0, tyre_degradation_slope=-0.01)
        with self.assertRaises(ValueError) as cm:
            SimulationContext(**self.base_context_args, ml_handoff=[handoff])
        self.assertIn("tyre_degradation_slope must be non-negative", str(cm.exception))
        print("✅ Correctly rejected negative degradation.")
        
    def test_missing_driver_handoff(self):
        # Driver list has VER, but handoff has HAM
        handoff = MLHandoff(driver_id="HAM", baseline_lap_time=75.0, tyre_degradation_slope=0.1)
        with self.assertRaises(ValueError) as cm:
            SimulationContext(**self.base_context_args, ml_handoff=[handoff])
        self.assertIn("Missing ML handoff data for drivers: VER", str(cm.exception))
        print("✅ Correctly detected missing driver handoff.")

if __name__ == "__main__":
    unittest.main()
