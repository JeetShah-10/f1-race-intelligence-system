import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldAlert, Timer, Swords, Gauge, Sun, Cloud, CloudRain } from 'lucide-react';
import type { PredictionInsight } from '../../types/prediction';

interface PredictionInsightsPanelProps {
    insights: PredictionInsight[];
}

const ICON_MAP: Record<string, React.ElementType> = {
    Brain, ShieldAlert, Timer, Swords, Gauge, Sun, Cloud, CloudRain,
};

const cardVariants = {
    hidden: { opacity: 0, y: 16, scale: 0.97 },
    visible: (i: number) => ({
        opacity: 1, y: 0, scale: 1,
        transition: {
            delay: 0.8 + i * 0.1,
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
        },
    }),
};

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const duration = 1500;
        const startTime = Date.now();

        const tick = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            setCount(current);

            if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
    }, [target]);

    return <>{count}{suffix}</>;
}

function RingChart({ percentage, color, size = 60 }: { percentage: number; color: string; size?: number }) {
    const strokeWidth = 3;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
            />
            <motion.circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: offset }}
                transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
            />
        </svg>
    );
}

function InsightCard({ insight, index }: { insight: PredictionInsight; index: number }) {
    const IconComponent = ICON_MAP[insight.icon] || Brain;
    const isConfidence = insight.type === 'confidence';
    const isSafetyCar = insight.type === 'safety_car';
    const isBattle = insight.type === 'battle';

    return (
        <motion.div
            custom={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`
                prediction-glass rounded-xl p-4 relative overflow-hidden
                ${isConfidence ? 'row-span-2' : ''}
            `}
        >
            {/* Background accent for confidence card */}
            {isConfidence && (
                <div
                    className="absolute inset-0 opacity-[0.04] pointer-events-none"
                    style={{
                        backgroundImage: `url('/assets/textures/Screenshot 2026-02-11 202444.png')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center gap-2 mb-3">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: `${insight.color}15` }}
                    >
                        <IconComponent className="w-3.5 h-3.5" style={{ color: insight.color }} />
                    </div>
                    <span className="text-[10px] font-mono tracking-[0.15em] text-white/35 uppercase">
                        {insight.label}
                    </span>
                </div>

                {/* Content — varies by type */}
                {isConfidence ? (
                    <div className="flex items-center gap-4">
                        <RingChart percentage={insight.numericValue} color={insight.color} size={64} />
                        <div>
                            <span
                                className="text-3xl font-black text-white"
                                style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                            >
                                <AnimatedCounter target={insight.numericValue} suffix="%" />
                            </span>
                            <p className="text-[10px] text-white/25 mt-1">Prediction accuracy</p>
                        </div>
                    </div>
                ) : isSafetyCar ? (
                    <div className="flex items-center gap-3">
                        <RingChart percentage={insight.numericValue} color={insight.color} size={48} />
                        <span
                            className="text-xl font-bold text-white"
                            style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                        >
                            <AnimatedCounter target={insight.numericValue} suffix="%" />
                        </span>
                    </div>
                ) : isBattle ? (
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: insight.primaryTeamColor }} />
                            <span className="text-sm font-bold text-white">{insight.primaryDriver}</span>
                        </div>
                        <span className="text-[10px] text-white/20 font-mono">VS</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 rounded-full" style={{ background: insight.secondaryTeamColor }} />
                            <span className="text-sm font-bold text-white">{insight.secondaryDriver}</span>
                        </div>
                    </div>
                ) : (
                    <span
                        className="text-lg font-bold text-white"
                        style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                    >
                        {insight.value}
                    </span>
                )}
            </div>
        </motion.div>
    );
}

export default function PredictionInsightsPanel({ insights }: PredictionInsightsPanelProps) {
    return (
        <div className="w-full">
            {/* Section label */}
            <div className="flex items-center gap-2 mb-4 px-1">
                <div className="h-[2px] w-5 bg-[#E8002D]" />
                <span className="text-[10px] font-mono tracking-[0.3em] text-white/30 uppercase">
                    AI Insights
                </span>
            </div>

            {/* Bento grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {insights.map((insight, i) => (
                    <InsightCard key={insight.type} insight={insight} index={i} />
                ))}
            </div>
        </div>
    );
}
