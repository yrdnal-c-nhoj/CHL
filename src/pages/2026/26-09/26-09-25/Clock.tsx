import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

export const assets: string[] = [];

const getCSSVars = (() => {
  let cached: ReturnType<typeof readCSSVars> | null = null;

  return (): ReturnType<typeof readCSSVars> => {
    if (!cached) {
      cached = readCSSVars();
    }

    return cached;
  };
})();

function readCSSVars() {
  const container = document.querySelector(`.${styles.container}`);
  const cs = container ? getComputedStyle(container) : null;

  const getVar = (name: string, fallback: string) =>
    cs?.getPropertyValue(`--${name}`).trim() ?? fallback;

  const getNum = (name: string, fallback: number) => {
    const val = getVar(name, String(fallback));

    if (val.endsWith('vw')) {
      return (parseFloat(val) * window.innerWidth) / 100;
    }

    if (val.endsWith('vh')) {
      return (parseFloat(val) * window.innerHeight) / 100;
    }

    if (val.endsWith('vmin')) {
      return (
        (parseFloat(val) * Math.min(window.innerWidth, window.innerHeight)) /
        100
      );
    }

    if (val.endsWith('vmax')) {
      return (
        (parseFloat(val) * Math.max(window.innerWidth, window.innerHeight)) /
        100
      );
    }

    return parseFloat(val);
  };

  return {
    digitColor: getVar('digit-color', '#abd913'),
    faceColor: getVar('face-color', '#282885'),
    sideColor: getVar('side-color', '#17174d'),
    digitW: getNum('digit-width', 1.35),
    digitH: getNum('digit-height', 1.8),
    digitD: getNum('digit-depth', 0.5),
    spacing: getNum('spacing', 1.55),
    textureSize: getNum('texture-size', 512),
    fontSize: getNum('font-size', 340),
    spinSpeed: getNum('spin-speed', 0.45),
    wobbleSpeed: getNum('wobble-speed', 0.0004),
    wobbleAmplitude: getNum('wobble-amplitude', 0.08),
    spinOffsetStep: getNum('spin-offset-step', 1.1),
    ambientIntensity: getNum('ambient-intensity', 1.5),
    cameraZ: getNum('camera-z', 8),
    cameraFov: getNum('camera-fov', 40),
    cameraNear: getNum('camera-near', 0.1),
    cameraFar: getNum('camera-far', 100),
    fontFamily: getVar('font-family', 'Arial, sans-serif'),
    fontWeight: getVar('font-weight', 'bold'),
  };
}

function createDigitTextures(
  char: string,
  vars: ReturnType<typeof readCSSVars>,
): {
  front: THREE.CanvasTexture;
  back: THREE.CanvasTexture;
} {
  const {
    textureSize,
    fontSize,
    fontFamily,
    fontWeight,
    digitColor,
    faceColor,
  } = vars;

  const canvas = document.createElement('canvas');
  canvas.width = textureSize;
  canvas.height = textureSize;

  const ctx = canvas.getContext('2d')!;

  const fontString = `${fontWeight} ${fontSize}px "${fontFamily}"`;

  ctx.font = fontString;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const makeTexture = (mirrored: boolean) => {
    ctx.clearRect(0, 0, textureSize, textureSize);

    ctx.fillStyle = faceColor;
    ctx.fillRect(0, 0, textureSize, textureSize);

    ctx.fillStyle = digitColor;

    if (mirrored) {
      ctx.save();
      ctx.translate(textureSize, 0);
      ctx.scale(-1, 1);
    }

    ctx.fillText(char, textureSize / 2, textureSize / 2);

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
  };

  return {
    front: makeTexture(false),
    back: makeTexture(true),
  };
}

interface DigitMeshProps {
  x: number;
  reducedMotion: boolean;
  spinOffset: number;
  textures:
    | {
        front: THREE.CanvasTexture;
        back: THREE.CanvasTexture;
      }
    | undefined;
}

