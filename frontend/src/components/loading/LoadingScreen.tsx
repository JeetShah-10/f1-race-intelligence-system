import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
    onComplete: () => void;
    minDisplayTime?: number;
}

/**
 * LoadingScreen - Cinematic F1-style loading intro
 * Inspired by frontend-w.com with percentage counter and smooth transitions
 */
// Status messages that cycle during loading (stable reference outside component)
const STATUS_MESSAGES = [
    'INITIALIZING',
    'LOADING TELEMETRY',
    'SYNCING RACE DATA',
    'CALIBRATING AI MODELS',
    'READY TO RACE'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
    onComplete,
    minDisplayTime = 2500
}) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState('INITIALIZING');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const startTime = Date.now();
        const interval = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min(100, Math.floor((elapsed / minDisplayTime) * 100));

            setProgress(newProgress);

            // Update status text based on progress
            const statusIndex = Math.min(
                Math.floor(newProgress / 25),
                STATUS_MESSAGES.length - 1
            );
            setStatusText(STATUS_MESSAGES[statusIndex]);

            if (newProgress >= 100) {
                clearInterval(interval);
                setTimeout(() => {
                    setIsComplete(true);
                    setTimeout(onComplete, 500);
                }, 300);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [minDisplayTime, onComplete]);

    return (
        <AnimatePresence>
            {!isComplete && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex flex-col items-center justify-center overflow-hidden"
                >
                    {/* Background elements */}
                    <div className="absolute inset-0 overflow-hidden">
                        {/* Speed lines background */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.15 }}
                            transition={{ duration: 1 }}
                            className="absolute inset-0"
                            style={{
                                backgroundImage: "url('/assets/backgrounds/speed-lines.png')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        />

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />

                        {/* Animated glow */}
                        <motion.div
                            animate={{
                                opacity: [0.3, 0.6, 0.3],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-f1-red/30 blur-[150px]"
                        />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col items-center">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="mb-12"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-10 bg-f1-red rounded-sm" />
                                <span className="font-racing text-4xl md:text-5xl font-bold text-white tracking-tight">
                                    APEX
                                </span>
                            </div>
                            <div className="text-white/40 text-xs tracking-[0.3em] mt-2 text-center">
                                RACE INTELLIGENCE
                            </div>
                        </motion.div>

                        {/* Progress percentage */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative mb-8"
                        >
                            <span className="font-stats text-7xl md:text-8xl font-bold text-white">
                                {progress.toString().padStart(2, '0')}
                            </span>
                            <span className="font-stats text-3xl md:text-4xl text-white/50 ml-1">%</span>
                        </motion.div>

                        {/* Progress bar */}
                        <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden mb-6">
                            <motion.div
                                className="h-full bg-gradient-to-r from-f1-red via-neon-orange to-f1-red rounded-full"
                                style={{ width: `${progress}%` }}
                                transition={{ duration: 0.1 }}
                            />
                        </div>

                        {/* Status text with typewriter effect */}
                        <motion.div
                            key={statusText}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <motion.div
                                animate={{ opacity: [1, 0.3, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="w-2 h-2 rounded-full bg-f1-red"
                            />
                            <span className="font-stats text-sm text-white/50 tracking-widest">
                                {statusText}
                            </span>
                        </motion.div>

                        {/* Five lights indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex gap-3 mt-12"
                        >
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div
                                    key={i}
                                    animate={{
                                        backgroundColor: progress >= (i + 1) * 20 ? '#DC0000' : 'rgba(255,255,255,0.1)',
                                        boxShadow: progress >= (i + 1) * 20 ? '0 0 20px rgba(220,0,0,0.5)' : 'none'
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="w-4 h-4 rounded-full"
                                />
                            ))}
                        </motion.div>
                    </div>

                    {/* Bottom corner decoration */}
                    <div className="absolute bottom-6 right-6 text-white/20 font-stats text-xs">
                        2026 SEASON
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LoadingScreen;

