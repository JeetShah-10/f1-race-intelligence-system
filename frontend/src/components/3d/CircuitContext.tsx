import { useMemo, Suspense } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { useAsphaltMaterial } from './AsphaltMaterial';

interface CircuitContextProps {
    animate?: boolean;
    progress?: number;
    scale?: number;
}

const CIRCUIT_POINTS: [number, number][] = [
    [0, 0], [6, 0], [8, -1], [8, -4],
    [7, -5], [5, -5], [4, -6], [4, -8],
    [5, -9], [7, -9], [8, -10], [8, -12],
    [6, -13], [3, -13], [2, -12], [2, -8],
    [2, -4], [2, -1], [0, 0],
];

const SECTOR_DIVISIONS = {
    sector1: { start: 0, end: 7 },
    sector2: { start: 6, end: 13 },
    sector3: { start: 12, end: 19 },
};

const SECTOR_COLORS = {
    sector1: '#F9E300',
    sector2: '#CF2C28',
    sector3: '#A020F0',
};

export function CircuitContext({ progress = 1, scale = 1 }: CircuitContextProps) {
    const trackPoints = useMemo(() =>
        CIRCUIT_POINTS.map(([x, z]) => new THREE.Vector3(x, 0, z)),
        []);

    const sector1Points = useMemo(() =>
        trackPoints.slice(SECTOR_DIVISIONS.sector1.start, SECTOR_DIVISIONS.sector1.end),
        [trackPoints]);

    const sector2Points = useMemo(() =>
        trackPoints.slice(SECTOR_DIVISIONS.sector2.start, SECTOR_DIVISIONS.sector2.end),
        [trackPoints]);

    const sector3Points = useMemo(() =>
        trackPoints.slice(SECTOR_DIVISIONS.sector3.start),
        [trackPoints]);

    const opacity = progress;

    return (
        <group scale={[scale, scale, scale]} position={[0, -1.2, -3]} rotation={[Math.PI * 0.12, 0, 0]}>
            <Suspense fallback={null}>
                <TrackSurfaceMesh points={trackPoints} opacity={opacity} />
            </Suspense>

            <Line points={trackPoints} color="#1a1a2e" lineWidth={4} transparent opacity={opacity * 0.8} />
            <Line points={sector1Points} color={SECTOR_COLORS.sector1} lineWidth={2.5} transparent opacity={opacity} />
            <Line points={sector2Points} color={SECTOR_COLORS.sector2} lineWidth={2.5} transparent opacity={opacity} />
            <Line points={sector3Points} color={SECTOR_COLORS.sector3} lineWidth={2.5} transparent opacity={opacity} />

            <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <planeGeometry args={[0.5, 0.1]} />
                <meshBasicMaterial color="#FFFFFF" transparent opacity={opacity} />
            </mesh>

            <mesh position={[3, 0.02, -1]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
                <planeGeometry args={[0.3, 0.05]} />
                <meshBasicMaterial color="#FFD700" transparent opacity={opacity * 0.7} />
            </mesh>

            <Line
                points={[
                    new THREE.Vector3(3, 0.01, -13),
                    new THREE.Vector3(6, 0.01, -13),
                ]}
                color="#00E676"
                lineWidth={3}
                transparent
                opacity={opacity * 0.6}
            />
        </group>
    );
}

function TrackSurfaceMesh({ points, opacity = 1 }: { points: THREE.Vector3[]; opacity?: number }) {
    const material = useAsphaltMaterial({
        tileRepeat: 12,
        colorTint: '#0d0d18',
        intensity: 0.9,
    });

    const trackCurve = useMemo(() => {
        return new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
    }, [points]);

    const tubeGeometry = useMemo(() => {
        const geo = new THREE.TubeGeometry(trackCurve, 80, 0.5, 8, true);
        return geo;
    }, [trackCurve]);

    const trackMaterial = useMemo(() => {
        const mat = material.clone();
        mat.transparent = true;
        mat.opacity = opacity;
        return mat;
    }, [material, opacity]);

    return <mesh geometry={tubeGeometry} material={trackMaterial} />;
}