function DigitMesh({
  x,
  reducedMotion,
  spinOffset,
  textures,
}: DigitMeshProps) {
  const vars = getCSSVars();
  const group = useRef<THREE.Group>(null);

  const materials = useMemo(
    () => [
      new THREE.MeshStandardMaterial({
        color: vars.sideColor,
        metalness: 0.2,
        roughness: 0.45,
      }),
      new THREE.MeshStandardMaterial({
        color: vars.sideColor,
        metalness: 0.2,
        roughness: 0.45,
      }),
      new THREE.MeshStandardMaterial({
        color: vars.sideColor,
        metalness: 0.2,
        roughness: 0.45,
      }),
      new THREE.MeshStandardMaterial({
        color: vars.sideColor,
        metalness: 0.2,
        roughness: 0.45,
      }),
      new THREE.MeshBasicMaterial({
        map: textures?.front ?? null,
        color: '#ffffff',
        toneMapped: false,
      }),
      new THREE.MeshBasicMaterial({
        map: textures?.back ?? null,
        color: '#ffffff',
        toneMapped: false,
      }),
    ],
    [vars.sideColor, textures?.front, textures?.back],
  );

  useEffect(
    () => () => {
      materials.forEach((material) => material.dispose());
    },
    [materials],
  );

  useFrame((_, delta) => {
    if (!group.current || reducedMotion) {
      return;
    }

    group.current.rotation.y += delta * vars.spinSpeed;

    group.current.rotation.x =
      Math.sin(
        performance.now() * vars.wobbleSpeed + spinOffset,
      ) * vars.wobbleAmplitude;
  });

  return (
    <group ref={group} position={[x, 0, 0]}>
      <mesh>
        <boxGeometry
          args={[vars.digitW, vars.digitH, vars.digitD]}
        />

        {materials.map((material, index) => (
          <primitive
            key={index}
            object={material}
            attach={`material-${index}`}
          />
        ))}
      </mesh>
    </group>
  );
}

interface ClockSceneProps {
  h0: string;
  h1: string;
  m0: string;
  m1: string;
  reducedMotion: boolean;
}

function ClockScene({
  h0,
  h1,
  m0,
  m1,
  reducedMotion,
}: ClockSceneProps) {
  const vars = getCSSVars();

  const chars = useMemo(
    () => [h0, h1, m0, m1],
    [h0, h1, m0, m1],
  );

  const [textures, setTextures] = useState<
    {
      front: THREE.CanvasTexture;
      back: THREE.CanvasTexture;
    }[]
  >([]);

  useEffect(() => {
    let cancelled = false;

    const loaded = chars.map((char) =>
      createDigitTextures(char, vars),
    );

    if (!cancelled) {
      setTextures((previous) => {
        previous.forEach(({ front, back }) => {
          front.dispose();
          back.dispose();
        });

        return loaded;
      });
    }

    return () => {
      cancelled = true;
    };
  }, [chars.join(',')]);

  const xs = useMemo(
    () => [-1.5, -0.5, 0.5, 1.5].map((x) => x * vars.spacing),
    [vars.spacing],
  );

  return (
    <>
      <color
        attach="background"
        args={[vars.faceColor]}
      />

      <ambientLight intensity={vars.ambientIntensity} />

      {chars.map((char, index) => (
        <DigitMesh
          key={`${index}-${char}`}
          x={xs[index] ?? 0}
          reducedMotion={reducedMotion}
          spinOffset={index * vars.spinOffsetStep}
          textures={textures[index]}
        />
      ))}
    </>
  );
}

const Clock = () => {
  const time = useClock();

  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    );

    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');

  const vars = getCSSVars();

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <Canvas
        className={styles.canvas}
        camera={{
          position: [0, 0, vars.cameraZ],
          fov: vars.cameraFov,
          near: vars.cameraNear,
          far: vars.cameraFar,
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
    </main>
  );
};

Clock.displayName = 'Clock_26_09_22';

export default Clock;