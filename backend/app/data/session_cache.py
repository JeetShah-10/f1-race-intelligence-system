# backend/app/data/session_cache.py
"""
FastF1 session caching wrapper.

Provides an aggressive caching layer around fastf1.get_session()
to avoid slow runtime fetches. Sessions are cached as pickle files.

Usage:
    from app.data.session_cache import get_session_with_cache
    session = get_session_with_cache(2024, "bahrain", "R")
"""

import os
import pickle
import fastf1
from pathlib import Path

# Cache directory: backend/cache/sessions/
ROOT_DIR = Path(__file__).parent.parent.parent
CACHE_DIR = ROOT_DIR / "cache" / "sessions"
FASTF1_CACHE = ROOT_DIR / "cache" / "fastf1"


def _ensure_cache():
    """Ensure cache directories exist and FastF1 cache is enabled."""
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
    FASTF1_CACHE.mkdir(parents=True, exist_ok=True)
    fastf1.Cache.enable_cache(str(FASTF1_CACHE))


def get_session_with_cache(year: int, track: str, session_type: str = "R"):
    """
    Load a FastF1 session with aggressive pickle caching.
    
    First checks for a pre-serialized pickle file. If not found,
    fetches from FastF1 (which has its own internal cache layer),
    then saves a pickle for instant future loads.
    
    Args:
        year: Season year (e.g. 2024)
        track: Track name or identifier (e.g. "bahrain", "Monaco")
        session_type: Session type ('R', 'Q', 'FP1', etc.)
    
    Returns:
        Loaded FastF1 session object
    """
    _ensure_cache()

    # Normalize track name for filesystem
    track_key = track.lower().replace(" ", "_").replace("'", "")
    cache_path = CACHE_DIR / f"{year}_{track_key}_{session_type}.pkl"

    # Try pickle cache first (fastest)
    if cache_path.exists():
        try:
            with open(cache_path, "rb") as f:
                return pickle.load(f)
        except Exception:
            # Corrupt cache — fall through to fresh fetch
            cache_path.unlink(missing_ok=True)

    # Fetch from FastF1 (uses its own HTTP cache layer)
    session = fastf1.get_session(year, track, session_type)
    session.load()

    # Save to pickle for instant future loads
    try:
        with open(cache_path, "wb") as f:
            pickle.dump(session, f)
    except Exception:
        pass  # Don't fail if we can't cache

    return session


def get_laps_with_cache(year: int, track: str, session_type: str = "R"):
    """
    Convenience: get just the laps DataFrame from a cached session.
    
    Returns:
        pandas DataFrame of lap data
    """
    session = get_session_with_cache(year, track, session_type)
    return session.laps.copy()


def clear_session_cache():
    """Remove all cached session pickle files."""
    if CACHE_DIR.exists():
        for f in CACHE_DIR.glob("*.pkl"):
            f.unlink()
