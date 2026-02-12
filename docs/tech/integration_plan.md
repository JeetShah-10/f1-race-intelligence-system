<<<<<<< HEAD
# integration_plan.md
=======
# Integration Plan — F1 Race Intelligence System

## Overview
Defines how frontend, backend, ML runtime, and simulation engine communicate.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React)                         │
│   Dashboard │ Predict │ Simulate │ Analyze                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST + WebSocket
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│                     BACKEND (FastAPI)                            │
│   Routes → Services → Adapters                                   │
└─────────┬──────────────────────────────────────┬────────────────┘
          │                                      │
          ▼                                      ▼
┌─────────────────────┐             ┌───────────────────────────┐
│    ML Runtime       │             │   Simulation Runtime      │
│  (Python + FastF1)  │             │   (Python Race Engine)    │
└─────────────────────┘             └───────────────────────────┘
          │                                      │
          └──────────────────┬───────────────────┘
                             ▼
                ┌────────────────────────┐
                │   Data Artifacts       │
                │  (.parquet / .json)    │
                └────────────────────────┘
```

---

## Integration Phases

### Phase 1: Static Data (Week 1-2)

| Component | Integration | Format |
|-----------|-------------|--------|
| Frontend → Backend | REST GET | JSON |
| Backend → FastF1 | Python import | DataFrame |
| FastF1 → Backend | DataFrame processing | JSON response |

**Endpoints:** `/drivers`, `/circuits`, `/sessions`

### Phase 2: ML Predictions (Week 3-4)

| Component | Integration | Format |
|-----------|-------------|--------|
| Frontend → Backend | REST POST | JSON Body |
| Backend → ML Runtime | Subprocess call | Parquet |
| ML Runtime → Backend | Model output | JSON |

**Endpoints:** `/predict/qualifying`, `/predict/race`

### Phase 3: Simulation (Week 5-6)

| Component | Integration | Format |
|-----------|-------------|--------|
| Frontend → Backend | REST POST | JSON Body |
| Backend → Sim Runtime | Async subprocess | Parquet |
| Sim Runtime → Backend | Lap-by-lap data | JSON stream |

**Endpoints:** `/simulate`

---

## Data Flow: Prediction Request

```
1. User selects circuit + weather in Frontend
2. Frontend sends POST /api/predict/race
3. Backend validates request (Pydantic)
4. Backend calls ML Runtime with parameters
5. ML Runtime loads FastF1 historical data
6. ML Runtime runs prediction model
7. ML Runtime returns ranked classification
8. Backend formats response
9. Frontend displays results in HUD
```

---

## Data Flow: Simulation Request

```
1. User configures simulation parameters
2. Frontend sends POST /api/simulate
3. Backend validates and queues simulation
4. Simulation Engine initializes with grid
5. For each lap:
   a. Engine calculates positions
   b. Engine applies tyre degradation
   c. Engine checks pit windows
   d. Engine updates gaps
6. Engine completes race
7. Backend returns full lap data
8. Frontend renders lap-by-lap replay
```

---

## File-Based Handoffs

| Artifact | Format | Producer | Consumer |
|----------|--------|----------|----------|
| Session data | `.parquet` | FastF1 loader | ML Runtime |
| Feature matrix | `.parquet` | Feature engine | ML model |
| Model output | `.json` | ML Runtime | Backend |
| Sim results | `.json` | Sim Engine | Backend |

**Storage path:** `backend/artifacts/{type}/{timestamp}/`

---

## WebSocket Integration (Phase 2)

For real-time simulation updates:

```javascript
// Frontend connection
const ws = new WebSocket('ws://localhost:8000/ws/simulate/{sim_id}');

ws.onmessage = (event) => {
  const lapUpdate = JSON.parse(event.data);
  // { lap: 15, positions: [...], gaps: [...] }
  updateTimingTower(lapUpdate);
};
```

---

## Error Handling

| Layer | Strategy |
|-------|----------|
| Frontend | Toast notifications + retry logic |
| Backend | Structured error responses |
| ML Runtime | Fallback to cached predictions |
| Sim Engine | Graceful degradation |

---

## Environment Configuration

```env
# Backend .env
FASTF1_CACHE_DIR=./cache/fastf1
ML_MODEL_PATH=./models/pace_model.pkl
ARTIFACT_DIR=./artifacts
LOG_LEVEL=INFO
```
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
