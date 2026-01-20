import { useDashboardStore, selectRivalries, selectStandings } from '../../store';

export function RivalryTracker() {
    const rivalries = useDashboardStore(selectRivalries);
    const standings = useDashboardStore(selectStandings);

    const getDriverColor = (code: string) => {
        const driver = standings.find(d => d.code === code);
        return driver?.teamColor || '#FFFFFF';
    };

    return (
        <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-px bg-[#CF2C28]" />
                <span className="text-xs text-white/40 uppercase tracking-widest">Driver Rivalries</span>
            </div>

            <div className="space-y-3">
                {rivalries.map((rivalry, i) => (
                    <div
                        key={`${rivalry.pair[0]}-${rivalry.pair[1]}`}
                        className="glass-card p-4 hover-lift gpu-accelerated animate-slide-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                    >
                        {/* Driver Pair Header */}
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                                <span
                                    className="font-bold text-sm uppercase"
                                    style={{ color: getDriverColor(rivalry.pair[0]), fontFamily: 'NeoSpeed, Rajdhani, sans-serif' }}
                                >
                                    {rivalry.pair[0]}
                                </span>
                                <span className="text-white/30 text-xs">vs</span>
                                <span
                                    className="font-bold text-sm uppercase"
                                    style={{ color: getDriverColor(rivalry.pair[1]), fontFamily: 'NeoSpeed, Rajdhani, sans-serif' }}
                                >
                                    {rivalry.pair[1]}
                                </span>
                            </div>
                            <span className="text-[10px] text-white/30 uppercase tracking-wider">{rivalry.metric}</span>
                        </div>

                        {/* Delta Value */}
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-2xl font-mono font-medium text-white">{rivalry.value}</span>
                        </div>

                        {/* Narrative */}
                        <p className="text-white/50 text-xs">{rivalry.narrative}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
