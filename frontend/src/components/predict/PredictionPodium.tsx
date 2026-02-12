import React from 'react';
import { motion } from 'framer-motion';
import type { PredictionDriver } from '../../types/prediction';

interface PredictionPodiumProps {
    drivers: PredictionDriver[];
}

function PodiumBlock({
    driver,
    position,
    delay,
    height,
}: {
    driver: PredictionDriver;
    position: number;
    delay: number;
    height: number;
}) {
    const positionLabel = position === 1 ? '1ST' : position === 2 ? '2ND' : '3RD';
    const positionClass = position === 1 ? 'position-gold' : position === 2 ? 'position-silver' : 'position-bronze';

    return (
        <motion.div
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Driver cutout */}
            <motion.div
                className="relative mb-2"
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: delay + 0.2, duration: 0.5 }}
            >
                <div
                    className="w-20 h-24 sm:w-24 sm:h-28 lg:w-28 lg:h-32 relative overflow-hidden rounded-lg"
                    style={{
                        background: `radial-gradient(ellipse at center bottom, ${driver.teamColor}30, transparent 70%)`,
                    }}
                >
                    <img
                        src={driver.driverCutout}
                        alt={driver.driverName}
                        className="absolute inset-0 w-full h-full object-cover object-top"
                        onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                </div>
                {/* Team color glow */}
                <div
                    className="absolute -inset-2 rounded-xl opacity-20 blur-xl -z-10"
                    style={{ background: driver.teamColor }}
                />
            </motion.div>

            {/* Driver info */}
            <div className="text-center mb-2">
                <p className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                    {driver.driverName}
                </p>
                <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: driver.teamColor }} />
                    <span className="text-[10px] font-mono text-white/40">{driver.teamName}</span>
                </div>
            </div>

            {/* Podium block */}
            <motion.div
                className="w-24 sm:w-28 lg:w-32 rounded-t-lg relative overflow-hidden"
                style={{ height }}
                initial={{ height: 0 }}
                animate={{ height }}
                transition={{ delay: delay - 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        background: `linear-gradient(to top, ${driver.teamColor}25, ${driver.teamColor}08)`,
                        borderTop: `2px solid ${driver.teamColor}`,
                    }}
                />
                {/* Position number */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span
                        className={`text-3xl sm:text-4xl lg:text-5xl font-black ${positionClass}`}
                        style={{ fontFamily: '"Raceline Demo", sans-serif' }}
                    >
                        {position}
                    </span>
                </div>
                {/* Position label */}
                <div className="absolute bottom-2 left-0 right-0 text-center">
                    <span className="text-[9px] font-mono tracking-[0.2em] text-white/30">
                        {positionLabel}
                    </span>
                </div>
            </motion.div>

            {/* Gap */}
            <div className="mt-2">
                <span className="text-[10px] font-mono text-white/30">
                    {driver.gap}
                </span>
            </div>
        </motion.div>
    );
}

export default function PredictionPodium({ drivers }: PredictionPodiumProps) {
    if (drivers.length < 3) return null;

    const [p1, p2, p3] = drivers;

    return (
        <div className="relative py-6 sm:py-8">
            {/* Background texture */}
            <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: `url('/assets/textures/Screenshot 2026-02-11 190041.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Section label */}
            <div className="flex items-center gap-2 mb-6 px-4">
                <div className="h-[2px] w-5 bg-[#E8002D]" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">Predicted Podium</span>
            </div>

            {/* Podium arrangement: P2 | P1 | P3 */}
            <div className="flex items-end justify-center gap-3 sm:gap-4 lg:gap-6">
                <PodiumBlock driver={p2} position={2} delay={0.4} height={100} />
                <PodiumBlock driver={p1} position={1} delay={0.1} height={140} />
                <PodiumBlock driver={p3} position={3} delay={0.6} height={80} />
            </div>
        </div>
    );
}
