# Antigravity Prompt: F1 Backend Implementation

> **Copy this entire prompt and paste it into a new Antigravity chat session in VS Code.**  
> **Make sure your workspace is open to**: `c:\Users\shahj\Dev\Personal\F1-Intelligence-Model`

---

```
You are implementing the backend for the F1 Race Intelligence System. Read `docs/backend_developer_guide.md` first — it contains everything: live Supabase audit, merge conflicts, API specs, ML pipeline, and a 6-phase task plan. Execute the phases in order.

## CRITICAL CONTEXT

- **Supabase Project ID**: `jmllcxhzdusnhjxysilf`
- **API URL**: `https://jmllcxhzdusnhjxysilf.supabase.co`
- **Region**: ap-south-1
- **Active branch**: `frontend-core` — the backend code is in `backend/` already
- **Remote branch**: `backend-core` (has 5 commits, but merge conflicts exist locally)

## YOUR TASK — Execute ALL 7 Phases

### Phase 0: Fix Blockers
1. Read `backend/app/api/simulate.py` — it has merge conflicts starting at line 1. Resolve: keep the HEAD version (async + BackgroundTasks).
2. Read `backend/app/services/prediction_service.py` — merge conflict at line 57 in `get_simulation_handoff()`. Resolve: merge both versions, keep all parameters (lap_number=1, track_temp, air_temp, session_type).
3. Add missing packages to `backend/requirements.txt`: fastf1, supabase, python-dotenv, pydantic, httpx, websockets
4. Create `backend/.env` with the Supabase credentials (use Supabase MCP `get_publishable_keys` for the anon key, the service key needs to be retrieved from Supabase dashboard).
5. Read `backend/app/config/2026_season.json` — verify all 22 drivers are present (already updated). Confirmed lineup: NOR, PIA (McLaren), VER, HAD (Red Bull), LEC, HAM (Ferrari), RUS, ANT (Mercedes), ALB, SAI (Williams), LAW, LIN (Racing Bulls), ALO, STR (Aston Martin), OCO, BEA (Haas), HUL, BOR (Audi), GAS, COL (Alpine), BOT, PER (Cadillac).
6. Clean stale/duplicate drivers in Supabase using Supabase MCP:
   - `DELETE FROM drivers WHERE driver_id IN ('alexander_albon', 'kimi_antonelli', 'yuki_tsunoda', 'jack_doohan')`
   - Replace `yuki_tsunoda` → `arvid_lindblad` and `jack_doohan` → `franco_colapinto` in `standings` table
   - Move `isack_hadjar` from team RB to Red Bull Racing, `liam_lawson` from Red Bull to Racing Bulls
7. Verify the FastAPI app starts: `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`

### Phase 1: Seed Reference Data
Use the Supabase MCP `apply_migration` tool to:
1. Insert 24 circuits into the `circuits` table (the SQL is in the backend guide — 24 circuits for 2026, includes Madrid, excludes Imola)
2. Insert 11 teams into the `teams` table
3. Insert seasons 2022-2026 into the `seasons` table
4. Create the `fastf1_training_data` table (schema is in the guide)
5. Verify data with `execute_sql` queries

### Phase 2: FastF1 ETL Pipeline
1. Create `backend/scripts/ingest_fastf1.py` following the template in the guide
2. Enable FastF1 caching at `backend/cache/`
3. Ingest 2022-2025 race data: laps, results, race records
4. Target: ~72,000 lap rows in `fastf1_training_data`, ~2,000 rows in `race_results`, ~100 races
5. Run the script and verify with SQL count queries

### Phase 3: ML Training
1. Create `backend/scripts/train_models.py`
2. Load training data from Supabase `fastf1_training_data`
3. Train PaceModel (LightGBM regressor) — features: Compound, TyreLife, Driver, Team, SpeedST, SpeedFL, LapNumber
4. Train degradation models (linear regression per driver+compound pair)
5. Save models to `backend/app/models/` (.pkl files)
6. Validate: predict for "VER SOFT at Monza" → should get ~81-84s; "VER HARD at Monaco" → ~73-78s
7. Implement archetype resolution: when predicting for a 2026 rookie (like HAD), use their archetype's (perez) historical data + apply performance modifiers from 2026_season.json

