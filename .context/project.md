# F1 Race Intelligence System - Project Context

## Project Structure

```
F1-Intelligence-Model/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── 3d/             # Three.js 3D scene components
│   │   │   ├── cinematic/      # Cinematic hero sections
│   │   │   ├── dashboard/      # Dashboard widgets & charts
│   │   │   ├── hud/            # Racing HUD overlays
│   │   │   ├── landing/        # Landing page sections
│   │   │   ├── simulation/     # Race simulation components
│   │   │   └── ui/             # Shared UI components
│   │   ├── pages/              # Route pages
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── PredictPage.tsx
│   │   │   ├── SimulatePage.tsx
│   │   │   └── analyze/        # Analysis sub-pages
│   │   ├── store/              # Zustand state stores
│   │   └── hooks/              # Custom React hooks
│   └── public/assets/          # Static assets
│       ├── cars/               # F1 car images
│       ├── circuits/           # Track maps & images
│       ├── drivers/            # Driver portraits
│       ├── logos/              # Team logos
│       ├── videos/             # Background videos
│       └── fonts/              # Custom typography
│
├── backend/                     # FastAPI backend
│   └── app/
│       ├── main.py             # FastAPI app entry
│       ├── routers/            # API route handlers
│       ├── models/             # Pydantic models
│       └── services/           # Business logic
│
├── F1_Intelligence_Model/       # ML model code
│   ├── data/                   # Training data
│   ├── models/                 # Trained model weights
│   └── training/               # Training scripts
│
└── docs/                        # Documentation
    ├── product/                # PRDs, specs
    ├── ux/                     # Design docs
    └── tech/                   # Technical architecture
```

## Frontend Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **Three.js / R3F** | 3D graphics |
| **Zustand** | State management |
| **TanStack Query** | Server state |
| **TanStack Router** | Routing |

## Backend Tech Stack

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Web framework |
| **Python 3.11+** | Language |
| **Pydantic** | Data validation |
| **Uvicorn** | ASGI server |
| **SQLAlchemy** | ORM (if needed) |

## ML Stack

| Technology | Purpose |
|------------|---------|
| **scikit-learn** | Classical ML |
| **XGBoost** | Gradient boosting |
| **pandas** | Data processing |
| **numpy** | Numerical ops |
| **FastF1** | F1 telemetry data |

## Key API Endpoints

```
GET  /api/predictions/race/{race_id}     # Race predictions
GET  /api/predictions/qualifying/{race_id} # Quali predictions
GET  /api/drivers                        # Driver data
GET  /api/teams                          # Team data
GET  /api/circuits                       # Circuit info
POST /api/simulate                       # Run simulation
GET  /api/telemetry/{session_id}        # Telemetry data
```

## Performance Targets

| Metric | Target |
|--------|--------|
| FPS | 60fps constant |
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Bundle | < 500KB initial |
| Images | WebP, lazy loaded |
| Videos | WebM, poster image |

## Current Assets

### Available in `/public/assets/`
- Team logos (all 10 teams)
- Driver portraits (placeholders)
- Circuit maps (SVG)
- F1 fonts (Formula1 family)

### Needed
- 4K hero images (racing action shots)
- Background videos (60fps, WebM)
- Car renders (high quality)
- Circuit photography (aerial views)
