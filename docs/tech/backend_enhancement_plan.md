# Dev's Backend Enhancement Plan — F1 Intelligence Platform

> **Owner**: Dev  
> **Focus**: ML, Simulation Physics, FastF1 Integration, API Completion  
> **Timeline**: 3 Weeks to Production-Ready Backend

---

## 🎯 Executive Summary

The backend has a solid foundation. This plan focuses on:

1. **Making ML models more realistic** (real FastF1 data, proper training)
2. **Enhancing simulation physics** (overtaking, DRS, ERS, weather effects)
3. **Adding secondary features** (Driver vs Driver, Season Sim, What-If)
4. **Creating missing API endpoints** for frontend integration

---

## Current State Analysis

### ✅ What's Working
| Component | Status | Notes |
|-----------|--------|-------|
| `PaceModel` | ⚠️ Basic | LightGBM but features limited |
| `RaceEngine` | ✅ Good | Has SC, DNFs, fuel burn |
| `CrashModel` | ✅ Good | Circuit/weather/reliability factors |
| `StrategyService` | ⚠️ Basic | Undercut logic but no optimal window |
| `QualifyingService` | ⚠️ Hardcoded | Tier-based, needs ML backing |
| 2026 Config | ✅ Complete | 11 teams, 15+ drivers |

### ⚠️ What Needs Enhancement
| Component | Current Problem | Solution |
|-----------|-----------------|----------|
| `PaceModel` | Uses SpeedST/SpeedFL, not real telemetry | Use FastF1 sector times |
| Degradation | Linear 0.05s/lap | Per-compound nonlinear curve |
| Overtaking | Not simulated | Add DRS zones + delta threshold |
| Weather | Multiplier only | Dynamic track evolution |
| Driver vs Driver | Missing | New `/api/compare/drivers` |
| Season Sim | Missing | New `/api/season/simulate` |

---

## Week 1: ML Model Enhancements

### Task 1.1: FastF1 Data Pipeline

**Goal**: Create robust data fetching from FastF1 for ML training.

#### File: `backend/app/services/fastf1_service.py`
```python
import fastf1
from functools import lru_cache
from typing import List, Dict, Any
import pandas as pd

fastf1.Cache.enable_cache('f1_cache')

class FastF1Service:
    """
    Service for fetching real F1 data from FastF1 API.
    Used for ML training and telemetry visualization.
    """
    
    @lru_cache(maxsize=20)
    def get_session(self, year: int, gp: str, session_type: str = 'R'):
        """Load and cache a session."""
        session = fastf1.get_session(year, gp, session_type)
        session.load(telemetry=True, weather=True)
        return session
    
    def get_lap_data(self, year: int, gp: str) -> pd.DataFrame:
        """
        Get lap-by-lap data for ML training.
        Includes: Driver, Team, LapTime, LapNumber,
        Compound, TyreLife, FuelLoad
        """
        session = self.get_session(year, gp, 'R')
        laps = session.laps.pick_accurate()
        
        return laps[[
            'Driver', 'Team', 'LapTime', 'LapNumber',
            'Compound', 'TyreLife', 'Stint', 'IsPersonalBest',
            'Sector1Time', 'Sector2Time', 'Sector3Time',
            'SpeedI1', 'SpeedI2', 'SpeedFL', 'SpeedST'
        ]].dropna()
    
    def get_telemetry(self, year: int, gp: str, driver: str, lap: int = None):
        """
        Get detailed telemetry for a specific driver/lap.
        Returns: Speed, Throttle, Brake, Gear, DRS, RPM, X, Y, Z
        """
        session = self.get_session(year, gp, 'R')
        driver_laps = session.laps.pick_driver(driver)
        
        if lap:
            target_lap = driver_laps[driver_laps['LapNumber'] == lap].iloc[0]
        else:
            target_lap = driver_laps.pick_fastest()
            
        return target_lap.get_car_data().add_distance()
    
    def get_weather_data(self, year: int, gp: str) -> Dict[str, Any]:
        """Get weather conditions for a session."""
        session = self.get_session(year, gp, 'R')
        weather = session.weather_data
        return {
            'air_temp': weather['AirTemp'].mean(),
            'track_temp': weather['TrackTemp'].mean(),
            'humidity': weather['Humidity'].mean(),
            'rainfall': weather['Rainfall'].any(),
            'wind_speed': weather['WindSpeed'].mean()
        }
    
    def get_driver_standings(self, year: int) -> List[Dict]:
        """Get current season standings."""
        ergast = fastf1.ergast.Ergast()
        standings = ergast.get_driver_standings(year)
        return standings.content[0].to_dict('records')
```

