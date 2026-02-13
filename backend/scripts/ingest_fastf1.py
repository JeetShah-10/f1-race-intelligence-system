# backend/scripts/ingest_fastf1.py
"""
FastF1 ETL Pipeline - Ingest historical F1 data into Supabase.

Usage:
    python scripts/ingest_fastf1.py                     # Default: 2023-2024
    python scripts/ingest_fastf1.py --years 2022 2023 2024
    python scripts/ingest_fastf1.py --years 2024 --rounds 1 2 3

Populates:
    - public.fastf1_training_data (ML features)
    - public.race_results (finishing positions)
"""

import argparse
import os
import sys
import time
import logging
from pathlib import Path

import fastf1
import numpy as np
import pandas as pd
from dotenv import load_dotenv
from supabase import create_client

# Setup
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)-8s %(message)s")
log = logging.getLogger(__name__)

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY") or os.getenv("SUPABASE_KEY")
CACHE_DIR = Path(__file__).resolve().parent.parent / "cache"
CACHE_DIR.mkdir(exist_ok=True)
fastf1.Cache.enable_cache(str(CACHE_DIR))

BATCH_SIZE = 500  # Supabase insert batch limit
DELAY_BETWEEN_RACES = 8  # seconds - stay under 500 calls/h


def get_supabase():
    if not SUPABASE_URL or not SUPABASE_KEY:
        log.error("Missing SUPABASE_URL or SUPABASE_KEY in .env")
        sys.exit(1)
    return create_client(SUPABASE_URL, SUPABASE_KEY)


def ensure_race_exists(sb, session, year: int, round_num: int, circuit_id: str):
    """Insert into `races` table if not already present (satisfies FK for race_results)."""
    race_id = f"{year}_R{round_num:02d}"
    event = session.event
    event_name = event.get("EventName", f"Round {round_num}")
    event_date = str(event.get("EventDate", f"{year}-01-01"))[:10]  # YYYY-MM-DD

    row = {
        "race_id": race_id,
        "year": year,
        "round": round_num,
        "circuit_id": circuit_id,
        "name": event_name,
        "date": event_date,
    }
    try:
        sb.table("races").upsert(row, on_conflict="race_id").execute()
    except Exception as e:
        log.warning(f"  Could not upsert race {race_id}: {e}")


def circuit_id_from_name(name: str) -> str:
    """Convert circuit name to snake_case id."""
    mapping = {
        "Albert Park": "albert_park",
        "Shanghai": "shanghai",
        "Suzuka": "suzuka",
        "Bahrain": "bahrain",
        "Jeddah": "jeddah",
        "Miami": "miami",
        "Monaco": "monaco",
        "Barcelona": "barcelona",
        "Montréal": "montreal",
        "Montreal": "montreal",
        "Silverstone": "silverstone",
        "Spielberg": "red_bull_ring",
        "Budapest": "budapest",
        "Spa-Francorchamps": "spa",
        "Spa": "spa",
        "Zandvoort": "zandvoort",
        "Monza": "monza",
        "Baku": "baku",
        "Marina Bay": "marina_bay",
        "Singapore": "marina_bay",
        "Austin": "cota",
        "COTA": "cota",
        "Mexico City": "mexico",
        "São Paulo": "interlagos",
        "Sao Paulo": "interlagos",
        "Las Vegas": "las_vegas",
        "Lusail": "losail",
        "Qatar": "losail",
        "Yas Marina": "yas_marina",
        "Abu Dhabi": "yas_marina",
        "Imola": "imola",
        "Mugello": "mugello",
        "Portimão": "portimao",
        "Istanbul": "istanbul",
        "Losail": "losail",
        "Madrid": "madrid",
    }
    for key, val in mapping.items():
        if key.lower() in name.lower():
            return val
    return name.lower().replace(" ", "_").replace("-", "_")


def safe_float(val) -> float | None:
    """Convert timedelta or numeric to float seconds, returning None for NaN/NaT."""
    if pd.isna(val) or val is None or val is pd.NaT:
        return None
    if hasattr(val, "total_seconds"):
        v = val.total_seconds()
        return v if v > 0 else None
    try:
        f = float(val)
        return f if not np.isnan(f) else None
    except (TypeError, ValueError):
        return None


def load_session_safe(year: int, round_num: int):
    """Load a FastF1 session with retry on rate limit."""
    max_retries = 3
    for attempt in range(max_retries):
        try:
            session = fastf1.get_session(year, round_num, "R")
            session.load(laps=True, telemetry=False, weather=True, messages=False)
            return session
        except fastf1.req.RateLimitExceededError:
            wait = 60 * (attempt + 1)  # 60s, 120s, 180s
            log.warning(f"   Rate limited! Waiting {wait}s before retry {attempt+1}/{max_retries}...")
            time.sleep(wait)
        except Exception as e:
            log.warning(f"  Skipping {year} R{round_num}: {e}")
            return None
    log.error(f"   Failed after {max_retries} retries for {year} R{round_num}")
    return None


