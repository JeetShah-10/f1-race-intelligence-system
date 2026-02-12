# backend/app/api/scenario.py
"""
What-If scenario API.

POST /api/scenario/whatif — Run hypothetical scenarios:
  - Driver team swaps ("What if Hamilton was at Red Bull?")
  - Performance adjustments ("What if McLaren gained 0.5s?")
  - Weather overrides ("What if it rained at Monaco?")
  - Forced DNFs ("What if Verstappen DNF'd at Spa?")
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import json
import copy
from pathlib import Path

from app.services.prediction_service import PredictionService
from app.simulation.simulation_context import SimulationContext
from app.simulation.race_engine import RaceEngine
from app.schemas.simulation import DriverInput

router = APIRouter()
prediction_service = PredictionService()

CONFIG_PATH = Path(__file__).parent.parent / "config" / "2026_season.json"
with open(CONFIG_PATH) as f:
    SEASON_CONFIG = json.load(f)


# ── Schemas ──

class Modification(BaseModel):
    type: str                           # driver_swap, performance_boost, weather_override, dnf_inject
    driver_id: Optional[str] = None     # For driver_swap, dnf_inject
    new_team: Optional[str] = None      # For driver_swap
    team_id: Optional[str] = None       # For performance_boost
    delta: Optional[float] = None       # For performance_boost (seconds)
    weather: Optional[str] = None       # For weather_override
    dnf_lap: Optional[int] = None       # For dnf_inject


class WhatIfRequest(BaseModel):
    circuit: str = "monaco"
    year: int = 2026
    lap_count: int = 57
    modifications: List[Modification]
    description: Optional[str] = None   # Human-readable scenario description


class DriverDelta(BaseModel):
    driver: str
    original_position: int
    modified_position: int
    position_change: int             # positive = improved


class WhatIfResult(BaseModel):
    description: str
    circuit: str
    modifications_applied: int
    original_result: List[Dict[str, Any]]
    modified_result: List[Dict[str, Any]]
    deltas: List[DriverDelta]
    biggest_mover: Optional[str] = None
    biggest_loser: Optional[str] = None


def _get_team_name(team_id: str) -> str:
    for t in SEASON_CONFIG.get("teams", []):
        if t.get("id") == team_id:
            return t.get("name", team_id)
    return team_id


def _build_grid() -> List[DriverInput]:
    """Build the full 20-driver grid from config."""
    drivers = []
    for i, d in enumerate(SEASON_CONFIG.get("drivers", [])[:20]):
        team_name = _get_team_name(d.get("team_id", ""))
        drivers.append(DriverInput(
            driver=d.get("code", f"DR{i}"),
            team=team_name,
            grid_position=i + 1,
            compound="MEDIUM" if i < 10 else "HARD",
        ))
    return drivers


def _run_simulation(grid: List[DriverInput], circuit: str, year: int,
                    lap_count: int, weather: str = "DRY") -> List[Dict]:
    """Run a single simulation and return results list."""
    ml_handoff = prediction_service.get_simulation_handoff_raw(grid)
    pace_model = prediction_service.get_pace_model()

    ctx = SimulationContext(
        drivers=grid,
        weather=weather,
        circuit=circuit,
        year=year,
        lap_count=lap_count,
        track_temp=35.0,
        air_temp=25.0,
        ml_handoff=ml_handoff,
        pace_model=pace_model,
    )

    engine = RaceEngine(ctx)
    result = engine.run()
    return result.get("results", [])


@router.post("/whatif", response_model=WhatIfResult)
def what_if_scenario(request: WhatIfRequest):
    """
    Run a what-if scenario simulation.

    Runs the baseline first, then applies modifications and re-runs.
    Returns comparison between original and modified results.
    """
    if not request.modifications:
        raise HTTPException(400, "At least one modification is required")

    # ── 1. Run Baseline ──
    base_grid = _build_grid()
    base_weather = "DRY"
    original_results = _run_simulation(
        base_grid, request.circuit, request.year, request.lap_count, base_weather
    )

    # ── 2. Apply Modifications ──
    mod_grid = copy.deepcopy(base_grid)
    mod_weather = base_weather
    mods_applied = 0

    for mod in request.modifications:
        if mod.type == "driver_swap" and mod.driver_id and mod.new_team:
            # Find driver and change their team
            new_team_name = _get_team_name(mod.new_team) if mod.new_team else mod.new_team
            for d in mod_grid:
                if d.driver == mod.driver_id:
                    d.team = new_team_name
                    mods_applied += 1
                    break

        elif mod.type == "performance_boost" and mod.team_id and mod.delta is not None:
            # We can't directly modify lap_time_bias in the grid,
            # but we can adjust avg_lap_time for drivers on that team
            team_name = _get_team_name(mod.team_id) if mod.team_id else mod.team_id
            for d in mod_grid:
                if d.team == team_name:
                    if d.avg_lap_time:
                        d.avg_lap_time += mod.delta
                    else:
                        # Apply as std adjustment (the engine will pick it up)
                        d.avg_lap_time = 90.0 + mod.delta
                    mods_applied += 1

        elif mod.type == "weather_override" and mod.weather:
            mod_weather = mod.weather
            mods_applied += 1

        elif mod.type == "dnf_inject" and mod.driver_id:
            # Mark driver as DNF (finished=0)
            for d in mod_grid:
                if d.driver == mod.driver_id:
                    d.finished = 0
                    mods_applied += 1
                    break

    # ── 3. Run Modified Simulation ──
    modified_results = _run_simulation(
        mod_grid, request.circuit, request.year, request.lap_count, mod_weather
    )

    # ── 4. Calculate Deltas ──
    orig_positions = {r.get("driver_id"): r.get("position", 99) for r in original_results}
    mod_positions = {r.get("driver_id"): r.get("position", 99) for r in modified_results}

    deltas = []
    for driver_id in orig_positions:
        orig_pos = orig_positions.get(driver_id, 99)
        mod_pos = mod_positions.get(driver_id, 99)
        change = orig_pos - mod_pos  # positive = improved (lower position number)
        deltas.append(DriverDelta(
            driver=driver_id,
            original_position=orig_pos,
            modified_position=mod_pos,
            position_change=change,
        ))

    deltas.sort(key=lambda x: x.position_change, reverse=True)

    biggest_mover = deltas[0].driver if deltas and deltas[0].position_change > 0 else None
    biggest_loser = deltas[-1].driver if deltas and deltas[-1].position_change < 0 else None

    description = request.description or f"What-if scenario on {request.circuit} with {mods_applied} modification(s)"

    # Simplify results for output (strip large lap data)
    def simplify(results: List[Dict]) -> List[Dict]:
        return [
            {
                "driver_id": r.get("driver_id"),
                "team": r.get("team"),
                "position": r.get("position"),
                "total_time": r.get("total_time"),
                "gap_to_leader": r.get("gap_to_leader"),
                "status": r.get("status"),
            }
            for r in results
        ]

    return WhatIfResult(
        description=description,
        circuit=request.circuit,
        modifications_applied=mods_applied,
        original_result=simplify(original_results),
        modified_result=simplify(modified_results),
        deltas=deltas,
        biggest_mover=biggest_mover,
        biggest_loser=biggest_loser,
    )
