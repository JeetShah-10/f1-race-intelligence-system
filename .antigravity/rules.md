# 🏎️ F1 Race Intelligence System - Antigravity Workspace Rules

## Core Philosophy: Performance-First, Immersive Experience

You are building the F1 Race Intelligence System - a premium, cinematic F1 analytics platform.
**Target: 60 FPS, Fast Loading, High Resolution, Immersive Experience**

---

## 🎯 Project Mission

Build the most immersive F1 race intelligence platform that combines:
- Real-time race predictions using ML models
- Interactive data visualizations
- Premium cinematic UI/UX with 3D elements
- Smooth 60 FPS performance across all devices

---

## 🏗️ Architecture Overview

```
F1-Intelligence-Model/
├── frontend/           # React + TypeScript + Vite + Framer Motion + Three.js
│   ├── src/
│   │   ├── components/ # 3D, cinematic, dashboard, HUD, landing components
│   │   ├── pages/      # Dashboard, Predict, Simulate, Analyze pages
│   │   └── store/      # Zustand state management
│   └── public/assets/  # Cars, circuits, drivers, logos, videos, fonts
├── backend/            # FastAPI + Python
│   └── app/            # API routes, ML model serving
├── F1_Intelligence_Model/ # Python ML training code
├── ml_notebooks/       # Jupyter notebooks for model development
└── docs/               # Product, UX, tech documentation
```

---

## ⚡ Performance Rules (60 FPS CRITICAL)

### Image Optimization
- **Format**: Use WebP for photos, SVG for icons/logos
- **Lazy Loading**: ALWAYS use lazy loading for images below fold
- **Responsive**: Provide srcset with 1x, 2x, 4K variants
- **Compression**: Target < 200KB per image, < 1MB for hero images

### Video Optimization
- **Format**: WebM with H.265/HEVC fallback to MP4
- **Preload**: Use `preload="metadata"` not `preload="auto"`
- **Poster**: Always set poster image for instant visual

### 3D/Three.js Performance
- **Model compression**: GLTF with Draco compression
- **LOD**: Implement Level of Detail for complex models
- **Instancing**: Use instanced meshes for repeated geometry
- **Dispose**: ALWAYS dispose geometries, materials, textures on unmount

### React Performance
- **Memoization**: Use React.memo, useMemo, useCallback appropriately
- **Code splitting**: Lazy load pages and heavy components
- **Bundle size**: Monitor with `npm run build -- --report`
- **Animations**: Use Framer Motion with `layout` prop, not CSS transitions

---

## 🎨 Design Standards

### Visual Language
- **Theme**: Dark mode first, F1-inspired colors (red accents, carbon textures)
- **Effects**: Glassmorphism, subtle gradients, depth shadows
- **Motion**: Smooth micro-animations, parallax scrolling, cinematic reveals
- **Typography**: Racing-inspired fonts, clear hierarchy

### Asset Sources (Use Browser Tool)
- Unsplash for 4K racing/automotive photos
- F1 official media for team logos/driver photos
- Custom SVGs for icons and UI elements

---

## 🔧 Coding Standards

### Frontend (TypeScript/React)
```typescript
// ALWAYS use strict TypeScript
// Prefer functional components with hooks
// Use Zustand for global state
// Use TanStack Query for server state
// Use Framer Motion for animations
```

### Backend (Python/FastAPI)
```python
# Use type hints everywhere
# Pydantic models for all schemas
# Async endpoints for I/O operations
# Document with docstrings
```

---

## 🧠 Agent Permissions

### ✅ Allowed
- Browser tool for fetching 4K images, videos, assets
- Running dev servers and build commands
- Installing npm/pip packages
- Creating/modifying any project files

### ⚠️ Caution
- Large asset downloads (confirm > 10MB)
- External API calls without rate limiting
- Database migrations

### ❌ Never
- Delete production data
- Push to main branch directly
- Expose API keys in code

---

## 🔄 Parallel Agent Workflows

When using parallel agents for this project:

| Agent | F1 Project Focus |
|-------|------------------|
| `frontend-specialist` | React, Three.js, Framer Motion, performance |
| `backend-specialist` | FastAPI, ML model serving, API design |
| `performance-optimizer` | 60 FPS, bundle size, loading speed |
| `test-engineer` | Playwright E2E, component testing |
| `devops-engineer` | Vite config, build optimization |

---

## 📊 Key Project Files

### Frontend Entry Points
- `frontend/src/main.tsx` - App entry
- `frontend/src/App.tsx` - Root component
- `frontend/src/router.tsx` - Route configuration

### Component Directories
- `frontend/src/components/3d/` - Three.js components
- `frontend/src/components/cinematic/` - Hero, landing animations
- `frontend/src/components/dashboard/` - Dashboard widgets
- `frontend/src/components/hud/` - Racing HUD overlays

### Assets
- `frontend/public/assets/cars/` - F1 car images
- `frontend/public/assets/circuits/` - Track maps
- `frontend/public/assets/drivers/` - Driver portraits
- `frontend/public/assets/logos/` - Team logos
- `frontend/public/assets/videos/` - Background videos
