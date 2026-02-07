---
description: How to use parallel agents for F1 project development
---

# Parallel Agent Development Workflow

## Quick Start

### Single Agent Tasks
```
"Use the frontend-specialist to optimize the DashboardPage"
"Use performance-optimizer to audit bundle size"
```

### Parallel Dispatch (Independent Tasks)
```
Task("frontend-specialist: Fix dashboard layout issues")
Task("performance-optimizer: Reduce bundle size")
Task("test-engineer: Add Playwright tests for navigation")
```

### Sequential Chain (Dependent Tasks)
```
1. First, use explorer-agent to map the codebase
2. Then, use backend-specialist to review API endpoints
3. Finally, use test-engineer to verify coverage
```

## F1 Project Agent Roles

| Agent | F1 Focus Areas |
|-------|---------------|
| `frontend-specialist` | React, Three.js, Framer Motion, dashboard components |
| `backend-specialist` | FastAPI, ML model serving, API routes |
| `performance-optimizer` | 60fps, lazy loading, WebP, video optimization |
| `test-engineer` | Playwright E2E, component tests |
| `security-auditor` | API auth, data validation |
| `devops-engineer` | Vite config, build pipeline |
| `explorer-agent` | Codebase discovery |

## Performance-Critical Tasks

For any performance work:
// turbo
```
Use performance-optimizer with these requirements:
- Target: 60 FPS on all animations
- Bundle: < 500KB initial load
- Images: WebP with lazy loading
- Videos: WebM with poster images
```

## Asset Acquisition

Use browser tool for high-quality assets:
```
Use browser to find 4K F1 racing images on Unsplash
Keywords: "formula 1 racing", "race car motion blur", "f1 circuit aerial"
Requirements:
- Minimum 3840x2160
- Racing/motorsport theme
- Save to frontend/public/assets/
```

## Review Pattern

After each major change:
```
1. Run: npm run build (check bundle size)
2. Run: npm run preview (test 60fps)
3. Lighthouse audit (Performance > 90)
```