---

### Task 1.2: Enhanced Pace Model

**Goal**: Train on real FastF1 data with proper features.

#### Enhanced Features for `pace_model.py`:

```python
# ENHANCED FEATURE SET for PaceModel
FEATURES_V2 = [
    # Track-specific
    'circuit_id',           # One-hot encoded
    'sector_count',         # 3
    
    # Tyre State
    'compound',             # SOFT/MEDIUM/HARD
    'tyre_life',            # Laps on current stint
    'stint_number',         # 1, 2, 3...
    
    # Fuel/Race Progress
    'fuel_load_kg',         # ~110kg start, burns ~1.5kg/lap
    'race_progress_pct',    # 0.0 to 1.0
    
    # Environmental
    'track_temp_c',
    'air_temp_c',
    'track_evolution',      # 0.0 (green) to 1.0 (rubbered in)
    
    # Driver/Car
    'driver_skill_rating',  # 0.0 to 1.0 (from performance_modifiers)
    'car_baseline_pace',    # From team tier
    
    # Historical (from FastF1)
    'avg_sector1_time',
    'avg_sector2_time', 
    'avg_sector3_time',
]
```

#### Training Script: `backend/scripts/train_pace_model_v2.py`

```python
#!/usr/bin/env python3
"""
Train enhanced pace model using historical FastF1 data.
Uses 2022-2024 data for realistic predictions.
"""
import fastf1
import pandas as pd
import lightgbm as lgb
from pathlib import Path
import joblib

fastf1.Cache.enable_cache('f1_cache')

# Races to train on (diverse circuits)
TRAINING_RACES = [
    (2024, 'Monaco'), (2024, 'Spa'), (2024, 'Monza'),
    (2024, 'Singapore'), (2024, 'Japan'), (2024, 'Austin'),
    (2023, 'Monaco'), (2023, 'Spa'), (2023, 'Monza'),
]

def collect_training_data() -> pd.DataFrame:
    """Collect lap data from multiple races."""
    all_laps = []
    
    for year, gp in TRAINING_RACES:
        print(f"Loading {year} {gp}...")
        session = fastf1.get_session(year, gp, 'R')
        session.load()
        
        laps = session.laps.pick_accurate()
        laps['year'] = year
        laps['circuit'] = gp.lower()
        all_laps.append(laps)
    
    return pd.concat(all_laps, ignore_index=True)

def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    """Create ML features from raw lap data."""
    # Fuel load estimation (110kg start, 1.5kg/lap burn)
    df['fuel_load_kg'] = 110 - (df['LapNumber'] * 1.5)
    df['fuel_load_kg'] = df['fuel_load_kg'].clip(lower=5)
    
    # Race progress
    max_laps = df.groupby(['year', 'circuit'])['LapNumber'].transform('max')
    df['race_progress'] = df['LapNumber'] / max_laps
    
    # Tyre degradation phase (fresh/optimal/degraded/cliff)
    df['tyre_phase'] = pd.cut(
        df['TyreLife'], 
        bins=[0, 5, 15, 25, 100],
        labels=['fresh', 'optimal', 'degraded', 'cliff']
    )
    
    # Convert LapTime to seconds
    df['LapTime_seconds'] = df['LapTime'].dt.total_seconds()
    
    return df

def train_model(df: pd.DataFrame):
    """Train LightGBM model."""
    features = [
        'TyreLife', 'fuel_load_kg', 'race_progress',
        'SpeedI1', 'SpeedI2', 'SpeedFL'
    ]
    
    # Filter valid data
    df = df.dropna(subset=features + ['LapTime_seconds'])
    df = df[df['LapTime_seconds'] < 150]  # Remove outliers
    
    X = df[features]
    y = df['LapTime_seconds']
    
    model = lgb.LGBMRegressor(
        objective='regression',
        n_estimators=200,
        learning_rate=0.05,
        max_depth=10,
        random_state=42
    )
    
    model.fit(X, y)
    
    # Save model
    model_path = Path(__file__).parent.parent / 'app/models'
    model_path.mkdir(exist_ok=True)
    joblib.dump(model, model_path / 'pace_model_v2.pkl')
    
    print(f"Model saved. Train RMSE: {model.score(X, y):.4f}")

if __name__ == '__main__':
    data = collect_training_data()
    data = engineer_features(data)
    train_model(data)
```

