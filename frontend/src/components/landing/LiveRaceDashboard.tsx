import { motion } from 'framer-motion';
import { useState } from 'react';

const DRIVERS = [
    { pos: 1, code: 'VER', name: 'Verstappen', team: 'Red Bull', color: '#3671C6', gap: 'LEADER', lastLap: '1:32.456', tire: 'M', stint: 18, delta: '+0.0' },
    { pos: 2, code: 'NOR', name: 'Norris', team: 'McLaren', color: '#FF8000', gap: '+2.341', lastLap: '1:32.788', tire: 'M', stint: 18, delta: '-0.2' },
    { pos: 3, code: 'LEC', name: 'Leclerc', team: 'Ferrari', color: '#E8002D', gap: '+5.892', lastLap: '1:32.901', tire: 'H', stint: 24, delta: '+0.1' },
    { pos: 4, code: 'SAI', name: 'Sainz', team: 'Ferrari', color: '#E8002D', gap: '+8.234', lastLap: '1:33.012', tire: 'H', stint: 24, delta: '+0.3' },
    { pos: 5, code: 'HAM', name: 'Hamilton', team: 'Mercedes', color: '#27F4D2', gap: '+12.456', lastLap: '1:33.234', tire: 'M', stint: 15, delta: '-0.4' },
    { pos: 6, code: 'RUS', name: 'Russell', team: 'Mercedes', color: '#27F4D2', gap: '+15.789', lastLap: '1:33.345', tire: 'M', stint: 15, delta: '+0.0' },
    { pos: 7, code: 'PIA', name: 'Piastri', team: 'McLaren', color: '#FF8000', gap: '+22.123', lastLap: '1:33.567', tire: 'H', stint: 28, delta: '+0.5' },
    { pos: 8, code: 'ALO', name: 'Alonso', team: 'Aston Martin', color: '#229971', gap: '+28.456', lastLap: '1:33.789', tire: 'H', stint: 28, delta: '+0.2' },
];

// Tire compound colors
const TIRE_COLORS = {
    S: '#FF3333', // Soft - Red
    M: '#FFD700', // Medium - Yellow  
    H: '#FFFFFF', // Hard - White
    I: '#00FF00', // Inter - Green
    W: '#00BFFF', // Wet - Blue
};

