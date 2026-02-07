# Branching Strategy — F1 Race Intelligence System

## Branch Types

| Branch | Purpose | Naming |
|--------|---------|--------|
| `main` | Production-ready code | - |
| `develop` | Integration branch | - |
| `feature/*` | New features | `feature/predict-api` |
| `fix/*` | Bug fixes | `fix/simulation-crash` |
| `hotfix/*` | Production fixes | `hotfix/api-timeout` |

## Workflow

```
main ← hotfix/*
  ↑
develop ← feature/* / fix/*
```

1. Create feature branch from `develop`
2. Work and commit
3. PR back to `develop`
4. After testing, merge `develop` → `main`

## Rules

- Never push directly to `main`
- All PRs require review
- Keep feature branches short-lived (< 1 week)