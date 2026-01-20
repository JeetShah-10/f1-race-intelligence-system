import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '../../context/ScrollContext';

const HERITAGE = {
    ferrariRosso: '#CF2C28',
    carbonBlack: '#0B0D10',
    silverArrow: '#9FA4A8',
};

// Premium easing
const PREMIUM_EASING = [0.17, 0.84, 0.44, 1] as const;

// F1 Car Silhouette
const F1_CAR_PATH = `M15,24 L25,22 L45,20 L65,18 L90,17 L115,16 L140,16 L165,17 L185,19 L195,22 L200,25 L195,28 L185,30 L165,30 L145,29 L125,29 L105,30 L85,30 L65,29 L45,28 L25,27 L15,26 Z`;

interface LoadingTransitionProps {
    minDuration?: number;
    onComplete?: () => void;
}

export function LoadingTransition({ minDuration = 3000, onComplete }: LoadingTransitionProps) {
    const [phase, setPhase] = useState<'loading' | 'accelerate' | 'done'>('loading');
    const [progress, setProgress] = useState(0);
    const { setIsLoaded } = useScroll();

    // Progress animation
    useEffect(() => {
        const startTime = Date.now();
        const loadingDuration = minDuration * 0.7;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const linear = Math.min(elapsed / loadingDuration, 1);
            // Smooth easing
            const eased = 1 - Math.pow(1 - linear, 3);
            setProgress(eased * 100);

            if (linear >= 1) {
                clearInterval(progressInterval);
                setPhase('accelerate');
            }
        }, 30);

        return () => clearInterval(progressInterval);
    }, [minDuration]);

    // Phase transitions
    useEffect(() => {
        if (phase === 'accelerate') {
            const timer = setTimeout(() => {
                setPhase('done');
                setIsLoaded(true);
                onComplete?.();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [phase, setIsLoaded, onComplete]);

    if (phase === 'done') return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: PREMIUM_EASING }}
                className="fixed inset-0 z-[200] flex flex-col items-center justify-center overflow-hidden"
                style={{ backgroundColor: HERITAGE.carbonBlack }}
            >
                {/* Subtle grid */}
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)
                        `,
                        backgroundSize: '80px 80px',
                    }}
                />

                {/* Red glow */}
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] blur-[180px] rounded-full"
                    style={{ backgroundColor: `${HERITAGE.ferrariRosso}08` }}
                />

                {/* Loading Content */}
                {phase === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: PREMIUM_EASING }}
                        className="relative z-10 flex flex-col items-center"
                    >
                        {/* Red stripes */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="flex gap-1.5 mb-10"
                        >
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.3, duration: 0.5, ease: PREMIUM_EASING }}
                                className="w-12 h-1.5 origin-left"
                                style={{ backgroundColor: HERITAGE.ferrariRosso }}
                            />
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.4, duration: 0.5, ease: PREMIUM_EASING }}
                                className="w-8 h-1.5 origin-left"
                                style={{ backgroundColor: `${HERITAGE.ferrariRosso}80` }}
                            />
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ delay: 0.5, duration: 0.5, ease: PREMIUM_EASING }}
                                className="w-4 h-1.5 origin-left"
                                style={{ backgroundColor: `${HERITAGE.ferrariRosso}40` }}
                            />
                        </motion.div>

                        {/* Brand */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8, ease: PREMIUM_EASING }}
                            className="text-center mb-16"
                        >
                            <h1 className="font-bold text-5xl md:text-6xl tracking-tighter text-white mb-2">
                                APEX
                            </h1>
                            <span
                                className="text-base tracking-[0.5em] font-light"
                                style={{ color: HERITAGE.silverArrow }}
                            >
                                INTELLIGENCE
                            </span>
                        </motion.div>

                        {/* Progress bar */}
                        <div className="w-56">
                            <div className="h-[3px] bg-white/10 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{
                                        width: `${progress}%`,
                                        backgroundColor: HERITAGE.ferrariRosso
                                    }}
                                    transition={{ duration: 0.1 }}
                                />
                            </div>
                            <div className="flex justify-between mt-4 text-sm">
                                <span style={{ color: `${HERITAGE.silverArrow}80` }}>
                                    INITIALIZING SYSTEMS
                                </span>
                                <span className="font-mono text-white">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Accelerate Phase */}
                {phase === 'accelerate' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center overflow-hidden"
                    >
                        {/* Speed lines */}
                        <div className="absolute inset-0">
                            {[...Array(15)].map((_, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ x: '100%', opacity: 0 }}
                                    animate={{ x: '-100%', opacity: [0, 0.4, 0] }}
                                    transition={{
                                        duration: 0.5,
                                        delay: i * 0.03,
                                        ease: 'linear',
                                    }}
                                    className="absolute h-[2px] bg-gradient-to-r from-transparent to-white/30"
                                    style={{
                                        top: `${15 + (i * 5)}%`,
                                        width: `${15 + Math.random() * 25}%`,
                                    }}
                                />
                            ))}
                        </div>

                        {/* F1 Silhouette */}
                        <motion.svg
                            viewBox="0 0 220 50"
                            className="w-[350px] h-auto"
                            initial={{ x: '-30%', opacity: 1 }}
                            animate={{ x: '130%', scale: [1, 1.15] }}
                            transition={{
                                duration: 0.8,
                                ease: [0.4, 0, 1, 1],
                            }}
                        >
                            <path d={F1_CAR_PATH} fill="white" />
                        </motion.svg>

                        {/* Red trail */}
                        <motion.div
                            initial={{ scaleX: 0, opacity: 0 }}
                            animate={{ scaleX: 1, opacity: [0, 0.8, 0] }}
                            transition={{ duration: 0.6, ease: PREMIUM_EASING }}
                            className="absolute left-0 right-1/3 h-[3px] origin-left"
                            style={{
                                top: '50%',
                                background: `linear-gradient(90deg, transparent, ${HERITAGE.ferrariRosso})`
                            }}
                        />
                    </motion.div>
                )}

                {/* Corner accents */}
                <div className="absolute top-8 left-8 w-8 h-8 border-l-2 border-t-2 border-white/10" />
                <div className="absolute top-8 right-8 w-8 h-8 border-r-2 border-t-2 border-white/10" />
                <div className="absolute bottom-8 left-8 w-8 h-8 border-l-2 border-b-2 border-white/10" />
                <div className="absolute bottom-8 right-8 w-8 h-8 border-r-2 border-b-2 border-white/10" />
            </motion.div>
        </AnimatePresence>
    );
}
