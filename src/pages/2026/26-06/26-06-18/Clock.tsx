import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Optional background asset - fall back to color if missing
let pyramidBgUrl = '';
try {
  // @ts-ignore
  import('@/assets/images/26_images/26-06/26-06-18/pyramid.webp?url').then(m => pyramidBgUrl = m.default);
} catch (e) {}

const createClockDrawer = (canvas: HTMLCanvasElement) => {
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {};

  return () => {
    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const ms = now.getMilliseconds();

    // Clock background
    ctx.fillStyle = '#BB744E';
    ctx.fillRect(0, 0, 512, 512);

    // Hour ticks
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * 195, 256 + Math.sin(angle) * 195);
      ctx.lineTo(256 + Math.cos(angle) * 215, 256 + Math.sin(angle) * 215);
      ctx.stroke();
    }

    const drawHand = (angle: number, length: number, width: number, color: string) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(256 + Math.sin(angle) * length, 256 - Math.cos(angle) * length);
      ctx.stroke();
    };

    const secAngle = ((secs + ms / 1000) * Math.PI) / 30;
    const minAngle = ((mins + secs / 60) * Math.PI) / 30;
    const hrAngle = (((hrs % 12) + mins / 60) * Math.PI) / 6;

    drawHand(hrAngle, 110, 12, '#111111');
    drawHand(minAngle, 160, 8, '#1D1B1B');
    drawHand(secAngle, 185, 4, '#ff3333');

    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(256, 256, 10, 0, Math.PI * 2);
    ctx.fill();
  };
};

const PyramidMesh = () => {
  const meshRef = useRef<THREE.Mesh | null>(null);

  const { pyramidGeometry, materials, clockTexture, drawFn } = useMemo(() => {
    // 1) Explicit Geometry Setup using ConeGeometry(radius, height, radialSegments, heightSegments, openEnded)
    // 4 radial segments means 4 triangles for the sides and 4 triangles for the bottom cap.
    const geo = new THREE.ConeGeometry(2, 3, 4, 1, false).toNonIndexed();
    geo.clearGroups();

    const pos = geo.attributes.position;
    const uvAttr = geo.attributes.uv;

    if (pos && uvAttr) {
      // In ConeGeometry, the side faces are built first. 
      // 4 radial segments = 4 side triangles = 12 vertices.
      // We assign Group 0 (Clock) to the sides, Group 1 (Plain) to the bottom base.
      geo.addGroup(0, 12, 0);       // Side faces get the clock
      geo.addGroup(12, 12, 1);      // Bottom base faces get plain dark color

      // Adjust UV mapping for the side triangles so the clock scales cleanly up to the apex point
      for (let i = 0; i < 12; i += 3) {
        for (let v = 0; v < 3; v++) {
          const idx = i + v;
          const y = pos.getY(idx);
          
          if (y > 0) {
            // This is the top tip of the pyramid (Apex)
            uvAttr.setXY(idx, 0.5, 1);
          } else {
            // Left or right base vertices of the side triangle face
            // Distribute them cleanly based on their sequence in the face
            if (v === 0) uvAttr.setXY(idx, 0, 0);
            if (v === 1) uvAttr.setXY(idx, 1, 0);
            if (v === 2) uvAttr.setXY(idx, 0.5, 0); 
          }
        }
      }
      uvAttr.needsUpdate = true;
    }

    // 2) Materials Setup
    const canvas = document.createElement('canvas');
    const createdDrawFn = createClockDrawer(canvas);
    const createdClockTexture = new THREE.CanvasTexture(canvas);

    const clockMat = new THREE.MeshStandardMaterial({
      map: createdClockTexture,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    const plainMat = new THREE.MeshStandardMaterial({
      color: '#222222',
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    return {
      pyramidGeometry: geo,
      materials: [clockMat, plainMat] as THREE.Material[],
      clockTexture: createdClockTexture,
      drawFn: createdDrawFn,
    };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }

    // FIXED: Access stable values directly from useMemo closure instead of missing Refs
    if (drawFn && clockTexture) {
      drawFn();
      clockTexture.needsUpdate = true;
    }
  });

  return <mesh ref={meshRef} geometry={pyramidGeometry} material={materials} />;
};

export default function SpinningPyramid() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundImage: pyramidBgUrl ? `url(${pyramidBgUrl})` : 'none',
        backgroundSize: '140px 100px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top left',
        backgroundColor: '#151313',
        filter: 'invert(1)',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(4, 181, 246, 0.58)',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, width: '100%', height: '100%' }}>
        <Canvas camera={{ position: [0, 1, 5.5], fov: 55 }}>
          <group position={[0, 0, 0]}>
            <ambientLight intensity={0.9} />
            <directionalLight position={[5, 8, 5]} intensity={2.6} />
            <directionalLight position={[-5, -2, -5]} intensity={2.4} />

            <PyramidMesh />
          </group>
          <OrbitControls enableZoom={true} />
        </Canvas>
      </div>
    </div>
  );
}