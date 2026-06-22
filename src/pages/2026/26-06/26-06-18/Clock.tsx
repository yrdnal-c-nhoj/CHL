import pyramidBgUrl from '@/assets/images/26_images/26-06/26-06-18/pyramid.webp?url';
import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';

// Helper function to create clock drawer for a single canvas

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

    // Smooth angles
    const secAngle = ((secs + ms / 1000) * Math.PI) / 30;
    const minAngle = ((mins + secs / 60) * Math.PI) / 30;
    const hrAngle = (((hrs % 12) + mins / 60) * Math.PI) / 6;

    drawHand(hrAngle, 110, 12, '#111111'); // Hour
    drawHand(minAngle, 160, 8, '#1D1B1B'); // Minute
    drawHand(secAngle, 185, 4, '#ff3333'); // Second

    // Center node
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(256, 256, 10, 0, Math.PI * 2);
    ctx.fill();
  };
};

const PyramidMesh = () => {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const clockTextureRef = useRef<THREE.CanvasTexture | null>(null);
  const drawFnRef = useRef<(() => void) | null>(null);

  const { pyramidGeometry, materials } = useMemo(() => {

    // 1) Geometry

    const pyramidGeometry = (() => {
      const geo = new THREE.ConeGeometry(2, 3, 4).toNonIndexed();
      geo.clearGroups();


      // Group 0: first triangle face (vertices 0-2) -> clock
      geo.addGroup(0, 3, 0);
      // Group 1: rest -> plain
      geo.addGroup(3, geo.attributes.position.count - 3, 1);

      const pos = geo.attributes.position;
      const uv = geo.attributes.uv;
      const bottomVerts: number[] = [];

      if (!pos || !uv) return geo;

      for (let i = 0; i < 3; i++) {
        const y = pos.getY(i) ?? 0;
        if (y > 0) {

          uv.setXY(i, 0.5, 1);
        } else {
          bottomVerts.push(i);
        }
      }

      if (bottomVerts.length === 2) {
        if (uv.getX(bottomVerts[0]) < uv.getX(bottomVerts[1])) {
          uv.setXY(bottomVerts[0], 0, 0);
          uv.setXY(bottomVerts[1], 1, 0);
        } else {
          uv.setXY(bottomVerts[0], 1, 0);
          uv.setXY(bottomVerts[1], 0, 0);
        }
      }

      uv.needsUpdate = true;
      return geo;
    })();

    // 2) Materials
    const canvas = document.createElement('canvas');
    const drawFn = createClockDrawer(canvas);
    const clockTexture = new THREE.CanvasTexture(canvas);

    const clockMat = new THREE.MeshStandardMaterial({


      map: clockTexture,
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

    return { pyramidGeometry, materials: [clockMat, plainMat] as THREE.Material[] };
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }

    if (!clockTextureRef.current || !drawFnRef.current) return;
    drawFnRef.current();
    clockTextureRef.current.needsUpdate = true;

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
        backgroundImage: `url(${pyramidBgUrl})`,
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
        <Canvas camera={{ position: [0, 0, 5.5], fov: 55 }}>
          <group position={[0, 0.1, 0]}>
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

