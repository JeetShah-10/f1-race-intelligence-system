<p align="center">
  <h1 align="center">🏎️ F1 Intelligence System</h1>
  <p align="center">
    <strong>Advanced Formula 1 Analytics, Strategy Simulation & Predictive Intelligence</strong>
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#api-reference">API</a> •
    <a href="#ml-pipeline">ML Pipeline</a> •
    <a href="#roadmap">Roadmap</a>
  </p>
</p>

---

## Overview

The **F1 Intelligence System** is a full-stack web platform that brings advanced data analytics, race strategy simulation, and predictive modeling to Formula 1. By combining historical race data with machine learning models, it delivers deep insights into race dynamics, driver performance, and strategic decision-making.

The goal is to go beyond simple statistics — offering predictive intelligence and interactive simulation capabilities that help users understand the *"why"* behind race results.

---

## Features

### 🏠 Landing Page
- Immersive hero section with cinematic F1 visuals
- Feature showcase, "How It Works" workflow, and 2026 Season Preview
- Premium animations powered by Framer Motion & GSAP

### 🔐 Authentication
- Email/password login & registration via Supabase Auth
- Session management with JWT auto-refresh
- Row Level Security (RLS) on all database tables

### 📊 Interactive Dashboard
- Customizable drag-and-drop widget grid (React Grid Layout)
- Race Calendar, Driver Standings, Constructor Standings widgets
- Responsive sidebar navigation across all modules

### 🏁 Race Simulation Engine
- Full lap-by-lap race simulation with physics-based models
- **Tyre degradation model** — compound-specific wear curves
- **Overtake model** — calculates probability based on car delta & circuit data
- **Crash model** — simulates incidents with probability distributions
- **Weather model** — dynamic weather changes affecting grip & strategy
- **Strategy AI** — autonomous pit-stop decision engine
- Random event injection (safety cars, red flags, mechanical failures)
- Real-time WebSocket streaming of simulation frames

### 📈 Analysis & Telemetry
- Lap time analysis with interactive D3.js visualizations
- Speed, throttle, and brake telemetry overlays
- Driver head-to-head comparison tools
- Qualifying result analysis

### 🤖 Predictive Intelligence
- Race outcome prediction (pre-race win probability)
- Tyre degradation forecasting via LightGBM models
- Pace prediction with feature-engineered ML pipeline
- "What-if" scenario analysis

### 🧠 AI Agent Swarm *(Experimental)*
- Multi-agent system with specialized roles (Researcher, Coder, Reviewer, Router)
- MCP (Model Context Protocol) client for external tool integration
- Persistent agent memory system

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 19** (Vite) | High-performance UI framework |
| **TypeScript** | Type-safe, maintainable code |
| **Tailwind CSS 4** | Utility-first responsive design |
| **Framer Motion & GSAP** | Cinematic animations & transitions |
| **Zustand** | Lightweight global state management |
| **D3.js** | Custom track maps & telemetry overlays |
| **Recharts** | Standard charts & data visualizations |
| **React Router v7** | Client-side routing |
| **Aceternity UI** | Premium modern UI components |
| **Lucide React** | Consistent iconography |
| **React Grid Layout** | Drag-and-drop dashboard widgets |

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** (Python) | High-performance async API server |
| **FastF1** | Official F1 data ingestion library |
| **Scikit-learn** | Classical ML models |
| **LightGBM** | Gradient-boosted race predictions |
| **Pandas / NumPy** | Data manipulation & analysis |
| **WebSockets** | Real-time simulation streaming |
| **Uvicorn** | ASGI server |

### Database & Auth
| Technology | Purpose |
|---|---|
| **Supabase (PostgreSQL)** | Relational database with RLS |
| **Supabase Auth** | User management & JWT sessions |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.10
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/JeetShah-10/f1-race-intelligence-system.git
cd f1-race-intelligence-system
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Contact the project owner (Jeet Shah) for the Supabase Anon Key.**

Start the dev server:

```bash
npm run dev
# → http://localhost:5173
```

### 3. Backend Setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
```

Create `backend/.env`:

```env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
```

Start the API server:

```bash
uvicorn app.main:app --reload --port 8000
```

---

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                       Frontend                           │
│  React 19 · TypeScript · Tailwind CSS 4 · D3 · Recharts │
│    Dashboard │ Simulate │ Analyze │ Predict │ Insights   │
└───────────────────────┬─────────────────┬────────────────┘
                   REST API          WebSocket
                        │                 │
┌───────────────────────▼─────────────────▼────────────────┐
│                       Backend                            │
│              FastAPI · Python 3.10+                       │
│                                                          │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  API Layer │  │  Simulation  │  │   ML Pipeline    │  │
│  │ 15+ routes │  │  Race Engine │  │ Pace Model       │  │
│  │            │  │  Strategy AI │  │ Tyre Model       │  │
│  │            │  │  Overtake    │  │ Feature Eng.     │  │
│  │            │  │  Weather     │  │ LightGBM/Sklearn │  │
│  └────────────┘  └──────────────┘  └──────────────────┘  │
└───────────────────────┬──────────────────────────────────┘
                        │
              ┌─────────▼─────────┐
              │     Supabase      │
              │  PostgreSQL + RLS │
              │  Auth (JWT)       │
              └───────────────────┘
```

---

## API Reference

The backend exposes a RESTful API at `http://localhost:8000`:

