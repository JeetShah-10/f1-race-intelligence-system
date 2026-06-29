# F1 Race Intelligence - Coding Style Guide

## TypeScript & React Standards

### 1. Component Structure & Order
Write components with a predictable, structured layout:
1. **Imports Grouping:** Group imports in this order:
   - React core hooks and libraries.
   - External dependencies (e.g. Framer Motion, Zustand).
   - Internal imports (components, stores, utils, config).
   - Stylesheet/CSS modules.
2. **Prop Interfaces:** Always define a TypeScript interface for props (e.g. `interface DashboardCardProps`).
3. **Component Definition:** Export named components. Use `React.memo` for heavy rendering components.
4. **Hooks Order:** Hooks first, followed by state, Zustand store selectors, memoized callbacks (`useCallback`), and side effects (`useEffect`).
5. **Render Logic:** Return JSX at the bottom. Keep JSX clean by extracting complex render functions or child components.

### 2. Component Performance Guidelines
- **Lazy Loading:** Dynamically import heavy components (e.g., D3 charts, 3D Canvas scenes) using `lazy` and wrap them in a `Suspense` block with a loading placeholder.
- **Visual Asset Optimization:**
  - Images: Use WebP formats, specify `srcset` for 1x/2x displays, and use `loading="lazy"` for below-the-fold content.
  - Videos: Preload only metadata (`preload="metadata"`), set a poster image, and use `playsInline muted loop` attributes for background tracks.

### 3. GPU-Accelerated Animations
- **Properties:** Animate only properties that can be offloaded to the GPU to maintain a 60 FPS target: `transform` (translates, scales, rotations) and `opacity`.
- **Constraint:** Never animate layout-affecting properties (such as `width`, `height`, `top`, `left`, `margin`, `padding`) as they trigger browser layout cycles and cause thrashing.

---

## Python & FastAPI Standards

### 1. API Endpoint Design
- **Routing:** Organize endpoints into distinct routers (`APIRouter`) with modular prefixes and documentation tags.
- **Asynchronous Code:** Declare endpoints with `async def` to utilize non-blocking ASGI features.
- **Data Schemas:** Use Pydantic models for validation of both incoming payloads (`BaseModel`) and outgoing responses (`response_model`).
- **Docstrings:** Document endpoints with Google-style docstrings describing the endpoint's purpose, parameters, and returns.

---

## File Naming Conventions

| File Type | Case Style | Example |
| :--- | :--- | :--- |
| React Component | PascalCase | `DashboardCard.tsx` |
| Custom React Hook | camelCase with `use` prefix | `useRaceData.ts` |
| Utility Function | camelCase | `formatLapTime.ts` |
| Type Definition | PascalCase | `types/Race.ts` |
| Python Module/File | snake_case | `prediction_service.py` |
| Database Model | PascalCase | `db/models.py` |