---

### Task 1.3: Realistic Tyre Degradation Model

**Goal**: Non-linear degradation with "cliff" effect.

#### File: `backend/app/ml/degradation_model.py`

```python
import numpy as np
from typing import Dict

class TyreDegradationModel:
    """
    Realistic tyre degradation with:
    - Initial "scrub-in" phase (laps 1-3)
    - Optimal window (laps 4-15 for soft, longer for harder)
    - Linear degradation phase
    - Performance "cliff" at end of life
    """
    
    # Base life expectancy per compound (laps)
    COMPOUND_LIFE = {
        'SOFT': 18,
        'MEDIUM': 28,
        'HARD': 40,
        'INTERMEDIATE': 30,
        'WET': 25
    }
    
    # Performance delta vs soft at equal wear
    COMPOUND_PACE = {
        'SOFT': 0.0,
        'MEDIUM': 0.6,
        'HARD': 1.2,
        'INTERMEDIATE': 3.0,
        'WET': 6.0
    }
    
    def get_degradation(
        self, 
        compound: str, 
        tyre_life: int, 
        track_temp: float = 30.0,
        aggression: float = 1.0
    ) -> float:
        """
        Calculate time loss in seconds due to tyre wear.
        
        Args:
            compound: Tyre compound (SOFT/MEDIUM/HARD/etc)
            tyre_life: Laps on current set
            track_temp: Track temperature in Celsius
            aggression: Driver aggression factor (0.8 = conservative, 1.2 = aggressive)
        
        Returns:
            Seconds added to base lap time
        """
        compound = compound.upper()
        base_life = self.COMPOUND_LIFE.get(compound, 25)
        
        # Temperature adjustment (hotter = faster degradation)
        temp_factor = 1.0 + (track_temp - 30) * 0.01
        adjusted_life = base_life / (temp_factor * aggression)
        
        # Wear percentage
        wear_pct = tyre_life / adjusted_life
        
        # Phase-based degradation
        if wear_pct <= 0.15:
            # Scrub-in phase: slight improvement then stable
            deg = 0.1 - (wear_pct * 0.5)  # Slightly negative early
        elif wear_pct <= 0.70:
            # Linear phase: gradual degradation
            deg = (wear_pct - 0.15) * 1.5
        elif wear_pct <= 1.0:
            # Late phase: accelerating degradation
            base_deg = 0.55 * 1.5  # deg at 70%
            extra = (wear_pct - 0.70) * 4.0
            deg = base_deg + extra
        else:
            # CLIFF: massive performance drop
            deg = 2.0 + ((wear_pct - 1.0) * 10.0)
        
        return max(0, deg)
    
    def get_optimal_pit_window(
        self, 
        compound: str, 
        track_temp: float = 30.0
    ) -> Dict[str, int]:
        """Calculate optimal pit stop window for a compound."""
        base_life = self.COMPOUND_LIFE.get(compound.upper(), 25)
        temp_factor = 1.0 + (track_temp - 30) * 0.01
        adjusted_life = int(base_life / temp_factor)
        
        return {
            'optimal_start': int(adjusted_life * 0.65),
            'optimal_end': int(adjusted_life * 0.80),
            'danger_zone': int(adjusted_life * 0.95)
        }
```

---

## Week 2: Simulation Enhancements

### Task 2.1: Overtaking Model

**Goal**: Simulate realistic overtaking with DRS and dirty air.

#### File: `backend/app/simulation/overtaking_model.py`

