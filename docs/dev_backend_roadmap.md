# Dev's Backend/ML Roadmap — F1 Race Intelligence System

## Current State Analysis

### ✅ What Exists
| Component | Status | Location |
|-----------|--------|----------|
| FastAPI skeleton | ✅ Basic | `backend/app/main.py` |
| `/health` endpoint | ✅ Working | `main.py` |
| `/simulate/race` endpoint | ✅ Basic | `app/api/simulate.py` |
| `RaceRankPredictor` | ✅ Basic | `app/services/prediction_service.py` |
| `race_rank_model_v0.pkl` | ✅ Exists | `app/models/` |
| `requirements.txt` | ⚠️ Minimal | fastapi, uvicorn, sklearn, pandas |

### ❌ What's Missing (Critical)
| Component | Priority | Impact |
|-----------|----------|--------|
| FastF1 integration | 🔴 Critical | No real F1 data |
| Race simulation engine | 🔴 Critical | Core feature |
| Championship prediction | 🔴 Critical | Free tier feature |
| More API endpoints | 🔴 Critical | Frontend blocked |
| Ergast integration | 🟡 High | Standings data |
| Strategy optimizer | 🟡 High | Premium feature |
| Model improvements | 🟡 High | Accuracy |

---

## API Contract Gap Analysis

### Endpoints in Contract vs Implemented

| Endpoint | Contract | Implemented | Priority |
|----------|----------|-------------|----------|
| `GET /health` | ✅ | ✅ | - |
| `GET /api/sessions/{year}` | ✅ | ❌ | 🔴 Week 1 |
| `GET /api/sessions/{year}/{round}` | ✅ | ❌ | 🔴 Week 1 |
| `GET /api/drivers` | ✅ | ❌ | 🔴 Week 1 |
| `GET /api/circuits` | ✅ | ❌ | 🔴 Week 1 |
| `POST /api/predict/qualifying` | ✅ | ❌ | 🔴 Week 1 |
| `POST /api/predict/race` | ✅ | ❌ | 🔴 Week 1 |
| `POST /api/simulate` | ✅ | ⚠️ Partial | 🔴 Week 1 |
| `GET /api/telemetry/{session}/{driver}` | ✅ | ❌ | 🟡 Week 2 |
| `GET /api/standings/drivers` | ❌ | ❌ | 🔴 Week 1 |
| `GET /api/standings/constructors` | ❌ | ❌ | 🔴 Week 1 |
| `POST /api/compare/drivers` | ❌ | ❌ | 🟡 Week 2 |
| `POST /api/championship/simulate` | ❌ | ❌ | 🟡 Week 2 |

---

## Week-by-Week Roadmap

### 📅 WEEK 1: Core Infrastructure

#### Day 1-2: FastF1 Integration
```python
# Add to requirements.txt
fastf1>=3.6.0
python-dotenv
cachetools
```

**Tasks:**
- [ ] Install and configure FastF1
- [ ] Set up caching directory (`cache/fastf1/`)
- [ ] Create `services/fastf1_service.py` with:
  - `get_session(year, gp, session_type)`
  - `get_lap_data(session)`
  - `get_telemetry(session, driver)`
  - `get_results(session)`

**Endpoint to add:**
```python
@router.get("/api/sessions/{year}")
def get_sessions(year: int):
    schedule = fastf1.get_event_schedule(year)
    return {"sessions": schedule.to_dict("records")}
```

#### Day 3-4: Ergast Integration for Standings
```python
# services/ergast_service.py
from fastf1.ergast import Ergast

class StandingsService:
    def __init__(self):
        self.ergast = Ergast()
    
    def get_driver_standings(self, year: int):
        return self.ergast.get_driver_standings(year).content[0].to_dict("records")
    
    def get_constructor_standings(self, year: int):
        return self.ergast.get_constructor_standings(year).content[0].to_dict("records")
```

**Endpoints to add:**
- [ ] `GET /api/standings/drivers?year=2025`
- [ ] `GET /api/standings/constructors?year=2025`

#### Day 5-6: Race Prediction Model Enhancement

**Current model features:**
```python
["grid_position", "avg_lap_time", "std_lap_time", "num_laps", "finished"]
```

**Enhanced features to add:**
```python
[
    "grid_position",
    "avg_lap_time",
    "std_lap_time",
    "avg_sector1", "avg_sector2", "avg_sector3",
    "quali_position",
    "practice_avg_position",
    "team_performance_score",  # Based on constructor standings
    "circuit_type",  # street/permanent/hybrid
    "wet_weather_score",  # Historical wet performance
    "reliability_score",  # DNF probability
]
```

**Tasks:**
- [ ] Create feature engineering pipeline
- [ ] Retrain model with FastF1 data
- [ ] Save as `race_rank_model_v1.pkl`

