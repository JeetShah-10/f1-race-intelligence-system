import { useSimulationStore } from '../../store/useSimulationStore';
import { TIRE_COLORS } from '../../types/simulation';
import type { RaceEvent } from '../../types/simulation';

//  Event Type Config 
const EVENT_ICONS: Record<string, { icon: string; color: string }> = {
    OVERTAKE: { icon: '', color: '#00E676' },
    PIT_STOP: { icon: '', color: '#FFC107' },
    SC_DEPLOY: { icon: '', color: '#FF9800' },
    SC_END: { icon: '', color: '#00E676' },
    VSC_DEPLOY: { icon: '[!]', color: '#FF9800' },
    VSC_END: { icon: '[OK]', color: '#00E676' },
    DNF: { icon: '', color: '#FF1744' },
    FASTEST_LAP: { icon: '', color: '#A020F0' },
    DRS_ENABLED: { icon: '', color: '#00F0FF' },
    YELLOW_FLAG: { icon: '', color: '#FFC107' },
};

//  Event Feed Item 
function EventItem({ event }: { event: RaceEvent }) {
    const cfg = EVENT_ICONS[event.type] || { icon: '', color: '#666' };
    return (
        <div className="flex items-start gap-2 py-1.5 border-b border-white/[0.03] last:border-0">
            <span className="text-[11px] flex-shrink-0 mt-0.5" style={{ color: cfg.color }}>{cfg.icon}</span>
            <div className="min-w-0 flex-1">
                <span className="text-[10px] font-ui text-white/70 leading-tight block">{event.description}</span>
                <span className="text-[9px] font-timing text-white/25 tabular-nums">LAP {event.lap}</span>
            </div>
        </div>
    );
}

//  Selected Driver Detail 
function DriverDetail() {
    const { selectedDriver, currentStandings } = useSimulationStore();

    if (!selectedDriver) {
        return (
            <div className="p-4 text-center">
                <div className="text-[10px] font-ui uppercase tracking-[0.15em] text-white/20 mb-2">
                    Driver Detail
                </div>
                <p className="text-[11px] font-ui text-white/30">
                    Click a driver in the timing tower or track to view details
                </p>
            </div>
        );
    }

    const d = currentStandings.find(s => s.driverCode === selectedDriver);
    if (!d) return null;

    return (
        <div className="p-3">
            {/* Driver Header */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-[4px] h-[28px] rounded-full" style={{ backgroundColor: d.teamColor }} />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="font-timing text-[18px] font-bold text-white tracking-wide">{d.driverCode}</span>
                        <span className="font-timing text-[12px] text-white/30 font-semibold">#{d.driverNumber}</span>
                    </div>
                    <div className="text-[10px] font-ui text-white/40 uppercase tracking-wider -mt-0.5">{d.teamName}</div>
                </div>
                <div className="text-right">
                    <div className={`
                        font-timing text-[22px] font-bold tabular-nums
                        ${d.position <= 3 ? 'text-white' : 'text-white/70'}
                    `}>
                        P{d.position}
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-1.5 mb-3">
                <StatCell label="Gap" value={d.gapToLeader} />
                <StatCell label="Interval" value={d.interval} />
                <StatCell label="Last Lap" value={d.lastLapTime > 0 ? d.lastLapTime.toFixed(3) : '---'} purple={d.isFastestLap} />
                <StatCell label="Best Lap" value={d.bestLapTime < 999 ? d.bestLapTime.toFixed(3) : '---'} />
                <StatCell label="Speed" value={`${d.speed} km/h`} />
                <StatCell label="Pit Stops" value={String(d.pitStops)} />
            </div>

            {/* Sectors */}
            <div className="mb-3">
                <div className="text-[9px] font-ui uppercase tracking-[0.15em] text-white/25 mb-1.5">Sectors</div>
                <div className="flex gap-1">
                    {d.sectors.map((time, i) => (
                        <div
                            key={i}
                            className="flex-1 p-1.5 rounded text-center"
                            style={{
                                backgroundColor: d.sectorStatus[i] === 'PURPLE' ? 'rgba(160,32,240,0.15)' :
                                    d.sectorStatus[i] === 'GREEN' ? 'rgba(0,230,118,0.10)' :
                                        'rgba(255,255,255,0.03)',
                                borderBottom: `2px solid ${d.sectorStatus[i] === 'PURPLE' ? '#A020F0' :
                                    d.sectorStatus[i] === 'GREEN' ? '#00E676' :
                                        'rgba(255,255,255,0.06)'
                                    }`,
                            }}
                        >
                            <div className="text-[8px] font-ui text-white/30 mb-0.5">S{i + 1}</div>
                            <div className="font-timing text-[12px] text-white/80 font-semibold tabular-nums">{time.toFixed(3)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tyre Strategy */}
            <div>
                <div className="text-[9px] font-ui uppercase tracking-[0.15em] text-white/25 mb-1.5">Tyre</div>
                <div className="flex items-center gap-2 p-2 rounded bg-white/[0.03]">
                    <div
                        className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                            backgroundColor: TIRE_COLORS[d.compound],
                            color: d.compound === 'HARD' || d.compound === 'MEDIUM' ? '#000' : '#fff',
                        }}
                    >
                        {d.compound[0]}
                    </div>
                    <div className="flex-1">
                        <div className="text-[11px] font-ui text-white/70">{d.compound}</div>
                        <div className="text-[10px] font-timing text-white/40 tabular-nums">{d.tyreAge} laps old</div>
                    </div>
                    {/* Degradation bar */}
                    <div className="w-16 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${Math.min(100, (d.tyreAge / 30) * 100)}%`,
                                background: d.tyreAge > 25 ? '#FF1744' : d.tyreAge > 15 ? '#FFC107' : '#00E676',
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCell({ label, value, purple }: { label: string; value: string; purple?: boolean }) {
    return (
        <div className="p-2 rounded bg-white/[0.03]">
            <div className="text-[8px] font-ui uppercase tracking-[0.12em] text-white/25 mb-0.5">{label}</div>
            <div className={`font-timing text-[13px] font-semibold tabular-nums ${purple ? 'text-[#A020F0]' : 'text-white/80'}`}>
                {value}
            </div>
        </div>
    );
}

//  Main Panel 
export function TelemetryPanel() {
    const { allPastEvents } = useSimulationStore();

    const recentEvents = allPastEvents.slice(-20).reverse();

    return (
        <div className="flex flex-col h-full">
            {/* Selected Driver Section */}
            <div className="flex-shrink-0 border-b border-white/[0.06]">
                <DriverDetail />
            </div>

            {/* Event Feed */}
            <div className="flex-1 overflow-y-auto p-3" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.1) transparent' }}>
                <div className="text-[9px] font-ui uppercase tracking-[0.15em] text-white/25 mb-2">
                    Race Feed
                </div>
                {recentEvents.length === 0 ? (
                    <p className="text-[10px] font-ui text-white/20">No events yet</p>
                ) : (
                    recentEvents.map((event, i) => <EventItem key={`${event.type}-${event.lap}-${i}`} event={event} />)
                )}
            </div>
        </div>
    );
}
