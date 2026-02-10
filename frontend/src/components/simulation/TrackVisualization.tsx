import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSimulationStore } from '../../store/useSimulationStore';

export function TrackVisualization() {
    const { standings, currentLap, totalLaps } = useSimulationStore();

    // Map drivers to a position on a circle (0-360 degrees)
    // In a real implementation, this would map to SVG path coordinates of the specific circuit
    // For now, we simulate "progress" within the lap if we had sector times, but since we receive "Lap Updates"
    // we might only get positions once per lap? 
    // Wait, the backend streams updates. If it streams "Sector" updates, we can interp.
    // If it only streams "Lap" updates, the dots will jump. 
    // Let's assume for V1 we just show the ORDER on the track, spread out by time gaps?

    // Better visual: A "Gap String" or "Track Radar". 
    // Let's visualize the "Gap from Leader" on a circular track.
    // Leader is at 12 o'clock. 
    // Driver +10s is behind... how many degrees?
    // Avg lap time ~90s => 360 degrees.
    // So 1s = 4 degrees.

    const driverPositions = useMemo(() => {
        return standings.map((driver) => {
            let gapSeconds = 0;
            if (driver.gap !== 'LEADER') {
                gapSeconds = parseFloat(driver.gap.replace('+', ''));
            }

            // Map gap to degrees (Leader at 0/360)
            // 90s lap = 360 deg -> 1s = 4 deg
            // If gap is 10s, angle is -40 deg (behind)
            const angle = 360 - (gapSeconds * 4) % 360;

            return {
                ...driver,
                angle
            };
        });
    }, [standings]);

    return (
        <div className="relative w-full h-full flex items-center justify-center p-8">
            {/* Track Line */}
            <div className="absolute w-[500px] h-[500px] rounded-full border-4 border-white/10" />

            {/* Sectors/Markers (Decorative) */}
            <div className="absolute w-[520px] h-[520px] rounded-full border border-dashed border-white/5 opacity-50 animate-spin-slow" />

            {/* Start/Finish Line */}
            <div className="absolute top-[calc(50%-260px)] h-8 w-1 bg-white/50 z-10" />

            {/* Cars */}
            {driverPositions.map((d) => (
                <motion.div
                    key={d.driver.code}
                    className="absolute w-[500px] h-[500px]" // Container to rotate
                    animate={{ rotate: d.angle }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                >
                    {/* The Dot (Offset to circle edge) */}
                    <div
                        className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    >
                        {/* Driver Dot */}
                        <div
                            className="w-4 h-4 rounded-full border-2 border-[#0B0D10] shadow-[0_0_10px_currentColor]"
                            style={{
                                backgroundColor: d.driver.constructor.color || '#fff',
                                color: d.driver.constructor.color || '#fff'
                            }}
                        />
                        {/* Driver Code Label */}
                        <span className="text-[10px] font-bold mt-1 opacity-80" style={{ color: d.driver.constructor.color }}>
                            {d.driver.code}
                        </span>
                    </div>
                </motion.div>
            ))}

            {/* Center Info */}
            <div className="absolute text-center">
                <div className="text-6xl font-bold font-mono tracking-tighter">
                    {currentLap}<span className="text-2xl text-white/40">/{totalLaps}</span>
                </div>
                <div className="text-sm uppercase tracking-widest text-[#CF2C28] mt-2 font-bold">
                    Lap Number
                </div>
            </div>
        </div>
    );
}
