import { useState } from 'react';
import { Link } from 'react-router-dom';

const DRIVERS = [
    { code: 'VER', name: 'Max Verstappen', team: 'Red Bull', color: '#3671C6' },
    { code: 'NOR', name: 'Lando Norris', team: 'McLaren', color: '#FF8700' },
    { code: 'LEC', name: 'Charles Leclerc', team: 'Ferrari', color: '#DC0000' },
    { code: 'HAM', name: 'Lewis Hamilton', team: 'Mercedes', color: '#00D2BE' },
    { code: 'PIA', name: 'Oscar Piastri', team: 'McLaren', color: '#FF8700' },
];

export function DriverVsPage() {
    const [driver1, setDriver1] = useState('VER');
    const [driver2, setDriver2] = useState('NOR');

    return (
        <div className="min-h-screen bg-[#0B0D10] text-white">
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0B0D10]/90 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center gap-8">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#CF2C28] flex items-center justify-center">
                            <span className="text-white font-bold text-xs">A</span>
                        </div>
                    </Link>
                    <Link to="/analyze" className="text-sm text-white/70 hover:text-white">← Analyze</Link>
                    <span className="text-sm font-medium">Driver vs Driver</span>
                </div>
            </header>

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Raceburst, sans-serif' }}>
                        Driver vs Driver
                    </h1>

                    {/* Driver Selectors */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-2">Driver 1</div>
                            <select
                                value={driver1}
                                onChange={(e) => setDriver1(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
                            >
                                {DRIVERS.map((d) => (
                                    <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-2">Driver 2</div>
                            <select
                                value={driver2}
                                onChange={(e) => setDriver2(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
                            >
                                {DRIVERS.map((d) => (
                                    <option key={d.code} value={d.code}>{d.code} - {d.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Session Selector */}
                    <div className="mb-8 flex gap-4">
                        <select className="bg-white/10 border border-white/20 rounded px-4 py-2 text-sm">
                            <option>2026 Season</option>
                            <option>2025 Season</option>
                        </select>
                        <select className="bg-white/10 border border-white/20 rounded px-4 py-2 text-sm">
                            <option>All Sessions</option>
                            <option>Monaco GP - Race</option>
                            <option>Monaco GP - Qualifying</option>
                        </select>
                    </div>

                    {/* Comparison View */}
                    <div className="glass-card p-6 mb-6">
                        <div className="text-xs text-white/40 uppercase mb-4">Head-to-Head</div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="py-4" style={{ color: DRIVERS.find(d => d.code === driver1)?.color }}>
                                <div className="text-3xl font-bold">{driver1}</div>
                            </div>
                            <div className="py-4 text-white/40">vs</div>
                            <div className="py-4" style={{ color: DRIVERS.find(d => d.code === driver2)?.color }}>
                                <div className="text-3xl font-bold">{driver2}</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Quali H2H</div>
                            <div className="text-xl font-mono">12 - 8</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Race H2H</div>
                            <div className="text-xl font-mono">14 - 6</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Avg Gap</div>
                            <div className="text-xl font-mono">+0.143s</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Points</div>
                            <div className="text-xl font-mono">575 - 374</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
