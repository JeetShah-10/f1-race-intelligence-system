import { Canvas } from "@react-three/fiber"

function Scene() {
  return (
    <mesh>
      <boxGeometry args={[1,1,1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

export default function App() {
  return (
    <div className="h-screen w-screen">
      <Canvas>
        <ambientLight />
        <Scene />
      </Canvas>
    </div>
  );
}

