import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

// Dynamic background asset fallback
let pyramidBgUrl = '';
try {
  // @ts-ignore
  import('@/assets/images/26_images/26-06/26-06-18/pyramid.webp?url').then((m) => (pyramidBgUrl = m.default));
} catch (e) {
  /* Fallback handled gracefully */
}

/**
 * Hook to manage the 2D clock texture generation and real-time updates
 * with sharp, pointed diamond-styled hands.
 */
const useClockTexture = () => {
  const [texture, draw] = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    const canvasTexture = new THREE.CanvasTexture(canvas);

    const drawHand = (canvasCtx: CanvasRenderingContext2D, angle: number, length: number, baseWidth: number, color: string) => {
      canvasCtx.save();
      // Move origin to the center of the clock and rotate to match the hand's time angle
      canvasCtx.translate(256, 256);
      canvasCtx.rotate(angle);

      canvasCtx.fillStyle = color;
      canvasCtx.beginPath();
      
      // Counter-weight tail slightly behind center pin
      canvasCtx.moveTo(0, baseWidth * 0.4); 
      // Left wide base corner
      canvasCtx.lineTo(-baseWidth / 2, 0);   
      // Ultra sharp pointed tip
      canvasCtx.lineTo(0, -length);          
      // Right wide base corner
      canvasCtx.lineTo(baseWidth / 2, 0);    
      
      canvasCtx.closePath();
      canvasCtx.fill();
      canvasCtx.restore();
    };

    const drawFn = () => {
      if (!ctx) return;
      
      const now = new Date();
      const hrs = now.getHours();
      const mins = now.getMinutes();
      const secs = now.getSeconds();
      const ms = now.getMilliseconds();

      // Clear & Background Face
      ctx.fillStyle = '#BB744E';
      ctx.fillRect(0, 0, 512, 512);

      // Smooth continuous hand positioning
      const secAngle = ((secs + ms / 1000) * Math.PI) / 30;
      const minAngle = ((mins + secs / 60) * Math.PI) / 30;
      const hrAngle = (((hrs % 12) + mins / 60) * Math.PI) / 6;

   
      // Draw Minute Hand (Elegant, extended mid-thickness)
      drawHand(ctx, minAngle, 100, 16, '#1D1B1B');
      

   // Draw Hour Hand (Shorter, robust tapered base)
      drawHand(ctx, hrAngle, 60, 23, '#1B375B');
      

      // Draw Second Hand (Longest, sleek needle profile)
      drawHand(ctx, secAngle, 520, 6, '#EB11BF');

      // Subtle Center Pin anchoring the hands
      ctx.fillStyle = '#8B8484';
      ctx.beginPath();
      ctx.arc(256, 256, 4, 0, Math.PI * 2);
      ctx.fill();
    };

    return [canvasTexture, drawFn] as const;
  }, []);

  // Clean up texture when unmounting
  useEffect(() => () => texture.dispose(), [texture]);

  return { texture, draw };
};

const PyramidMesh = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const { texture, draw } = useClockTexture();

  const { geometry, materials } = useMemo(() => {
    const geo = new THREE.ConeGeometry(2, 3, 4);
    const nonIndexed = geo.toNonIndexed();
    nonIndexed.clearGroups();

    const pos = nonIndexed.attributes.position as THREE.BufferAttribute;
    const uv = nonIndexed.attributes.uv as THREE.BufferAttribute;

    const sideFaceCount = 12; // 4 faces * 3 vertices
    nonIndexed.addGroup(0, sideFaceCount, 0);
    const baseStart = sideFaceCount;
    const baseCount = pos.count - sideFaceCount;
    if (baseCount > 0) nonIndexed.addGroup(baseStart, baseCount, 1);

    // UV mapping: Maps the 2D clock face sharply onto the side triangle faces
    for (let f = 0; f < 4; f++) {
      const baseIdx = f * 3;
      uv.setXY(baseIdx,     0.12, 0.22);
      uv.setXY(baseIdx + 1, 0.88, 0.22);
      uv.setXY(baseIdx + 2, 0.50, 0.88);
    }
    uv.needsUpdate = true;

    const clockMat = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.25,
      metalness: 0.15,
      side: THREE.DoubleSide,
      emissive: '#222222',
      emissiveIntensity: 0.15,
    });

    const plainMat = new THREE.MeshStandardMaterial({
      color: '#222222',
      roughness: 0.6,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    return { geometry: nonIndexed, materials: [clockMat, plainMat] };
  }, [texture]);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.35;

    if (draw && texture) {
      draw();
      texture.needsUpdate = true;
    }
  });

  return <mesh ref={meshRef} geometry={geometry} material={materials} />;
};

export default function SpinningPyramid() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundColor: '#151313',
        backgroundImage: pyramidBgUrl ? `url(${pyramidBgUrl})` : 'none',
        backgroundSize: '100px 70px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
      }}
    >
      {/* Background Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(246, 145, 4, 0.58)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      
      {/* 3D Canvas Viewport */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 0, 5.5], fov: 55 }}>
          <group position={[0, 0.1, 0]}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 5]} intensity={2.6} />
            <directionalLight position={[-5, -2, -5]} intensity={2.4} />
            <PyramidMesh />
          </group>
          <OrbitControls enableZoom />
        </Canvas>
      </div>
    </div>
  );
}