#### Day 7: API Completion
**Endpoints to implement:**
- [ ] `GET /api/drivers` - Return 2025 grid
- [ ] `GET /api/circuits` - Return all circuits
- [ ] `POST /api/predict/race` - Use enhanced model

---

### 📅 WEEK 2: Simulation Engine

#### Day 1-3: Race Simulation Core

**Create:** `services/simulation_engine.py`

```python
class RaceSimulator:
    def __init__(self):
        self.lap_time_model = LapTimePredictor()
        self.strategy_advisor = StrategyOptimizer()
    
    def simulate_race(self, params: SimulationParams) -> SimulationResult:
        positions = self._initialize_from_grid(params.grid)
        lap_data = []
        
        for lap in range(1, params.total_laps + 1):
            # Calculate lap times for each driver
            lap_times = self._calculate_lap_times(lap, positions)
            
            # Apply tyre degradation
            self._apply_tyre_deg(positions, lap)
            
            # Check for pit stops
            pit_drivers = self._evaluate_pit_windows(positions, lap)
            
            # Update positions
            positions = self._update_positions(positions, lap_times)
            
            # Check for safety car (probability model)
            if self._safety_car_check(lap, params):
                self._apply_safety_car(positions)
            
            lap_data.append(self._snapshot_lap(lap, positions))
        
        return SimulationResult(results=positions, lap_data=lap_data)
```

#### Day 4-5: Lap Time Predictor (Premium Feature)

**Create:** `models/lap_time_predictor.py`

Uses:
- Sector telemetry from FastF1
- Tyre compound & age
- Fuel load (estimated)
- Track position (dirty air penalty)

```python
class LapTimePredictor:
    def predict_lap_time(self, driver_id, lap, compound, tyre_age, position):
        base_time = self.base_times[driver_id]
        tyre_penalty = self.tyre_deg_curve(compound, tyre_age)
        fuel_benefit = (total_laps - lap) * 0.03  # 30ms per lap of fuel
        dirty_air = self._dirty_air_penalty(position)
        
        return base_time + tyre_penalty - fuel_benefit + dirty_air
```

#### Day 6-7: Strategy Optimizer (Premium Feature)

**Create:** `models/strategy_optimizer.py`

```python
class StrategyOptimizer:
    def find_optimal_strategy(self, circuit, race_length, weather):
        strategies = self._generate_strategies(race_length)
        
        for strategy in strategies:
            strategy.score = self._evaluate_strategy(strategy, circuit)
        
        return sorted(strategies, key=lambda s: s.score)[:3]
    
    def _evaluate_strategy(self, strategy, circuit):
        total_time = 0
        pit_time = circuit.pit_loss * len(strategy.stops)
        
        for stint in strategy.stints:
            for lap in range(stint.laps):
                total_time += self.lap_time_predictor.predict(
                    compound=stint.compound,
                    tyre_age=lap
                )
        
        return total_time + pit_time
```

---

### 📅 WEEK 3: Advanced Features

#### Championship Simulator (Free Tier)

**Create:** `services/championship_simulator.py`

```python
class ChampionshipSimulator:
    def simulate_remaining_season(self, current_standings, remaining_races, n_simulations=10000):
        results = []
        
        for _ in range(n_simulations):
            standings = current_standings.copy()
            
            for race in remaining_races:
                race_result = self.race_predictor.predict_with_variance(race)
                standings = self._update_standings(standings, race_result)
            
            results.append(standings)
        
        return self._calculate_probabilities(results)
```

**Endpoint:**
```python
@router.post("/api/championship/simulate")
def simulate_championship(request: ChampionshipSimRequest):
    return champion_sim.simulate_remaining_season(
        current_standings=get_current_standings(),
        remaining_races=get_remaining_races(request.year),
        n_simulations=request.simulations
    )
```

#### Driver Comparison (Free Tier)

**Create:** `services/comparison_service.py`

```python
class DriverComparison:
    def compare(self, driver1, driver2, year_range=None):
        return {
            "head_to_head": self._get_h2h_stats(driver1, driver2, year_range),
            "qualifying_pace": self._get_quali_comparison(driver1, driver2),
            "race_pace": self._get_race_pace_comparison(driver1, driver2),
            "overtakes": self._get_overtake_stats(driver1, driver2),
            "wet_performance": self._get_wet_stats(driver1, driver2),
        }
```

---

### 📅 WEEK 4: Premium Features

#### Sandbox Mode
- Custom grid ordering
- Weather injection (rain on specific lap)
- Safety car injection
- Driver retirement simulation

#### Safety Car Probability Model

```python
class SafetyCarPredictor:
    def predict_probability(self, circuit, lap, weather, historical_data):
        base_prob = self.circuit_base_rates[circuit]
        weather_factor = 1.5 if weather == "wet" else 1.0
        lap_factor = 1.2 if lap < 5 else 1.0  # Higher in first laps
        
        return min(base_prob * weather_factor * lap_factor, 0.15)
```

