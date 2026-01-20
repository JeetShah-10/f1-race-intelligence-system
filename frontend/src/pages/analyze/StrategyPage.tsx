import { Link } from 'react-router-dom';

export function StrategyPage() {
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
                    <span className="text-sm font-medium">Strategy Analysis</span>
                </div>
            </header>

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Raceburst, sans-serif' }}>
                        Race Strategy Analysis
                    </h1>

                    {/* Stint Chart */}
                    <div className="glass-card p-6 mb-6">
                        <div className="text-xs text-white/40 uppercase mb-4">Tyre Stints</div>
                        <div className="space-y-3">
                            {['VER', 'NOR', 'LEC'].map((driver) => (
                                <div key={driver} className="flex items-center gap-4">
                                    <span className="w-12 font-bold">{driver}</span>
                                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                                        <div className="bg-[#FFD700] flex-[40]" title="Medium L1-18" />
                                        <div className="bg-white flex-[38]" title="Hard L19-56" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Pit Stop Summary */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <div className="text-xs text-white/40 uppercase mb-4">Pit Windows</div>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Optimal Undercut</span>
                                    <span className="font-mono text-[#00D2BE]">L18-22</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Overcut Window</span>
                                    <span className="font-mono text-[#FF8700]">L23-26</span>
                                </div>
                            </div>
                        </div>
                        <div className="glass-card p-6">
                            <div className="text-xs text-white/40 uppercase mb-4">Pit Loss</div>
                            <div className="text-3xl font-mono">18.2s</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
