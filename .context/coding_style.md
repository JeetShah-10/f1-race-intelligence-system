# F1 Intelligence - Coding Style Guide

## TypeScript/React Standards

### Component Structure
```tsx
// 1. Imports (grouped: react, external libs, internal, styles)
import { useState, useEffect, memo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/useStore';
import styles from './Component.module.css';

// 2. Types/Interfaces
interface ComponentProps {
  title: string;
  onAction?: () => void;
}

// 3. Component (memoized if needed)
export const Component = memo(function Component({ title, onAction }: ComponentProps) {
  // Hooks first
  const [state, setState] = useState(false);
  const data = useStore((s) => s.data);
  
  // Memoized callbacks
  const handleClick = useCallback(() => {
    onAction?.();
  }, [onAction]);
  
  // Effects
  useEffect(() => {
    // ...
  }, []);
  
  // Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {title}
    </motion.div>
  );
});
```

### Performance Patterns
```tsx
// ✅ Lazy load heavy components
const ThreeScene = lazy(() => import('./components/3d/Scene'));

// ✅ Use Suspense with fallback
<Suspense fallback={<LoadingSpinner />}>
  <ThreeScene />
</Suspense>

// ✅ Image optimization
<img
  src={smallImage}
  srcSet={`${smallImage} 1x, ${largeImage} 2x`}
  loading="lazy"
  alt="..."
/>

// ✅ Video optimization
<video
  poster={posterImage}
  preload="metadata"
  playsInline
  muted
  loop
>
  <source src={videoWebm} type="video/webm" />
  <source src={videoMp4} type="video/mp4" />
</video>
```

### Animation Standards (60 FPS)
```tsx
// ✅ Use transform, opacity (GPU-accelerated)
const variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

// ✅ Use layout prop for smooth re-layouts
<motion.div layout layoutId="unique-id">

// ❌ NEVER animate width, height, top, left directly
```

## Python/FastAPI Standards

### Async Endpoints
```python
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api", tags=["predictions"])

class PredictionResponse(BaseModel):
    driver_id: str
    position: int
    confidence: float

@router.get("/predictions/{race_id}", response_model=list[PredictionResponse])
async def get_predictions(race_id: str) -> list[PredictionResponse]:
    """
    Get race predictions for a specific race.
    
    Args:
        race_id: The unique race identifier
        
    Returns:
        List of predicted positions with confidence scores
    """
    results = await prediction_service.predict(race_id)
    return results
```

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| React Component | PascalCase | `DashboardCard.tsx` |
| Hook | camelCase + use prefix | `useRaceData.ts` |
| Utility | camelCase | `formatLapTime.ts` |
| Types | PascalCase | `types/Race.ts` |
| Python module | snake_case | `prediction_service.py` |
