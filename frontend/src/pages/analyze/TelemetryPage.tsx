import { Link } from 'react-router-dom';

export function TelemetryPage() {
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
                    <span className="text-sm font-medium">Telemetry Viewer</span>
                </div>
            </header>

            <main className="pt-24 pb-16 px-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8" style={{ fontFamily: 'Raceburst, sans-serif' }}>
                        Telemetry Viewer
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Lap Selector */}
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-3">Select Lap</div>
                            <select className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm">
                                <option>Lap 1</option>
                                <option>Lap 15 (Fastest)</option>
                                <option>Lap 42</option>
                            </select>
                        </div>

                        {/* Driver Selector */}
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-3">Driver</div>
                            <select className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm">
                                <option>VER - Max Verstappen</option>
                                <option>NOR - Lando Norris</option>
                                <option>LEC - Charles Leclerc</option>
                            </select>
                        </div>

                        {/* Session Selector */}
                        <div className="glass-card p-4">
                            <div className="text-xs text-white/40 uppercase mb-3">Session</div>
                            <select className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 text-sm">
                                <option>Race</option>
                                <option>Qualifying</option>
                                <option>Practice 3</option>
                            </select>
                        </div>
                    </div>

                    {/* Telemetry Charts Placeholder */}
                    <div className="mt-8 glass-card p-6">
                        <div className="text-xs text-white/40 uppercase mb-4">Speed Trace</div>
                        <div className="h-48 bg-white/5 rounded flex items-center justify-center text-white/30">
                            FastF1 Speed Trace Chart
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-6">
                        <div className="glass-card p-6">
                            <div className="text-xs text-white/40 uppercase mb-4">Throttle / Brake</div>
                            <div className="h-32 bg-white/5 rounded flex items-center justify-center text-white/30">
                                Throttle/Brake Trace
                            </div>
                        </div>
                        <div className="glass-card p-6">
                            <div className="text-xs text-white/40 uppercase mb-4">Gear Usage</div>
                            <div className="h-32 bg-white/5 rounded flex items-center justify-center text-white/30">
                                Gear Chart
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
