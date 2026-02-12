# backend/scripts/apply_schema_v2.py
"""
Initialize the database schema for Phase 11.

Creates tables for:
  - users
  - scenarios
  - simulations

Usage:
    python scripts/apply_schema_v2.py
"""

import sys
from pathlib import Path

# Add backend to path so we can import app modules
ROOT = Path(__file__).resolve().parent.parent
sys.path.append(str(ROOT))

from app.db.database import engine, Base
from app.db.models import User, Scenario, Simulation

def main():
    print(f"Applying schema to {engine.url}...")
    
    # 1. Drop existing (optional, for clean slate)
    # print("Dropping all tables...")
    # Base.metadata.drop_all(bind=engine)

    # 2. Create tables
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    print("Schema initialized successfully!")
    print("Tables created:")
    for table in Base.metadata.tables:
        print(f"  - {table}")

if __name__ == "__main__":
    main()
