import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Circuit2026 } from '../../data/f1-data';

interface PredictionLoadingAnimationProps {
    circuit: Circuit2026;
    onComplete: () => void;
}

const LOADING_PHASES = [
    { text: 'ANALYZING HISTORICAL DATA', duration: 1000 },
    { text: 'RUNNING PREDICTIVE MODELS', duration: 1000 },
    { text: 'GENERATING RACE PREDICTION', duration: 1000 },
];

export default function PredictionLoadingAnimation({ circuit, onComplete }: PredictionLoadingAnimationProps) {
    const [phase, setPhase] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const startTime = Date.now();
        const totalDuration = 3000;

        const progressInterval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const p = Math.min(elapsed / totalDuration, 1);
            setProgress(p * 100);

            if (p >= 1) {
                clearInterval(progressInterval);
                setTimeout(onComplete, 200);
            }
        }, 16);

        const phase1 = setTimeout(() => setPhase(1), 1000);
        const phase2 = setTimeout(() => setPhase(2), 2000);

        return () => {
            clearInterval(progressInterval);
            clearTimeout(phase1);
            clearTimeout(phase2);
        };
    }, [onComplete]);

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
        >
            {/* Background layers */}
            <div className="absolute inset-0 bg-black" />

            {/* Light trails texture */}
            <div
                className="absolute inset-0 opacity-20 bg-pan-slow"
                style={{
                    backgroundImage: `url('/assets/textures/Screenshot 2026-02-11 182944.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Scanning lines */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[0, 1, 2].map(i => (
                    <div
                        key={i}
                        className="absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E8002D]/60 to-transparent"
                        style={{
                            animation: `scanline-sweep ${2 + i * 0.5}s linear infinite`,
                            animationDelay: `${i * 0.8}s`,
                        }}
                    />
                ))}
            </div>

            {/* Center content */}
            <div className="relative z-10 flex flex-col items-center max-w-lg px-6">
                {/* Car silhouette */}
                <motion.div
                    className="w-64 h-40 mb-8 opacity-30"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 0.3, scale: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <img
                        src="/assets/textures/Screenshot 2026-02-11 202112.png"
                        alt=""
                        className="w-full h-full object-contain"
                    />
                </motion.div>

                {/* Circuit name */}
                <motion.h2
                    className="text-2xl sm:text-3xl font-black uppercase text-white/90 mb-2 text-center"
                    style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                >
                    {circuit.name}
                </motion.h2>
                <motion.p
                    className="text-xs font-mono text-white/30 mb-8 tracking-wider"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    {circuit.location} · {circuit.laps} LAPS · {circuit.lapDistance}KM
                </motion.p>

                {/* Animated text sequence */}
                <div className="h-8 mb-8 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={phase}
                            className="flex items-center gap-2 justify-center"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Dots */}
                            <div className="flex gap-1">
                                {[0, 1, 2].map(i => (
                                    <motion.div
                                        key={i}
                                        className="w-1.5 h-1.5 rounded-full bg-[#E8002D]"
                                        animate={{ opacity: [0.3, 1, 0.3] }}
                                        transition={{
                                            duration: 1,
                                            repeat: Infinity,
                                            delay: i * 0.2,
                                        }}
                                    />
                                ))}
                            </div>
                            <span className="text-xs font-mono tracking-[0.2em] text-white/60 uppercase">
                                {LOADING_PHASES[phase].text}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress bar */}
                <div className="w-full max-w-xs">
                    <div className="h-[2px] w-full bg-white/[0.06] rounded-full overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: 'linear-gradient(90deg, #E8002D, #FF4444)',
                                width: `${progress}%`,
                            }}
                        />
                    </div>
                    <div className="flex justify-between mt-2">
                        <span className="text-[10px] font-mono text-white/20">PROCESSING</span>
                        <span className="text-[10px] font-mono text-white/30">
                            {Math.round(progress)}%
                        </span>
                    </div>
                </div>
            </div>

            {/* Particle burst at end */}
            {progress > 90 && (
                <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.3 }}
                >
                    <img
                        src="/assets/textures/Screenshot 2026-02-11 190514.png"
                        alt=""
                        className="w-full h-full object-cover"
                    />
                </motion.div>
            )}
        </motion.div>
    );
}
