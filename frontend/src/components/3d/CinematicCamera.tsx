import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as THREE from 'three';

gsap.registerPlugin(ScrollTrigger);

interface CameraKeyframe {
    position: [number, number, number];
    target: [number, number, number];
    fov: number;
}

const CAMERA_KEYFRAMES: CameraKeyframe[] = [
    { position: [6, 3, 8], target: [-1.5, 0, 0], fov: 35 },
    { position: [4, 2, 6], target: [-1.5, -0.5, 0], fov: 35 },
    { position: [1, 1, 3], target: [-1.5, -0.3, 0], fov: 40 },
    { position: [5, 4, 10], target: [-1.5, -0.5, 0], fov: 30 },
    { position: [4, 2.5, 7], target: [-1.5, -0.5, 0], fov: 32 },
];

interface CinematicCameraProps {
    scrollEnabled?: boolean;
}

export function CinematicCamera({ scrollEnabled = true }: CinematicCameraProps) {
    const { camera } = useThree();
    const progressRef = useRef({ value: 0 });
    const targetRef = useRef(new THREE.Vector3(-1.5, -0.5, 0));
    const isAnimatingRef = useRef(false);

    useEffect(() => {
        if (!scrollEnabled) return;

        const scrollTrigger = ScrollTrigger.create({
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 1.5,
            onUpdate: (self) => {
                progressRef.current.value = self.progress;
            },
        });

        camera.position.set(...CAMERA_KEYFRAMES[0].position);
        if (camera instanceof THREE.PerspectiveCamera) {
            camera.fov = CAMERA_KEYFRAMES[0].fov;
            camera.updateProjectionMatrix();
        }

        return () => {
            scrollTrigger.kill();
        };
    }, [camera, scrollEnabled]);

    useFrame(() => {
        if (!scrollEnabled || isAnimatingRef.current) return;

        const progress = progressRef.current.value;
        const numSegments = CAMERA_KEYFRAMES.length - 1;

        const segmentProgress = progress * numSegments;
        const segmentIndex = Math.min(Math.floor(segmentProgress), numSegments - 1);
        const segmentT = segmentProgress - segmentIndex;

        const from = CAMERA_KEYFRAMES[segmentIndex];
        const to = CAMERA_KEYFRAMES[segmentIndex + 1];

        const easedT = easeOutExpo(segmentT);

        const newX = THREE.MathUtils.lerp(from.position[0], to.position[0], easedT);
        const newY = THREE.MathUtils.lerp(from.position[1], to.position[1], easedT);
        const newZ = THREE.MathUtils.lerp(from.position[2], to.position[2], easedT);

        camera.position.x += (newX - camera.position.x) * 0.1;
        camera.position.y += (newY - camera.position.y) * 0.1;
        camera.position.z += (newZ - camera.position.z) * 0.1;

        const targetX = THREE.MathUtils.lerp(from.target[0], to.target[0], easedT);
        const targetY = THREE.MathUtils.lerp(from.target[1], to.target[1], easedT);
        const targetZ = THREE.MathUtils.lerp(from.target[2], to.target[2], easedT);

        targetRef.current.set(targetX, targetY, targetZ);
        camera.lookAt(targetRef.current);

        if (camera instanceof THREE.PerspectiveCamera) {
            const newFov = THREE.MathUtils.lerp(from.fov, to.fov, easedT);
            camera.fov += (newFov - camera.fov) * 0.1;
            camera.updateProjectionMatrix();
        }
    });

    return null;
}

function easeOutExpo(t: number): number {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export function useAmbientCameraMotion(enabled: boolean = true) {
    const { camera } = useThree();
    const timeRef = useRef(0);
    const basePositionRef = useRef<THREE.Vector3 | null>(null);

    useFrame((_, delta) => {
        if (!enabled) return;

        if (!basePositionRef.current) {
            basePositionRef.current = camera.position.clone();
        }

        timeRef.current += delta;

        const breatheX = Math.sin(timeRef.current * 0.3) * 0.05;
        const breatheY = Math.sin(timeRef.current * 0.2) * 0.03;

        camera.position.x += breatheX * delta;
        camera.position.y += breatheY * delta;
    });
}
