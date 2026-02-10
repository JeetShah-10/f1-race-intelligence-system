import { Link } from 'react-router-dom';
import { useSimulationStore } from '../store/useSimulationStore';
import { TrackVisualization } from '../components/simulation/TrackVisualization';
import { TelemetryPanel } from '../components/simulation/TelemetryPanel';
import { Leaderboard } from '../components/simulation/Leaderboard';
import { RaceControl } from '../components/simulation/RaceControl';

export function SimulatePage() {
    const { isRunning, isConnected, currentLap, totalLaps } = useSimulationStore();

    return (
        <div className="h-screen bg-[#0B0D10] text-white overflow-hidden flex flex-col">
            {/* Header */}
            <header className="h-14 bg-[#0B0D10]/90 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-4 z-50 flex-shrink-0">
                <div className="flex items-center gap-6">
                    <Link to="/dashboard" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#CF2C28] to-[#8B0000] flex items-center justify-center rounded">
                            <span className="text-white font-bold text-xs" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>A</span>
                        </div>
                    </Link>
                    <nav className="hidden md:flex items-center gap-1">
                        <Link to="/simulate" className="px-3 py-1.5 text-sm text-white bg-white/10 rounded font-medium">Simulate</Link>
                        <Link to="/predict" className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors">Predict</Link>
                        <Link to="/analyze" className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors">Analyze</Link>
                    </nav>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-4">
                    {isConnected && (
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] uppercase tracking-widest text-green-500 font-bold">Live Data</span>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Grid */}
            <div className="flex-1 flex overflow-hidden">

                {/* Left: Leaderboard */}
                <aside className="w-80 bg-black/60 backdrop-blur-md border-r border-white/10 flex flex-col z-20">
                    <Leaderboard />
                </aside>

                {/* Center: Stage */}
                <main className="flex-1 flex flex-col relative bg-[#0B0D10]">
                    {/* Background Visuals */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-[#0B0D10] to-[#0B0D10] pointer-events-none" />

                    {/* Track Map Area */}
                    <div className="flex-1 relative z-10">
                        <TrackVisualization />
                    </div>

                    {/* Bottom Telemetry Panel */}
                    <div className="h-64 border-t border-white/10 bg-black/80 backdrop-blur-xl z-20 p-4">
                        <TelemetryPanel />
                    </div>
                </main>

                {/* Right: Race Control & Info */}
                <aside className="w-72 bg-black/60 backdrop-blur-md border-l border-white/10 flex flex-col z-20">
                    <div className="p-4 border-b border-white/10">
                        <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Race Control</h2>
                        <RaceControl />
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto">
                        <h2 className="text-xs uppercase tracking-widest text-white/40 mb-4 font-bold">Session Info</h2>

                        <div className="space-y-4">
                            <div className="p-3 rounded bg-white/5 border border-white/5">
                                <div className="text-[10px] text-white/40 uppercase mb-1">Status</div>
                                <div className="text-lg font-bold text-white">
                                    {isRunning ? 'RACE LIVE' : 'SESSION STOPPED'}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Laps</div>
                                    <div className="text-xl font-mono font-bold text-white">
                                        {currentLap}/{totalLaps}
                                    </div>
                                </div>
                                <div className="p-3 rounded bg-white/5 border border-white/5">
                                    <div className="text-[10px] text-white/40 uppercase mb-1">Weather</div>
                                    <div className="text-xl font-bold text-white">☀️ Dry</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
}
