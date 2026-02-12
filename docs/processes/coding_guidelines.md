<<<<<<< HEAD
# coding_guidelines.md
=======
# Coding Guidelines — F1 Race Intelligence System

## TypeScript (Frontend)

- Use functional components with hooks
- Strict TypeScript (`strict: true`)
- Prefer named exports
- Max 300 lines per file
- Use `async/await` over `.then()`

```typescript
// Good
export const PredictPage: React.FC = () => { ... }

// Avoid
export default function() { ... }
```

## Python (Backend)

- PEP 8 compliant
- Type hints required
- Docstrings for public functions
- Max 100 chars per line
- Use `pathlib` over `os.path`

```python
# Good
def predict_race(circuit: str, year: int) -> RaceResult:
    """Predict race outcome for given circuit."""
    ...

# Avoid
def predict_race(circuit, year):
    ...
```

## Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `TimingTower` |
| Hooks | camelCase with `use` | `useSimulation` |
| API routes | snake_case | `predict_race` |
| Constants | UPPER_SNAKE | `MAX_LAPS` |

## Linting

- Frontend: ESLint + Prettier
- Backend: Ruff + Black
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
