import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardStore, selectNextRace, selectStandings, selectInsights } from '../store';

export function SimulatePage() {
    const nextRace = useDashboardStore(selectNextRace);
    const standings = useDashboardStore(selectStandings);
    const insights = useDashboardStore(selectInsights);
    const [isRunning, setIsRunning] = useState(false);
    const [currentLap, setCurrentLap] = useState(0);
    const [showHUD, setShowHUD] = useState(true);

    const handleStartSimulation = () => {
        setIsRunning(true);
    };

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setCurrentLap(prev => {
                if (prev >= 78) {
                    clearInterval(interval);
                    return 78;
                }
                return prev + 1;
            });
        }, 400);
        return () => clearInterval(interval);
    }, [isRunning]);

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
                        <Link to="/simulate" className="px-3 py-1.5 text-sm text-white bg-white/10 rounded">Simulate</Link>
                        <Link to="/predict" className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded">Predict</Link>
                        <Link to="/analyze" className="px-3 py-1.5 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded">Analyze</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {isRunning && (
                        <div className="flex items-center gap-3 text-sm">
                            <span className="text-white/40">LAP</span>
                            <span className="font-mono text-lg font-bold">{currentLap}<span className="text-white/40">/78</span></span>
                        </div>
                    )}
                    <button
                        onClick={() => setShowHUD(!showHUD)}
                        className={`px-3 py-1.5 text-xs rounded transition-colors ${showHUD ? 'bg-white/10 text-white' : 'text-white/50'}`}
                    >
                        HUD
                    </button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Timing Tower Sidebar */}
                {showHUD && (
                    <aside className="w-56 bg-black/60 backdrop-blur-md border-r border-white/10 overflow-y-auto flex-shrink-0">
                        <div className="p-3">
                            <div className="text-[10px] text-white/40 uppercase tracking-widest mb-3 flex items-center justify-between">
                                <span>Live Standings</span>
                                <span className="w-2 h-2 bg-[#CF2C28] rounded-full animate-pulse" />
                            </div>
                            {standings.slice(0, 10).map((driver, i) => (
                                <div
                                    key={driver.code}
                                    className="flex items-center gap-2 py-2 px-2 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                                >
                                    <span className={`w-5 text-xs font-mono ${i < 3 ? 'text-[#FFD700] font-bold' : 'text-white/40'}`}>
                                        {i + 1}
                                    </span>
                                    <div
                                        className="w-1 h-5 rounded-full transition-all group-hover:h-7"
                                        style={{ background: driver.teamColor }}
                                    />
                                    <span className="text-sm font-bold" style={{ fontFamily: 'NeoSpeed, sans-serif' }}>
                                        {driver.code}
                                    </span>
                                    {i > 0 && (
                                        <span className="ml-auto text-[11px] font-mono text-white/40">
                                            +{(i * 1.2 + Math.random() * 0.5).toFixed(1)}s
                                        </span>
                                    )}
                                    {i === 0 && (
                                        <span className="ml-auto text-[11px] font-mono text-[#00D2BE]">
                                            LEADER
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </aside>
                )}

                {/* Main Viewer Area */}
                <div
                    className="flex-1 relative"
                    style={{
                        backgroundImage: `url(/assets/circuits/monaco-circuit.png)`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                >
                    {/* Dark Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0D10]/60 via-[#0B0D10]/40 to-[#0B0D10]/80" />

                    {/* Center Content */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                        {!isRunning ? (
                            <div className="text-center">
                                <img
                                    src="/assets/circuits/monaco-map.png"
                                    alt="Monaco"
                                    className="w-32 h-32 object-contain mx-auto mb-6 opacity-50"
                                />
                                <div className="text-5xl font-bold mb-3" style={{ fontFamily: 'Raceburst, NeoSpeed, sans-serif' }}>
                                    {nextRace.name}
                                </div>
                                <div className="text-white/50 mb-10">{nextRace.circuit}</div>
                                <button
                                    onClick={handleStartSimulation}
                                    className="px-16 py-5 bg-gradient-to-r from-[#CF2C28] to-[#FF6B6B] text-white font-bold uppercase tracking-widest text-lg rounded-xl hover:shadow-2xl hover:shadow-[#CF2C28]/40 transition-all hover:scale-105"
                                    style={{ fontFamily: 'NeoSpeed, sans-serif' }}
                                >
                                    Start Simulation
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <div className="text-[120px] font-mono font-bold leading-none mb-4 text-white/20">
                                    {currentLap.toString().padStart(2, '0')}
                                </div>
                                <div className="text-white/40 uppercase tracking-widest text-sm mb-6">Current Lap</div>
                                <div
                                    className="text-4xl font-bold"
                                    style={{ fontFamily: 'NeoSpeed, sans-serif', color: standings[0]?.teamColor }}
                                >
                                    P1: {standings[0]?.code}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timeline Bar */}
                    {isRunning && showHUD && (
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent z-20">
                            <div className="max-w-4xl mx-auto">
                                <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#CF2C28] to-[#FF6B6B] transition-all duration-500"
                                        style={{ width: `${(currentLap / 78) * 100}%` }}
                                    />
                                </div>
                                <div className="flex justify-between text-xs text-white/40">
                                    <span>Start</span>
                                    <span className="font-mono">Lap {currentLap} / 78</span>
                                    <span>Finish</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Insights Panel */}
                {showHUD && (
                    <aside className="w-64 bg-black/60 backdrop-blur-md border-l border-white/10 p-4 overflow-y-auto flex-shrink-0">
                        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-4">Race Insights</div>

                        <div className="space-y-4">
                            <div className="glass-card rounded-xl p-4 border border-white/10">
                                <div className="text-[10px] text-white/40 uppercase mb-1">Weather</div>
                                <div className="text-lg flex items-center gap-2">
                                    <span>☀️</span>
                                    <span>{nextRace.weather}</span>
                                </div>
                            </div>

                            <div className="glass-card rounded-xl p-4 border border-white/10">
                                <div className="text-[10px] text-white/40 uppercase mb-1">SC Probability</div>
                                <div className="text-2xl font-mono font-bold text-[#FF8700]">{insights.safetyCarProbability}%</div>
                            </div>

                            <div className="glass-card rounded-xl p-4 border border-white/10">
                                <div className="text-[10px] text-white/40 uppercase mb-1">Pit Window</div>
                                <div className="text-2xl font-mono font-bold text-[#00D2BE]">L18-22</div>
                            </div>

                            <div className="glass-card rounded-xl p-4 border border-white/10">
                                <div className="text-[10px] text-white/40 uppercase mb-2">Tyre Strategy</div>
                                <div className="text-sm text-white/70">{insights.strategyRecommendation}</div>
                            </div>

                            <div className="glass-card rounded-xl p-4 border border-white/10">
                                <div className="text-[10px] text-white/40 uppercase mb-3">Degradation</div>
                                <div className="space-y-2">
                                    {[
                                        { compound: 'Soft', color: '#FF3333', value: insights.tyreDegradation.soft },
                                        { compound: 'Medium', color: '#FFD700', value: insights.tyreDegradation.medium },
                                        { compound: 'Hard', color: '#FFFFFF', value: insights.tyreDegradation.hard },
                                    ].map((tyre) => (
                                        <div key={tyre.compound} className="flex items-center gap-2 text-sm">
                                            <div className="w-3 h-3 rounded-full" style={{ background: tyre.color }} />
                                            <span className="w-14">{tyre.compound}</span>
                                            <span className="text-white/50 ml-auto">{tyre.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <Link
                                to="/analyze"
                                className="block w-full text-center py-3 border border-white/20 rounded-lg text-sm hover:bg-white/5 transition-colors"
                            >
                                Export to Analyze
                            </Link>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
