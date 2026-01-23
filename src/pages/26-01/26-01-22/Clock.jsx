import React, { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { SoftShadows, Text, Plane, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const SEGMENTS = {
  '0': [1,1,1,0,1,1,1], '1': [0,0,1,0,0,1,0], '2': [1,0,1,1,1,0,1],
  '3': [1,0,1,1,0,1,1], '4': [0,1,1,1,0,1,0], '5': [1,1,0,1,0,1,1],
  '6': [1,1,0,1,1,1,1], '7': [1,0,1,0,0,1,0], '8': [1,1,1,1,1,1,1],
  '9': [1,1,1,1,0,1,1], 'A': [1,1,1,1,1,1,0], 'P': [1,1,1,1,0,1,1],
};

const Segment = ({ position, rotation = [0,0,0], active }) => {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Smooth movement on Z axis
    const targetZ = active ? 0.4 : -0.1;
    meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);

    // Emissive intensity animation
    if (meshRef.current.material) {
      const targetIntensity = active ? 1.5 : 0.02;
      meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
        meshRef.current.material.emissiveIntensity,
        targetIntensity,
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef} position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={[0.9, 0.25, 0.2]} />
      <meshStandardMaterial
        color={active ? "#0066ff" : "#111111"}
        roughness={0.3}
        metalness={0.8}
        emissive="#0044cc"
      />
    </mesh>
  );
};

const Digit = ({ val, xOffset }) => {
  const seg = useMemo(() => SEGMENTS[val] || [0,0,0,0,0,0,0], [val]);
  return (
    <group position={[xOffset, 0, 0]}>
      <Segment active={seg[0]} position={[0, 1.1, 0]} />
      <Segment active={seg[1]} position={[0.55, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Segment active={seg[2]} position={[0.55, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Segment active={seg[3]} position={[0, -1.1, 0]} />
      <Segment active={seg[4]} position={[-0.55, -0.55, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Segment active={seg[5]} position={[-0.55, 0.55, 0]} rotation={[0, 0, Math.PI / 2]} />
      <Segment active={seg[6]} position={[0, 0, 0]} />
    </group>
  );
};

const Scene = () => {
  const [time, setTime] = useState(new Date());
  const lightRef = useRef();
  const clockGroupRef = useRef();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Time String Logic
  const h = time.getHours();
  const h12 = h % 12 || 12;
  const timeStr = [
    h12.toString().padStart(2, '0'),
    time.getMinutes().toString().padStart(2, '0'),
    time.getSeconds().toString().padStart(2, '0')
  ].join('');
  
  const offsets = [-4.5, -3.1, -1.2, 0.2, 2.1, 3.5];

  useFrame((state) => {
    // Camera movement
    const t = state.clock.elapsedTime;
    state.camera.position.x = Math.sin(t * 0.4) * 0.5;
    state.camera.lookAt(0, 0, 0);

    // Light Flicker & Target
    if (lightRef.current && clockGroupRef.current) {
      lightRef.current.target = clockGroupRef.current; // Critical for shadows
      lightRef.current.intensity = 1500 + Math.random() * 200;
    }
  });

  return (
    <>
      <color attach="background" args={['#020202']} />
      <SoftShadows size={25} samples={10} focus={0} />
      
      <ambientLight intensity={0.2} />
      
      <spotLight
        ref={lightRef}
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={1500}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0005}
      />

      <group ref={clockGroupRef} rotation={[-0.2, 0, 0]} position={[0, 0.5, 0]}>
        {/* Time Digits */}
        {timeStr.split('').map((char, i) => (
          <Digit key={i} val={char} xOffset={offsets[i]} />
        ))}

        {/* AM/PM Indicator */}
        <group position={[5.5, 0, 0]}>
          <Digit val={h >= 12 ? 'P' : 'A'} xOffset={0} />
          <Text position={[0, -1.8, 0.2]} fontSize={0.3} color="#222">MODE: 12H</Text>
        </group>

        {/* Ground Plane (The shadow catcher) */}
        <Plane args={[100, 100]} receiveShadow position={[0, 0, -1.2]}>
          <meshStandardMaterial color="#0a0a0a" roughness={1} />
        </Plane>
      </group>
    </>
  );
};

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
        <Scene />
      </Canvas>
    </div>
  );
}