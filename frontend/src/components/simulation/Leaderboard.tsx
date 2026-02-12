import { useSimulationStore } from '../../store/useSimulationStore';
import { motion, AnimatePresence } from 'framer-motion';
import type { DriverStanding, TireCompound, SectorStatus } from '../../types/simulation';

// ─── Constants ────────────────────────────────────────────────────────────
const TYRE_CONFIG: Record<TireCompound, { label: string; bg: string; text: string }> = {
    SOFT: { label: 'S', bg: '#FF3333', text: '#fff' },
    MEDIUM: { label: 'M', bg: '#FFC906', text: '#000' },
    HARD: { label: 'H', bg: '#FFFFFF', text: '#000' },
    INTER: { label: 'I', bg: '#1EB53A', text: '#fff' },
    WET: { label: 'W', bg: '#0064E0', text: '#fff' },
};

const SECTOR_DOT_COLORS: Record<SectorStatus, string> = {
    PURPLE: '#A020F0',
    GREEN: '#00E676',
    YELLOW: '#F9E300',
    NONE: '#555',
};

// ─── Sub-Components ──────────────────────────────────────────────────────

function TyreBadge({ compound }: { compound: TireCompound }) {
    const cfg = TYRE_CONFIG[compound];
    return (
        <div
            className="w-[16px] h-[16px] rounded-full flex items-center justify-center text-[9px] font-bold shadow-sm"
            style={{ backgroundColor: cfg.bg, color: cfg.text }}
        >
            {cfg.label}
        </div>
    );
}

function SectorDots({ sectors }: { sectors: [SectorStatus, SectorStatus, SectorStatus] }) {
    return (
        <div className="flex items-center gap-0.5">
            {sectors.map((s, i) => (
                <div
                    key={i}
                    className="w-[4px] h-[4px] rounded-full"
                    style={{ backgroundColor: SECTOR_DOT_COLORS[s] }}
                />
            ))}
        </div>
    );
}

