# backend/app/services/fastf1_service.py
"""
FastF1 data service for runtime data fetching.

Provides cached access to:
  - Session data (laps, telemetry, weather)
  - Ergast standings (driver + constructor)
  - Race results and schedules

Used by API endpoints for live data and by training scripts.
"""

import fastf1
import pandas as pd
import os
from typing import List, Dict, Any, Optional
from pathlib import Path

# ── Cache Setup ──
CACHE_DIR = Path(__file__).resolve().parent.parent.parent / "cache" / "fastf1"
CACHE_DIR.mkdir(parents=True, exist_ok=True)

try:
    fastf1.Cache.enable_cache(str(CACHE_DIR))
except Exception:
    pass  # Cache may already be enabled


class FastF1Service:
    """
    Service for fetching real F1 data from FastF1 API.
    Used for ML training, telemetry visualization, and standings.
    """

    def __init__(self):
        self._session_cache: Dict[str, Any] = {}

    # ── Session Management ──

    def _cache_key(self, year: int, gp: str, session_type: str) -> str:
        return f"{year}_{gp}_{session_type}"

    def get_session(self, year: int, gp: str, session_type: str = "R"):
        """
        Load and cache a FastF1 session.

        Args:
            year: Season year (2018-2025)
            gp: Grand Prix name or round number
            session_type: 'R' (Race), 'Q' (Qualifying), 'FP1'/'FP2'/'FP3'
        """
        key = self._cache_key(year, gp, session_type)

        if key not in self._session_cache:
            session = fastf1.get_session(year, gp, session_type)
            session.load(telemetry=True, weather=True)
            self._session_cache[key] = session

        return self._session_cache[key]

    # Backwards-compatible alias
    def load_session(self, year: int, gp: str, session: str = "R"):
        """Alias for get_session (backwards compatibility)."""
        try:
            return self.get_session(year, gp, session)
        except Exception as e:
            print(f"Error loading session: {e}")
            return None

    # ── Lap Data ──

    def get_lap_data(self, year: int, gp: str, session_type: str = "R") -> pd.DataFrame:
        """
        Get lap-by-lap data for ML training or analysis.

        Returns DataFrame with columns:
            Driver, Team, LapTime, LapNumber, Compound, TyreLife,
            Stint, Sector1Time, Sector2Time, Sector3Time,
            SpeedI1, SpeedI2, SpeedFL, SpeedST, IsPersonalBest
        """
        session = self.get_session(year, gp, session_type)
        laps = session.laps.pick_accurate()

        columns = [
            "Driver", "Team", "LapTime", "LapNumber",
            "Compound", "TyreLife", "Stint", "IsPersonalBest",
            "Sector1Time", "Sector2Time", "Sector3Time",
            "SpeedI1", "SpeedI2", "SpeedFL", "SpeedST",
        ]

        available = [c for c in columns if c in laps.columns]
        return laps[available].dropna(subset=["LapTime"])

    # ── Telemetry ──

    def get_telemetry(
        self,
        year: int,
        gp: str,
        driver: str,
        lap: Optional[int] = None,
        session_type: str = "R",
    ) -> pd.DataFrame:
        """
        Get detailed telemetry for a specific driver/lap.

        Returns DataFrame with: Speed, Throttle, Brake, Gear, DRS, RPM,
        X, Y, Z, Distance.
        If no lap specified, returns fastest lap telemetry.
        """
        session = self.get_session(year, gp, session_type)
        driver_laps = session.laps.pick_driver(driver)

        if lap is not None:
            target_lap = driver_laps[driver_laps["LapNumber"] == lap].iloc[0]
        else:
            target_lap = driver_laps.pick_fastest()

        return target_lap.get_car_data().add_distance()

    # ── Weather ──

    def get_weather_data(self, year: int, gp: str, session_type: str = "R") -> Dict[str, Any]:
        """
        Get weather conditions summary for a session.

        Returns dict with: air_temp, track_temp, humidity, rainfall, wind_speed.
        """
        session = self.get_session(year, gp, session_type)
        weather = session.weather_data

        if weather is None or weather.empty:
            return {
                "air_temp": None,
                "track_temp": None,
                "humidity": None,
                "rainfall": False,
                "wind_speed": None,
            }

        return {
            "air_temp": round(float(weather["AirTemp"].mean()), 1),
            "track_temp": round(float(weather["TrackTemp"].mean()), 1),
            "humidity": round(float(weather["Humidity"].mean()), 1),
            "rainfall": bool(weather["Rainfall"].any()),
            "wind_speed": round(float(weather["WindSpeed"].mean()), 1),
        }

    # ── Race Results ──

    def get_race_results(self, year: int, gp: str) -> List[Dict]:
        """Get race classification results."""
        session = self.get_session(year, gp, "R")
        results = session.results

        if results is None or results.empty:
            return []

        output = []
        for _, row in results.iterrows():
            output.append({
                "position": int(row.get("Position", 0)),
                "driver": row.get("Abbreviation", ""),
                "team": row.get("TeamName", ""),
                "points": float(row.get("Points", 0)),
                "status": row.get("Status", ""),
                "grid_position": int(row.get("GridPosition", 0)),
            })
        return output

    # ── Standings (Ergast) ──

    def get_driver_standings(self, year: int) -> List[Dict]:
        """
        Get driver championship standings via Ergast.

        Returns list of dicts with driver standings data.
        """
        try:
            ergast = fastf1.ergast.Ergast()
            standings = ergast.get_driver_standings(year)
            if standings.content and len(standings.content) > 0:
                return standings.content[0].to_dict("records")
        except Exception as e:
            print(f"Warning: Could not fetch driver standings for {year}: {e}")
        return []

    def get_constructor_standings(self, year: int) -> List[Dict]:
        """
        Get constructor championship standings via Ergast.

        Returns list of dicts with constructor standings data.
        """
        try:
            ergast = fastf1.ergast.Ergast()
            standings = ergast.get_constructor_standings(year)
            if standings.content and len(standings.content) > 0:
                return standings.content[0].to_dict("records")
        except Exception as e:
            print(f"Warning: Could not fetch constructor standings for {year}: {e}")
        return []

    # ── Schedule ──

    def get_schedule(self, year: int) -> List[Dict]:
        """
        Get the event schedule for a season.

        Returns list of events with: round, name, country, date, circuit.
        """
        try:
            schedule = fastf1.get_event_schedule(year)
            if schedule.empty:
                return []

            # Filter out testing events
            if "EventFormat" in schedule.columns:
                schedule = schedule[schedule["EventFormat"] != "testing"]

            # Sanitize to JSON-serializable types
            records = schedule.to_dict("records")
            sanitized = []
            for r in records:
                safe = {}
                for k, v in r.items():
                    if pd.isna(v):
                        safe[k] = None
                    elif hasattr(v, "isoformat"):
                        safe[k] = v.isoformat()
                    elif hasattr(v, "item"):  # numpy types
                        safe[k] = v.item()
                    else:
                        safe[k] = v
                sanitized.append(safe)
            return sanitized
        except Exception as e:
            print(f"Error fetching schedule for {year}: {e}")
            return []
