import type { Variants } from 'framer-motion';
import { springs } from './springs';

// ═══════════════════════════════════════════════════════════════════
// FADE VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: springs.smooth },
};

export const fadeInScale: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: springs.gentle },
};

// ═══════════════════════════════════════════════════════════════════
// STAGGER CONTAINERS
// ═══════════════════════════════════════════════════════════════════

export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.1,
        },
    },
};

export const staggerDramatic: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        },
    },
};

// ═══════════════════════════════════════════════════════════════════
// SCROLL REVEAL (for word-by-word text)
// ═══════════════════════════════════════════════════════════════════

export const scrollWord: Variants = {
    hidden: { opacity: 0.2, y: 20 },
    visible: { opacity: 1, y: 0, transition: springs.gentle },
};

// ═══════════════════════════════════════════════════════════════════
// CARD VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const cardHover: Variants = {
    idle: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -4, transition: springs.snappy },
};

export const glassCard: Variants = {
    hidden: { opacity: 0, y: 40, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1, transition: springs.smooth },
};

// ═══════════════════════════════════════════════════════════════════
// TIMING TOWER VARIANTS
// ═══════════════════════════════════════════════════════════════════

export const timingRow: Variants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.1, ...springs.smooth },
    }),
};

export const gapBar: Variants = {
    hidden: { scaleX: 0 },
    visible: { scaleX: 1, transition: { duration: 0.8, ease: [0.17, 0.84, 0.44, 1] } },
};

// ═══════════════════════════════════════════════════════════════════
// CTA GLOW
// ═══════════════════════════════════════════════════════════════════

export const glowPulse: Variants = {
    idle: { boxShadow: '0 0 20px rgba(225, 6, 0, 0.3)' },
    pulse: {
        boxShadow: [
            '0 0 20px rgba(225, 6, 0, 0.3)',
            '0 0 40px rgba(225, 6, 0, 0.6)',
            '0 0 20px rgba(225, 6, 0, 0.3)',
        ],
        transition: { duration: 2, repeat: Infinity },
    },
};
