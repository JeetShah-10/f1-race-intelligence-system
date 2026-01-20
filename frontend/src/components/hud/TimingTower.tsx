import { motion, AnimatePresence } from 'framer-motion';
import type { TimingEntry, TireCompound } from '../../types/simulation';
import { TIRE_COLORS } from '../../types/simulation';

interface TimingTowerProps {
    entries: TimingEntry[];
    /** Whether to show expanded driver details */
    expandedDriverId?: string | null;
    /** Callback when driver row is clicked */
    onDriverClick?: (driverId: string) => void;
}

export function TimingTower({ entries, expandedDriverId, onDriverClick }: TimingTowerProps) {
    return (
        <div className="hud-panel p-2 w-80 max-h-[600px] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-2">
                <span className="font-square text-[10px] text-silver-arrow/60 tracking-widest">TIMING</span>
                <span className="font-square text-[10px] text-silver-arrow/60 tracking-widest">INTERVAL</span>
            </div>

            {/* Driver Entries */}
            <div className="space-y-1">
                <AnimatePresence mode="popLayout">
                    {entries.map((entry, index) => (
                        <TimingRow
                            key={entry.driver.id}
                            entry={entry}
                            isExpanded={expandedDriverId === entry.driver.id}
                            onClick={() => onDriverClick?.(entry.driver.id)}
                            animationDelay={index * 0.05}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}

interface TimingRowProps {
    entry: TimingEntry;
    isExpanded: boolean;
    onClick: () => void;
    animationDelay: number;
}

function TimingRow({ entry, isExpanded, onClick, animationDelay }: TimingRowProps) {
    const { driver, position, gap, interval, currentTire, tireAge, status } = entry;

    const statusColors: Record<string, string> = {
        RUNNING: 'bg-sector-green',
        PIT: 'bg-industrial-amber',
        OUT: 'bg-silver-arrow/50',
        DNF: 'bg-status-danger',
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{
                duration: 0.3,
                delay: animationDelay,
                ease: [0.17, 0.84, 0.44, 1]
            }}
            onClick={onClick}
            className={`
        relative flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer
        transition-colors duration-200
        ${isExpanded ? 'bg-white/10' : 'hover:bg-white/5'}
        ${status === 'DNF' ? 'opacity-50' : ''}
      `}
        >
            {/* Team Color Stripe */}
            <div
                className="absolute left-0 top-0 bottom-0 w-1 rounded-l-lg"
                style={{ backgroundColor: driver.constructor.color }}
            />

            {/* Position */}
            <div className="w-6 text-center">
                <span className={`
          font-square text-lg font-bold
          ${position <= 3 ? 'text-sunset-gold' : 'text-white'}
        `}>
                    {position}
                </span>
            </div>

            {/* Driver Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-square text-sm font-bold text-white truncate">
                        {driver.code}
                    </span>
                    {/* Status Indicator */}
                    <div className={`w-2 h-2 rounded-full ${statusColors[status]}`} />
                </div>
                <span className="font-modern text-[10px] text-silver-arrow/60 truncate block">
                    {driver.constructor.shortName}
                </span>
            </div>

            {/* Tire Indicator */}
            <TireChip compound={currentTire} age={tireAge} />

            {/* Gap / Interval */}
            <div className="w-20 text-right">
                <span className="font-square text-sm font-bold text-electric-cyan block">
                    {position === 1 ? 'LEADER' : gap}
                </span>
                <span className="font-square text-[10px] text-silver-arrow/60 block">
                    {interval}
                </span>
            </div>

            {/* Expanded Details */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 right-0 top-full z-10 bg-asphalt rounded-b-lg border-t border-white/10 overflow-hidden"
                    >
                        <ExpandedDriverDetails entry={entry} />
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function TireChip({ compound, age }: { compound: TireCompound; age: number }) {
    const color = TIRE_COLORS[compound];

    return (
        <div className="flex items-center gap-1">
            <div
                className="w-4 h-4 rounded-full border border-white/20"
                style={{ backgroundColor: color }}
            />
            <span className="font-square text-[10px] text-silver-arrow/60">
                L{age}
            </span>
        </div>
    );
}

function ExpandedDriverDetails({ entry }: { entry: TimingEntry }) {
    return (
        <div className="p-3 space-y-3">
            {/* Last Lap / Best Lap */}
            <div className="flex justify-between">
                <div>
                    <span className="font-square text-[10px] text-silver-arrow/60 block">LAST LAP</span>
                    <span className="font-square text-sm text-white">
                        {entry.lastLap ? formatLapTime(entry.lastLap.total) : '--:--.---'}
                    </span>
                </div>
                <div className="text-right">
                    <span className="font-square text-[10px] text-silver-arrow/60 block">BEST LAP</span>
                    <span className="font-square text-sm text-sector-purple">
                        {entry.bestLap ? formatLapTime(entry.bestLap.total) : '--:--.---'}
                    </span>
                </div>
            </div>

            {/* Sector Times */}
            {entry.lastLap && (
                <div className="flex gap-2">
                    {entry.lastLap.sectors.map((sector, i) => (
                        <div
                            key={i}
                            className={`
                flex-1 text-center py-1 rounded
                ${sector.status === 'PURPLE' ? 'bg-sector-purple/20 text-sector-purple' : ''}
                ${sector.status === 'GREEN' ? 'bg-sector-green/20 text-sector-green' : ''}
                ${sector.status === 'YELLOW' ? 'bg-sector-yellow/20 text-sector-yellow' : ''}
                ${sector.status === 'NONE' ? 'bg-white/10 text-white' : ''}
              `}
                        >
                            <span className="font-square text-[10px] block">S{sector.sector}</span>
                            <span className="font-square text-xs">{formatSectorTime(sector.time)}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* Pit Stops */}
            <div className="flex items-center justify-between">
                <span className="font-square text-[10px] text-silver-arrow/60">PIT STOPS</span>
                <span className="font-square text-sm text-white">{entry.pitStops}</span>
            </div>
        </div>
    );
}

function formatLapTime(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const millis = ms % 1000;
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${millis.toString().padStart(3, '0')}`;
}

function formatSectorTime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const millis = ms % 1000;
    return `${seconds}.${millis.toString().padStart(3, '0').slice(0, 1)}`;
}

export const DEMO_TIMING_DATA: TimingEntry[] = [
    {
        position: 1,
        driver: {
            id: 'ver',
            code: 'VER',
            firstName: 'Max',
            lastName: 'Verstappen',
            number: 1,
            constructor: { id: 'rbr', name: 'Red Bull Racing', shortName: 'RBR', color: '#3671C6' },
            nationality: 'NL',
        },
        gap: 'LEADER',
        interval: '--',
        lastLap: {
            lap: 47,
            sectors: [
                { sector: 1, time: 28453, status: 'PURPLE' },
                { sector: 2, time: 35621, status: 'GREEN' },
                { sector: 3, time: 27892, status: 'YELLOW' },
            ],
            total: 91966,
            isPersonalBest: false,
            isSessionBest: false,
        },
        bestLap: { lap: 32, sectors: [], total: 91234, isPersonalBest: true, isSessionBest: true },
        currentTire: 'C3',
        tireAge: 14,
        pitStops: 2,
        status: 'RUNNING',
    },
    {
        position: 2,
        driver: {
            id: 'nor',
            code: 'NOR',
            firstName: 'Lando',
            lastName: 'Norris',
            number: 4,
            constructor: { id: 'mclaren', name: 'McLaren', shortName: 'MCL', color: '#FF8000' },
            nationality: 'GB',
        },
        gap: '+2.347',
        interval: '+2.347',
        lastLap: null,
        bestLap: null,
        currentTire: 'C2',
        tireAge: 8,
        pitStops: 1,
        status: 'RUNNING',
    },
    {
        position: 3,
        driver: {
            id: 'lec',
            code: 'LEC',
            firstName: 'Charles',
            lastName: 'Leclerc',
            number: 16,
            constructor: { id: 'ferrari', name: 'Ferrari', shortName: 'FER', color: '#E8002D' },
            nationality: 'MC',
        },
        gap: '+5.892',
        interval: '+3.545',
        lastLap: null,
        bestLap: null,
        currentTire: 'C3',
        tireAge: 22,
        pitStops: 1,
        status: 'RUNNING',
    },
    {
        position: 4,
        driver: {
            id: 'ham',
            code: 'HAM',
            firstName: 'Lewis',
            lastName: 'Hamilton',
            number: 44,
            constructor: { id: 'ferrari', name: 'Ferrari', shortName: 'FER', color: '#E8002D' },
            nationality: 'GB',
        },
        gap: '+8.234',
        interval: '+2.342',
        lastLap: null,
        bestLap: null,
        currentTire: 'C2',
        tireAge: 12,
        pitStops: 2,
        status: 'RUNNING',
    },
    {
        position: 5,
        driver: {
            id: 'rus',
            code: 'RUS',
            firstName: 'George',
            lastName: 'Russell',
            number: 63,
            constructor: { id: 'mercedes', name: 'Mercedes', shortName: 'MER', color: '#27F4D2' },
            nationality: 'GB',
        },
        gap: '+12.567',
        interval: '+4.333',
        lastLap: null,
        bestLap: null,
        currentTire: 'C3',
        tireAge: 5,
        pitStops: 2,
        status: 'PIT',
    },
];
