import { useMemo } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const TEXTURE_PATHS = {
    base: '/textures/asphalt/asphalt_base.png',
    normal: '/textures/asphalt/asphalt_normal.png',
    roughness: '/textures/asphalt/asphalt_rough.png',
    metalness: '/textures/asphalt/asphalt_metal.png',
};

interface AsphaltMaterialProps {
    tileRepeat?: number;
    colorTint?: string;
    intensity?: number;
}

export function useAsphaltMaterial({
    tileRepeat = 20,
    colorTint = '#0a0a12',
    intensity = 0.8,
}: AsphaltMaterialProps = {}) {
    const textures = useTexture(TEXTURE_PATHS);

    const material = useMemo(() => {
        Object.values(textures).forEach((texture) => {
            if (texture instanceof THREE.Texture) {
                texture.wrapS = THREE.RepeatWrapping;
                texture.wrapT = THREE.RepeatWrapping;
                texture.repeat.set(tileRepeat, tileRepeat);
                texture.anisotropy = 4;
            }
        });

        return new THREE.MeshStandardMaterial({
            map: textures.base,
            normalMap: textures.normal,
            normalScale: new THREE.Vector2(0.8, 0.8),
            roughnessMap: textures.roughness,
            roughness: 0.85,
            metalnessMap: textures.metalness,
            metalness: 0.15,
            color: new THREE.Color(colorTint).multiplyScalar(intensity),
            envMapIntensity: 0.4,
            flatShading: false,
        });
    }, [textures, tileRepeat, colorTint, intensity]);

    return material;
}

export function preloadAsphaltTextures() {
    useTexture.preload(Object.values(TEXTURE_PATHS));
}

export function AsphaltGround({
    size = 150,
    position = [0, -1.5, 0] as [number, number, number],
    tileRepeat = 20,
}: {
    size?: number;
    position?: [number, number, number];
    tileRepeat?: number;
}) {
    const material = useAsphaltMaterial({ tileRepeat });

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={position} receiveShadow>
            <planeGeometry args={[size, size]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}

export function TrackSurface({
    points,
    width = 0.8,
    tileRepeat = 8,
    position = [0, -1.2, -3] as [number, number, number],
    scale = 1,
}: {
    points: THREE.Vector3[];
    width?: number;
    tileRepeat?: number;
    position?: [number, number, number];
    scale?: number;
}) {
    const material = useAsphaltMaterial({
        tileRepeat,
        colorTint: '#0d0d15',
        intensity: 1.0,
    });

    const trackCurve = useMemo(() => {
        return new THREE.CatmullRomCurve3(points, true);
    }, [points]);

    return (
        <mesh position={position} scale={[scale, scale, scale]} rotation={[Math.PI * 0.12, 0, 0]}>
            <tubeGeometry args={[trackCurve, 64, width, 8, true]} />
            <primitive object={material} attach="material" />
        </mesh>
    );
}
