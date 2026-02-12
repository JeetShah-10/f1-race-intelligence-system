import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, ChevronRight, ArrowLeft } from 'lucide-react';
import { PREDICTION_CIRCUITS } from '../../data/predictionMockData';
import { getCountryFlag } from '../../data/predictionMockData';
import type { Circuit2026 } from '../../data/f1-data';

interface CircuitCalendarGridProps {
    onSelectCircuit: (circuit: Circuit2026) => void;
}

const RACE_DATES: Record<string, string> = {
    'albert-park': 'MAR 16', 'shanghai': 'MAR 23', 'suzuka': 'APR 06',
    'sakhir': 'APR 13', 'jeddah': 'APR 20', 'miami': 'MAY 04',
    'montreal': 'MAY 18', 'monaco': 'MAY 25', 'catalunya': 'JUN 01',
    'red-bull-ring': 'JUN 15', 'silverstone': 'JUN 29', 'spa': 'JUL 13',
    'hungaroring': 'JUL 27', 'zandvoort': 'AUG 03', 'monza': 'AUG 31',
    'ifema-madrid': 'SEP 14', 'baku': 'SEP 21', 'marina-bay': 'OCT 05',
    'cota': 'OCT 19', 'mexico-city': 'OCT 26', 'interlagos': 'NOV 09',
    'las-vegas': 'NOV 22', 'lusail': 'NOV 30', 'yas-marina': 'DEC 07',
};

const NEXT_RACE_ID = 'sakhir';

const containerVariants = {
    hidden: {},
    visible: {
        transition: { staggerChildren: 0.04 },
    },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    visible: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as const },
    },
};

export default function CircuitCalendarGrid({ onSelectCircuit }: CircuitCalendarGridProps) {
    const [search, setSearch] = useState('');
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const circuits = useMemo(() => {
        if (!search.trim()) return PREDICTION_CIRCUITS;
        const q = search.toLowerCase();
        return PREDICTION_CIRCUITS.filter(c =>
            c.name.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q) ||
            c.location.toLowerCase().includes(q)
        );
    }, [search]);

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6">
            {/* Header */}
            <div className="mb-8 sm:mb-10">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 text-white/40 hover:text-white mb-6 transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-mono tracking-wider uppercase">Back to Dashboard</span>
                </Link>

                <div className="flex items-center gap-3 mb-2">
                    <div className="h-[2px] w-8 bg-[#E8002D]" />
                    <span className="text-xs font-mono tracking-[0.3em] text-white/40 uppercase">2026 Season</span>
                </div>
                <h1
                    className="text-3xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white mb-3"
                    style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                >
                    Race Predictions
                </h1>
                <p className="text-sm sm:text-base text-white/40 max-w-xl">
                    Select a Grand Prix to generate AI-powered race predictions with driver classification, strategy analysis, and key insights.
                </p>
            </div>

            {/* Search */}
            <div className="relative mb-6 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                    type="text"
                    placeholder="Search circuits..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-white/20 transition-colors"
                />
            </div>

            {/* Grid */}
            <motion.div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {circuits.map(circuit => {
                    const isNext = circuit.id === NEXT_RACE_ID;
                    const isHovered = hoveredId === circuit.id;
                    const flag = getCountryFlag(circuit.countryCode);
                    const date = RACE_DATES[circuit.id] || '';

                    return (
                        <motion.button
                            key={circuit.id}
                            variants={cardVariants}
                            onClick={() => onSelectCircuit(circuit)}
                            onMouseEnter={() => setHoveredId(circuit.id)}
                            onMouseLeave={() => setHoveredId(null)}
                            className={`
                                relative overflow-hidden rounded-xl text-left
                                transition-all duration-300 cursor-pointer group
                                ${isNext ? 'sm:col-span-2 pulse-glow' : ''}
                            `}
                            style={{
                                background: 'rgba(255,255,255,0.02)',
                                border: `1px solid ${isNext ? 'rgba(232,0,45,0.3)' : isHovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.05)'}`,
                            }}
                            whileHover={{ scale: 1.015 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Circuit Image */}
                            <div className={`relative ${isNext ? 'h-44 sm:h-52' : 'h-36 sm:h-40'} overflow-hidden`}>
                                <img
                                    src={circuit.images.photo}
                                    alt={circuit.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

                                {/* Round badge */}
                                <div className="absolute top-3 left-3">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider bg-black/60 border border-white/10 text-white/60">
                                        R{String(circuit.round).padStart(2, '0')}
                                    </span>
                                </div>

                                {/* Next Race badge */}
                                {isNext && (
                                    <div className="absolute top-3 right-3">
                                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase bg-[#E8002D] text-white pulse-badge">
                                            Next Race
                                        </span>
                                    </div>
                                )}

                                {/* Team color accent bar */}
                                <div
                                    className="absolute left-0 top-0 bottom-0 w-[3px]"
                                    style={{ background: `linear-gradient(to bottom, #E8002D, transparent)` }}
                                />
                            </div>

                            {/* Content */}
                            <div className="p-3 sm:p-4">
                                <h3
                                    className="text-sm sm:text-base font-bold text-white mb-1 truncate"
                                    style={{ fontFamily: '"NeoSpeed", sans-serif' }}
                                >
                                    {circuit.name}
                                </h3>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-xs text-white/40">
                                        <MapPin className="w-3 h-3" />
                                        <span>{flag} {circuit.location}, {circuit.country}</span>
                                    </div>
                                    {date && (
                                        <div className="flex items-center gap-1 text-[10px] font-mono text-white/30">
                                            <Calendar className="w-3 h-3" />
                                            {date}
                                        </div>
                                    )}
                                </div>

                                {/* Circuit stats (shown on next race or hover) */}
                                {(isNext || isHovered) && (
                                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-white/[0.06]">
                                        <span className="text-[10px] font-mono text-white/30">{circuit.laps} laps</span>
                                        <span className="text-[10px] font-mono text-white/30">{circuit.lapDistance}km</span>
                                        <div className="ml-auto">
                                            <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-[#E8002D] transition-colors" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.button>
                    );
                })}
            </motion.div>

            {circuits.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-white/30 text-sm">No circuits match your search.</p>
                </div>
            )}
        </div>
    );
}
