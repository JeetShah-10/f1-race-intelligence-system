---
description: Parallel agents for F1 frontend rebuild with 60fps performance
---

# F1 Frontend Rebuild - Parallel Agent Workflow

## When to Use
Use when rebuilding or significantly enhancing the F1 frontend with multiple independent concerns:
- UI/UX improvements
- Performance optimization
- Asset acquisition
- 3D scene work

## Parallel Agent Dispatch

### Phase 1: Discovery & Planning (Sequential)
```
1. Use explorer-agent to map current frontend state
2. Identify performance bottlenecks
3. Create task breakdown
```

### Phase 2: Parallel Execution
Dispatch these agents simultaneously:

```
Agent 1: frontend-specialist
Focus: React components, routing, state management
Files: src/pages/*, src/components/ui/*

Agent 2: performance-optimizer  
Focus: Bundle size, lazy loading, image optimization
Files: vite.config.ts, src/components/*, public/assets/*

Agent 3: Use browser tool for asset acquisition
Focus: 4K images, 60fps videos from Unsplash, Pexels
Output: Save to public/assets/ with proper compression

Agent 4: 3D specialist (frontend-specialist with Three.js context)
Focus: Three.js performance, GLTF optimization, LOD
Files: src/components/3d/*
```

### Phase 3: Integration (Sequential)
```
1. Merge all changes
2. Run performance audit (Lighthouse)
3. Test 60fps on target devices
4. Fix any conflicts
```

## Performance Checklist

Before completing:
- [ ] Lighthouse Performance > 90
- [ ] First Contentful Paint < 1.5s
- [ ] Total Bundle Size < 500KB initial
- [ ] All images lazy loaded
- [ ] Videos have poster images
- [ ] 60fps on scroll/animations

## Asset Requirements

### Images
- Format: WebP with JPEG fallback
- Sizes: 640w, 1280w, 1920w, 3840w (4K)
- Compression: 80% quality

### Videos
- Format: WebM (VP9) primary, MP4 (H.264) fallback
- Resolution: 1080p for backgrounds, 4K for heroes
- FPS: 60fps for smooth playback
- Duration: < 10s for loops
