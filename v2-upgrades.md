# V2 Upgrades

Tracking improvements and tech debt to address in the next iteration.

---

## 1. Retrain ML Models on scikit-learn 1.9.0

**Priority:** High  
**Why:** The `.pkl` model artifacts in `backend/app/models/` were trained with scikit-learn 1.7.2. The current `.venv` has 1.9.0 but we had to pin back to 1.7.2 because the internal `_loss` module was restructured, causing `ModuleNotFoundError` on unpickle.

**What to do:**
- Run the training scripts in `backend/scripts/` using sklearn 1.9.0
- Replace all `.pkl` files in `backend/app/models/`
- Update `requirements.txt` to pin `scikit-learn>=1.9.0`
- Verify predictions match expected outputs after retraining

**Files affected:**
- `backend/app/models/race_rank_model_v0.pkl`
- `backend/app/models/baseline_pace_model.pkl`
- `backend/app/models/degradation_model.pkl`
- `backend/app/models/race_pace_v1.pkl`
- `backend/app/models/label_encoders.pkl`
- `backend/app/models/sector_label_encoders.pkl`
- `backend/scripts/` (training scripts)
- `backend/train.py`

---

## 2. Separate ML Artifacts from ORM Models

**Priority:** Medium  
**Why:** `backend/app/models/` currently mixes `.pkl` ML artifacts with `simulation.py` (SQLAlchemy ORM model). This is a naming collision.

**What to do:**
- Move ML artifacts to `backend/app/ml/artifacts/`
- Keep `backend/app/models/` for ORM/database models only
- Update all `MODEL_PATH` references in services

---

## 3. Clean Up Virtual Environments

**Priority:** Low  
**Why:** Multiple stale venvs (`venv_old2`, etc.) have accumulated. Only `.venv` should exist.

**What to do:**
- Delete any leftover `venv_old*` directories
- Ensure `.venv` is the single source of truth
- Pin all dependency versions in `requirements.txt`
