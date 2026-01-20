import { Link } from 'react-router-dom';
import { useDashboardStore, selectNextRace, selectMeta } from '../store';

// Icons for CTAs
const IconSimulate = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <polygon points="5,3 19,12 5,21" fill="currentColor" />
    </svg>
);

const IconPredict = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
    </svg>
);

const IconAnalyze = () => (
    <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3 3v18h18" />
        <path d="M7 16l4-8 4 4 6-10" />
    </svg>
);

export function DashboardPage() {
    const nextRace = useDashboardStore(selectNextRace);
    const meta = useDashboardStore(selectMeta);

    return (
        <div className="min-h-screen bg-[#0B0D10] text-white relative overflow-hidden">
            {/* Background Circuit Image */}
            <div
                className="absolute inset-0 z-0 opacity-20"
                style={{
                    backgroundImage: 'url(/assets/circuits/monaco-circuit.png)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'blur(2px)',
                }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#0B0D10]/80 via-[#0B0D10]/90 to-[#0B0D10]" />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0B0D10]/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#CF2C28] to-[#8B0000] flex items-center justify-center rounded">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>A</span>
                            </div>
                            <span className="font-bold text-xl tracking-tight" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>APEX</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link to="/simulate" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-all">Simulate</Link>
                            <Link to="/predict" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-all">Predict</Link>
                            <Link to="/analyze" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-all">Analyze</Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#00D2BE]/10 border border-[#00D2BE]/30 rounded text-[#00D2BE] text-xs">
                            <span className="w-2 h-2 bg-[#00D2BE] rounded-full animate-pulse" />
                            {meta.status}
                        </div>
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#CF2C28] to-[#FF6B6B] flex items-center justify-center text-sm font-bold shadow-lg shadow-[#CF2C28]/20">
                            U
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 pt-28 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Hero Section */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white/60 mb-6">
                            <span className="w-2 h-2 bg-[#CF2C28] rounded-full" />
                            AI-Powered Race Intelligence
                        </div>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                            <span className="block" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>
                                F1 Intelligence
                            </span>
                            <span className="block bg-gradient-to-r from-[#CF2C28] via-[#FF6B6B] to-[#FF8700] bg-clip-text text-transparent" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>
                                Platform
                            </span>
                        </h1>
                        <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
                            Predict race outcomes, run full simulations, and analyze telemetry data with cutting-edge AI models.
                        </p>
                    </div>

                    {/* Hero CTAs */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {/* Run Simulation */}
                        <Link
                            to="/simulate"
                            className="group relative overflow-hidden rounded-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#CF2C28]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative glass-card-glow p-8 border border-white/10 group-hover:border-[#CF2C28]/50 transition-all duration-300">
                                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-[#CF2C28] to-[#8B0000] flex items-center justify-center text-white shadow-lg shadow-[#CF2C28]/30 group-hover:scale-110 transition-transform duration-300">
                                    <IconSimulate />
                                </div>
                                <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>Run Simulation</h2>
                                <p className="text-white/50 text-sm leading-relaxed">Full broadcast-style viewer with AI-powered race predictions and real-time telemetry.</p>
                                <div className="mt-6 flex items-center gap-2 text-[#CF2C28] text-sm font-medium group-hover:gap-4 transition-all">
                                    <span>Launch Viewer</span>
                                    <span className="text-lg">→</span>
                                </div>
                            </div>
                        </Link>

                        {/* Predict Race */}
                        <Link
                            to="/predict"
                            className="group relative overflow-hidden rounded-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#00D2BE]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative glass-card-glow p-8 border border-white/10 group-hover:border-[#00D2BE]/50 transition-all duration-300">
                                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-[#00D2BE] to-[#008C82] flex items-center justify-center text-white shadow-lg shadow-[#00D2BE]/30 group-hover:scale-110 transition-transform duration-300">
                                    <IconPredict />
                                </div>
                                <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>Predict Race</h2>
                                <p className="text-white/50 text-sm leading-relaxed">Quick predictions with classification, strategy analysis, and confidence scores.</p>
                                <div className="mt-6 flex items-center gap-2 text-[#00D2BE] text-sm font-medium group-hover:gap-4 transition-all">
                                    <span>Start Prediction</span>
                                    <span className="text-lg">→</span>
                                </div>
                            </div>
                        </Link>

                        {/* Analyze Data */}
                        <Link
                            to="/analyze"
                            className="group relative overflow-hidden rounded-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#0090FF]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative glass-card-glow p-8 border border-white/10 group-hover:border-[#0090FF]/50 transition-all duration-300">
                                <div className="w-16 h-16 mb-6 rounded-xl bg-gradient-to-br from-[#0090FF] to-[#0050AA] flex items-center justify-center text-white shadow-lg shadow-[#0090FF]/30 group-hover:scale-110 transition-transform duration-300">
                                    <IconAnalyze />
                                </div>
                                <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>Analyze Data</h2>
                                <p className="text-white/50 text-sm leading-relaxed">FastF1-backed telemetry, lap time analysis, and comprehensive race insights.</p>
                                <div className="mt-6 flex items-center gap-2 text-[#0090FF] text-sm font-medium group-hover:gap-4 transition-all">
                                    <span>Open Workspace</span>
                                    <span className="text-lg">→</span>
                                </div>
                            </div>
                        </Link>
                    </div>

                    {/* Recent Work + GP Context Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Work */}
                        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10">
                            <h3 className="text-lg font-bold mb-5 flex items-center gap-3">
                                <span className="w-1 h-5 bg-gradient-to-b from-[#CF2C28] to-[#FF6B6B] rounded-full" />
                                Recent Work
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { title: 'Monaco GP Simulation', time: '2 hours ago', type: 'Simulation', color: '#CF2C28', icon: '🏎️' },
                                    { title: 'Spa Prediction', time: 'Yesterday', type: 'Prediction', color: '#00D2BE', icon: '📊' },
                                    { title: 'VER vs NOR Analysis', time: '3 days ago', type: 'Analysis', color: '#0090FF', icon: '📈' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors cursor-pointer group"
                                    >
                                        <div className="flex items-center gap-4">
                                            <span className="text-xl">{item.icon}</span>
                                            <div>
                                                <div className="text-sm font-medium group-hover:text-white transition-colors">{item.title}</div>
                                                <div className="text-xs text-white/40">{item.time}</div>
                                            </div>
                                        </div>
                                        <span
                                            className="text-xs px-3 py-1 rounded-full font-medium"
                                            style={{ background: `${item.color}20`, color: item.color }}
                                        >
                                            {item.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Upcoming GP Context */}
                        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
                            {/* Circuit Image Header */}
                            <div
                                className="h-32 relative"
                                style={{
                                    backgroundImage: 'url(/assets/circuits/monaco-circuit.png)',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D10] to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="text-xs text-white/60 uppercase tracking-widest mb-1">Next Race</div>
                                    <div className="text-xl font-bold" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>
                                        {nextRace.name}
                                    </div>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="text-white/50 text-sm mb-4">{nextRace.circuit}</div>
                                <div className="flex items-center gap-4 text-sm mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/40">📍</span>
                                        <span className="font-mono">{nextRace.countdown.days}d {nextRace.countdown.hours}h</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-white/40">☀️</span>
                                        <span>{nextRace.weather}</span>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {Object.values(nextRace.trackCharacteristics).map((char: string, i: number) => (
                                        <span
                                            key={i}
                                            className="px-3 py-1.5 bg-white/10 text-xs rounded-lg font-medium"
                                        >
                                            {char}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-8 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-white/40">
                    <div className="flex items-center gap-8">
                        <Link to="#" className="hover:text-white/60 transition-colors">Release Notes</Link>
                        <Link to="#" className="hover:text-white/60 transition-colors">Credits</Link>
                        <Link to="#" className="hover:text-white/60 transition-colors">Terms</Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-[#00D2BE] rounded-full" />
                        <span>{meta.modelVersion}</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}
