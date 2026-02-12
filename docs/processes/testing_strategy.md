<<<<<<< HEAD
# testing_strategy.md
=======
# Testing Strategy — F1 Race Intelligence System

## Frontend Tests

| Type | Tool | Focus |
|------|------|-------|
| Unit | Vitest | Components, hooks |
| Integration | Playwright | Page flows |
| E2E | Playwright | Full user journeys |

```bash
cd frontend && npm test
```

## Backend Tests

| Type | Tool | Focus |
|------|------|-------|
| Unit | pytest | Services, utils |
| API | pytest + httpx | Endpoints |
| ML | pytest | Model inference |

```bash
cd backend && pytest tests/ -v
```

## Coverage Targets

| Component | Target |
|-----------|--------|
| Backend services | 80% |
| API routes | 90% |
| Frontend hooks | 70% |

## Test Data

- Use FastF1 cached data
- Mock external APIs
- Fixtures in `tests/fixtures/`
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