export function LiveRaceDashboard() {
    const [selectedDriver, setSelectedDriver] = useState('VER');

    return (
        <section className="relative w-full py-20 bg-[#0a0a0f] overflow-hidden">
            {/* Section Header */}
            <div className="container mx-auto px-6 mb-12">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    <span className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase">Live Session</span>
                </div>
                <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                    RACE INTELLIGENCE <span className="text-white/30">DASHBOARD</span>
                </h2>
                <p className="text-white/40 mt-3 max-w-2xl">
                    Experience F1 data visualization with professional telemetry, timing, and strategy analysis tools.
                </p>
            </div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-12 gap-4">

                    {/* TIMING TOWER - Left Column */}
                    <div className="col-span-12 lg:col-span-3">
                        <div className="bg-[#111118] border border-white/10 rounded-sm overflow-hidden">
                            {/* Header */}
                            <div className="bg-[#1a1a24] px-4 py-3 border-b border-white/10 flex justify-between items-center">
                                <span className="text-white font-bold text-sm tracking-wide">TIMING TOWER</span>
                                <span className="text-white/40 text-xs">LAP 42/57</span>
                            </div>

                            {/* Driver Rows */}
                            <div className="divide-y divide-white/5">
                                {DRIVERS.map((driver) => (
                                    <motion.div
                                        key={driver.code}
                                        onClick={() => setSelectedDriver(driver.code)}
                                        className={`px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors ${selectedDriver === driver.code ? 'bg-white/10' : 'hover:bg-white/5'
                                            }`}
                                        whileHover={{ x: 2 }}
                                    >
                                        {/* Position */}
                                        <span className="w-6 text-center font-mono text-white font-bold text-sm">
                                            {driver.pos}
                                        </span>

                                        {/* Team Color Bar */}
                                        <div
                                            className="w-1 h-8 rounded-full"
                                            style={{ backgroundColor: driver.color }}
                                        />

                                        {/* Driver Code */}
                                        <span className="font-bold text-white text-sm tracking-wide w-12">
                                            {driver.code}
                                        </span>

                                        {/* Tire Compound */}
                                        <div
                                            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                                            style={{
                                                backgroundColor: TIRE_COLORS[driver.tire as keyof typeof TIRE_COLORS],
                                                color: driver.tire === 'H' ? '#000' : '#fff'
                                            }}
                                        >
                                            {driver.tire}
                                        </div>

                                        {/* Gap */}
                                        <span className={`ml-auto font-mono text-xs ${driver.gap === 'LEADER' ? 'text-white' : 'text-white/60'
                                            }`}>
                                            {driver.gap}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* MAIN CONTENT - Center */}
                    <div className="col-span-12 lg:col-span-6 space-y-4">

                        {/* Telemetry Comparison */}
                        <div className="bg-[#111118] border border-white/10 rounded-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white font-bold text-sm">TELEMETRY COMPARISON</span>
                                <div className="flex gap-4 text-xs">
                                    <span className="text-[#3671C6]">VER</span>
                                    <span className="text-[#FF8000]">NOR</span>
                                </div>
                            </div>

                            {/* Speed Trace SVG */}
                            <div className="h-32 relative">
                                <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
                                    {/* Grid lines */}
                                    {[0, 25, 50, 75, 100].map((y) => (
                                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="rgba(255,255,255,0.05)" />
                                    ))}

                                    {/* VER Speed Trace */}
                                    <motion.path
                                        d="M0,80 L50,20 L100,85 L150,15 L200,75 L250,25 L300,80 L350,30 L400,70"
                                        fill="none"
                                        stroke="#3671C6"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5 }}
                                    />

                                    {/* NOR Speed Trace */}
                                    <motion.path
                                        d="M0,82 L50,25 L100,82 L150,20 L200,78 L250,28 L300,78 L350,35 L400,72"
                                        fill="none"
                                        stroke="#FF8000"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.2 }}
                                    />
                                </svg>

                                {/* Labels */}
                                <div className="absolute left-0 top-0 text-[10px] text-white/40">340 km/h</div>
                                <div className="absolute left-0 bottom-0 text-[10px] text-white/40">80 km/h</div>
                            </div>

                            {/* Throttle/Brake Bars */}
                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-white/40">THROTTLE</span>
                                        <span className="text-green-500">92%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-green-600 to-green-400"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: '92%' }}
                                            viewport={{ once: true }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-white/40">BRAKE</span>
                                        <span className="text-red-500">0%</span>
                                    </div>
                                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-red-600 to-red-400 w-0" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Gap Chart */}
                        <div className="bg-[#111118] border border-white/10 rounded-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-white font-bold text-sm">GAP TO LEADER</span>
                                <span className="text-white/40 text-xs">Last 10 laps</span>
                            </div>

                            <div className="h-24 relative">
                                <svg className="w-full h-full" viewBox="0 0 400 80" preserveAspectRatio="none">
                                    {/* Area fill for NOR */}
                                    <motion.path
                                        d="M0,10 L40,12 L80,15 L120,18 L160,20 L200,22 L240,25 L280,26 L320,27 L360,28 L400,30 L400,80 L0,80 Z"
                                        fill="url(#gapGradient)"
                                        initial={{ opacity: 0 }}
                                        whileInView={{ opacity: 1 }}
                                        viewport={{ once: true }}
                                    />
                                    <defs>
                                        <linearGradient id="gapGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#FF8000" stopOpacity="0.3" />
                                            <stop offset="100%" stopColor="#FF8000" stopOpacity="0" />
                                        </linearGradient>
                                    </defs>

                                    {/* NOR gap line */}
                                    <motion.path
                                        d="M0,10 L40,12 L80,15 L120,18 L160,20 L200,22 L240,25 L280,26 L320,27 L360,28 L400,30"
                                        fill="none"
                                        stroke="#FF8000"
                                        strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1 }}
                                    />
                                </svg>

                                <div className="absolute right-2 top-6 text-sm font-mono text-[#FF8000]">+2.3s</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="col-span-12 lg:col-span-3 space-y-4">

                        {/* Strategy Timeline */}
                        <div className="bg-[#111118] border border-white/10 rounded-sm p-4">
                            <span className="text-white font-bold text-sm block mb-4">PIT STRATEGY</span>

                            {/* VER Strategy */}
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#3671C6' }} />
                                    <span className="text-white text-xs font-bold">VER</span>
                                </div>
                                <div className="flex h-4 bg-white/5 rounded overflow-hidden">
                                    <div className="bg-[#FF3333] flex-[18]" title="Soft" />
                                    <div className="w-0.5 bg-black" />
                                    <div className="bg-[#FFD700] flex-[24]" title="Medium" />
                                </div>
                                <div className="flex justify-between text-[10px] text-white/30 mt-1">
                                    <span>L1</span>
                                    <span>L18 PIT</span>
                                    <span>L42</span>
                                </div>
                            </div>

                            {/* NOR Strategy */}
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#FF8000' }} />
                                    <span className="text-white text-xs font-bold">NOR</span>
                                </div>
                                <div className="flex h-4 bg-white/5 rounded overflow-hidden">
                                    <div className="bg-[#FFD700] flex-[22]" title="Medium" />
                                    <div className="w-0.5 bg-black" />
                                    <div className="bg-[#FFD700] flex-[20]" title="Medium" />
                                </div>
                                <div className="flex justify-between text-[10px] text-white/30 mt-1">
                                    <span>L1</span>
                                    <span>L22 PIT</span>
                                    <span>L42</span>
                                </div>
                            </div>
                        </div>

                        {/* Tire Degradation */}
                        <div className="bg-[#111118] border border-white/10 rounded-sm p-4">
                            <span className="text-white font-bold text-sm block mb-4">TIRE WEAR</span>

                            <div className="grid grid-cols-2 gap-3">
                                {['FL', 'FR', 'RL', 'RR'].map((tire, i) => (
                                    <div key={tire} className="text-center">
                                        <div className="text-[10px] text-white/40 mb-1">{tire}</div>
                                        <div
                                            className="w-10 h-10 mx-auto rounded-full border-2 flex items-center justify-center"
                                            style={{
                                                borderColor: `hsl(${60 - i * 8}, 100%, 50%)`,
                                                backgroundColor: `hsla(${60 - i * 8}, 100%, 50%, 0.1)`
                                            }}
                                        >
                                            <span className="text-xs font-mono text-white">{78 - i * 3}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Weather */}
                        <div className="bg-[#111118] border border-white/10 rounded-sm p-4">
                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div>
                                    <div className="text-[10px] text-white/40 mb-1">TRACK</div>
                                    <div className="text-lg font-mono text-white">42°C</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 mb-1">AIR</div>
                                    <div className="text-lg font-mono text-white">28°C</div>
                                </div>
                                <div>
                                    <div className="text-[10px] text-white/40 mb-1">RAIN</div>
                                    <div className="text-lg font-mono text-green-400">0%</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
