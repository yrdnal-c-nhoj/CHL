import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';

import font26_09_21 from '@/assets/fonts/26fonts/26-09-21.ttf?url';

export const assets = [font26_09_21];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_09_21',
  fontUrl: font26_09_21,
};

const FONT_FAMILY = 'ClockFont_26_09_21';

const DIGIT_W = 1.35;
const DIGIT_H = 1.8;
const DIGIT_D = 0.5;

const SPACING = 1.55;

const TEXTURE_SIZE = 512;

const DIGIT_COLOR = '#abd913';
const FACE_COLOR = '#282885';
const SIDE_COLOR = '#17174d';

interface DigitTextures {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
}

interface DigitMeshProps {
  x: number;
  reducedMotion: boolean;
  spinOffset: number;
  textures: DigitTextures | undefined;
}

interface ClockSceneProps {
  h0: string;
  h1: string;
  m0: string;
  m1: string;
  reducedMotion: boolean;
}

async function createDigitTexture(
  char: string,
  mirrored = false,
): Promise<THREE.CanvasTexture> {
  await document.fonts.load(
    `bold 340px "${FONT_FAMILY}"`,
  );

  await document.fonts.ready;

  const canvas = document.createElement('canvas');

  canvas.width = TEXTURE_SIZE;
  canvas.height = TEXTURE_SIZE;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Unable to create digit canvas');
  }

  ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

  /*
   * Face background.
   */
  ctx.fillStyle = FACE_COLOR;
  ctx.fillRect(
    0,
    0,
    TEXTURE_SIZE,
    TEXTURE_SIZE,
  );

  /*
   * Digit.
   */
  ctx.font = `bold 340px "${FONT_FAMILY}", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = DIGIT_COLOR;

  if (mirrored) {
    ctx.save();
    ctx.translate(TEXTURE_SIZE, 0);
    ctx.scale(-1, 1);
  }

  ctx.fillText(
    char,
    TEXTURE_SIZE / 2,
    TEXTURE_SIZE / 2,
  );

  if (mirrored) {
    ctx.restore();
  }

  const texture = new THREE.CanvasTexture(canvas);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.anisotropy = 4;
  texture.needsUpdate = true;

  return texture;
}

function DigitMesh({
  x,
  reducedMotion,
  spinOffset,
  textures,
}: DigitMeshProps) {
  const group = useRef<THREE.Group>(null);

  const sideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: SIDE_COLOR,
        metalness: 0.2,
        roughness: 0.45,
      }),
    [],
  );

  const frontMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textures?.front ?? null,
        color: '#ffffff',
        toneMapped: false,
      }),
    [textures?.front],
  );

  const backMaterial = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        map: textures?.back ?? null,
        color: '#ffffff',
        toneMapped: false,
      }),
    [textures?.back],
  );

  useEffect(() => {
    return () => {
      sideMaterial.dispose();
      frontMaterial.dispose();
      backMaterial.dispose();
    };
  }, [
    sideMaterial,
    frontMaterial,
    backMaterial,
  ]);

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) {
      return;
    }

    group.current.rotation.y += delta * 0.45;

    group.current.rotation.x =
      Math.sin(
        performance.now() * 0.0004 + spinOffset,
      ) * 0.08;
  });

  return (
    <group
      ref={group}
      position={[x, 0, 0]}
    >
      <mesh>
        <boxGeometry
          args={[
            DIGIT_W,
            DIGIT_H,
            DIGIT_D,
          ]}
        />

        {/* Right */}
        <primitive
          object={sideMaterial}
          attach="material-0"
        />

        {/* Left */}
        <primitive
          object={sideMaterial}
          attach="material-1"
        />

        {/* Top */}
        <primitive
          object={sideMaterial}
          attach="material-2"
        />

        {/* Bottom */}
        <primitive
          object={sideMaterial}
          attach="material-3"
        />

        {/* Front */}
        <primitive
          object={frontMaterial}
          attach="material-4"
        />

        {/* Back */}
        <primitive
          object={backMaterial}
          attach="material-5"
        />
      </mesh>
    </group>
  );
}

function ClockScene({
  h0,
  h1,
  m0,
  m1,
  reducedMotion,
}: ClockSceneProps) {
  const chars = useMemo(
    () => [h0, h1, m0, m1],
    [h0, h1, m0, m1],
  );

  const [textures, setTextures] = useState<
    DigitTextures[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    const loadTextures = async () => {
      const loaded: DigitTextures[] = [];

      for (const char of chars) {
        const front =
          await createDigitTexture(char);

        const back =
          await createDigitTexture(
            char,
            true,
          );

        loaded.push({
          front,
          back,
        });
      }

      if (cancelled) {
        loaded.forEach(({ front, back }) => {
          front.dispose();
          back.dispose();
        });

        return;
      }

      setTextures((previous) => {
        previous.forEach(({ front, back }) => {
          front.dispose();
          back.dispose();
        });

        return loaded;
      });
    };

    void loadTextures();

    return () => {
      cancelled = true;
    };
  }, [chars]);

  const xs = useMemo(
    () => [
      -1.5 * SPACING,
      -0.5 * SPACING,
      0.5 * SPACING,
      1.5 * SPACING,
    ],
    [],
  );

  return (
    <>
      <color
        attach="background"
        args={[FACE_COLOR]}
      />

      <ambientLight intensity={1.5} />

      {chars.map((char, index) => (
        <DigitMesh
          key={`${index}-${char}`}
          x={xs[index]!}
          reducedMotion={reducedMotion}
          spinOffset={index * 1.1}
          textures={textures[index] ?? undefined}
        />
      ))}
    </>
  );
}

const Clock = () => {
  const time = useClock();

  const [reducedMotion, setReducedMotion] =
    useState(false);

  const [fontReady, setFontReady] =
    useState(false);

  useSuspenseFontLoader([fontConfig]);

  useEffect(() => {
    let mounted = true;

    document.fonts.ready.then(() => {
      if (mounted) {
        setFontReady(true);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );

    setReducedMotion(mediaQuery.matches);

    const handleChange = (
      event: MediaQueryListEvent,
    ) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener(
      'change',
      handleChange,
    );

    return () => {
      mediaQuery.removeEventListener(
        'change',
        handleChange,
      );
    };
  }, []);

  const hours = String(
    time.getHours(),
  ).padStart(2, '0');

  const minutes = String(
    time.getMinutes(),
  ).padStart(2, '0');

  if (!fontReady) {
    return (
      <main className={styles.container}>
        <div className={styles.loading}>
          Loading font…
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <Canvas
        className={styles.canvas}
        camera={{
          position: [0, 0, 8],
          fov: 40,
          near: 0.1,
          far: 100,
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: false,
        }}
      >
        <ClockScene
          h0={hours[0] ?? '0'}
          h1={hours[1] ?? '0'}
          m0={minutes[0] ?? '0'}
          m1={minutes[1] ?? '0'}
          reducedMotion={reducedMotion}
        />
      </Canvas>

      <time
        dateTime={time.toISOString()}
        className={styles.srOnly}
      >
        {hours}
        {minutes}
      </time>
    </main>
  );
};

Clock.displayName = 'Clock_26_09_21';

export default Clock;