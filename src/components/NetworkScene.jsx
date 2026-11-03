import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
export function rotateNetwork(group, time) {
  if (!group) return;
  group.rotation.y = time * 0.12;
  group.rotation.z = Math.sin(time * 0.15) * 0.12;
}
export function NetworkObject() {
  const group = useRef(null);
  useFrame(({ clock }) => rotateNetwork(group.current, clock.getElapsedTime()));
  return (
    <group ref={group} rotation={[0.25, 0, 0.3]}>
      <mesh>
        <torusKnotGeometry args={[1.45, 0.45, 160, 24, 2, 3]} />
        <meshPhysicalMaterial color="#93b9c3" metalness={0.55} roughness={0.19} clearcoat={1} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.45, 0.018, 8, 100]} />
        <meshStandardMaterial color="#8fbcac" />
      </mesh>
      <mesh position={[2.45, 0, 0]}>
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial color="#224c55" />
      </mesh>
      <mesh position={[-2.45, 0, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#5b9482" />
      </mesh>
    </group>
  );
}
export default function NetworkScene({ onLost }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 7.3], fov: 43 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      onCreated={({ gl }) => {
        gl.domElement.addEventListener(
          'webglcontextlost',
          (event) => {
            event.preventDefault();
            onLost();
          },
          { once: true },
        );
      }}
    >
      <ambientLight intensity={1.7} />
      <directionalLight position={[4, 5, 4]} intensity={4} />
      <directionalLight position={[-4, -2, 2]} intensity={2} color="#bce7d5" />
      <NetworkObject />
    </Canvas>
  );
}
