# Frontend Developer Collaboration Guide

This guide helps the frontend developer integrate with the F1 Race Intelligence backend system.

## Quick Start

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at `http://localhost:8000`

---

## API Endpoints

### Core Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/simulate` | POST | Run race simulation |
| `/api/predict` | POST | Get race predictions |
| `/api/drivers` | GET | List all drivers |
| `/api/circuits` | GET | List all circuits |
| `/api/standings` | GET | Championship standings |
| `/api/strategy` | POST | Strategy recommendations |
| `/api/telemetry` | GET | Historical telemetry data |

### WebSocket (Real-Time)

| Endpoint | Description |
|----------|-------------|
| `/ws/simulate` | Real-time race simulation stream |

---

## API Response Examples

### POST /api/simulate

**Request:**
```json
{
  "circuit_id": "bahrain",
  "lap_count": 57,
  "weather": "dry",
  "year": 2026
}
```

**Response:**
```json
{
  "circuit": "bahrain",
  "results": [
    {
      "position": 1,
      "driver_id": "nor",
      "team": "mclaren",
      "gap_to_leader": 0.0,
      "status": "Finished"
    }
  ],
  "analysis": "## Post-Race Analysis..."
}
```

### WebSocket Message Types

1. **LAP_UPDATE** - Sent each lap
```json
{
  "type": "LAP_UPDATE",
  "data": {
    "lap": 15,
    "positions": ["VER", "NOR", "HAM"],
    "gaps": {"NOR": 1.234, "HAM": 3.567}
  }
}
```

2. **RACE_COMPLETE** - Final results
```json
{
  "type": "RACE_COMPLETE",
  "results": { ... }
}
```

---

## Git Workflow

### Branches
- `main` - **DO NOT PUSH TO** - Protected release branch
- `backend-core` - Backend development
- `frontend-core` - Frontend development

### Pulling Backend Changes

```bash
# From your frontend-core branch:
git fetch origin
git merge origin/backend-core

# Or rebase (cleaner history):
git rebase origin/backend-core
```

### Pushing Frontend Changes

```bash
git checkout frontend-core
git add .
git commit -m "feat(frontend): description of changes"
git push origin frontend-core
```

### After Both Are Ready

1. Both developers review each other's branches
2. Create PR from `frontend-core` → `main`
3. Create PR from `backend-core` → `main`
4. Merge after review

---

## 2026 Season Data

The backend includes a complete 2026 season configuration:

### Teams (Performance Order)
1. McLaren (Norris, Piastri)
2. Mercedes (Russell, Antonelli)
3. Red Bull (Verstappen, Hadjar)
4. Ferrari (Leclerc, Hamilton)
5. Williams (Albon, Sainz)
6. Aston Martin
7. RB (Lawson, Lindblad)
8. Haas
9. Audi (Palou)
10. Alpine
11. Cadillac (Bottas, Perez)

### Driver Codes
Use 3-letter codes: `VER`, `NOR`, `HAM`, `LEC`, etc.

---

## Frontend Integration Checklist

- [ ] Connect to backend API
- [ ] Implement WebSocket for live simulation
- [ ] Display driver cards with team colors
- [ ] Show race results with gaps
- [ ] Render post-race analysis markdown
- [ ] Handle DNF/crash events
- [ ] Implement strategy visualization

---

## Questions?

Coordinate via the shared repository issues or direct communication.
