import { motion } from 'framer-motion';
import type { SectorStatus } from '../../types/simulation';
import { SECTOR_COLORS } from '../../types/simulation';

interface DriverPosition {
    id: string;
    code: string;
    position: number; // 0-100 percentage around the track
    color: string;
    isUserFocus?: boolean;
}

interface SectorMapProps {
    /** Driver positions on track */
    drivers: DriverPosition[];
    /** Current sector statuses (for coloring) */
    sectors?: [SectorStatus, SectorStatus, SectorStatus];
    /** Whether to show pit lane */
    showPitLane?: boolean;
    /** Track name */
    trackName?: string;
}

export function SectorMap({
    drivers,
    sectors = ['NONE', 'NONE', 'NONE'],
    showPitLane = true,
    trackName = 'Las Vegas Strip Circuit',
}: SectorMapProps) {
    return (
        <div className="hud-panel p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <span className="font-square text-[10px] text-silver-arrow/60 tracking-widest">
                    TRACK MAP
                </span>
                <span className="font-square text-[10px] text-electric-cyan tracking-wider">
                    {trackName}
                </span>
            </div>

            {/* Track SVG */}
            <div className="relative w-full aspect-[16/9]">
                <svg viewBox="0 0 400 225" className="w-full h-full">
                    {/* Track Outline - Stylized Las Vegas circuit shape */}
                    <defs>
                        {/* Neon glow filter */}
                        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background track path */}
                    <path
                        d="M 50 50 L 350 50 Q 380 50 380 80 L 380 145 Q 380 175 350 175 L 250 175 L 220 200 L 150 200 L 120 175 L 50 175 Q 20 175 20 145 L 20 80 Q 20 50 50 50"
                        fill="none"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="20"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />

                    {/* Sector 1 */}
                    <path
                        d="M 50 50 L 200 50"
                        fill="none"
                        stroke={SECTOR_COLORS[sectors[0]]}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity={sectors[0] !== 'NONE' ? 1 : 0.3}
                        filter={sectors[0] !== 'NONE' ? 'url(#neonGlow)' : undefined}
                    />

                    {/* Sector 2 */}
                    <path
                        d="M 200 50 L 350 50 Q 380 50 380 80 L 380 145 Q 380 175 350 175 L 250 175"
                        fill="none"
                        stroke={SECTOR_COLORS[sectors[1]]}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity={sectors[1] !== 'NONE' ? 1 : 0.3}
                        filter={sectors[1] !== 'NONE' ? 'url(#neonGlow)' : undefined}
                    />

                    {/* Sector 3 */}
                    <path
                        d="M 250 175 L 220 200 L 150 200 L 120 175 L 50 175 Q 20 175 20 145 L 20 80 Q 20 50 50 50"
                        fill="none"
                        stroke={SECTOR_COLORS[sectors[2]]}
                        strokeWidth="4"
                        strokeLinecap="round"
                        opacity={sectors[2] !== 'NONE' ? 1 : 0.3}
                        filter={sectors[2] !== 'NONE' ? 'url(#neonGlow)' : undefined}
                    />

                    {/* Pit Lane */}
                    {showPitLane && (
                        <path
                            d="M 120 175 L 120 210 L 250 210 L 250 175"
                            fill="none"
                            stroke="rgba(255, 174, 0, 0.5)"
                            strokeWidth="2"
                            strokeDasharray="8 4"
                        />
                    )}

                    {/* Start/Finish Line */}
                    <line
                        x1="50"
                        y1="45"
                        x2="50"
                        y2="55"
                        stroke="#FFFFFF"
                        strokeWidth="3"
                    />
                    <text
                        x="55"
                        y="40"
                        fill="rgba(255,255,255,0.5)"
                        fontSize="8"
                        fontFamily="Rajdhani"
                    >
                        S/F
                    </text>

                    {/* DRS Zones */}
                    <line x1="100" y1="50" x2="180" y2="50" stroke="#00FF00" strokeWidth="2" opacity={0.6} />
                    <line x1="300" y1="50" x2="350" y2="50" stroke="#00FF00" strokeWidth="2" opacity={0.6} />

                    {/* Driver Positions */}
                    {drivers.map((driver) => {
                        const pos = getTrackPosition(driver.position);
                        return (
                            <g key={driver.id}>
                                {/* Driver dot */}
                                <motion.circle
                                    cx={pos.x}
                                    cy={pos.y}
                                    r={driver.isUserFocus ? 8 : 5}
                                    fill={driver.color}
                                    filter="url(#neonGlow)"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                />
                                {/* Driver code label */}
                                {driver.isUserFocus && (
                                    <text
                                        x={pos.x}
                                        y={pos.y - 12}
                                        fill="white"
                                        fontSize="8"
                                        textAnchor="middle"
                                        fontFamily="Rajdhani"
                                        fontWeight="bold"
                                    >
                                        {driver.code}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Sector Legend */}
            <div className="flex justify-center gap-4 mt-3">
                {sectors.map((status, i) => (
                    <div key={i} className="flex items-center gap-1">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: SECTOR_COLORS[status] }}
                        />
                        <span className="font-square text-[10px] text-silver-arrow/60">S{i + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function getTrackPosition(percentage: number): { x: number; y: number } {
    // Simplified track path mapping
    // This is an approximation - real implementation would use path interpolation
    const p = percentage % 100;

    if (p < 25) {
        // Straight 1 (top)
        const t = p / 25;
        return { x: 50 + t * 300, y: 50 };
    } else if (p < 40) {
        // Turn 1-2 (right side down)
        const t = (p - 25) / 15;
        return { x: 350 + 30 * Math.sin(t * Math.PI / 2), y: 50 + t * 125 };
    } else if (p < 55) {
        // Bottom right section
        const t = (p - 40) / 15;
        return { x: 380 - t * 130, y: 175 };
    } else if (p < 70) {
        // Chicane
        const t = (p - 55) / 15;
        return { x: 250 - t * 100, y: 175 + t * 25 };
    } else if (p < 85) {
        // Bottom left section
        const t = (p - 70) / 15;
        return { x: 150 - t * 100, y: 200 - t * 25 };
    } else {
        // Left side up (back to start)
        const t = (p - 85) / 15;
        return { x: 50 - 30 * Math.sin(t * Math.PI / 2), y: 175 - t * 125 };
    }
}

export const DEMO_DRIVER_POSITIONS: DriverPosition[] = [
    { id: 'ver', code: 'VER', position: 45, color: '#3671C6', isUserFocus: true },
    { id: 'nor', code: 'NOR', position: 41, color: '#FF8000' },
    { id: 'lec', code: 'LEC', position: 36, color: '#E8002D' },
    { id: 'ham', code: 'HAM', position: 30, color: '#E8002D' },
    { id: 'rus', code: 'RUS', position: 22, color: '#27F4D2' },
];
