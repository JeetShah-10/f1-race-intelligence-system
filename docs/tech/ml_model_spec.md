<<<<<<< HEAD
# ml_model_spec.md
=======
# ML Model Specification — F1 Race Intelligence System

## Overview
Defines the machine learning models used for predictions and simulation inputs.

---

## Data Source: FastF1

All ML models are trained on FastF1 data (2018-2024 seasons).

| Data Type | FastF1 Method | Use Case |
|-----------|---------------|----------|
| Lap times | `session.laps` | Pace modeling |
| Sector times | `laps['Sector1Time']` | Track segment analysis |
| Tyre data | `laps['Compound', 'TyreLife']` | Degradation curves |
| Weather | `session.weather_data` | Condition adjustments |
| Telemetry | `laps.get_telemetry()` | Speed/throttle patterns |

---

## Model 1: Qualifying Position Predictor

### Architecture
- **Type:** Gradient Boosting (XGBoost)
- **Output:** Predicted grid position (1-20)

### Features

| Feature | Type | Source |
|---------|------|--------|
| `driver_quali_avg` | float | Historical quali positions |
| `team_quali_power` | float | Constructor pace ranking |
| `circuit_category` | categorical | Street/Power/Aero track |
| `weather_condition` | categorical | Dry/Wet |
| `track_temp` | float | FastF1 weather |
| `practice_pace_delta` | float | FP3 lap times |

### Training Pipeline

```python
import fastf1
import pandas as pd
from xgboost import XGBClassifier

# Load historical qualifying sessions
sessions = []
for year in range(2018, 2025):
    for round in range(1, 24):
        try:
            session = fastf1.get_session(year, round, 'Q')
            session.load()
            sessions.append(process_session(session))
        except:
            continue

# Feature engineering
features = create_quali_features(sessions)

# Train model
model = XGBClassifier(n_estimators=100, max_depth=6)
model.fit(features.X, features.y)
```

### Performance Target
- **Accuracy (Top 3):** > 60%
- **RMSE (Position):** < 3.5

---

## Model 2: Race Pace Predictor

### Architecture
- **Type:** LightGBM Regressor
- **Output:** Predicted lap time (seconds)

### Features

| Feature | Type | Description |
|---------|------|-------------|
| `tyre_compound` | categorical | SOFT/MEDIUM/HARD |
| `tyre_life` | int | Laps on current tyre |
| `fuel_load` | float | Estimated fuel remaining |
| `track_position` | int | Current race position |
| `gap_to_front` | float | Time to car ahead |
| `driver_avg_pace` | float | Historical pace coefficient |

### Degradation Curve

```python
def predict_tyre_deg(compound, tyre_life, driver_style):
    base_deg = {
        'SOFT': 0.05,
        'MEDIUM': 0.03,
        'HARD': 0.02
    }
    return base_deg[compound] * tyre_life * driver_style
```

---

## Model 3: Race Outcome Classifier

### Architecture
- **Type:** Ensemble (XGBoost + RandomForest)
- **Output:** Probability distribution over positions

### Features

| Feature | Description |
|---------|-------------|
| `grid_position` | Starting position |
| `quali_pace_delta` | Gap to pole in qualifying |
| `constructor_power_rank` | Team performance metric |
| `circuit_overtake_difficulty` | Track characteristic |
| `historical_finishing_position` | Driver's track record |

---

## Feature Engineering

### Driver Metrics (Pre-computed)

```python
def compute_driver_metrics(driver_code, year):
    return {
        'quali_avg': mean_quali_position(driver_code, year),
        'race_avg': mean_race_position(driver_code, year),
        'consistency': std_race_position(driver_code, year),
        'wet_skill': wet_performance_coefficient(driver_code)
    }
```

### Constructor Metrics

```python
def compute_constructor_metrics(team, year):
    return {
        'power_unit_rank': power_unit_performance(team, year),
        'aero_efficiency': corner_speed_coefficient(team, year),
        'reliability': dnf_rate(team, year)
    }
```

---

## Model Storage

| Model | File | Size |
|-------|------|------|
| Quali Predictor | `models/quali_predictor.pkl` | ~5MB |
| Pace Model | `models/pace_model.pkl` | ~3MB |
| Race Classifier | `models/race_classifier.pkl` | ~8MB |

---

## Inference Pipeline

```python
from backend.services.prediction_service import PredictionService

service = PredictionService()

# Run qualifying prediction
quali_results = service.predict_qualifying(
    circuit='monaco',
    year=2024,
    weather='dry'
)

# Run race prediction
race_results = service.predict_race(
    circuit='monaco',
    grid=quali_results,
    weather='dry',
    strategy='mandatory'
)
```

---

## Confidence Estimation

Each prediction includes confidence score based on:
- Model uncertainty (ensemble variance)
- Data recency (recent seasons weighted higher)
- Feature completeness (missing data penalty)

```python
confidence = 1.0 - model_uncertainty * recency_weight * completeness_score
```

---

## MVP Performance Targets

| Metric | Target | Validation |
|--------|--------|------------|
| Pole prediction accuracy | > 20% | Last 3 seasons |
| Top 3 quali accuracy | > 50% | Last 3 seasons |
| Race winner accuracy | > 25% | Last 3 seasons |
| Podium accuracy | > 40% | Last 3 seasons |
| Inference time | < 500ms | Per prediction |
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
