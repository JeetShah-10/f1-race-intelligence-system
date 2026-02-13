import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, selectRivalries, selectStandings } from '../../../store/useDashboardStore';
import { GlassCard } from '../../ui/GlassCard';

const teamColors: Record<string, string> = {
    'Red Bull Racing': '#3671C6',
    'Ferrari': '#E8002D',
    'McLaren': '#FF8000',
    'Mercedes': '#27F4D2',
    'Aston Martin': '#229971',
    'Alpine': '#0093CC',
    'Williams': '#64C4FF',
    'Racing Bulls': '#6692FF',
    'Audi': '#000000',
    'Haas': '#B6BABD',
    'Cadillac': '#1E3264'
};

const variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 100 : -100,
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)'
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)'
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 100 : -100,
        opacity: 0,
        scale: 0.95,
        filter: 'blur(10px)'
    })
};
export const RivalryCards: React.FC = () => {
    const rivalries = useDashboardStore(selectRivalries) || [];
    const standings = useDashboardStore(selectStandings) || [];
    const topRivalries = rivalries.slice(0, 5);

    if (!topRivalries || topRivalries.length === 0) {
        return (
            <GlassCard className="h-full flex items-center justify-center" blur="sm" padding="none">
                <div className="flex flex-col items-center gap-2 text-white/30">
                    <span className="text-2xl"></span>
                    <span className="text-sm font-medium">No active rivalries</span>
                </div>
            </GlassCard>
        );
    }

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const getDriver = (code: string) => standings.find(d => d.code === code);

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(() => {
            paginate(1);
        }, 6000);
        return () => clearInterval(timer);
    }, [index, isHovered]);

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setIndex((prev) => (prev + newDirection + topRivalries.length) % topRivalries.length);
    };

    const rivalry = topRivalries[index];
    const d1 = getDriver(rivalry.pair[0]);
    const d2 = getDriver(rivalry.pair[1]);
    const c1 = teamColors[d1?.team || ''] || '#666';
    const c2 = teamColors[d2?.team || ''] || '#666';

    return (
        <GlassCard
            className="h-full group"
            blur="sm"
            padding="none"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col h-full w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 z-20 px-4 py-3 border-b border-white/[0.08] flex items-center justify-between bg-black/20 backdrop-blur-md">
                    <h3 className="text-white/90 font-racing text-sm flex items-center gap-2 tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E10600] animate-pulse shadow-[0_0_8px_rgba(225,6,0,0.8)]" />
                        KEY RIVALRIES
                    </h3>

                    <div className="flex gap-1.5">
                        {topRivalries.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    setDirection(i > index ? 1 : -1);
                                    setIndex(i);
                                }}
                                className={`h-1 rounded-full transition-all duration-300 ${i === index ? 'w-4 bg-[#E10600] shadow-[0_0_6px_rgba(225,6,0,0.6)]' : 'w-1 bg-white/20 hover:bg-white/40'}`}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={index}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                                scale: { duration: 0.2 },
                                filter: { duration: 0.2 }
                            }}
                            className="absolute inset-0 flex"
                        >
                            <div className="absolute inset-0 z-0">
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        background: `linear-gradient(115deg, ${c1} 0%, transparent 45%, transparent 55%, ${c2} 100%)`
                                    }}
                                />
                                <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.03] mix-blend-overlay" />
                                <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ background: c1 }} />
                                <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-[100px] opacity-20" style={{ background: c2 }} />
                            </div>

                            <div className="relative z-10 w-full h-full grid grid-cols-[1fr_auto_1fr] items-end pb-8 md:pb-0 md:items-center px-2 md:px-8 gap-2 md:gap-8">
                                <div className="flex flex-col items-center md:items-end text-center md:text-right relative">
                                    <div className="relative mb-2 md:mb-4 group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ background: c1 }} />
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
                                            style={{ borderColor: `${c1}40` }}>
                                            {d1?.image ? (
                                                <img src={d1.image} alt={d1.code} className="w-full h-full object-cover object-top" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-2xl font-bold">{d1?.code}</div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full border-2 border-[#0D0D10]"
                                            style={{ background: c1 }} />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white leading-none">
                                        {d1?.code}
                                    </h2>
                                    <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-white/40 mt-1">
                                        {d1?.team}
                                    </p>
                                </div>

                                <div className="flex flex-col items-center justify-center relative -mt-12 md:mt-0">
                                    <div className="absolute inset-x-[-100px] top-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                    <div className="relative z-10 bg-[#0D0D10]/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-lg transform -skew-x-12 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                        <span className="block text-xl md:text-2xl font-black text-white italic transform skew-x-12 relative">
                                            VS
                                            <span className="absolute inset-0 text-red-500 opacity-50 blur-[1px] ml-[1px]">VS</span>
                                            <span className="absolute inset-0 text-blue-500 opacity-50 blur-[1px] -ml-[1px]">VS</span>
                                        </span>
                                    </div>
                                    <div className="mt-4 px-3 py-1 rounded bg-white/5 border border-white/5 backdrop-blur text-[10px] md:text-xs text-white/60 font-mono tracking-widest text-center">
                                        {rivalry.metric}
                                    </div>
                                    <div className="mt-1 text-lg font-bold text-white tabular-nums tracking-tight">
                                        {rivalry.value}
                                    </div>
                                </div>

                                <div className="flex flex-col items-center md:items-start text-center md:text-left relative">
                                    <div className="relative mb-2 md:mb-4 group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 rounded-full blur-xl opacity-20" style={{ background: c2 }} />
                                        <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl"
                                            style={{ borderColor: `${c2}40` }}>
                                            {d2?.image ? (
                                                <img src={d2.image} alt={d2.code} className="w-full h-full object-cover object-top" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-2xl font-bold">{d2?.code}</div>
                                            )}
                                        </div>
                                        <div className="absolute -bottom-2 -left-2 w-6 h-6 rounded-full border-2 border-[#0D0D10]"
                                            style={{ background: c2 }} />
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-black italic tracking-tighter text-white leading-none">
                                        {d2?.code}
                                    </h2>
                                    <p className="text-xs md:text-sm font-bold tracking-widest uppercase text-white/40 mt-1">
                                        {d2?.team}
                                    </p>
                                </div>
                            </div>

                            {rivalry.narrative && (
                                <div className="absolute bottom-6 left-0 right-0 text-center px-12 z-20">
                                    <p className="text-white/50 text-xs md:text-sm italic font-medium leading-relaxed max-w-md mx-auto line-clamp-2">
                                        "{rivalry.narrative}"
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="absolute inset-y-0 left-0 w-16 z-20 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => paginate(-1)}
                        className="p-2 rounded-full bg-white/5 hover:bg-[#E10600]/20 border border-white/5 hover:border-[#E10600]/30 backdrop-blur text-white/70 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                </div>

                <div className="absolute inset-y-0 right-0 w-16 z-20 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => paginate(1)}
                        className="p-2 rounded-full bg-white/5 hover:bg-[#E10600]/20 border border-white/5 hover:border-[#E10600]/30 backdrop-blur text-white/70 hover:text-white transition-all transform hover:scale-110 active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </GlassCard>
    );
};

export default RivalryCards;
