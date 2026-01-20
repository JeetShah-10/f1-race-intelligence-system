import { motion } from 'framer-motion';
import { useState } from 'react';

const SECTOR_TIMES = [
    { driver: 'VER', s1: '28.234', s1Status: 'purple', s2: '35.123', s2Status: 'green', s3: '29.099', s3Status: 'yellow' },
    { driver: 'NOR', s1: '28.456', s1Status: 'green', s2: '35.089', s2Status: 'purple', s3: '29.243', s3Status: 'green' },
    { driver: 'LEC', s1: '28.567', s1Status: 'yellow', s2: '35.234', s2Status: 'yellow', s3: '29.100', s3Status: 'purple' },
    { driver: 'SAI', s1: '28.678', s1Status: 'yellow', s2: '35.345', s2Status: 'green', s3: '29.189', s3Status: 'green' },
];

const CONSTRUCTOR_STANDINGS = [
    { pos: 1, team: 'Red Bull Racing', color: '#3671C6', points: 512, bars: 100 },
    { pos: 2, team: 'McLaren', color: '#FF8000', points: 478, bars: 93 },
    { pos: 3, team: 'Ferrari', color: '#E8002D', points: 412, bars: 80 },
    { pos: 4, team: 'Mercedes', color: '#27F4D2', points: 356, bars: 70 },
    { pos: 5, team: 'Aston Martin', color: '#229971', points: 234, bars: 46 },
];

const RACE_EVENTS = [
    { lap: 42, time: '14:32:15', type: 'flag', message: 'GREEN FLAG - Racing resumes', color: '#00FF00' },
    { lap: 38, time: '14:28:03', type: 'sc', message: 'SAFETY CAR DEPLOYED - Debris on track', color: '#FFD700' },
    { lap: 35, time: '14:24:45', type: 'pit', message: 'VER pits - 2.4s stop - Hard tyres', color: '#3671C6' },
    { lap: 32, time: '14:21:22', type: 'overtake', message: 'NOR passes LEC for P2 at Turn 4', color: '#FF8000' },
    { lap: 28, time: '14:17:10', type: 'fastest', message: 'VER sets fastest lap - 1:32.456', color: '#A020F0' },
];

const STATUS_COLORS = {
    purple: '#A855F7', // Personal best
    green: '#22C55E',  // Improvement
    yellow: '#EAB308', // Slower
};

