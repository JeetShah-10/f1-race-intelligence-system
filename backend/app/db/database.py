# backend/app/db/database.py
"""
Database connection stubs.

This module provides placeholder database utilities. The simulation
engine works without a database — these stubs unblock the server
startup so the /api/simulate/generate endpoint (which does NOT use
the database) can be tested.

Replace with real SQLAlchemy setup when persistence is needed.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, declarative_base

# In-memory SQLite for development (no file needed)
DATABASE_URL = "sqlite:///./f1_sim.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """FastAPI dependency: yields a database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
