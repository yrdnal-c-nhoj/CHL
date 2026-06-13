import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import * as THREE from 'three';

// Helper function to create clock drawer for a single canvas
const createClockDrawer = (canvas) => {
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  return () => {
    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const ms = now.getMilliseconds();

    // White clock background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);

    // Outer Rim
    ctx.strokeStyle = '#222222';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.arc(256, 256, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Hour Ticks
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * 195, 256 + Math.sin(angle) * 195);
      ctx.lineTo(256 + Math.cos(angle) * 215, 256 + Math.sin(angle) * 215);
      ctx.stroke();
    }

    const drawHand = (angle, length, width, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(256 + Math.sin(angle) * length, 256 - Math.cos(angle) * length);
      ctx.stroke();
    };

    // Continuous, smooth calculations
    const secAngle = ((secs + ms / 1000) * Math.PI) / 30;
    const minAngle = ((mins + secs / 60) * Math.PI) / 30;
    const hrAngle = (((hrs % 12) + mins / 60) * Math.PI) / 6;

    drawHand(hrAngle, 110, 12, '#111111'); // Hour
    drawHand(minAngle, 160, 8, '#444444');  // Minute
    drawHand(secAngle, 185, 4, '#ff3333');  // Second

    // Center Node
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(256, 256, 10, 0, Math.PI * 2);
    ctx.fill();
  };
};

// The Pyramid Mesh Component with 4 clocks on 4 faces
const PyramidMesh = () => {
  const meshRef = useRef();
  const texturesRef = useRef([]);

  // Initialize 4 separate canvases and textures (only for the 4 side faces)
  const [materials] = useState(() => {
    const mats = [];
    texturesRef.current = [];

    // Create 4 materials for the 4 side faces (indices 0, 1, 2, 3)
    for (let i = 0; i < 4; i++) {
      const canvas = document.createElement('canvas');
      const drawFn = createClockDrawer(canvas);
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;

      texturesRef.current.push({ texture, drawFn });

      mats.push(
        new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.2,
          metalness: 0.1,
          side: THREE.DoubleSide
        })
      );
    }
    
    // Create a plain material for the base (index 4) - no clock
    const baseCanvas = document.createElement('canvas');
    baseCanvas.width = 512;
    baseCanvas.height = 512;
    const baseCtx = baseCanvas.getContext('2d');
    baseCtx.fillStyle = '#222222';
    baseCtx.fillRect(0, 0, 512, 512);
    
    const baseTexture = new THREE.CanvasTexture(baseCanvas);
    baseTexture.wrapS = THREE.ClampToEdgeWrapping;
    baseTexture.wrapT = THREE.ClampToEdgeWrapping;
    
    mats.push(
      new THREE.MeshStandardMaterial({
        map: baseTexture,
        roughness: 0.2,
        metalness: 0.1,
        side: THREE.DoubleSide
      })
    );
    
    return mats;
  });

  // Animation Loop
  useFrame((state, delta) => {
    // Spin the pyramid
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
      // Remove the x tilt so the pyramid stands upright - clocks won't be clipped
      meshRef.current.rotation.x = 0;
      meshRef.current.rotation.z = 0;
    }

    // Update all 4 clock textures (only the side faces, not the base)
    texturesRef.current.forEach(({ texture, drawFn }) => {
      drawFn();
      texture.needsUpdate = true;
    });
  });

  return (
    <mesh 
      ref={meshRef} 
      material={materials}
    >
      {/* ConeGeometry with 4 radialSegments creates 4 triangular faces + 1 base */}
      <coneGeometry args={[2, 3, 4]} />
    </mesh>
  );
};

// Main Export Scene Canvas Container
export default function SpinningPyramid() {
  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#111111' }}>
      <Canvas camera={{ position: [0, 2, 5.5], fov: 55 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 8, 5]} intensity={1.6} />
        <directionalLight position={[-5, -2, -5]} intensity={0.4} />

        <PyramidMesh />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}