```python
import random
from typing import Optional, Tuple

class OvertakingModel:
    """
    Determines if an overtake attempt succeeds based on:
    - Gap to car ahead
    - DRS availability
    - Tyre delta
    - Track characteristics
    - Driver skill
    """
    
    # Circuit overtaking difficulty (0 = easy like Monza, 1 = hard like Monaco)
    CIRCUIT_DIFFICULTY = {
        'monaco': 0.95,
        'singapore': 0.75,
        'hungary': 0.70,
        'spa': 0.30,
        'monza': 0.20,
        'baku': 0.35,
        'default': 0.50
    }
    
    # DRS effectiveness (seconds gained per activation)
    DRS_GAIN = 0.3  # ~0.3s advantage
    DRS_THRESHOLD = 1.0  # Must be within 1s to use DRS
    
    def __init__(self, rng: random.Random = None):
        self.rng = rng or random.Random()
    
    def evaluate_overtake(
        self,
        attacker_id: str,
        defender_id: str,
        gap_seconds: float,
        attacker_pace: float,
        defender_pace: float,
        attacker_tyre_age: int,
        defender_tyre_age: int,
        circuit_id: str,
        drs_enabled: bool = True,
        is_drs_zone: bool = False
    ) -> Tuple[bool, Optional[str]]:
        """
        Evaluate if an overtake attempt succeeds.
        
        Returns:
            (success: bool, method: str|None)
            method can be: 'DRS', 'TYRE_ADVANTAGE', 'OUTBRAKING', None
        """
        # Base probability from gap (closer = higher chance)
        if gap_seconds > 1.5:
            return False, None  # Too far back
        
        # Gap factor (0.0s = 0.5 base, 1.5s = 0.0 base)
        gap_factor = max(0, 0.5 - (gap_seconds / 3.0))
        
        # Pace delta factor
        pace_delta = defender_pace - attacker_pace  # Positive = attacker faster
        pace_factor = min(0.3, pace_delta * 0.2)  # Max 0.3 boost
        
        # Tyre advantage
        tyre_delta = defender_tyre_age - attacker_tyre_age
        tyre_factor = min(0.15, tyre_delta * 0.01)  # Max 0.15 boost
        
        # Circuit difficulty
        difficulty = self.CIRCUIT_DIFFICULTY.get(
            circuit_id.lower(), 
            self.CIRCUIT_DIFFICULTY['default']
        )
        
        # DRS boost
        drs_factor = 0.0
        method = 'OUTBRAKING'
        
        if drs_enabled and is_drs_zone and gap_seconds <= self.DRS_THRESHOLD:
            drs_factor = 0.25
            method = 'DRS'
        elif tyre_factor > 0.1:
            method = 'TYRE_ADVANTAGE'
        
        # Final probability
        base_prob = gap_factor + pace_factor + tyre_factor + drs_factor
        final_prob = base_prob * (1 - difficulty * 0.5)
        
        success = self.rng.random() < final_prob
        
        return success, method if success else None
```

---

### Task 2.2: Enhanced Race Engine with Overtaking

Update `race_engine.py` to include overtaking:

```python
# Add to RaceEngine._process_lap() after line 176:

def _process_lap(self, lap: int):
    """Process simulation logic with overtaking."""
    # ... existing lap time calculation ...
    
    # OVERTAKING PHASE (after lap times calculated)
    if not self.flags.get("SC"):
        self._resolve_overtakes(lap)

def _resolve_overtakes(self, lap: int):
    """Attempt overtakes between adjacent positions."""
    # Sort by current position
    sorted_drivers = sorted(self.drivers, key=lambda d: d.position)
    
    for i in range(1, len(sorted_drivers)):
        attacker = sorted_drivers[i]
        defender = sorted_drivers[i-1]
        
        if not attacker.is_running or not defender.is_running:
            continue
        
        # Calculate gap
        gap = attacker.current_time - defender.current_time
        
        # Only attempt if within 1.5s
        if gap <= 1.5:
            # Check DRS zone (simplified: every 3rd lap has DRS opportunity)
            is_drs_zone = lap % 3 == 0
            
            success, method = self.overtaking_model.evaluate_overtake(
                attacker_id=attacker.driver_id,
                defender_id=defender.driver_id,
                gap_seconds=gap,
                attacker_pace=attacker.last_lap_time,
                defender_pace=defender.last_lap_time,
                attacker_tyre_age=attacker.tire_age,
                defender_tyre_age=defender.tire_age,
                circuit_id=self.circuit,
                is_drs_zone=is_drs_zone
            )
            
            if success:
                # Swap positions and adjust times
                print(f"🏎️ LAP {lap}: {attacker.driver_id} overtakes {defender.driver_id} ({method})")
                attacker.position, defender.position = defender.position, attacker.position
                # Time adjustment for defensive driving
                defender.current_time += 0.5
                attacker.record_event(f"OVERTAKE_{method}", lap)
```

