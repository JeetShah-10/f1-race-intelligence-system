import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScroll } from '../../context/ScrollContext';

interface LoadingScreenProps {
    minDuration?: number;
    onComplete?: () => void;
}

// Loading phases for cinematic sequence
const LOADING_PHASES = [
    { text: 'ESTABLISHING TELEMETRY LINK', duration: 0.3 },
    { text: 'LOADING CIRCUIT DATA', duration: 0.3 },
    { text: 'SYNCING SIMULATION ENGINE', duration: 0.25 },
    { text: 'READY', duration: 0.15 },
];

export function LoadingScreen({ minDuration = 2200, onComplete }: LoadingScreenProps) {
    const [isVisible, setIsVisible] = useState(true);
    const [progress, setProgress] = useState(0);
    const { setIsLoaded } = useScroll();

    // Calculate current phase based on progress
    const phaseText = useMemo(() => {
        let accumulated = 0;
        for (let i = 0; i < LOADING_PHASES.length; i++) {
            accumulated += LOADING_PHASES[i].duration;
            if (progress / 100 < accumulated) {
                return LOADING_PHASES[i].text;
            }
        }
        return LOADING_PHASES[LOADING_PHASES.length - 1].text;
    }, [progress]);

    useEffect(() => {
        const startTime = Date.now();

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            // Ease out the progress for smoother feel
            const linear = Math.min(elapsed / minDuration, 1);
            const eased = 1 - Math.pow(1 - linear, 2); // Ease out quad
            setProgress(eased * 100);

            if (linear >= 1) {
                clearInterval(progressInterval);
            }
        }, 30);

        const timer = setTimeout(() => {
            setIsVisible(false);
            setIsLoaded(true);
            onComplete?.();
        }, minDuration);

        return () => {
            clearTimeout(timer);
            clearInterval(progressInterval);
        };
    }, [minDuration, onComplete, setIsLoaded]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[200] bg-[#030308] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Subtle grid background */}
                    <div
                        className="absolute inset-0 opacity-[0.03]"
                        style={{
                            backgroundImage: `
                                linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                            `,
                            backgroundSize: '40px 40px',
                        }}
                    />

                    {/* Gradient accents */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-red-600/10 to-transparent blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[200px] bg-gradient-to-tr from-cyan-500/5 to-transparent blur-2xl" />
                    <div className="absolute bottom-0 right-0 w-[400px] h-[200px] bg-gradient-to-tl from-purple-500/5 to-transparent blur-2xl" />

                    {/* Main content */}
                    <div className="relative z-10 flex flex-col items-center">

                        {/* Brand Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                            className="mb-6"
                        >
                            {/* F1-style stripes accent */}
                            <div className="flex gap-1 mb-6 justify-center">
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.4, delay: 0.2 }}
                                    className="w-8 h-1 bg-red-600 origin-left"
                                />
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.4, delay: 0.3 }}
                                    className="w-6 h-1 bg-red-600/60 origin-left"
                                />
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ duration: 0.4, delay: 0.4 }}
                                    className="w-4 h-1 bg-red-600/30 origin-left"
                                />
                            </div>

                            {/* Brand Name */}
                            <h1 className="text-center">
                                <span className="block font-bold text-4xl md:text-5xl tracking-tight text-white">
                                    APEX
                                </span>
                                <span className="block font-light text-lg md:text-xl tracking-[0.35em] text-white/50 mt-1">
                                    INTELLIGENCE
                                </span>
                            </h1>
                        </motion.div>

                        {/* Tagline */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-[11px] tracking-[0.25em] text-white/30 uppercase mb-12"
                        >
                            Predictive Motorsport Simulation
                        </motion.p>

                        {/* Progress Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                            className="w-64"
                        >
                            {/* Progress bar container */}
                            <div className="relative h-[2px] bg-white/10 rounded-full overflow-hidden">
                                {/* Animated background shimmer */}
                                <motion.div
                                    animate={{ x: ['-100%', '200%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                    className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                />

                                {/* Actual progress */}
                                <motion.div
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-600 via-red-500 to-orange-500"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>

                            {/* Status text */}
                            <div className="flex justify-between items-center mt-4">
                                <motion.span
                                    key={phaseText}
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-[10px] tracking-[0.15em] text-white/40 font-medium"
                                >
                                    {phaseText}
                                </motion.span>
                                <span className="text-[10px] tracking-wider text-white/60 font-mono">
                                    {Math.round(progress)}%
                                </span>
                            </div>
                        </motion.div>
                    </div>

                    {/* Bottom decorative line */}
                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 1, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent origin-center"
                    />

                    {/* Corner accents */}
                    <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-white/10" />
                    <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-white/10" />
                    <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-white/10" />
                    <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-white/10" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}
