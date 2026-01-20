import { Canvas } from '@react-three/fiber';
import { Environment, ContactShadows, Float, Preload } from '@react-three/drei';
import { Suspense } from 'react';
import { CarModel } from './CarModel';
import { CinematicCamera } from './CinematicCamera';
import { CircuitContext } from './CircuitContext';
import { EnvironmentBackdrop } from './EnvironmentBackdrop';

export function ThinkingCanvas() {
    return (
        <div className="w-full h-full">
            <Canvas
                gl={{
                    antialias: true,
                    alpha: false,
                    powerPreference: 'high-performance',
                    toneMapping: 3,
                    toneMappingExposure: 1.1,
                }}
                dpr={[1, 1.5]}
                shadows={false}
                camera={{ position: [6, 3, 8], fov: 35 }}
            >
                <color attach="background" args={['#050510']} />

                <Suspense fallback={null}>
                    <CinematicCamera scrollEnabled={true} />
                    <EnvironmentBackdrop intensity={1} />
                    <Environment preset="night" background={false} />
                    <CircuitContext animate={false} progress={1} scale={0.8} />

                    <ambientLight intensity={0.2} color="#9999ff" />
                    <directionalLight position={[8, 10, 6]} intensity={1.5} color="#FFD700" />
                    <directionalLight position={[-8, 5, 4]} intensity={0.8} color="#00CCFF" />
                    <directionalLight position={[-2, 3, -8]} intensity={0.6} color="#FF00FF" />

                    <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.15}>
                        <group position={[0, -0.5, 0]} rotation={[0, Math.PI / 6, 0]}>
                            <CarModel />
                        </group>
                    </Float>

                    <ContactShadows
                        position={[0, -1.48, 0]}
                        opacity={0.6}
                        scale={15}
                        blur={2}
                        far={4}
                        color="#000015"
                    />

                    <Preload all />
                </Suspense>
            </Canvas>
        </div>
    );
}