---

### Task 2.3: Weather Evolution Model

**Goal**: Dynamic weather that changes during race.

#### File: `backend/app/simulation/weather_model.py`

```python
import random
from dataclasses import dataclass
from typing import List

@dataclass
class WeatherState:
    condition: str  # 'dry', 'light_rain', 'heavy_rain'
    track_temp: float
    air_temp: float
    humidity: float
    track_wetness: float  # 0.0 (bone dry) to 1.0 (standing water)

class WeatherEvolutionModel:
    """Simulates weather evolution during a race."""
    
    def __init__(self, initial_condition: str = 'dry', rng: random.Random = None):
        self.rng = rng or random.Random()
        self.condition = initial_condition
        self.track_wetness = 0.0 if initial_condition == 'dry' else 0.5
        
    def evolve(self, lap: int, total_laps: int) -> WeatherState:
        """Calculate weather for a specific lap."""
        # Random chance of weather change
        if self.rng.random() < 0.02:  # 2% per lap
            transitions = {
                'dry': ['dry', 'dry', 'light_rain'],
                'light_rain': ['light_rain', 'dry', 'heavy_rain'],
                'heavy_rain': ['heavy_rain', 'light_rain', 'light_rain']
            }
            self.condition = self.rng.choice(transitions[self.condition])
        
        # Track wetness dynamics
        if self.condition == 'heavy_rain':
            self.track_wetness = min(1.0, self.track_wetness + 0.05)
        elif self.condition == 'light_rain':
            self.track_wetness = min(0.6, max(0.2, self.track_wetness + 0.02))
        else:
            # Drying out
            self.track_wetness = max(0.0, self.track_wetness - 0.03)
        
        # Temperature variation
        base_track = 35.0 if self.condition == 'dry' else 25.0
        track_temp = base_track + self.rng.gauss(0, 2)
        
        return WeatherState(
            condition=self.condition,
            track_temp=track_temp,
            air_temp=track_temp - 10,
            humidity=0.5 + self.track_wetness * 0.4,
            track_wetness=self.track_wetness
        )
    
    def get_tyre_compound_recommendation(self, state: WeatherState) -> str:
        """Recommend tyre compound based on conditions."""
        if state.track_wetness > 0.7:
            return 'WET'
        elif state.track_wetness > 0.3:
            return 'INTERMEDIATE'
        else:
            return 'HARD' if state.track_temp > 40 else 'MEDIUM'
```

---

## Week 3: Secondary Features & API Completion

### Task 3.1: Driver vs Driver Comparison

**Endpoint**: `POST /api/compare/drivers`

#### File: `backend/app/api/compare.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from app.services.fastf1_service import FastF1Service
from app.services.season_config_service import SeasonConfigService
import pandas as pd

router = APIRouter()
fastf1 = FastF1Service()
season_config = SeasonConfigService()

class DriverCompareRequest(BaseModel):
    driver1: str
    driver2: str
    circuits: Optional[List[str]] = None  # Optional filter
    year: int = 2024  # Historical data year

class HeadToHeadResult(BaseModel):
    driver1_id: str
    driver2_id: str
    quali_wins: dict
    race_wins: dict
    avg_quali_gap: float
    avg_race_pace_gap: float
    circuit_breakdown: list

@router.post("/drivers", response_model=HeadToHeadResult)
async def compare_drivers(request: DriverCompareRequest):
    """
    Compare two drivers head-to-head across multiple dimensions.
    Uses historical data + 2026 performance modifiers.
    """
    d1, d2 = request.driver1.upper(), request.driver2.upper()
    
    # Get 2026 config modifiers
    d1_cfg = season_config.get_driver_config(d1.lower())
    d2_cfg = season_config.get_driver_config(d2.lower())
    
    d1_pace_mod = d1_cfg.get('performance_modifiers', {}).get('raw_pace', 0) if d1_cfg else 0
    d2_pace_mod = d2_cfg.get('performance_modifiers', {}).get('raw_pace', 0) if d2_cfg else 0
    
    # Calculate projected gap
    pace_gap = d2_pace_mod - d1_pace_mod  # Positive = d1 faster
    
    # Mock circuit breakdown (replace with real FastF1 query)
    circuits = request.circuits or ['monaco', 'spa', 'monza', 'singapore']
    circuit_data = []
    
    for circuit in circuits:
        # In production: query FastF1 for actual h2h data
        circuit_data.append({
            'circuit': circuit,
            'driver1_avg_position': 3 + (1 if d1_pace_mod > d2_pace_mod else -1),
            'driver2_avg_position': 4 + (1 if d2_pace_mod > d1_pace_mod else -1),
            'driver1_wins': 1 if d1_pace_mod < d2_pace_mod else 0,
            'driver2_wins': 1 if d2_pace_mod < d1_pace_mod else 0,
        })
    
    return HeadToHeadResult(
        driver1_id=d1,
        driver2_id=d2,
        quali_wins={'driver1': 4, 'driver2': 2},
        race_wins={'driver1': 3, 'driver2': 3},
        avg_quali_gap=round(pace_gap * 0.8, 3),
        avg_race_pace_gap=round(pace_gap, 3),
        circuit_breakdown=circuit_data
    )
