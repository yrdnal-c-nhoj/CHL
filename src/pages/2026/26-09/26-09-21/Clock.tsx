import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useClock } from '@/utils/hooks';
import styles from './Clock.module.css';

export const assets: string[] = [];

const DIGIT_W = 1.1;
const DIGIT_H = 1.5;
const DIGIT_D = 0.55;
const SPIN = 0.55;
const SPACING = 1.45;

function makeDigitTexture(char: string): THREE.CanvasTexture {
  const s = 256;
  const canvas = document.createElement('canvas');
  canvas.width = s;
  canvas.height = s;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#f4f4f6';
  ctx.fillRect(0, 0, s, s);

  ctx.strokeStyle = '#c8c8d0';
  ctx.lineWidth = 8;
  ctx.strokeRect(6, 6, s - 12, s - 12);

  ctx.font = 'bold 170px system-ui, -apple-system, "Segoe UI", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#1a1a22';
  ctx.fillText(char, s / 2, s / 2 + 6);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  tex.needsUpdate = true;
  return tex;
}

interface DigitMeshProps {
  char: string;
  x: number;
  reducedMotion: boolean;
  spinOffset: number;
}

function DigitMesh({ char, x, reducedMotion, spinOffset }: DigitMeshProps) {
  const group = useRef<THREE.Group>(null);
  const texRef = useRef<THREE.CanvasTexture | null>(null);

  const materials = useMemo(() => {
    const side = new THREE.MeshStandardMaterial({
      color: '#3a3a48',
      metalness: 0.25,
      roughness: 0.55,
    });
    const front = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      metalness: 0.1,
      roughness: 0.45,
    });
    return [side, side, side, side, front, side];
  }, []);

  useEffect(() => {
    const next = makeDigitTexture(char);
    const prev = texRef.current;
    texRef.current = next;

    const front = materials[4] as THREE.MeshStandardMaterial;
    front.map = next;
    front.needsUpdate = true;

    return () => {
      if (prev && prev !== next) prev.dispose();
    };
  }, [char, materials]);

  useEffect(() => {
    return () => {
      texRef.current?.dispose();
      materials.forEach((m) => m.dispose());
    };
  }, [materials]);

  useFrame((_, delta) => {
    if (reducedMotion || !group.current) return;
    group.current.rotation.y += delta * SPIN;
    group.current.rotation.x = Math.sin(performance.now() * 0.0004 + spinOffset) * 0.12;
  });

  return (
    <group ref={group} position={[x, 0, 0]}>
      <mesh material={materials} castShadow receiveShadow>
        <boxGeometry args={[DIGIT_W, DIGIT_H, DIGIT_D]} />
      </mesh>
    </group>
  );
}

function Colon() {
  return (
    <group>
      {[0.32, -0.32].map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <sphereGeometry args={[0.1, 20, 20]} />
          <meshStandardMaterial color="#2a2a32" metalness={0.2} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

function ClockScene({
  h0,
  h1,
  m0,
  m1,
  reducedMotion,
}: {
  h0: string;
  h1: string;
  m0: string;
  m1: string;
  reducedMotion: boolean;
}) {
  const xs = [-1.5 * SPACING, -0.5 * SPACING, 0.5 * SPACING, 1.5 * SPACING];
  const chars = [h0, h1, m0, m1];

  return (
    <>
      <color attach="background" args={['#d8d8dc']} />
      <ambientLight intensity={0.85} />
      <directionalLight position={[5, 8, 6]} intensity={1.15} castShadow />
      <directionalLight position={[-4, 2, -3]} intensity={0.35} />

      {chars.map((c, i) => (
        <DigitMesh
          key={i}
          char={c}
          x={xs[i]}
          reducedMotion={reducedMotion}
          spinOffset={i * 1.1}
        />
      ))}
      <Colon />
    </>
  );
}

const Clock = () => {
  const time = useClock();
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const hh = String(time.getHours()).padStart(2, '0');
  const mm = String(time.getMinutes()).padStart(2, '0');

  return (
    <main className={styles.container}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0.2, 7.2], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: false }}
        shadows
      >
        <ClockScene
          h0={hh[0]}
          h1={hh[1]}
          m0={mm[0]}
          m1={mm[1]}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {hh}{mm}
      </time>
    </main>
  );
};

Clock.displayName = 'Clock_26_09_21';

export default Clock;