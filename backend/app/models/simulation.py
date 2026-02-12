# backend/app/models/simulation.py
"""
ORM model stub for simulation results.

Provides a minimal SQLAlchemy model so that simulate.py can import
SimulationResult without breaking. The /api/simulate/generate endpoint
does NOT use this model — it returns JSON directly.
"""

from sqlalchemy import Column, Integer, String, Text
from app.db.database import Base


class SimulationResult(Base):
    """Persisted simulation result (stub)."""
    __tablename__ = "simulation_results"

    id = Column(Integer, primary_key=True, index=True)
    circuit = Column(String, nullable=False)
    weather = Column(String, default="DRY")
    laps = Column(Integer, default=0)
    results = Column(Text, default="[]")  # JSON string
