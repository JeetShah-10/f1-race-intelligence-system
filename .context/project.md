# F1 Race Intelligence System - Project Context

## Project Architecture
The F1 Race Intelligence System is a full-stack analytics platform comprising a React frontend, a Python FastAPI backend, and a database layer powered by Supabase Postgres.

---

## Workspace Directory Map

### 💻 1. Frontend (`frontend/`)
A React 19 web application built with TypeScript and Vite.
- **`src/components/`**: Modular UI components.
  - `dashboard/`: Custom widgets (recent work, stands, calendar).
  - `landing/`: Immersive landing page segments.
  - `layout/`: Shared shell layouts and sidebar navigations.
  - `loading/`: Cinematic spinners and state loading indicators.
  - `onboarding/`: Onboarding wizard and favoriting modal.
  - `predict/`: Prediction calendar grid and event configurations.
  - `season2026/`: Specs and 2026 regulation previews.
  - `simulation/`: Race playback views, grid formations, and weekend intros.
  - `timing/`: Real-time race timing towers.
  - `ui/`: Design-system primitive elements.
- **`src/pages/`**: Routable page views (Dashboard, Predict, Simulate, Analyze sub-pages, Standings, Calendar).
- **`src/store/`**: Zustand state management stores (app config, simulation state machine, dashboard stats).
- **`src/services/`**: Network communication layers:
  - `api.ts`: Fetch clients for REST API.
  - `auth.ts`: Supabase authentication wrapper.
  - `websocket.ts`: Real-time WebSocket connection client.
  - `transformers.ts`: Data structure mapping between backend schemas and frontend types.

### 🐍 2. Backend (`backend/`)
An async FastAPI backend for predictions and physics-based simulations.
- **`app/main.py`**: Uvicorn entry point.
- **`app/api/`**: API endpoint routers (WS routes, predict, simulate, standings, telemetry, compare).
- **`app/ml/`**: Machine Learning pipeline:
  - `pace_model.py`: LightGBM ensemble predicting race lap times.
  - `tyre_model.py`: Gradient-boosted compound degradation forecasting.
- **`app/simulation/`**: Physics-based race simulation engine:
  - `race_engine.py`: Core lap-by-lap simulation loop.
  - `strategy_ai.py`: Autonomous pit-stop decision engine.
  - `overtake_model.py`, `weather_model.py`, `crash_model.py`, `random_event_injector.py`.
- **`app/db/`**: Connection config and SQLAlchemy models.
- **`app/services/`**: Support services (database, prediction, config mapping).

### 🤖 3. Developer Swarm (`src/`)
A local multi-agent automation framework.
- **Not a website feature.**
- Used by AI assistants (like Antigravity) to run heavy background tasks, research, and coding operations.
- Comprises specialized agents: Router (`src/agents/router_agent.py`), Researcher, Coder, Reviewer.

### 📂 4. Shared Resources
- **`docs/`**: Technical specs, PRDs, and UX plans.
- **`ml_data/`**: Datasets for machine learning model training.
- **`3D-model-and-references/`**: Visual assets and reference files.

---

## Tech Stack Overview
- **Frontend:** React 19, Tailwind CSS 4, Framer Motion, GSAP, Zustand, D3.js, Recharts, React Router v7.
- **Backend:** FastAPI, Python 3.11+, LightGBM, scikit-learn, Pandas, NumPy, Uvicorn, WebSockets.
- **Database:** Supabase PostgreSQL + Auth (production), SQLite `f1_sim.db` (local development fallback).

---

## Database Architecture & Fallback
The backend connects to database storage using a hybrid approach:
- **Supabase (PostgreSQL):** Used in production for persistency (saves simulation runs, driver standings, circuits metadata).
- **SQLAlchemy (SQLite):** Local file-based fallback database. If Supabase is paused or environment credentials are missing, the backend disables cloud database writes and reads locally from `f1_sim.db` to keep the application fully functional.

---

## Missing Backend Endpoints Roadmap
To remove remaining frontend mock data, the following endpoints must be implemented in the FastAPI backend:
1. `POST /api/newsletter`: Save waitlist email subscriptions.
2. `GET /api/stats/2026`: Fetch regulation parameters (electric splits, aero profiles).
3. `GET /api/rivalries`: Fetch calculated head-to-head driver statistics.
4. `GET /api/momentum`: Calculate driver form indicators.
