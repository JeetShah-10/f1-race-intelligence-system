<<<<<<< HEAD
# onboarding.md
=======
# Onboarding — F1 Race Intelligence System

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- Git

### Setup

```bash
# Clone repo
git clone https://github.com/JeetShah-10/f1-race-intelligence-system

# Frontend
cd frontend
npm install
npm run dev

# Backend (new terminal)
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Key Directories

| Path | Purpose |
|------|---------|
| `frontend/src/pages/` | Route pages |
| `backend/app/api/` | API endpoints |
| `docs/` | Documentation |
| `.context/` | Project context files |

### Key Docs to Read

1. [mission.md](file:///c:/Users/shahj/Dev/Personal/F1-Intelligence-Model/.context/mission.md)
2. [project.md](file:///c:/Users/shahj/Dev/Personal/F1-Intelligence-Model/.context/project.md)
3. [architecture_overview.md](file:///c:/Users/shahj/Dev/Personal/F1-Intelligence-Model/docs/tech/architecture_overview.md)

### FastF1 Setup

```python
import fastf1
fastf1.Cache.enable_cache('./cache/fastf1')
```
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
