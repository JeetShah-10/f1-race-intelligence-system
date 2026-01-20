import { Link } from 'react-router-dom';

export function SeasonPage() {
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
                    <span className="text-sm font-medium">Season Analysis</span>
                </div>
            </header>

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Raceburst, sans-serif' }}>
                        Season Analysis
                    </h1>

                    {/* Season Selector */}
                    <div className="mb-8">
                        <select className="bg-white/10 border border-white/20 rounded px-4 py-2 text-sm">
                            <option>2026 Season</option>
                            <option>2025 Season</option>
                            <option>2024 Season</option>
                        </select>
                    </div>

                    {/* Points Evolution */}
                    <div className="glass-card p-6 mb-6">
                        <div className="text-xs text-white/40 uppercase mb-4">Championship Points Evolution</div>
                        <div className="h-64 bg-white/5 rounded flex items-center justify-center text-white/30">
                            Points Over Season Chart
                        </div>
                    </div>

                    {/* Current Standings */}
                    <div className="glass-card p-6">
                        <div className="text-xs text-white/40 uppercase mb-4">Driver Standings</div>
                        <div className="space-y-2">
                            {[
                                { pos: 1, driver: 'VER', points: 575, color: '#3671C6' },
                                { pos: 2, driver: 'NOR', points: 374, color: '#FF8700' },
                                { pos: 3, driver: 'LEC', points: 319, color: '#DC0000' },
                            ].map((row) => (
                                <div key={row.driver} className="flex items-center gap-4 py-2 border-b border-white/5">
                                    <span className="w-8 font-mono">{row.pos}</span>
                                    <div className="w-1 h-4 rounded" style={{ background: row.color }} />
                                    <span className="font-bold">{row.driver}</span>
                                    <span className="ml-auto font-mono">{row.points} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
