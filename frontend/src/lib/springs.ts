export const springs = {
    // Snappy - Buttons, interactions
    snappy: { type: 'spring', stiffness: 400, damping: 30 },

    // Smooth - Cards, panels
    smooth: { type: 'spring', stiffness: 300, damping: 30 },

    // Gentle - Reveals, hero elements
    gentle: { type: 'spring', stiffness: 200, damping: 25 },

    // Bouncy - Playful accents
    bouncy: { type: 'spring', stiffness: 500, damping: 15 },

    // Slow - Cinematic reveals
    slow: { type: 'spring', stiffness: 100, damping: 20 },

    // 3D Car - Smooth following
    car3d: { type: 'spring', stiffness: 50, damping: 15, mass: 0.5 },
} as const;

// Duration transitions (CSS easing equiv)
export const durations = {
    quick: { duration: 0.15, ease: [0.17, 0.84, 0.44, 1] },
    normal: { duration: 0.2, ease: [0.17, 0.84, 0.44, 1] },
    moderate: { duration: 0.3, ease: [0.17, 0.84, 0.44, 1] },
    slow: { duration: 0.4, ease: [0.17, 0.84, 0.44, 1] },
    reveal: { duration: 0.8, ease: [0.17, 0.84, 0.44, 1] },
    cinematic: { duration: 1.0, ease: [0.65, 0, 0.35, 1] },
} as const;
