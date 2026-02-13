import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';

export function RaceResults() {
    const { currentStandings, raceConfig, backToCircuits, allPastEvents } = useSimulationStore();

    if (!currentStandings.length) return null;

    const podium = currentStandings.filter(d => d.status !== 'OUT').slice(0, 3);
    const classification = currentStandings;

    // Find fastest lap holder
    const fastestLapDriver = currentStandings.find(d => d.isFastestLap);

    // Count overtakes
    const overtakes = allPastEvents.filter(e => e.type === 'OVERTAKE').length;

    return (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: '#0a0a0f' }}>

            {/* Header */}
            <motion.div
                className="shrink-0 text-center py-6"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="text-[10px] text-white/30 tracking-[0.3em] font-medium mb-1">RACE RESULTS</div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                    {raceConfig?.circuitName || 'Grand Prix'}
                </h1>
                <div className="text-xs text-white/20 tracking-widest mt-1">
                     CLASSIFICATION • {raceConfig?.year || 2026}
                </div>
            </motion.div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
                <div className="max-w-3xl mx-auto">

                    {/* Podium */}
                    <motion.div
                        className="flex items-end justify-center gap-4 mb-10 h-56"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        {/* P2 */}
                        {podium[1] && <PodiumBlock driver={podium[1]} position={2} delay={0.6} height="h-36" />}
                        {/* P1 */}
                        {podium[0] && <PodiumBlock driver={podium[0]} position={1} delay={0.4} height="h-48" />}
                        {/* P3 */}
                        {podium[2] && <PodiumBlock driver={podium[2]} position={3} delay={0.8} height="h-28" />}
                    </motion.div>

                    {/* Quick Stats */}
                    <motion.div
                        className="grid grid-cols-3 gap-4 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.0 }}
                    >
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="text-lg font-black text-[#A020F0]">
                                {fastestLapDriver?.driverCode || '---'}
                            </div>
                            <div className="text-[10px] text-white/30 tracking-wider mt-0.5">FASTEST LAP</div>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="text-lg font-black text-white">{overtakes}</div>
                            <div className="text-[10px] text-white/30 tracking-wider mt-0.5">OVERTAKES</div>
                        </div>
                        <div className="text-center p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div className="text-lg font-black text-white">
                                {currentStandings.filter(d => d.status === 'OUT').length}
                            </div>
                            <div className="text-[10px] text-white/30 tracking-wider mt-0.5">RETIREMENTS</div>
                        </div>
                    </motion.div>

                    {/* Full Classification */}
                    <motion.div
                        className="rounded-lg overflow-hidden"
                        style={{ border: '1px solid rgba(255,255,255,0.06)' }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                    >
                        {/* Table header */}
                        <div className="flex items-center px-4 py-2 text-[10px] text-white/30 tracking-wider font-medium"
                            style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                            <div className="w-10">POS</div>
                            <div className="w-4" />
                            <div className="flex-1">DRIVER</div>
                            <div className="w-20 text-right">GAP</div>
                            <div className="w-16 text-center">STOPS</div>
                            <div className="w-16 text-center">STATUS</div>
                        </div>

                        {/* Rows */}
                        {classification.map((driver, idx) => (
                            <motion.div
                                key={driver.driverCode}
                                className="flex items-center px-4 py-2.5 border-b transition-colors hover:bg-white/[0.02]"
                                style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.3 + idx * 0.04 }}
                            >
                                {/* Position */}
                                <div className="w-10">
                                    <span className="text-sm font-black" style={{
                                        color: idx === 0 ? '#FFD700' : idx === 1 ? '#C0C0C0' : idx === 2 ? '#CD7F32' : driver.status === 'OUT' ? '#FF1744' : 'rgba(255,255,255,0.5)',
                                    }}>
                                        {driver.status === 'OUT' ? 'DNF' : driver.position}
                                    </span>
                                </div>

                                {/* Team bar */}
                                <div className="w-[3px] h-5 rounded-full mr-3" style={{ background: driver.teamColor }} />

                                {/* Driver */}
                                <div className="flex-1 min-w-0 flex items-center gap-2">
                                    <span className="text-sm font-bold text-white">{driver.driverCode}</span>
                                    <span className="text-xs text-white/20">{driver.teamName}</span>
                                    {driver.isFastestLap && (
                                        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold" style={{ background: '#A020F0', color: '#fff' }}>
                                            FL
                                        </span>
                                    )}
                                </div>

                                {/* Gap */}
                                <div className="w-20 text-right text-xs font-mono" style={{ color: driver.status === 'OUT' ? '#FF1744' : 'rgba(255,255,255,0.4)' }}>
                                    {driver.gapToLeader}
                                </div>

                                {/* Pit stops */}
                                <div className="w-16 text-center text-xs text-white/30">
                                    {driver.pitStops}
                                </div>

                                {/* Status */}
                                <div className="w-16 text-center">
                                    <span className="text-[10px] font-bold tracking-wider" style={{
                                        color: driver.status === 'OUT' ? '#FF1744' : '#00E676',
                                    }}>
                                        {driver.status === 'OUT' ? 'DNF' : 'FIN'}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom CTA */}
            <motion.div
                className="shrink-0 px-6 py-5 flex justify-center gap-4"
                style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.0 }}
            >
                <button
                    onClick={backToCircuits}
                    className="px-8 py-3 rounded-lg text-white font-bold text-sm tracking-wider uppercase"
                    style={{
                        background: 'rgba(255,255,255,0.06)',
                        border: '1px solid rgba(255,255,255,0.1)',
                    }}
                >
                    BACK TO CIRCUITS
                </button>
            </motion.div>
        </div>
    );
}

function PodiumBlock({
    driver,
    position,
    delay,
    height,
}: {
    driver: {
        driverCode: string;
        driverName: string;
        teamColor: string;
        teamName: string;
        gapToLeader: string;
        driverPhoto?: string;
    };
    position: number;
    delay: number;
    height: string;
}) {
    const posColors: Record<number, string> = { 1: '#FFD700', 2: '#C0C0C0', 3: '#CD7F32' };
    const posLabels: Record<number, string> = { 1: '1ST', 2: '2ND', 3: '3RD' };

    return (
        <motion.div
            className="flex flex-col items-center w-36"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            {/* Driver photo */}
            <div className="w-16 h-16 rounded-full overflow-hidden mb-3 ring-2"
                style={{ background: 'rgba(255,255,255,0.05)', outline: `2px solid ${driver.teamColor}`, outlineOffset: '-2px' }}>
                {driver.driverPhoto && (
                    <img
                        src={driver.driverPhoto}
                        alt={driver.driverName}
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                )}
            </div>

            {/* Driver name */}
            <div className="text-sm font-black text-white mb-1">{driver.driverCode}</div>
            <div className="text-[10px] text-white/30 mb-3">{driver.teamName}</div>

            {/* Podium block */}
            <div
                className={`w-full ${height} rounded-t-lg flex items-start justify-center pt-3`}
                style={{
                    background: `linear-gradient(180deg, ${driver.teamColor}20 0%, ${driver.teamColor}08 100%)`,
                    border: `1px solid ${driver.teamColor}30`,
                    borderBottom: 'none',
                }}
            >
                <span className="text-xl font-black" style={{ color: posColors[position] }}>
                    {posLabels[position]}
                </span>
            </div>
        </motion.div>
    );
}
