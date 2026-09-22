
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import { useClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import styles from './Clock.module.css';

import font26_09_21 from '@/assets/fonts/26fonts/26-09-21.ttf?url';

export const assets = [font26_09_21];

const FONT_FAMILY = 'ClockFont_26_09_21';
const FONT_WEIGHT = 'bold';

const fontConfig: FontConfig = {
  fontFamily: FONT_FAMILY,
  fontUrl: font26_09_21,
};

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

interface CSSVars {
  digitColor: string;
  faceColor: string;
  sideColor: string;
  digitW: number;
  digitH: number;
  digitD: number;
  spacing: number;
  textureSize: number;
  fontSize: number;
  spinSpeed: number;
  wobbleSpeed: number;
  wobbleAmplitude: number;
  spinOffsetStep: number;
  ambientIntensity: number;
  cameraZ: number;
  cameraFov: number;
  cameraNear: number;
  cameraFar: number;
  fontFamily: string;
  fontWeight: string;
}

function getCSSVars(): CSSVars {
  const container = document.querySelector(`.${styles.container}`);

  const cs = container ? getComputedStyle(container) : null;

  const getVar = (
    name: string,
    fallback: string,
  ): string =>
    cs?.getPropertyValue(`--${name}`).trim() || fallback;

  const getNum = (
    name: string,
    fallback: number,
  ): number => {
    const value = parseFloat(
      getVar(name, String(fallback)),
    );

    return Number.isFinite(value) ? value : fallback;
  };

  return {
    digitColor: getVar(
      'digit-color',
      '#abd913',
    ),

    faceColor: getVar(
      'face-color',
      '#282885',
    ),

    sideColor: getVar(
      'side-color',
      '#17174d',
    ),

    digitW: getNum(
      'digit-width',
      1.35,
    ),

    digitH: getNum(
      'digit-height',
      1.8,
    ),

    digitD: getNum(
      'digit-depth',
      0.5,
    ),

    spacing: getNum(
      'spacing',
      1.55,
    ),

    textureSize: getNum(
      'texture-size',
      512,
    ),

    fontSize: getNum(
      'font-size',
      340,
    ),

    spinSpeed: getNum(
      'spin-speed',
      0.45,
    ),

    wobbleSpeed: getNum(
      'wobble-speed',
      0.0004,
    ),

    wobbleAmplitude: getNum(
      'wobble-amplitude',
      0.08,
    ),

    spinOffsetStep: getNum(
      'spin-offset-step',
      1.1,
    ),

    ambientIntensity: getNum(
      'ambient-intensity',
      1.5,
    ),

    cameraZ: getNum(
      'camera-z',
      8,
    ),

    cameraFov: getNum(
      'camera-fov',
      40,
    ),

    cameraNear: getNum(
      'camera-near',
      0.1,
    ),

    cameraFar: getNum(
      'camera-far',
      100,
    ),

    fontFamily: getVar(
      'font-family',
      FONT_FAMILY,
    ),

    fontWeight: getVar(
      'font-weight',
      FONT_WEIGHT,
    ),
  };
}

/*
 * One shared font-loading promise.
 *
 * This is important because the digit textures are rendered
 * into <canvas>. Canvas does not wait for CSS font loading.
 */
let clockFontPromise: Promise<FontFace> | null = null;

async function loadClockFont(): Promise<FontFace> {
  if (clockFontPromise) {
    return clockFontPromise;
  }

  clockFontPromise = (async () => {
    /*
     * The font is already loaded by useSuspenseFontLoader.
     * Wait for it to be ready in document.fonts.
     */
    await document.fonts.ready;

    /*
     * Find the loaded font.
     */
    const existingFont = Array.from(
      document.fonts,
    ).find(
      (font) =>
        font.family.replace(/['"]/g, '') ===
          FONT_FAMILY &&
        font.weight === FONT_WEIGHT,
    );

    if (existingFont) {
      await existingFont.load();

      /*
       * Ask the browser to resolve the exact face.
       */
      const descriptor = `${FONT_WEIGHT} 340px "${FONT_FAMILY}"`;
      await document.fonts.load(descriptor);

      return existingFont;
    }

    /*
     * Fallback: register the font ourselves if not found.
     */
    const font = new FontFace(
      FONT_FAMILY,
      `url(${font26_09_21})`,
      {
        weight: FONT_WEIGHT,
        style: 'normal',
        display: 'block',
      },
    );

    document.fonts.add(font);

    await font.load();
    await document.fonts.ready;

    const descriptor = `${FONT_WEIGHT} 340px "${FONT_FAMILY}"`;
    await document.fonts.load(descriptor);

    return font;
  })();

  return clockFontPromise;
}

/*
 * Canvas font verification.
 *
 * This deliberately checks the same family and weight that
 * will actually be assigned to ctx.font.
 */
async function ensureClockFont(): Promise<void> {
  await loadClockFont();

  const descriptor =
    `${FONT_WEIGHT} 340px "${FONT_FAMILY}"`;

  const verified =
    document.fonts.check(descriptor);

  if (!verified) {
    throw new Error(
      `Canvas font verification failed: ${descriptor}`,
    );
  }
}

async function createDigitTexture(
  char: string,
  mirrored = false,
): Promise<THREE.CanvasTexture> {
  const vars = getCSSVars();

  const fontFamily = FONT_FAMILY;
  const fontWeight = FONT_WEIGHT;
  const fontSize = vars.fontSize;
  const textureSize = vars.textureSize;

  /*
   * Do not create the canvas until the actual FontFace
   * has finished loading.
   */
  await ensureClockFont();

  const canvas =
    document.createElement('canvas');

  canvas.width = textureSize;
  canvas.height = textureSize;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error(
      'Unable to create digit canvas.',
    );
  }

  /*
   * Background.
   */
  ctx.fillStyle = vars.faceColor;

  ctx.fillRect(
    0,
    0,
    textureSize,
    textureSize,
  );

  /*
   * Explicitly use the loaded custom font.
   */
  const fontString = `${fontWeight} ${fontSize}px "${fontFamily}"`;
  ctx.font = fontString;

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  /*
   * Digit.
   */
  ctx.fillStyle = vars.digitColor;

  if (mirrored) {
    ctx.save();

    ctx.translate(
      textureSize,
      0,
    );

    ctx.scale(
      -1,
      1,
    );
  }

  ctx.fillText(
    char,
    textureSize / 2,
    textureSize / 2,
  );

  if (mirrored) {
    ctx.restore();
  }

  const texture =
    new THREE.CanvasTexture(canvas);

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.minFilter =
    THREE.LinearFilter;

  texture.magFilter =
    THREE.LinearFilter;

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
  const vars = getCSSVars();

  const group =
    useRef<THREE.Group>(null);

  const sideMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: vars.sideColor,
        metalness: 0.2,
        roughness: 0.45,
      }),
    [vars.sideColor],
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
    if (
      !group.current ||
      reducedMotion
    ) {
      return;
    }

    group.current.rotation.y +=
      delta * vars.spinSpeed;

    group.current.rotation.x =
      Math.sin(
        performance.now() *
          vars.wobbleSpeed +
          spinOffset,
      ) *
      vars.wobbleAmplitude;
  });

  return (
    <group
      ref={group}
      position={[x, 0, 0]}
    >
      <mesh>
        <boxGeometry
          args={[
            vars.digitW,
            vars.digitH,
            vars.digitD,
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
  const vars = getCSSVars();

  const chars = useMemo(
    () => [
      h0,
      h1,
      m0,
      m1,
    ],
    [
      h0,
      h1,
      m0,
      m1,
    ],
  );

  const [
    textures,
    setTextures,
  ] = useState<DigitTextures[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadTextures =
      async () => {
        const loaded: DigitTextures[] =
          [];

        try {
          /*
           * Load the font once before generating
           * all of the canvas textures.
           */
          await ensureClockFont();

          for (const char of chars) {
            const front =
              await createDigitTexture(
                char,
              );

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
            loaded.forEach(
              ({
                front,
                back,
              }) => {
                front.dispose();
                back.dispose();
              },
            );

            return;
          }

          setTextures(
            (previous) => {
              previous.forEach(
                ({
                  front,
                  back,
                }) => {
                  front.dispose();
                  back.dispose();
                },
              );

              return loaded;
            },
          );
        } catch (error) {
          console.error(
            'Unable to create clock digit textures.',
            error,
          );
        }
      };

    void loadTextures();

    return () => {
      cancelled = true;
    };
  }, [chars]);

  const xs = useMemo(
    () => [
      -1.5 * vars.spacing,
      -0.5 * vars.spacing,
      0.5 * vars.spacing,
      1.5 * vars.spacing,
    ],
    [vars.spacing],
  );

  return (
    <>
      <color
        attach="background"
        args={[vars.faceColor]}
      />

      <ambientLight
        intensity={
          vars.ambientIntensity
        }
      />

      {chars.map(
        (char, index) => (
          <DigitMesh
            key={`${index}-${char}`}
            x={xs[index]!}
            reducedMotion={
              reducedMotion
            }
            spinOffset={
              index *
              vars.spinOffsetStep
            }
            textures={
              textures[index] ??
              undefined
            }
          />
        ),
      )}
    </>
  );
}

const Clock = () => {
  const time = useClock();

  const [
    reducedMotion,
    setReducedMotion,
  ] = useState(false);

  const [
    fontReady,
    setFontReady,
  ] = useState(false);

  /*
   * Keep the existing application font-loader.
   *
   * The explicit loadClockFont() below is still necessary
   * because the font is ultimately rasterized into Canvas.
   */
  useSuspenseFontLoader([
    fontConfig,
  ]);

  useEffect(() => {
    let mounted = true;

    const initializeFont =
      async () => {
        try {
          console.log('[ClockFont] Starting font load...');
          await loadClockFont();
          console.log('[ClockFont] Font loaded successfully');

          if (mounted) {
            setFontReady(true);
          }
        } catch (error) {
          console.error(
            'Clock font initialization failed.',
            error,
          );

          if (mounted) {
            setFontReady(false);
          }
        }
      };

    void initializeFont();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const mediaQuery =
      window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      );

    setReducedMotion(
      mediaQuery.matches,
    );

    const handleChange = (
      event: MediaQueryListEvent,
    ) => {
      setReducedMotion(
        event.matches,
      );
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
      <main
        className={
          styles.container
        }
      >
        <div
          className={
            styles.loading
          }
        >
          Loading font…
        </div>
      </main>
    );
  }

  const vars = getCSSVars();

  return (
    <main
      className={
        styles.container
      }
    >
      <Canvas
        className={
          styles.canvas
        }
        camera={{
          position: [
            0,
            0,
            vars.cameraZ,
          ],
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
          h0={
            hours[0] ?? '0'
          }
          h1={
            hours[1] ?? '0'
          }
          m0={
            minutes[0] ?? '0'
          }
          m1={
            minutes[1] ?? '0'
          }
          reducedMotion={
            reducedMotion
          }
        />
      </Canvas>

      <time
        dateTime={
          time.toISOString()
        }
        className={
          styles.srOnly
        }
      >
        {hours}
        {minutes}
      </time>
    </main>
  );
};

Clock.displayName =
  'Clock_26_09_21';

export default Clock;