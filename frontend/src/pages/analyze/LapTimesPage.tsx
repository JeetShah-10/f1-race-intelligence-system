import { Link } from 'react-router-dom';

export function LapTimesPage() {
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
                    <span className="text-sm font-medium">Lap Time Analysis</span>
                </div>
            </header>

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Raceburst, sans-serif' }}>
                        Lap Time Analysis
                    </h1>

                    {/* Lap Time Scatter */}
                    <div className="glass-card p-6 mb-6">
                        <div className="text-xs text-white/40 uppercase mb-4">Lap Time Distribution</div>
                        <div className="h-64 bg-white/5 rounded flex items-center justify-center text-white/30">
                            Lap Time Scatter Plot (FastF1)
                        </div>
                    </div>

                    {/* Sector Breakdown */}
                    <div className="grid grid-cols-3 gap-6">
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-2">Sector 1</div>
                            <div className="text-2xl font-mono text-[#A020F0]">24.532</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-2">Sector 2</div>
                            <div className="text-2xl font-mono text-[#00E676]">32.108</div>
                        </div>
                        <div className="glass-card p-4 text-center">
                            <div className="text-xs text-white/40 uppercase mb-2">Sector 3</div>
                            <div className="text-2xl font-mono text-[#F9E300]">19.876</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
