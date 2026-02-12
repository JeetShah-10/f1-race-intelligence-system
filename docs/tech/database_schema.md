<<<<<<< HEAD
# database_schema.md
=======
# Database Schema — F1 Race Intelligence System

## MVP Approach: File-Based Artifacts

For the MVP, we use file-based storage instead of a database:

| Artifact Type | Format | Location |
|---------------|--------|----------|
| Session cache | `.pkl` | `cache/fastf1/` |
| ML features | `.parquet` | `artifacts/features/` |
| Predictions | `.json` | `artifacts/outputs/` |
| Saved scenarios | `.json` | `artifacts/scenarios/` |

---

## Phase 2: Database Schema (Future)

When auth and scenario persistence are added:

### Tables

#### users
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    tier ENUM('free', 'premium') DEFAULT 'free',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP
);
```

#### scenarios
```sql
CREATE TABLE scenarios (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    circuit VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    configuration JSONB NOT NULL,
    results JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### simulations
```sql
CREATE TABLE simulations (
    id UUID PRIMARY KEY,
    scenario_id UUID REFERENCES scenarios(id),
    status ENUM('pending', 'running', 'completed', 'failed'),
    lap_data JSONB,
    completed_at TIMESTAMP
);
```

---

## MVP File Structure

```
artifacts/
├── features/
│   └── {year}_{round}_features.parquet
├── outputs/
│   └── pred_{timestamp}.json
├── scenarios/
│   └── scenario_{uuid}.json
└── cache/
    └── fastf1/
```
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