| Endpoint | Method | Description |
|---|---|---|
| `/health` | GET | Health check |
| `/api/simulate` | POST | Run race simulation |
| `/api/predict` | POST | Get race predictions |
| `/api/strategy` | GET/POST | Strategy analysis |
| `/api/telemetry` | GET | Telemetry data for sessions |
| `/api/drivers` | GET | List all drivers |
| `/api/circuits` | GET | List all circuits |
| `/api/standings` | GET | Driver/constructor standings |
| `/api/calendar` | GET | Race calendar |
| `/api/qualifying` | GET | Qualifying results |
| `/api/sessions` | GET | Available race sessions |
| `/api/compare` | GET | Driver comparison data |
| `/api/season` | GET | Season statistics |
| `/api/scenario` | POST | What-if scenario analysis |
| `/ws/` | WS | Real-time simulation WebSocket |

Interactive API docs: [`http://localhost:8000/docs`](http://localhost:8000/docs) (Swagger UI)

---

## ML Pipeline

### Models

| Model | Algorithm | Purpose |
|---|---|---|
| **Pace Model** | LightGBM + Ensemble | Predicts lap times based on driver, car, track, and conditions |
| **Tyre Model** | Gradient Boosted Trees | Forecasts tyre degradation curves per compound |
| **Feature Engineering** | Custom pipeline | Extracts 50+ features from raw FastF1 telemetry |

### Simulation Physics

The race engine (`backend/app/simulation/`) includes:

- **`race_engine.py`** — Core lap-by-lap simulation loop
- **`strategy_ai.py`** — Autonomous pit-stop decision engine
- **`tyre_degradation_model.py`** — Physics-based wear model (soft / medium / hard / inter / wet)
- **`overtake_model.py`** — Overtake probability calculator
- **`crash_model.py`** — Incident probability simulation
- **`weather_model.py`** — Dynamic weather state machine
- **`random_event_injector.py`** — Safety car, red flag, mechanical failure events

### Training

```bash
cd backend
python train.py
```

---

## Project Structure

```
f1-race-intelligence-system/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Route pages (Dashboard, Simulate, Predict, etc.)
│   │   ├── store/              # Zustand state management
│   │   ├── services/           # API client & auth services
│   │   ├── hooks/              # Custom React hooks
│   │   ├── data/               # Static/mock data
│   │   ├── types/              # TypeScript type definitions
│   │   ├── utils/              # Helper utilities
│   │   └── router.tsx          # Application routing
│   ├── public/                 # Static assets (images, fonts)
│   └── package.json
│
├── backend/                    # Python backend server
│   ├── app/
│   │   ├── api/                # FastAPI route handlers (15+ endpoints)
│   │   ├── ml/                 # Machine learning models
│   │   │   ├── pace_model.py   # Race pace prediction
│   │   │   ├── tyre_model.py   # Tyre degradation forecasting
│   │   │   └── features.py     # Feature engineering pipeline
│   │   ├── simulation/         # Race simulation engine
│   │   │   ├── race_engine.py  # Core simulation loop
│   │   │   ├── strategy_ai.py  # Pit-stop decision AI
│   │   │   ├── overtake_model.py
│   │   │   ├── weather_model.py
│   │   │   └── ...
│   │   ├── models/             # Pydantic data models
│   │   ├── services/           # Business logic services
│   │   ├── db/                 # Database configuration
│   │   └── main.py             # FastAPI app entry point
│   ├── scripts/                # Data seeding & utility scripts
│   ├── tests/                  # Backend test suite
│   └── requirements.txt
│
├── src/                        # AI Agent Swarm (experimental)
│   ├── agents/                 # Specialized AI agents
│   ├── tools/                  # Agent tool definitions
│   ├── swarm.py                # Multi-agent orchestrator
│   └── mcp_client.py           # MCP protocol client
│
├── docs/                       # Project documentation
│   ├── PROJECT_DOCUMENTATION.md
│   ├── DEVELOPER_SETUP.md
│   ├── backend_developer_guide.md
│   ├── simulation_architecture_guide.md
│   └── ...
│
├── ml_data/                    # Training data directory
├── 3D-model-and-references/    # Design references & 3D assets
└── requirements.txt            # Root Python dependencies
```

---

## Database Security

All Supabase tables enforce **Row Level Security (RLS)**:

| Table | Read | Write |
|---|---|---|
| `drivers`, `circuits`, `teams` | ✅ Public | ❌ Backend only |
| `simulation_results` | ✅ Public | ✅ Authenticated users |

---

## Roadmap

- [ ] **Real-Time Telemetry** — WebSocket integration with live timing data during race weekends
- [ ] **Live Pit Wall Mode** — Real-time strategy tracking during live sessions
- [ ] **3D Car Viewer** — Three.js car configurator exploring technical updates
- [ ] **3D Track Walk** — Immersive 3D visualization of circuit elevation profiles
- [ ] **Prediction Leagues** — User-created prediction competitions
- [ ] **Google / GitHub OAuth** — Social authentication providers
- [ ] **Admin Panel** — Dataset management, model retraining, user administration
- [ ] **Sim Racing Integration** — Compare user lap times from sim racing platforms

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is privately maintained. Contact the project owner for licensing inquiries.

---

<p align="center">
  Built with ❤️ for the Formula 1 community<br/>
  <strong>F1 Intelligence Team</strong>
</p>
