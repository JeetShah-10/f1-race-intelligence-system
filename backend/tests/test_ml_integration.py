
import pytest
from unittest.mock import MagicMock, ANY, patch
from app.simulation.race_engine import RaceEngine
from app.simulation.simulation_context import SimulationContext
from app.schemas.simulation import DriverInput
from app.ml.pace_model import PaceModel

from app.schemas.ml_simulation_handoff import MLHandoff

class TestMLIntegration:
    
    @pytest.fixture
    def mock_pace_model(self):
        """Mock the PaceModel to return predictable lap times."""
        model = MagicMock(spec=PaceModel)
        # Verify call signature matches
        # predict_lap_time(driver, compound, tyre_life, team, speed_st, speed_fl, lap_number)
        
        # Default behavior: return 90.0 seconds
        model.predict_lap_time.return_value = 90.0
        # Ensure legacy path is used (not the sector model)
        model.has_sector_model = False
        return model

    @pytest.fixture
    def sim_context(self, mock_pace_model):
        return SimulationContext(
            drivers=[
                DriverInput(driver="VER", team="red_bull", grid_position=1, compound="MEDIUM", tyre_life=0),
                DriverInput(driver="HAM", team="mercedes", grid_position=2, compound="HARD", tyre_life=0)
            ],
            weather="dry",
            circuit="bahrain",
            year=2024,
            lap_count=5,
            track_temp=30.0,
            air_temp=25.0,
            ml_handoff=[],  # Not needed if pace_model is provided
            pace_model=mock_pace_model
        )

    def test_race_engine_calls_pace_model(self, sim_context, mock_pace_model):
        """Verify that RaceEngine calls pace_model.predict_lap_time each lap."""
        engine = RaceEngine(sim_context)
        
        # Run 1 lap
        simulation = engine.stream()
        next(simulation)
        
        # Expected calls: 2 drivers * 1 lap * 3 sectors? 
        # Wait, predict_lap_time is called once per sector? 
        # checking code... Yes, inside _calculate_sector_time which is called 3 times per lap.
        # So for 1 lap, 2 drivers: 2 * 3 = 6 calls.
        
        assert mock_pace_model.predict_lap_time.call_count == 6
        
        # Check arguments for one of the calls
        mock_pace_model.predict_lap_time.assert_any_call(
            driver="VER",
            compound="MEDIUM",
            tyre_life=0,  # Starts at 0
            team="Red Bull Racing",
            speed_st=0,
            speed_fl=0,
            lap_number=1
        )

    def test_tyre_life_increments_in_ml_calls(self, sim_context, mock_pace_model):
        """Verify that as race progresses, tyre_life passed to ML model increases."""
        # Mock StrategyAI to prevent unexpected pit stops
        with patch("app.simulation.race_engine.StrategyAI") as MockStrategyAI:
            mock_strategy = MockStrategyAI.return_value
            mock_strategy.evaluate_pit_stops.return_value = [] # No pit stops
            
            engine = RaceEngine(sim_context)
            
            # Run 3 laps completely
            simulation = engine.stream()
            for _ in range(3):
                next(simulation)
                
            # Filter calls for VER on lap 3
            calls_lap_3 = [
                c for c in mock_pace_model.predict_lap_time.call_args_list 
                if c.kwargs.get("driver") == "VER" and c.kwargs.get("lap_number") == 3
            ]
            
            assert len(calls_lap_3) == 3 # 3 sectors
            for call in calls_lap_3:
                assert call.kwargs["tyre_life"] == 2

    def test_fallback_logic_when_model_missing(self):
        """Verify engine still runs if pace_model is None (legacy/fallback mode)."""
        try:
            # Prepare handoff data internally
            from app.schemas.ml_simulation_handoff import MLHandoff
            handoff = [MLHandoff(driver_id="VER", baseline_lap_time=90.0, tyre_degradation_slope=0.1)]

            # Context without pace_model
            ctx = SimulationContext(
                drivers=[DriverInput(driver="VER", team="rb", grid_position=1)],
                weather="dry",
                circuit="bahrain",
                year=2024,
                lap_count=3,
                track_temp=30.0,
                air_temp=25.0,
                ml_handoff=handoff,
                pace_model=None
            )
            
            engine = RaceEngine(ctx)
            
            # Run simulation
            results = engine.run()
            
            assert results["total_laps"] == 3
            assert len(results["results"]) == 1
            assert results["results"][0]["total_time"] > 0
        except Exception:
            import traceback
            traceback.print_exc()
            raise
