import { useState } from 'react';
import { Link } from 'react-router-dom';

const TEAMS = [
    { id: 'redbull', name: 'Red Bull Racing', color: '#3671C6' },
    { id: 'mclaren', name: 'McLaren', color: '#FF8700' },
    { id: 'ferrari', name: 'Ferrari', color: '#DC0000' },
    { id: 'mercedes', name: 'Mercedes', color: '#00D2BE' },
    { id: 'aston', name: 'Aston Martin', color: '#006F62' },
];

export function ConstructorVsPage() {
    const [team1, setTeam1] = useState('redbull');
    const [team2, setTeam2] = useState('mclaren');

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
                    <span className="text-sm font-medium">Constructor vs Constructor</span>
                </div>
            </header>

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Raceburst, sans-serif' }}>
                        Constructor vs Constructor
                    </h1>

                    {/* Team Selectors */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-2">Team 1</div>
                            <select
                                value={team1}
                                onChange={(e) => setTeam1(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
                            >
                                {TEAMS.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-2">Team 2</div>
                            <select
                                value={team2}
                                onChange={(e) => setTeam2(e.target.value)}
                                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2"
                            >
                                {TEAMS.map((t) => (
                                    <option key={t.id} value={t.id}>{t.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Season Selector */}
                    <div className="mb-8">
                        <select className="bg-white/10 border border-white/20 rounded px-4 py-2 text-sm">
                            <option>2026 Season</option>
                            <option>2025 Season</option>
                        </select>
                    </div>

                    {/* Comparison */}
                    <div className="glass-card p-6 mb-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="py-4" style={{ color: TEAMS.find(t => t.id === team1)?.color }}>
                                <div className="text-2xl font-bold">{TEAMS.find(t => t.id === team1)?.name}</div>
                            </div>
                            <div className="py-4 text-white/40 text-2xl">vs</div>
                            <div className="py-4" style={{ color: TEAMS.find(t => t.id === team2)?.color }}>
                                <div className="text-2xl font-bold">{TEAMS.find(t => t.id === team2)?.name}</div>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Points</div>
                            <div className="text-xl font-mono">892 - 659</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Wins</div>
                            <div className="text-xl font-mono">18 - 6</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Podiums</div>
                            <div className="text-xl font-mono">32 - 24</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-1">Avg Pace</div>
                            <div className="text-xl font-mono">+0.08s</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