### Phase 4: Engine Integration
1. Wire `PredictionService.get_simulation_handoff()` to call trained PaceModel
2. Create `DatabaseService` class using supabase-py to save simulation results
3. Fix the `tyre_life` placeholder in simulate.py
4. Test full pipeline: POST /api/simulate/ with 22 drivers, verify response matches `SimulationResult` schema
5. Verify results save to `simulation_results`, `driver_results`, and `lap_data` tables
6. Test determinism: same request + same seed = identical results

### Phase 5: Build Remaining APIs
Build these endpoints to match the frontend TypeScript interfaces exactly:

1. `POST /api/qualifying/` → Return `QualifyingResult[]` (22 drivers with Q1/Q2/Q3 times, elimination rounds). Use ML models with archetype system. The frontend expects:
   ```
   { position, driverId, driverName, team, teamColor, q1Time, q2Time, q3Time, eliminated, gap }
   ```

2. `GET /api/standings/drivers` → Read from `standings` table, return array sorted by points
3. `GET /api/standings/constructors` → Aggregate driver standings by team
4. `GET /api/calendar/2026` → Return race calendar with circuit details
5. `GET /api/circuits/{circuit_id}` → Return circuit info including lap count
6. `GET /api/insights/{circuit_id}` → Return strategy insights for a circuit

When building these, read the frontend files first to understand the exact data shapes:
- `frontend/src/store/useSimulationStore.ts` (for simulation/qualifying flow)
- `frontend/src/store/useDashboardStore.ts` (for dashboard data shapes)
- `frontend/src/types/simulation.ts` (for TypeScript interfaces)
- `frontend/src/data/simulationMockData.ts` (for mock data structure)

### Phase 6: Testing + Security
1. Write pytest tests for:
   - RaceEngine determinism (same seed = same result)
   - PaceModel prediction range (60-150s)
   - All API endpoints (200 responses, valid schemas)
   - Supabase persistence (results saved correctly)
2. Fix 3 Supabase security warnings:
   - Tighten INSERT policies on simulation_results, driver_results, lap_data (use service_role instead)
   - Move vector extension out of public schema
   - Enable leaked password protection
3. Run Supabase advisor via MCP to confirm zero warnings

## IMPORTANT RULES

1. **Always use Supabase MCP** for database operations — don't write raw supabase-py code until you need to for the app itself.
2. **Always use Context7 MCP** before writing any FastAPI, FastF1, or LightGBM code — check latest API docs first.
3. **Test at every phase boundary** — run the FastAPI server and verify endpoints before moving on.
4. **Match frontend exactly** — read the TypeScript interfaces in `frontend/src/types/` before building response schemas.
5. **Use the service_role key** (not anon key) for backend database writes.
6. **Cache FastF1 data aggressively** — downloads are slow (~2min/session). Set `FASTF1_CACHE_DIR=./cache`.
7. **Commit after each phase** with message: `backend: complete phase N - [description]`

## ENVIRONMENT VARIABLES NEEDED
```
SUPABASE_URL=https://jmllcxhzdusnhjxysilf.supabase.co
SUPABASE_SERVICE_KEY=<get from Supabase dashboard → Settings → API → service_role key>
SUPABASE_ANON_KEY=<use Supabase MCP get_publishable_keys>
FASTF1_CACHE_DIR=./cache
MODEL_DIR=./app/models
```
```

---

> **How to use this prompt:**
> 1. Open a **new** Antigravity chat in VS Code
> 2. Make sure workspace is `F1-Intelligence-Model`
> 3. Paste the entire content between the ``` markers above
> 4. Let Antigravity work through all 7 phases
> 5. Review the implementation plan it creates before approving execution
