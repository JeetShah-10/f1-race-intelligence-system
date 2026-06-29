# backend/app/db/models.py
"""
SQLAlchemy ORM models for the F1 Intelligence System.

Defines the database schema for:
  - Users (auth, tiers)
  - Scenarios (saved configurations)
  - Simulations (results, status)
"""

from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class User(Base):
    """User account model."""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    tier = Column(String, default="free")  # free, pro, enterprise
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    scenarios = relationship("Scenario", back_populates="owner")


class Scenario(Base):
    """Saved simulation scenario configuration."""
    __tablename__ = "scenarios"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    
    # Simulation config
    circuit = Column(String, nullable=False)
    year = Column(Integer, default=2026)
    weather_config = Column(Text, default="{}")  # JSON: initial conditions
    grid_config = Column(Text, default="[]")     # JSON: driver positions/tyres
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relations
    owner = relationship("User", back_populates="scenarios")
    simulations = relationship("Simulation", back_populates="scenario")


class Simulation(Base):
    """Execution result of a scenario."""
    __tablename__ = "simulations"

    id = Column(Integer, primary_key=True, index=True)
    scenario_id = Column(Integer, ForeignKey("scenarios.id"), nullable=True)
    
    # Standalone support
    circuit = Column(String, nullable=True)
    weather_summary = Column(String, default="Dry")

    status = Column(String, default="pending")  # pending, running, completed, failed
    total_laps = Column(Integer, default=0)
    winner_driver = Column(String, nullable=True)
    
    # Results storage
    result_summary = Column(Text, nullable=True)  # JSON: minimal results
    full_telemetry_url = Column(String, nullable=True)  # Path to blob storage (optional)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relations
    scenario = relationship("Scenario", back_populates="simulations")


class NewsletterSubscriber(Base):
    """Waitlist and newsletter subscribers."""
    __tablename__ = "newsletter_subscribers"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

