import { useMemo, Suspense } from 'react';
import * as THREE from 'three';
import { AsphaltGround } from './AsphaltMaterial';

interface EnvironmentBackdropProps {
    intensity?: number;
}

export function EnvironmentBackdrop({ intensity = 1 }: EnvironmentBackdropProps) {
    const skyTexture = useMemo(() => createGradientTexture(), []);

    const buildings = useMemo(() => [
        { x: -35, z: -55, h: 20, w: 6 },
        { x: -15, z: -60, h: 28, w: 5 },
        { x: 5, z: -65, h: 35, w: 7 },
        { x: 25, z: -58, h: 22, w: 5 },
        { x: 45, z: -62, h: 18, w: 6 },
        { x: -50, z: -70, h: 15, w: 4 },
        { x: 35, z: -75, h: 25, w: 6 },
        { x: -5, z: -80, h: 40, w: 8 },
    ], []);

    return (
        <group>
            <mesh scale={[-1, 1, 1]}>
                <sphereGeometry args={[80, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshBasicMaterial side={THREE.BackSide} map={skyTexture} />
            </mesh>

            <SimpleStars count={250} />

            <Suspense fallback={<FallbackGround />}>
                <AsphaltGround size={150} position={[0, -1.5, 0]} tileRepeat={25} />
            </Suspense>

            {buildings.map((b, i) => (
                <group key={i} position={[b.x, b.h / 2 - 1.5, b.z]}>
                    <mesh>
                        <boxGeometry args={[b.w, b.h, 3]} />
                        <meshBasicMaterial color="#030308" />
                    </mesh>
                    <mesh position={[0, b.h * 0.3, 1.6]}>
                        <boxGeometry args={[b.w * 0.8, 0.1, 0.1]} />
                        <meshBasicMaterial
                            color={i % 2 === 0 ? "#ff0066" : "#00ccff"}
                            transparent
                            opacity={0.6 * intensity}
                        />
                    </mesh>
                </group>
            ))}

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.48, -40]}>
                <planeGeometry args={[120, 40]} />
                <meshBasicMaterial color="#1a0520" transparent opacity={0.35 * intensity} />
            </mesh>

            <TrackLightingStrips intensity={intensity} />
            <fog attach="fog" args={['#050510', 25, 90]} />
        </group>
    );
}

function FallbackGround() {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]}>
            <planeGeometry args={[150, 150]} />
            <meshStandardMaterial color="#0a0a12" metalness={0.6} roughness={0.4} />
        </mesh>
    );
}

function TrackLightingStrips({ intensity = 1 }: { intensity?: number }) {
    const stripPositions = useMemo(() => [
        { x: -8, z: 5, color: '#ff0066' },
        { x: 8, z: 5, color: '#00ccff' },
        { x: -10, z: -15, color: '#ffcc00' },
        { x: 10, z: -15, color: '#ff0066' },
    ], []);

    return (
        <group>
            {stripPositions.map((strip, i) => (
                <mesh key={i} position={[strip.x, -1.45, strip.z]} rotation={[-Math.PI / 2, 0, 0]}>
                    <planeGeometry args={[0.15, 8]} />
                    <meshBasicMaterial color={strip.color} transparent opacity={0.3 * intensity} />
                </mesh>
            ))}
        </group>
    );
}

function SimpleStars({ count = 250 }: { count?: number }) {
    const geometry = useMemo(() => {
        const positions = new Float32Array(count * 3);

        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.random() * Math.PI * 0.35;
            const r = 60 + Math.random() * 15;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.cos(phi);
            positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        return geo;
    }, [count]);

    return (
        <points geometry={geometry}>
            <pointsMaterial size={0.4} color="#FFFFFF" transparent opacity={0.5} sizeAttenuation={false} />
        </points>
    );
}

function createGradientTexture(): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 128;
    const ctx = canvas.getContext('2d')!;

    const gradient = ctx.createLinearGradient(0, 0, 0, 128);
    gradient.addColorStop(0, '#000005');
    gradient.addColorStop(0.3, '#050510');
    gradient.addColorStop(0.6, '#0a0a18');
    gradient.addColorStop(1, '#120a1a');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2, 128);

    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
}
