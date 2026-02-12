# backend/app/services/database_service.py
"""
Supabase client service for the F1 Intelligence System.

Handles all Supabase interactions: saving simulation results,
reading standings, circuits, and calendar data.
"""

import os
import logging
from typing import Optional
from pathlib import Path

from dotenv import load_dotenv

log = logging.getLogger(__name__)

# Load .env from backend root
_env_path = Path(__file__).resolve().parent.parent.parent / ".env"
load_dotenv(_env_path)

_client = None


def get_supabase():
    """Lazy singleton for the Supabase client."""
    global _client
    if _client is None:
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_ANON_KEY")
        if not url or not key:
            log.warning("Supabase credentials not found — database operations will be disabled")
            return None
        try:
            from supabase import create_client
            _client = create_client(url, key)
            log.info("Supabase client initialized")
        except Exception as e:
            log.error(f"Failed to create Supabase client: {e}")
            return None
    return _client


class DatabaseService:
    """High-level database operations for the F1 system."""

    def __init__(self):
        self.sb = get_supabase()

    @property
    def is_connected(self) -> bool:
        return self.sb is not None

    # ── Simulation Persistence ────────────────────────────────────────────

    def save_simulation(self, result: dict) -> Optional[str]:
        """
        Save a simulation result to Supabase.
        
        Args:
            result: SimulationResult as a dict (from .dict())
            
        Returns:
            simulation_id (UUID) or None on failure
        """
        if not self.is_connected:
            log.warning("Supabase not connected — skipping save")
            return None

        try:
            # 1. Insert simulation header
            sim_row = {
                "circuit_id": result.get("circuit", "unknown"),
                "session_type": "race",
                "total_laps": result.get("total_laps", 0),
                "winner_driver_id": result["results"][0]["driver_id"] if result.get("results") else None,
            }
            sim_resp = self.sb.table("simulation_results").insert(sim_row).execute()
            sim_id = sim_resp.data[0]["id"]
            log.info(f"Saved simulation header: {sim_id}")

            # 2. Insert driver results
            driver_rows = []
            for dr in result.get("results", []):
                driver_rows.append({
                    "simulation_id": sim_id,
                    "driver_id": dr.get("driver_id", "UNK"),
                    "team_id": dr.get("team", "UNK"),
                    "position": dr.get("position", 0),
                    "total_time": dr.get("total_time", 0),
                    "points": dr.get("points", 0),
                    "tyre_compound": dr.get("final_compound", None),
                    "strategy": str(dr.get("pit_stops", [])),
                })

            if driver_rows:
                dr_resp = self.sb.table("driver_results").insert(driver_rows).execute()
                log.info(f"Saved {len(dr_resp.data)} driver results")

                # 3. Insert lap data (batch per driver)
                for dr_data in dr_resp.data:
                    driver_id = dr_data["driver_id"]
                    dr_id = dr_data["id"]
                    
                    # Find matching driver in results to get lap times
                    matching = [r for r in result.get("results", []) if r.get("driver_id") == driver_id]
                    if matching and matching[0].get("lap_times"):
                        lap_rows = []
                        for i, lt in enumerate(matching[0]["lap_times"], 1):
                            lap_rows.append({
                                "driver_result_id": dr_id,
                                "lap_number": i,
                                "lap_time": lt if isinstance(lt, (int, float)) else 0,
                                "position": matching[0].get("position", 0),
                            })
                        if lap_rows:
                            # Batch in groups of 500
                            for j in range(0, len(lap_rows), 500):
                                self.sb.table("lap_data").insert(lap_rows[j:j+500]).execute()

            return sim_id

        except Exception as e:
            log.error(f"Error saving simulation: {e}")
            return None

    # ── Read Operations ───────────────────────────────────────────────────

    def get_standings(self, year: int = 2026) -> list[dict]:
        """Get driver standings for a given year."""
        if not self.is_connected:
            return []
        try:
            resp = self.sb.table("standings") \
                .select("*") \
                .eq("year", year) \
                .order("position") \
                .execute()
            return resp.data
        except Exception as e:
            log.error(f"Error fetching standings: {e}")
            return []

    def get_circuits(self) -> list[dict]:
        """Get all circuits."""
        if not self.is_connected:
            return []
        try:
            resp = self.sb.table("circuits").select("*").execute()
            return resp.data
        except Exception as e:
            log.error(f"Error fetching circuits: {e}")
            return []

    def get_circuit(self, circuit_id: str) -> Optional[dict]:
        """Get a single circuit by ID."""
        if not self.is_connected:
            return None
        try:
            resp = self.sb.table("circuits") \
                .select("*") \
                .eq("circuit_id", circuit_id) \
                .single() \
                .execute()
            return resp.data
        except Exception as e:
            log.error(f"Error fetching circuit {circuit_id}: {e}")
            return None

    def get_calendar(self, year: int = 2026) -> list[dict]:
        """Get race calendar for a year."""
        if not self.is_connected:
            return []
        try:
            resp = self.sb.table("races") \
                .select("*, circuits(name, country, lat, lng)") \
                .eq("year", year) \
                .order("round") \
                .execute()
            return resp.data
        except Exception as e:
            log.error(f"Error fetching calendar: {e}")
            return []

    def get_constructors_standings(self, year: int = 2026) -> list[dict]:
        """Aggregate constructor standings from driver standings."""
        if not self.is_connected:
            return []
        try:
            resp = self.sb.table("standings") \
                .select("team_name, points") \
                .eq("year", year) \
                .execute()

            # Aggregate by team
            teams = {}
            for row in resp.data:
                team = row["team_name"]
                if team not in teams:
                    teams[team] = {"team_name": team, "points": 0, "drivers": 0}
                teams[team]["points"] += row.get("points", 0) or 0
                teams[team]["drivers"] += 1

            result = sorted(teams.values(), key=lambda x: x["points"], reverse=True)
            for i, t in enumerate(result, 1):
                t["position"] = i
            return result
        except Exception as e:
            log.error(f"Error fetching constructor standings: {e}")
            return []

    def get_drivers(self) -> list[dict]:
        """Get all drivers."""
        if not self.is_connected:
            return []
        try:
            resp = self.sb.table("drivers").select("*").execute()
            return resp.data
        except Exception as e:
            log.error(f"Error fetching drivers: {e}")
            return []
