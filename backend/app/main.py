import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(env_path)

from fastapi import FastAPI
from app.api.simulate import router as simulate_router
from app.api.sessions import router as sessions_router
from app.api.standings import router as standings_router
from app.api.drivers import router as drivers_router

from app.api.circuits import router as circuits_router
from app.api.calendar import router as calendar_router
from app.api.qualifying import router as qualifying_router
from app.api.websockets import router as ws_router
from app.api.telemetry import router as telemetry_router
from app.api.predict import router as predict_router
from app.api.strategy import router as strategy_router
from app.api.generate import router as generate_router
from app.api.compare import router as compare_router
from app.api.season import router as season_router
from app.api.scenario import router as scenario_router
from app.api.public import router as public_router

from app.db.database import engine, Base
# Auto-create local SQLite tables on startup if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title="F1 Intelligence System")

# CORS Configuration
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev, or specific URLs: ["http://localhost:5173"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZIP Compression (compress responses > 500 bytes)
app.add_middleware(GZipMiddleware, minimum_size=500)

# API Routers
app.include_router(simulate_router, prefix="/api/simulate", tags=["Simulation"])
app.include_router(ws_router, prefix="/ws", tags=["Real-Time"])
app.include_router(sessions_router, prefix="/api/sessions", tags=["Sessions"])
app.include_router(standings_router, prefix="/api/standings", tags=["Standings"])
app.include_router(drivers_router, prefix="/api/drivers", tags=["Drivers"])
app.include_router(circuits_router, prefix="/api/circuits", tags=["Circuits"])
app.include_router(telemetry_router, prefix="/api/telemetry", tags=["Telemetry"])
app.include_router(predict_router, prefix="/api/predict", tags=["Prediction"])
app.include_router(strategy_router, prefix="/api/strategy", tags=["Strategy"])
app.include_router(generate_router, prefix="/api/simulate", tags=["Simulation"])
app.include_router(compare_router, prefix="/api/compare", tags=["Compare"])
app.include_router(season_router, prefix="/api/season", tags=["Season"])
app.include_router(scenario_router, prefix="/api/scenario", tags=["Scenario"])
app.include_router(calendar_router, prefix="/api/calendar", tags=["Calendar"])
app.include_router(qualifying_router, prefix="/api/qualifying", tags=["Qualifying"])
app.include_router(public_router, prefix="/api", tags=["Public"])

@app.get("/health")
def health():
    """Health check endpoint."""
    return {"status": "ok"}