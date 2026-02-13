import { Link, useLocation } from 'react-router-dom';

const MODULES = [
    { id: 'telemetry', name: 'Telemetry', path: '/analyze/telemetry', icon: '', desc: 'Speed, throttle, brake traces', color: '#CF2C28' },
    { id: 'laptimes', name: 'Lap Times', path: '/analyze/laptimes', icon: '', desc: 'Lap time distribution & sectors', color: '#FF8700' },
    { id: 'strategy', name: 'Strategy', path: '/analyze/strategy', icon: '', desc: 'Tyre stints & pit windows', color: '#00D2BE' },
    { id: 'season', name: 'Season', path: '/analyze/season', icon: '', desc: 'Championship progression', color: '#0090FF' },
    { id: 'driver', name: 'Driver vs', path: '/analyze/driver', icon: '', desc: 'Head-to-head comparisons', color: '#A020F0' },
    { id: 'constructor', name: 'Constructor vs', path: '/analyze/constructor', icon: '', desc: 'Team performance analysis', color: '#FFD700' },
];

export function AnalyzePage() {
    const location = useLocation();

    return (
        <div className="min-h-screen bg-[#0B0D10] text-white relative overflow-hidden">
            {/* Background Pattern */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0B0D10]/90 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#CF2C28] to-[#8B0000] flex items-center justify-center rounded">
                                <span className="text-white font-bold text-sm" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>A</span>
                            </div>
                            <span className="font-bold text-xl" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>APEX</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link to="/simulate" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded">Simulate</Link>
                            <Link to="/predict" className="px-4 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded">Predict</Link>
                            <Link to="/analyze" className="px-4 py-2 text-sm text-white bg-white/10 rounded">Analyze</Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="relative z-10 pt-28 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0090FF]/10 border border-[#0090FF]/30 rounded-full text-xs text-[#0090FF] mb-4">
                            <span className="w-2 h-2 bg-[#0090FF] rounded-full" />
                            FastF1 Powered
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>
                            Analyze Data
                        </h1>
                        <p className="text-white/50 max-w-lg mx-auto">
                            Deep dive into telemetry, lap times, and race strategy with official F1 data.
                        </p>
                    </div>

                    {/* Module Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
                        {MODULES.map((module) => (
                            <Link
                                key={module.id}
                                to={module.path}
                                className={`group relative overflow-hidden rounded-2xl transition-all duration-300 hover:scale-[1.02] ${location.pathname === module.path ? 'ring-2 ring-offset-2 ring-offset-[#0B0D10]' : ''
                                    }`}
                                style={{
                                    '--ring-color': module.color,
                                } as React.CSSProperties}
                            >
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                    style={{ background: `linear-gradient(135deg, ${module.color}20, transparent)` }}
                                />
                                <div className="relative glass-card p-8 border border-white/10 group-hover:border-white/20 transition-colors">
                                    <div
                                        className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl mb-5 transition-transform duration-300 group-hover:scale-110"
                                        style={{ background: `${module.color}20` }}
                                    >
                                        {module.icon}
                                    </div>
                                    <h2
                                        className="text-xl font-bold mb-2 transition-colors group-hover:text-white"
                                        style={{ fontFamily: 'NeoSpeed, sans-serif' }}
                                    >
                                        {module.name}
                                    </h2>
                                    <p className="text-white/50 text-sm">{module.desc}</p>
                                    <div
                                        className="mt-5 flex items-center gap-2 text-sm font-medium transition-all group-hover:gap-4"
                                        style={{ color: module.color }}
                                    >
                                        <span>Open</span>
                                        <span>&rarr;</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Data Source Selector */}
                    <div className="glass-card rounded-2xl p-8 border border-white/10">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                            <span className="w-1 h-5 bg-gradient-to-b from-[#0090FF] to-[#0050AA] rounded-full" />
                            Select Data Source
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-5 border-2 border-[#0090FF]/50 rounded-xl cursor-pointer bg-[#0090FF]/5 transition-all hover:bg-[#0090FF]/10">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-[#0090FF]/20 flex items-center justify-center">
                                        <img src="/assets/logos/f1-logo.png" alt="F1" className="w-6 h-6 object-contain" />
                                    </div>
                                    <div className="font-bold" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>FastF1 Sessions</div>
                                </div>
                                <div className="text-sm text-white/50">Real telemetry from official F1 data feeds</div>
                                <div className="mt-3 flex items-center gap-2 text-xs text-[#00D2BE]">
                                    <span className="w-2 h-2 bg-[#00D2BE] rounded-full" />
                                    Connected
                                </div>
                            </div>
                            <div className="p-5 border border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xl">

                                    </div>
                                    <div className="font-bold" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>Simulation Results</div>
                                </div>
                                <div className="text-sm text-white/50">Analyze your AI prediction outputs</div>
                                <div className="mt-3 text-xs text-white/30">
                                    3 simulations available
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
