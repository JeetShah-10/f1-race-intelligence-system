import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';
import type { RaceEvent } from '../../types/simulation';

//  Event Queue 
interface QueuedEvent extends RaceEvent {
    id: string;
    expiresAt: number;
}

const EVENT_DURATION: Record<string, number> = {
    SC_DEPLOY: 6000,
    CRASH: 6000,
    VSC_DEPLOY: 5000,
    DNF: 5000,
    PENALTY: 5000,
    FASTEST_LAP: 4000,
    PIT_STOP: 3500,
    OVERTAKE: 3000,
    SC_END: 3000,
    VSC_END: 3000,
    DRS_ENABLED: 2500,
    YELLOW_FLAG: 3000,
};

// Only show chyrons for high-drama events
const HIGH_DRAMA_EVENTS = new Set([
    'SC_DEPLOY', 'CRASH', 'VSC_DEPLOY', 'DNF', 'PENALTY', 'FASTEST_LAP',
]);

export function BroadcastOverlays() {
    const { currentEvents, currentLap, currentFlag, currentStandings } = useSimulationStore();
    const [activeEvents, setActiveEvents] = useState<QueuedEvent[]>([]);
    const eventIdCounter = useRef(0);

    // Queue new events
    useEffect(() => {
        if (!currentEvents.length) return;

        const highDramaEvents = currentEvents.filter(e => HIGH_DRAMA_EVENTS.has(e.type));
        if (!highDramaEvents.length) return;

        const now = Date.now();
        const newQueued: QueuedEvent[] = highDramaEvents.map(e => ({
            ...e,
            id: `${e.type}-${currentLap}-${++eventIdCounter.current}`,
            expiresAt: now + (EVENT_DURATION[e.type] || 3000),
        }));

        setActiveEvents(prev => [...prev, ...newQueued]);
    }, [currentEvents, currentLap]);

    // Remove expired events
    useEffect(() => {
        if (!activeEvents.length) return;
        const timer = setInterval(() => {
            setActiveEvents(prev => prev.filter(e => Date.now() < e.expiresAt));
        }, 500);
        return () => clearInterval(timer);
    }, [activeEvents.length]);

    // Get the latest event for display
    const latestEvent = activeEvents[activeEvents.length - 1];

    // Check for active SC/VSC flags
    const isSC = currentFlag === 'SC';
    const isVSC = currentFlag === 'VSC';

    return (
        <>
            {/*  Safety Car / VSC Banner  */}
            <AnimatePresence>
                {(isSC || isVSC) && (
                    <motion.div
                        className="absolute top-4 left-1/2 -translate-x-1/2 z-40"
                        initial={{ opacity: 0, y: -30, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center gap-3 px-6 py-3 rounded-lg"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,152,0,0.9) 0%, rgba(230,81,0,0.9) 100%)',
                                boxShadow: '0 0 40px rgba(255,152,0,0.3), 0 4px 20px rgba(0,0,0,0.5)',
                            }}>
                            <motion.div
                                animate={{ opacity: [1, 0.4, 1] }}
                                transition={{ repeat: Infinity, duration: 1.2 }}
                            >
                                <span className="text-2xl">[!]</span>
                            </motion.div>
                            <div>
                                <div className="text-[10px] text-white/70 tracking-[0.2em] font-bold">
                                    {isSC ? 'SAFETY CAR' : 'VIRTUAL SAFETY CAR'}
                                </div>
                                <div className="text-white font-black text-lg tracking-wider">
                                    {isSC ? 'SC DEPLOYED' : 'VSC DEPLOYED'}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/*  Event Chyrons  */}
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 w-[500px]">
                <AnimatePresence mode="sync">
                    {latestEvent && (
                        <EventChyron
                            key={latestEvent.id}
                            event={latestEvent}
                            standings={currentStandings}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/*  Lap Counter  */}
            <LapIndicator />
        </>
    );
}

//  Event Chyron Component 
function EventChyron({
    event,
    standings,
}: {
    event: QueuedEvent;
    standings: { driverCode: string; teamColor: string; driverPhoto?: string }[];
}) {
    const driverInfo = event.drivers[0]
        ? standings.find(d => d.driverCode === event.drivers[0])
        : null;

    const styles = getEventStyle(event.type);

    return (
        <motion.div
            className="w-full overflow-hidden rounded-lg"
            style={{
                background: styles.bg,
                boxShadow: styles.glow,
                border: `1px solid ${styles.border}`,
            }}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <div className="flex items-center gap-3 px-4 py-3">

                {/* Team color bar */}
                {driverInfo && (
                    <div className="shrink-0 w-[3px] h-10 rounded-full" style={{ background: driverInfo.teamColor }} />
                )}

                {/* Driver photo */}
                {driverInfo?.driverPhoto && (
                    <div className="shrink-0 w-10 h-10 rounded overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <img
                            src={driverInfo.driverPhoto}
                            alt=""
                            className="w-full h-full object-cover object-top"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">{styles.icon}</span>
                        <span className="text-[10px] font-bold tracking-[0.15em]" style={{ color: styles.label }}>
                            {styles.labelText}
                        </span>
                    </div>
                    <div className="text-sm text-white/80 mt-0.5 truncate">
                        {event.description}
                    </div>
                </div>

                {/* Lap badge */}
                <div className="shrink-0 px-2 py-1 rounded text-[10px] font-bold text-white/40"
                    style={{ background: 'rgba(255,255,255,0.05)' }}>
                    LAP {event.lap}
                </div>
            </div>

            {/* Purple flash for fastest lap */}
            {event.type === 'FASTEST_LAP' && (
                <motion.div
                    className="h-[2px]"
                    style={{ background: 'linear-gradient(90deg, transparent, #A020F0, transparent)' }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6 }}
                />
            )}
        </motion.div>
    );
}

function getEventStyle(type: string) {
    switch (type) {
        case 'SC_DEPLOY':
            return {
                bg: 'linear-gradient(135deg, rgba(255,152,0,0.15) 0%, rgba(10,10,15,0.95) 100%)',
                glow: '0 0 20px rgba(255,152,0,0.15)',
                border: 'rgba(255,152,0,0.25)',
                icon: '[!]',
                labelText: 'SAFETY CAR',
                label: '#FF9800',
            };
        case 'VSC_DEPLOY':
            return {
                bg: 'linear-gradient(135deg, rgba(255,152,0,0.12) 0%, rgba(10,10,15,0.95) 100%)',
                glow: '0 0 15px rgba(255,152,0,0.1)',
                border: 'rgba(255,152,0,0.2)',
                icon: '[!]',
                labelText: 'VIRTUAL SAFETY CAR',
                label: '#FF9800',
            };
        case 'CRASH':
        case 'DNF':
            return {
                bg: 'linear-gradient(135deg, rgba(255,23,68,0.15) 0%, rgba(10,10,15,0.95) 100%)',
                glow: '0 0 20px rgba(255,23,68,0.15)',
                border: 'rgba(255,23,68,0.25)',
                icon: '',
                labelText: type === 'CRASH' ? 'INCIDENT' : 'RETIREMENT',
                label: '#FF1744',
            };
        case 'FASTEST_LAP':
            return {
                bg: 'linear-gradient(135deg, rgba(160,32,240,0.15) 0%, rgba(10,10,15,0.95) 100%)',
                glow: '0 0 20px rgba(160,32,240,0.15)',
                border: 'rgba(160,32,240,0.3)',
                icon: '',
                labelText: 'FASTEST LAP',
                label: '#A020F0',
            };
        case 'PENALTY':
            return {
                bg: 'linear-gradient(135deg, rgba(255,193,7,0.12) 0%, rgba(10,10,15,0.95) 100%)',
                glow: '0 0 15px rgba(255,193,7,0.1)',
                border: 'rgba(255,193,7,0.2)',
                icon: '',
                labelText: 'FIA STEWARDS',
                label: '#FFC107',
            };
        default:
            return {
                bg: 'rgba(10,10,15,0.9)',
                glow: 'none',
                border: 'rgba(255,255,255,0.08)',
                icon: '',
                labelText: 'RACE CONTROL',
                label: 'rgba(255,255,255,0.5)',
            };
    }
}

//  Lap Counter 
function LapIndicator() {
    const { currentLap, raceConfig, currentFlag } = useSimulationStore();
    if (!raceConfig) return null;

    const flagColor = currentFlag === 'SC' || currentFlag === 'VSC' ? '#FF9800'
        : currentFlag === 'RED' ? '#FF1744'
            : currentFlag === 'YELLOW' ? '#FFC107'
                : 'rgba(255,255,255,0.1)';

    return (
        <div className="absolute top-4 right-4 z-20">
            <div className="px-3 py-2 rounded-lg" style={{
                background: 'rgba(0,0,0,0.7)',
                border: `1px solid ${flagColor}`,
                boxShadow: flagColor !== 'rgba(255,255,255,0.1)' ? `0 0 12px ${flagColor}30` : 'none',
            }}>
                <div className="text-[9px] text-white/30 tracking-[0.2em] font-bold">LAP</div>
                <div className="text-xl font-black text-white text-center">
                    {currentLap}<span className="text-white/30 text-sm">/{raceConfig.totalLaps}</span>
                </div>
            </div>
        </div>
    );
}