```

---

### Task 3.2: Season Championship Simulation

**Endpoint**: `POST /api/season/simulate`

#### File: `backend/app/api/season.py`

```python
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Optional
from app.services.race_predictor_service import RacePredictorService
import json
from pathlib import Path

router = APIRouter()
predictor = RacePredictorService()

# 2026 Calendar (simplified)
CALENDAR_2026 = [
    {'round': 1, 'name': 'Bahrain', 'circuit_id': 'bahrain', 'laps': 57, 'sprint': False},
    {'round': 2, 'name': 'Saudi Arabia', 'circuit_id': 'jeddah', 'laps': 50, 'sprint': False},
    {'round': 3, 'name': 'Australia', 'circuit_id': 'melbourne', 'laps': 58, 'sprint': True},
    {'round': 4, 'name': 'Japan', 'circuit_id': 'suzuka', 'laps': 53, 'sprint': False},
    {'round': 5, 'name': 'China', 'circuit_id': 'shanghai', 'laps': 56, 'sprint': True},
    {'round': 6, 'name': 'Miami', 'circuit_id': 'miami', 'laps': 57, 'sprint': True},
    {'round': 7, 'name': 'Monaco', 'circuit_id': 'monaco', 'laps': 78, 'sprint': False},
    {'round': 8, 'name': 'Spain', 'circuit_id': 'barcelona', 'laps': 66, 'sprint': False},
    {'round': 9, 'name': 'Canada', 'circuit_id': 'montreal', 'laps': 70, 'sprint': False},
    {'round': 10, 'name': 'Austria', 'circuit_id': 'spielberg', 'laps': 71, 'sprint': True},
    # ... add remaining races
]

# Points system
POINTS = {
    1: 25, 2: 18, 3: 15, 4: 12, 5: 10,
    6: 8, 7: 6, 8: 4, 9: 2, 10: 1
}

class SeasonSimRequest(BaseModel):
    num_races: int = 24  # Full season
    weather_variance: str = 'realistic'  # 'all_dry', 'realistic', 'chaotic'
    include_sprints: bool = True

class SeasonSimResult(BaseModel):
    driver_standings: List[Dict]
    constructor_standings: List[Dict]
    race_winners: List[Dict]
    championship_progression: List[Dict]  # For charts

@router.post("/simulate")
async def simulate_season(request: SeasonSimRequest):
    """Simulate the entire 2026 season."""
    driver_points = {}
    constructor_points = {}
    race_results = []
    progression = []
    
    for race in CALENDAR_2026[:request.num_races]:
        print(f"Simulating Round {race['round']}: {race['name']}")
        
        # Determine weather
        weather = 'dry'
        if request.weather_variance == 'realistic':
            # 20% chance of rain at certain circuits
            import random
            if race['circuit_id'] in ['spa', 'montreal', 'singapore'] and random.random() < 0.3:
                weather = 'light_rain'
        elif request.weather_variance == 'chaotic':
            weather = random.choice(['dry', 'dry', 'light_rain', 'wet'])
        
        # Run prediction
        result = predictor.predict_event_2026(
            circuit_id=race['circuit_id'],
            weather=weather,
            lap_count=race['laps']
        )
        
        # Award points
        for driver_result in result['race_result']['results']:
            pos = driver_result['position']
            driver_id = driver_result['driver_id']
            team = driver_result['team']
            
            if pos <= 10:
                points = POINTS.get(pos, 0)
                driver_points[driver_id] = driver_points.get(driver_id, 0) + points
                constructor_points[team] = constructor_points.get(team, 0) + points
        
        # Record race winner
        race_results.append({
            'round': race['round'],
            'name': race['name'],
            'winner': result['race_result']['results'][0]['driver_id'],
            'weather': weather
        })
        
        # Snapshot standings for progression chart
        progression.append({
            'round': race['round'],
            'standings': dict(sorted(driver_points.items(), key=lambda x: -x[1])[:10])
        })
    
    # Sort final standings
    driver_standings = [
        {'driver': d, 'points': p, 'position': i+1}
        for i, (d, p) in enumerate(sorted(driver_points.items(), key=lambda x: -x[1]))
    ]
    
    constructor_standings = [
        {'constructor': c, 'points': p, 'position': i+1}
        for i, (c, p) in enumerate(sorted(constructor_points.items(), key=lambda x: -x[1]))
    ]
    
    return SeasonSimResult(
        driver_standings=driver_standings,
        constructor_standings=constructor_standings,
        race_winners=race_results,
        championship_progression=progression
    )
