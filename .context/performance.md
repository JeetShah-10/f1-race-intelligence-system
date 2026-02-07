# 60 FPS Performance Guide

## Core Principle
> Every frame has 16.67ms. Every animation must complete within budget.

## GPU-Accelerated Properties (USE THESE)
- `transform` (translate, scale, rotate)
- `opacity`
- `filter` (blur, brightness)

## CPU-Heavy Properties (AVOID)
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `margin`, `padding`
- `border-radius` (during animation)

---

## React Performance Checklist

### Components
- [ ] Heavy components wrapped in `React.memo()`
- [ ] Expensive calculations in `useMemo()`
- [ ] Event handlers in `useCallback()`
- [ ] Large lists use virtualization (`react-window`)

### Images
- [ ] All images use WebP format
- [ ] `loading="lazy"` on below-fold images
- [ ] `srcset` with 1x, 2x, 4K variants
- [ ] Proper `width`/`height` to prevent CLS

### Videos
- [ ] WebM format (VP9 codec)
- [ ] `preload="metadata"` not `auto`
- [ ] `poster` image always set
- [ ] `playsInline muted loop` for backgrounds

### Three.js/3D
- [ ] Models use GLTF + Draco compression
- [ ] Dispose geometry/materials/textures on unmount
- [ ] Use `instancedMesh` for repeated objects
- [ ] Implement LOD for complex scenes

---

## Bundle Size Targets

| Category | Target | Action if Over |
|----------|--------|----------------|
| Initial JS | < 200KB | Code split more |
| Initial CSS | < 50KB | Purge unused |
| Per-route JS | < 100KB | Lazy load components |
| Total assets | < 2MB | Compress images |

## Commands

```bash
# Analyze bundle
npm run build -- --report

# Test performance
npm run preview
# Open DevTools > Performance > Record scroll

# Lighthouse
npx lighthouse http://localhost:4173 --view
```

## Framer Motion Patterns

```tsx
// ✅ Good - GPU accelerated
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
/>

// ❌ Bad - causes layout thrash
<motion.div
  initial={{ height: 0 }}
  animate={{ height: "auto" }}
/>

// ✅ Fix - use transform
<motion.div
  initial={{ scaleY: 0 }}
  animate={{ scaleY: 1 }}
  style={{ transformOrigin: "top" }}
/>
```