function TimingRow({
    driver,
    isSelected,
    onSelect,
}: {
    driver: DriverStanding;
    isSelected: boolean;
    onSelect: () => void;
}) {
    const isLeader = driver.position === 1;
    const isOut = driver.status === 'OUT';
    const isPit = driver.status === 'PIT';
    const isFastest = driver.isFastestLap;

    return (
        <motion.div
            layout
            initial={false}
            animate={{ opacity: isOut ? 0.4 : 1 }}
            className={`relative mb-[1px] h-[34px] flex items-center cursor-pointer group ${isSelected ? 'z-10' : 'z-0'}`}
            onClick={onSelect}
        >
            {/* Left: Position + Name */}
            <div className={`
                h-full flex items-center rounded-sm overflow-hidden flex-1
                transition-all duration-200 border-l-[3px]
                ${isSelected ? 'bg-white/[0.06]' : 'bg-[#141418] hover:bg-[#1A1A1F]'}
                ${isFastest ? 'border-l-purple-500' : ''}
            `}
                style={{ borderLeftColor: isFastest ? '#A020F0' : driver.teamColor }}
            >
                {/* Position */}
                <div className="w-[28px] flex justify-center text-[14px] font-timing font-bold text-white leading-none">
                    {driver.position}
                </div>

                {/* Position change indicator */}
                <div className="w-[14px] flex justify-center">
                    {driver.positionChange !== 0 && (
                        <span className={`text-[8px] font-bold leading-none ${driver.positionChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {driver.positionChange > 0 ? '▲' : '▼'}
                        </span>
                    )}
                </div>

                {/* Driver Code */}
                <div className="flex-1 flex items-center gap-1.5 px-1 min-w-0">
                    <span className="font-ui font-bold text-[13px] text-white tracking-wide uppercase truncate">
                        {driver.driverCode}
                    </span>
                </div>

                {/* Interval / Status */}
                <div className="font-timing text-[12px] font-bold text-white tabular-nums text-right pr-2 min-w-[50px]">
                    {isOut ? (
                        <span className="text-red-500">DNF</span>
                    ) : isPit ? (
                        <span className="text-yellow-500">PIT</span>
                    ) : isLeader ? (
                        <span className="text-white/30">INTERVAL</span>
                    ) : (
                        <span className="text-white/70">{driver.interval}</span>
                    )}
                </div>

                {/* Sector dots */}
                <div className="pr-1.5">
                    <SectorDots sectors={driver.sectorStatus} />
                </div>

                {/* Tyre */}
                <div className="flex items-center gap-1 pr-2">
                    {!isOut && <TyreBadge compound={driver.compound} />}
                    {driver.pitStops > 0 && (
                        <span className="text-[9px] font-ui text-white/30 font-bold w-[10px] text-center">
                            {driver.pitStops}
                        </span>
                    )}
                </div>
            </div>

            {/* Fastest lap glow */}
            {isFastest && !isOut && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-purple-500 shadow-[0_0_8px_rgba(160,32,240,0.5)]" />
            )}

            {/* Selection border */}
            {isSelected && (
                <div className="absolute inset-0 rounded-sm pointer-events-none border border-white/20" />
            )}
        </motion.div>
    );
}

// ─── Main Component ──────────────────────────────────────────────────────
export function Leaderboard() {
    const { currentStandings, selectedDriver, setSelectedDriver, raceConfig, currentLap, currentFlag } = useSimulationStore();

    const flagColors: Record<string, string> = {
        GREEN: 'bg-green-500',
        YELLOW: 'bg-yellow-400',
        SC: 'bg-orange-500',
        VSC: 'bg-orange-500',
        RED: 'bg-red-500',
    };

    return (
        <div className="h-full flex flex-col bg-[#0b0b0f]">
            {/* Header */}
            <div className="shrink-0 px-3 py-2.5 bg-[#111] border-b border-white/[0.06] relative overflow-hidden">
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <div className="text-[8px] font-ui uppercase tracking-[0.2em] text-white/40 mb-0.5">
                            {currentFlag === 'SC' ? '⚠ SAFETY CAR' : currentFlag === 'VSC' ? '⚠ VSC' : 'TIMING'}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-racing text-white leading-none">
                                {raceConfig?.circuitName.split(' ')[0] || 'GP'}
                            </span>
                            <div className={`px-1.5 py-0.5 rounded text-[9px] font-bold text-black ${flagColors[currentFlag] || 'bg-white'}`}>
                                {currentFlag}
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[8px] font-ui uppercase tracking-[0.2em] text-white/40 mb-0.5">LAP</div>
                        <div className="text-lg font-timing font-bold text-white leading-none tabular-nums">
                            {currentLap}<span className="text-xs text-white/30">/{raceConfig?.totalLaps || 0}</span>
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-white/[0.02] to-transparent pointer-events-none" />
            </div>

            {/* Scrollable List */}
            <div
                className="flex-1 overflow-y-auto px-1.5 py-1 min-h-0"
                style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
            >
                <AnimatePresence>
                    {currentStandings.map((driver) => (
                        <TimingRow
                            key={driver.driverCode}
                            driver={driver}
                            isSelected={selectedDriver === driver.driverCode}
                            onSelect={() => setSelectedDriver(
                                selectedDriver === driver.driverCode ? null : driver.driverCode
                            )}
                        />
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer Legend */}
            <div className="shrink-0 h-[22px] bg-[#0E0E12] border-t border-white/[0.06] flex items-center justify-center gap-3 text-[8px] font-ui text-white/20 uppercase tracking-wider">
                <span className="flex items-center gap-1">
                    <div className="w-[3px] h-[3px] rounded-full bg-purple-500" /> Fastest
                </span>
                <span>Int: Interval</span>
                <span>Pit: In Pit</span>
            </div>
        </div>
    );
}