def ingest_session(sb, session, year: int, round_num: int) -> int:
    """Ingest lap data from an already-loaded session."""
    event_name = session.event["EventName"]
    circuit_loc = session.event.get("Location", event_name)
    cid = circuit_id_from_name(circuit_loc)
    race_id = f"{year}_R{round_num:02d}"

    log.info(f"  Processing {event_name} ({race_id}) - {cid}")

    try:
        laps = session.laps
    except Exception as e:
        log.warning(f"  Laps not loaded for {race_id} (rate limit?): {e}")
        return 0
    if laps is None or laps.empty:
        log.warning(f"  No lap data for {race_id}")
        return 0

    # Weather info - safely handle missing/unloaded data
    avg_air_temp = None
    avg_track_temp = None
    has_rain = False
    try:
        weather = session.weather_data
        if weather is not None and not weather.empty:
            avg_air_temp = weather["AirTemp"].mean()
            avg_track_temp = weather["TrackTemp"].mean()
            has_rain = bool(weather["Rainfall"].any())
    except Exception as e:
        log.warning(f"  Weather data unavailable for {race_id}: {e}")

    # Build training rows
    rows = []
    for _, lap in laps.iterrows():
        lt = safe_float(lap.get("LapTime"))
        if lt is None or lt <= 0 or lt > 300:
            continue

        driver_id_raw = str(lap.get("Driver", "UNK"))
        driver_id = driver_id_raw.lower()

        row = {
            "race_id": race_id,
            "year": year,
            "round": round_num,
            "circuit_id": cid,
            "driver_id": driver_id,
            "lap_number": int(lap.get("LapNumber", 0)),
            "lap_time_seconds": round(lt, 4),
            "compound": str(lap.get("Compound", "UNKNOWN")).upper(),
            "tyre_life": int(lap.get("TyreLife", 0)) if pd.notna(lap.get("TyreLife")) else None,
            "sector1_seconds": safe_float(lap.get("Sector1Time")),
            "sector2_seconds": safe_float(lap.get("Sector2Time")),
            "sector3_seconds": safe_float(lap.get("Sector3Time")),
            "speed_trap": safe_float(lap.get("SpeedST")),
            "finish_line_speed": safe_float(lap.get("SpeedFL")),
            "air_temp": round(avg_air_temp, 1) if avg_air_temp else None,
            "track_temp": round(avg_track_temp, 1) if avg_track_temp else None,
            "rainfall": has_rain,
            "position": int(lap.get("Position", 0)) if pd.notna(lap.get("Position")) else None,
            "is_personal_best": bool(lap.get("IsPersonalBest", False)),
            "is_deleted": bool(lap.get("Deleted", False)),
        }
        rows.append(row)

    if not rows:
        return 0

    # Batch upsert to Supabase
    total_inserted = 0
    for i in range(0, len(rows), BATCH_SIZE):
        batch = rows[i : i + BATCH_SIZE]
        try:
            sb.table("fastf1_training_data").insert(batch).execute()
            total_inserted += len(batch)
        except Exception as e:
            err_str = str(e)
            if "duplicate" in err_str.lower() or "unique" in err_str.lower():
                log.warning(f"  Duplicate batch {i//BATCH_SIZE} - already ingested, skipping")
                total_inserted += len(batch)
            else:
                log.error(f"  Insert error at batch {i//BATCH_SIZE}: {e}")

    log.info(f"  -> Inserted {total_inserted} laps for {race_id}")
    return total_inserted


def ingest_results(sb, session, year: int, round_num: int):
    """Ingest race results from an already-loaded session."""
    try:
        results = session.results
    except Exception:
        return

    if results is None or results.empty:
        return

    race_id = f"{year}_R{round_num:02d}"
    rows = []
    for _, r in results.iterrows():
        driver_id = str(r.get("Abbreviation", "UNK")).lower()
        rows.append({
            "race_id": race_id,
            "driver_id": driver_id,
            "position": int(r.get("Position", 0)) if pd.notna(r.get("Position")) else None,
            "grid": int(r.get("GridPosition", 0)) if pd.notna(r.get("GridPosition")) else None,
            "status": str(r.get("Status", "Unknown")),
            "points": float(r.get("Points", 0)) if pd.notna(r.get("Points")) else 0,
            "time_millis": int(safe_float(r.get("Time")) * 1000) if safe_float(r.get("Time")) else None,
        })

    if rows:
        try:
            sb.table("race_results").insert(rows).execute()
            log.info(f"  -> Inserted {len(rows)} results for {race_id}")
        except Exception as e:
            err_str = str(e)
            if "duplicate" in err_str.lower() or "unique" in err_str.lower():
                log.warning(f"  Results for {race_id} already exist, skipping")
            else:
                log.error(f"  Results insert error: {e}")


def main():
    parser = argparse.ArgumentParser(description="FastF1 ETL Pipeline")
    parser.add_argument("--years", nargs="+", type=int, default=[2023, 2024])
    parser.add_argument("--rounds", nargs="*", type=int, default=None)
    args = parser.parse_args()

    sb = get_supabase()
    total_laps = 0

    for year in args.years:
        log.info(f"\n{'='*60}")
        log.info(f"INGESTING YEAR {year}")
        log.info(f"{'='*60}")

        schedule = fastf1.get_event_schedule(year, include_testing=False)
        rounds = args.rounds or list(schedule["RoundNumber"])

        for rnd in rounds:
            if rnd == 0:
                continue

            # Load session ONCE (handles rate limiting + retries)
            session = load_session_safe(year, rnd)
            if session is None:
                continue

            # Get circuit_id for this session
            circuit_loc = session.event.get("Location", session.event["EventName"])
            cid = circuit_id_from_name(circuit_loc)

            # Ensure race row exists in `races` table (FK for race_results)
            ensure_race_exists(sb, session, year, rnd, cid)

            # Ingest lap data (ML training features)
            n = ingest_session(sb, session, year, rnd)
            total_laps += n
            # NOTE: race_results skipped - FK constraints to races/drivers
            # tables don't have historical entries. fastf1_training_data
            # is sufficient for ML model training.
            # ingest_results(sb, session, year, rnd)

            # Delay between races to avoid rate limit
            log.info(f"   Waiting {DELAY_BETWEEN_RACES}s to avoid rate limit...")
            time.sleep(DELAY_BETWEEN_RACES)

    log.info(f"\n Done! Total laps ingested: {total_laps}")


if __name__ == "__main__":
    main()