```

---

### Task 3.3: What-If Scenario API

**Endpoint**: `POST /api/scenario/whatif`

```python
@router.post("/whatif")
async def what_if_scenario(request: WhatIfRequest):
    """
    Run a what-if scenario simulation.
    Examples:
    - "What if Hamilton was at Red Bull?"
    - "What if it rained at Monaco?"
    - "What if Verstappen had a DNF at Spa?"
    """
    # Load base 2026 config
    config = season_config.load_config()
    
    # Apply modifications
    for mod in request.modifications:
        if mod.type == 'driver_swap':
            # Move driver to new team
            for driver in config['drivers']:
                if driver['id'] == mod.driver_id:
                    driver['team_id'] = mod.new_team
                    
        elif mod.type == 'performance_boost':
            # Adjust team performance
            for team in config['teams']:
                if team['id'] == mod.team_id:
                    team['performance_modifiers']['lap_time_bias'] += mod.delta
                    
        elif mod.type == 'weather_override':
            # Will be passed to simulation
            pass
        
        elif mod.type == 'dnf_inject':
            # Force a DNF for specific driver at specific lap
            pass
    
    # Run simulation with modified config
    # ... simulation logic ...
    
    return {
        'original_result': original_standings,
        'whatif_result': modified_standings,
        'delta': calculate_delta(original_standings, modified_standings)
    }
```

---

## API Endpoint Summary

| Endpoint | Method | Status | Frontend Page |
|----------|--------|--------|---------------|
| `/health` | GET | ✅ Done | - |
| `/api/drivers` | GET | ✅ Done | Dashboard |
| `/api/circuits` | GET | ✅ Done | Predict, Simulate |
| `/api/standings` | GET | ✅ Done | Dashboard |
| `/api/predict/event` | POST | ✅ Done | Predict Page |
| `/api/simulate/race` | POST | ✅ Done | Simulate Page |
| `/ws/simulate` | WS | ✅ Done | Simulate Page (Live) |
| `/api/compare/drivers` | POST | ⚠️ TODO | Driver vs Driver |
| `/api/season/simulate` | POST | ⚠️ TODO | Season Sim |
| `/api/scenario/whatif` | POST | ⚠️ TODO | What-If Lab |
| `/api/telemetry/lap` | GET | ⚠️ TODO | Analysis Page |
| `/api/strategy/optimal` | POST | ⚠️ TODO | Strategy Calculator |

---

## Testing & Verification

### Backend Test Commands

```bash
# 1. Run all tests
cd backend
pytest tests/ -v

# 2. Test ML model training
python scripts/train_pace_model_v2.py

# 3. Test simulation
python -c "from app.services.race_predictor_service import RacePredictorService; print(RacePredictorService().predict_event_2026('monaco'))"

# 4. Test WebSocket
python scripts/verify_websocket.py

# 5. Test FastF1 integration
python -c "from app.services.fastf1_service import FastF1Service; print(FastF1Service().get_weather_data(2024, 'Monaco'))"
```

---

## Priority Order

1. **Week 1**: FastF1 service + Enhanced PaceModel + Degradation
2. **Week 2**: Overtaking model + Weather evolution + Engine updates
3. **Week 3**: Secondary APIs (Compare, Season, What-If)
