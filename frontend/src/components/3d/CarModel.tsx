import React from 'react'
import { useGLTF } from '@react-three/drei'


export function CarModel(props: React.JSX.IntrinsicElements['group']) {
    // Load the model from the public directory
    const { scene } = useGLTF('/models/mclaren.glb')

    return (
        <group {...props} dispose={null}>
            <primitive object={scene} />
        </group>
    )
}

useGLTF.preload('/models/mclaren.glb')