#### Post-Race Analysis

Compare predictions vs actual results:
```python
class PostRaceAnalyzer:
    def analyze(self, predicted, actual):
        return {
            "position_accuracy": self._calc_position_accuracy(predicted, actual),
            "gap_accuracy": self._calc_gap_accuracy(predicted, actual),
            "strategy_accuracy": self._calc_strategy_accuracy(predicted, actual),
            "model_insights": self._generate_insights(predicted, actual),
        }
```

---

## Updated Requirements.txt

```
# Web Framework
fastapi>=0.109.0
uvicorn>=0.27.0
python-dotenv>=1.0.0

# F1 Data
fastf1>=3.6.0

# ML/Data Science
scikit-learn>=1.4.0
pandas>=2.2.0
numpy>=1.26.0
joblib>=1.3.0
xgboost>=2.0.0
lightgbm>=4.2.0

# API Utilities
pydantic>=2.6.0
httpx>=0.26.0
cachetools>=5.3.0

# Testing
pytest>=8.0.0
pytest-asyncio>=0.23.0
```

---

## File Structure to Create

```
backend/
├── app/
│   ├── api/
│   │   ├── __init__.py
│   │   ├── routes.py
│   │   ├── sessions.py      # NEW
│   │   ├── drivers.py       # NEW
│   │   ├── circuits.py      # NEW
│   │   ├── predict.py       # NEW
│   │   ├── simulate.py      # UPDATE
│   │   ├── standings.py     # NEW
│   │   ├── compare.py       # NEW
│   │   └── telemetry.py     # NEW
│   ├── models/
│   │   ├── race_rank_model_v1.pkl  # NEW (retrained)
│   │   ├── lap_time_model.pkl      # NEW
│   │   └── safety_car_model.pkl    # NEW
│   ├── services/
│   │   ├── fastf1_service.py       # NEW
│   │   ├── ergast_service.py       # NEW
│   │   ├── prediction_service.py   # UPDATE
│   │   ├── simulation_engine.py    # NEW
│   │   ├── strategy_optimizer.py   # NEW
│   │   ├── championship_sim.py     # NEW
│   │   ├── comparison_service.py   # NEW
│   │   └── post_race_analyzer.py   # NEW
│   ├── schemas/
│   │   ├── simulation.py           # UPDATE
│   │   ├── prediction.py           # NEW
│   │   ├── standings.py            # NEW
│   │   └── comparison.py           # NEW
│   └── main.py                     # UPDATE
├── notebooks/
│   ├── train_race_model_v1.ipynb   # NEW
│   ├── train_lap_time_model.ipynb  # NEW
│   └── feature_engineering.ipynb   # NEW
├── cache/
│   └── fastf1/                     # FastF1 cache
├── requirements.txt                # UPDATE
└── README.md
```

---

## Priority Task Checklist for Dev

### 🔴 CRITICAL (This Week)
- [ ] Install FastF1 and set up caching
- [ ] Create `fastf1_service.py` with data fetching
- [ ] Create `ergast_service.py` for standings
- [ ] Implement `GET /api/sessions/{year}`
- [ ] Implement `GET /api/standings/drivers`
- [ ] Implement `GET /api/standings/constructors`
- [ ] Implement `GET /api/drivers`
- [ ] Implement `GET /api/circuits`
- [ ] Update `POST /api/predict/race` with better model

### 🟡 HIGH (Next Week)
- [ ] Build `simulation_engine.py`
- [ ] Implement full `POST /api/simulate` endpoint
- [ ] Create lap-by-lap position tracking
- [ ] Add tyre degradation curves
- [ ] Implement `POST /api/compare/drivers`
- [ ] Implement `POST /api/championship/simulate`

### 🟢 MEDIUM (Week 3+)
- [ ] Lap time predictor model
- [ ] Strategy optimizer
- [ ] Safety car probability model
- [ ] Sandbox mode parameters
- [ ] Post-race analysis comparison

---

## Message for Dev

> **Hey Dev,**
> 
> I've analyzed the current backend state and created a detailed roadmap. Before you start coding, please update your orchestrator agent with this context:
> 
> 1. **Current state:** Only `/health` and basic `/simulate/race` work
> 2. **Missing:** FastF1 integration, Ergast standings, 10+ API endpoints
> 3. **Priority:** Week 1 focus on data fetching (FastF1 + Ergast)
> 4. **Free tier:** Race prediction, championship sim, driver comparison
> 5. **Premium tier:** Lap time predictor, strategy optimizer, sandbox mode
> 
> **Key files to create first:**
> - `services/fastf1_service.py`
> - `services/ergast_service.py`
> - `api/standings.py`
> 
> The frontend is waiting on these endpoints. Let me know your timeline!
> 
> — Jeet