export function RaceControlHub() {
    const [activeTab, setActiveTab] = useState<'sectors' | 'standings'>('sectors');

    return (
        <section className="relative w-full py-20 bg-gradient-to-b from-[#0a0a0f] to-[#0f0f18] overflow-hidden">
            {/* Grid overlay */}
            <div className="absolute inset-0 opacity-[0.02]" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }} />

            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <span className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase">Race Control</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white tracking-tight">
                            COMMAND <span className="text-white/30">CENTER</span>
                        </h2>
                    </div>

                    {/* Current Flag Status */}
                    <div className="hidden md:flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/40 rounded">
                            <div className="w-6 h-4 bg-green-500" />
                            <span className="text-green-500 font-bold text-sm">GREEN FLAG</span>
                        </div>
                        <div className="text-right">
                            <div className="text-white/40 text-xs">SESSION TIME</div>
                            <div className="text-white font-mono text-lg">1:42:15</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-12 gap-6">

                    {/* RACE FEED - Left */}
                    <div className="col-span-12 lg:col-span-4">
                        <div className="bg-[#111118]/80 backdrop-blur border border-white/10 rounded-sm h-full">
                            <div className="px-4 py-3 border-b border-white/10 flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-white font-bold text-sm">LIVE RACE FEED</span>
                            </div>

                            <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto">
                                {RACE_EVENTS.map((event, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex gap-3 pb-3 border-b border-white/5 last:border-0"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="text-white/40 text-[10px]">L{event.lap}</span>
                                            <div
                                                className="w-2 h-2 rounded-full mt-1"
                                                style={{ backgroundColor: event.color }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="text-white/40 text-[10px] mb-0.5">{event.time}</div>
                                            <div className="text-white text-sm">{event.message}</div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* CENTER PANEL */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">

                        {/* Tab Switcher */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('sectors')}
                                className={`px-4 py-2 text-sm font-bold tracking-wide transition-colors ${activeTab === 'sectors'
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                            >
                                SECTOR TIMES
                            </button>
                            <button
                                onClick={() => setActiveTab('standings')}
                                className={`px-4 py-2 text-sm font-bold tracking-wide transition-colors ${activeTab === 'standings'
                                    ? 'bg-white text-black'
                                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                                    }`}
                            >
                                CONSTRUCTOR STANDINGS
                            </button>
                        </div>

                        {/* Sector Times Panel */}
                        {activeTab === 'sectors' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#111118]/80 backdrop-blur border border-white/10 rounded-sm overflow-hidden"
                            >
                                {/* Header Row */}
                                <div className="grid grid-cols-4 gap-4 px-4 py-3 bg-white/5 text-xs text-white/40 font-bold">
                                    <div>DRIVER</div>
                                    <div className="text-center">SECTOR 1</div>
                                    <div className="text-center">SECTOR 2</div>
                                    <div className="text-center">SECTOR 3</div>
                                </div>

                                {/* Data Rows */}
                                {SECTOR_TIMES.map((row, i) => (
                                    <motion.div
                                        key={row.driver}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.1 }}
                                        className="grid grid-cols-4 gap-4 px-4 py-3 border-t border-white/5 items-center"
                                    >
                                        <div className="font-bold text-white">{row.driver}</div>
                                        <div className="text-center">
                                            <span
                                                className="font-mono px-2 py-1 rounded text-sm"
                                                style={{
                                                    backgroundColor: `${STATUS_COLORS[row.s1Status as keyof typeof STATUS_COLORS]}20`,
                                                    color: STATUS_COLORS[row.s1Status as keyof typeof STATUS_COLORS]
                                                }}
                                            >
                                                {row.s1}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span
                                                className="font-mono px-2 py-1 rounded text-sm"
                                                style={{
                                                    backgroundColor: `${STATUS_COLORS[row.s2Status as keyof typeof STATUS_COLORS]}20`,
                                                    color: STATUS_COLORS[row.s2Status as keyof typeof STATUS_COLORS]
                                                }}
                                            >
                                                {row.s2}
                                            </span>
                                        </div>
                                        <div className="text-center">
                                            <span
                                                className="font-mono px-2 py-1 rounded text-sm"
                                                style={{
                                                    backgroundColor: `${STATUS_COLORS[row.s3Status as keyof typeof STATUS_COLORS]}20`,
                                                    color: STATUS_COLORS[row.s3Status as keyof typeof STATUS_COLORS]
                                                }}
                                            >
                                                {row.s3}
                                            </span>
                                        </div>
                                    </motion.div>
                                ))}

                                {/* Legend */}
                                <div className="px-4 py-3 bg-white/5 flex gap-6 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: STATUS_COLORS.purple }} />
                                        <span className="text-white/60">Personal Best</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: STATUS_COLORS.green }} />
                                        <span className="text-white/60">Improvement</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded" style={{ backgroundColor: STATUS_COLORS.yellow }} />
                                        <span className="text-white/60">Slower</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Constructor Standings Panel */}
                        {activeTab === 'standings' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-[#111118]/80 backdrop-blur border border-white/10 rounded-sm p-4"
                            >
                                <div className="space-y-4">
                                    {CONSTRUCTOR_STANDINGS.map((team, i) => (
                                        <motion.div
                                            key={team.team}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex items-center gap-4"
                                        >
                                            <span className="text-white/40 font-mono w-6">{team.pos}</span>
                                            <div
                                                className="w-1 h-8 rounded-full"
                                                style={{ backgroundColor: team.color }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-white font-bold text-sm">{team.team}</span>
                                                    <span className="text-white font-mono">{team.points} PTS</span>
                                                </div>
                                                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        whileInView={{ width: `${team.bars}%` }}
                                                        viewport={{ once: true }}
                                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                                        className="h-full rounded-full"
                                                        style={{ backgroundColor: team.color }}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { label: 'FASTEST LAP', value: '1:32.456', sub: 'VER - Lap 28', color: '#A855F7' },
                                { label: 'TOP SPEED', value: '342.7', sub: 'km/h - NOR', color: '#22C55E' },
                                { label: 'PIT STOPS', value: '24', sub: 'Total this race', color: '#EAB308' },
                                { label: 'OVERTAKES', value: '38', sub: 'On track passes', color: '#3B82F6' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={stat.label}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-[#111118]/80 backdrop-blur border border-white/10 rounded-sm p-4"
                                >
                                    <div className="text-[10px] text-white/40 mb-1">{stat.label}</div>
                                    <div className="text-2xl font-mono font-bold" style={{ color: stat.color }}>
                                        {stat.value}
                                    </div>
                                    <div className="text-xs text-white/40 mt-1">{stat.sub}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
