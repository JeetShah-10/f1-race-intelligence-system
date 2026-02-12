<<<<<<< HEAD
# commit_conventions.md
=======
# Commit Conventions — F1 Race Intelligence System

## Format

```
<type>(<scope>): <description>

[optional body]
```

## Types

| Type | Use |
|------|-----|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructure |
| `docs` | Documentation |
| `test` | Tests |
| `chore` | Tooling/config |

## Scopes

- `frontend` - React UI
- `backend` - FastAPI
- `ml` - Models/training
- `sim` - Simulation engine

## Examples

```
feat(frontend): add timing tower component
fix(backend): resolve session loading crash
docs(ml): update model spec with features
```

## Rules

- Max 72 chars first line
- Use present tense ("add" not "added")
- Reference issues: `Fixes #123`
>>>>>>> 2c436438b203d70c19f4e9029ac974df401817b5
