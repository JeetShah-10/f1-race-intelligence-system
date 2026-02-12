# 🔀 Backend Developer Merge Guide

> **Date**: Feb 13, 2026
> **From**: Frontend team → Backend developer
> **Branch to pull**: `frontend-core`

---

## ⚠️ IMPORTANT: Push FIRST, Then Pull

**You should PUSH your work to `backend-core` FIRST, then merge `frontend-core` into your branch.**

### Why Push First?

1. **Your work is safe** — if the merge goes wrong, you can always reset to your last commit
2. **Your local changes won't be lost** — everything is committed and pushed to remote
3. **Clean merge base** — Git works best when both sides are committed

### What If You Have Uncommitted Changes?

If you have uncommitted changes on `backend-core`:

```bash
# Option A: Commit everything first
git add .
git commit -m "wip: current ML model work"
git push origin backend-core

# Option B: Stash, merge, then pop
git stash
git merge origin/frontend-core
git stash pop
```

---

## Step-by-Step Merge Instructions

```bash
# 1. Make sure all your work is committed and pushed
git add .
git commit -m "your commit message"
git push origin backend-core

# 2. Fetch the latest from remote
git fetch origin

# 3. Merge frontend-core into your branch
git merge origin/frontend-core
```

---

## What You'll Get From This Merge

### Frontend Changes (1,900+ files — no conflicts expected)
- Complete dashboard with widgets (standings, calendar, quick actions)
- Full simulation page with qualifying view, race playback, leaderboard
- Prediction page with podium visualization, insights panel
- Landing page, onboarding flow, user profile
- All TypeScript types, stores (Zustand), and services

### Backend Changes (minimal — low conflict risk)
| File | Change | Conflict Risk |
|------|--------|--------------|
| `backend/scripts/train_pace_model_v2.py` | 1-line pyarrow import fix | ⚠️ Low — may conflict if you've edited this file |
| `backend/**/__pycache__/*.pyc` | Binary compiled files | ❌ None — Git auto-resolves or you can delete these |
| Root junk files (`debug.log`, `git_status.txt`) | Added from debugging sessions | ❌ None — safe to delete later |

### Config & Tooling
- `.vscode/settings.json` — VS Code config
- `.agent/` — AI agent skills and workflows
- `.context/` — Project context files
- `.antigravity/` — Agent rules
- `3D-model-and-references/` — UI reference images

---

## Handling Potential Conflicts

### Scenario 1: `train_pace_model_v2.py` conflict

If you get a merge conflict in this file:

```bash
# The change we made is just a pyarrow import fix (line ~2):
# Before: import pyarrow  (or similar)
# After:  import pyarrow as pa

# Accept THEIR (frontend-core) version if your version is the same as before
# Accept YOUR version if you've made more substantial changes to this file
git checkout --theirs backend/scripts/train_pace_model_v2.py  # Accept our fix
# OR
git checkout --ours backend/scripts/train_pace_model_v2.py    # Keep your version
```

### Scenario 2: `__pycache__` conflicts

```bash
# These are auto-generated. Just delete them all:
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null
# Or on Windows PowerShell:
Get-ChildItem -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
git add .
git commit -m "merge: resolve pycache conflicts"
```

### Scenario 3: If you've modified any frontend files

Very unlikely, but if you've touched files in `frontend/src/`:
```bash
# Their version is authoritative for all frontend files:
git checkout --theirs frontend/
git add frontend/
```

---

## After Merging: Quick Verification

```bash
# 1. Backend still starts
cd backend
pip install -r requirements.txt   # in case new deps were added
python -m uvicorn app.main:app --reload

# 2. Frontend still starts (optional)
cd frontend
npm install
npm run dev

# 3. Clean up pycache
Get-ChildItem -Recurse -Directory -Filter "__pycache__" | Remove-Item -Recurse -Force
```

---

## Known Issues to Fix Together (After Merge)

These are bugs I've documented in `docs/simulation_architecture_guide.md` that need backend fixes:

1. **`race_predictor_service.py`** doesn't inject `pace_model` into SimulationContext
2. **`qualifying_service.py`** uses hardcoded tiers instead of ML model
3. **Driver/team IDs** are lowercase (`ver`, `red_bull`) but ML models expect uppercase (`VER`, `Red Bull Racing`)
4. **Degradation slope** is hardcoded at `0.1` instead of using ML model
5. **No mandatory pit stops** in strategy AI
6. **Double fuel penalty** in BayesianTyreModel + ML predictions

See the full architecture guide: `docs/simulation_architecture_guide.md` (included in this merge)

---

## TL;DR

```bash
# 1. PUSH your work first
git add . && git commit -m "wip: current work" && git push origin backend-core

# 2. Fetch and merge
git fetch origin
git merge origin/frontend-core

# 3. If conflicts, accept theirs for frontend, yours for backend
# 4. Delete __pycache__ folders
# 5. Test: uvicorn app.main:app --reload
```
