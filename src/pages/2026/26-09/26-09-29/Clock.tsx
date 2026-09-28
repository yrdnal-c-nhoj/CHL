import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useMemo,
} from 'react';

import SRTime from '@/components/SRTime';
import { useClock } from '@/utils/hooks';
import {
  createRainEngine,
  type RainEngine,
  type RainOptions,
} from './rainEngine';
import styles from './Clock.module.css';

// Google Fonts selectable in the HUD. They are loaded on demand via a
// non-blocking <link> (see docs/AGENTS.md — Google Fonts are allowed this way)
// and never committed to the `assets` array, which is for locally bundled
// files resolved at build time.
const GOOGLE_FONTS: ReadonlyArray<{ name: string; href: string }> = [
  {
    name: 'Bebas Neue',
    href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap',
  },
  {
    name: 'Inter',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap',
  },
  {
    name: 'Montserrat',
    href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap',
  },
  {
    name: 'Poppins',
    href: 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap',
  },
  {
    name: 'Oswald',
    href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap',
  },
  {
    name: 'Roboto',
    href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap',
  },
  {
    name: 'Orbitron',
    href: 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap',
  },
  {
    name: 'Press Start 2P',
    href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap',
  },
  {
    name: 'Courier Prime',
    href: 'https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&display=swap',
  },
  {
    name: 'Sixtyfour',
    href: 'https://fonts.googleapis.com/css2?family=Sixtyfour&display=swap',
  },
];

const FONT_SIZE_MIN = 60;
const FONT_SIZE_MAX = 400;
const PX_SIZE_MIN = 1;
const PX_SIZE_MAX = 5;
const FONT_WEIGHT_MIN = 100;
const FONT_WEIGHT_MAX = 900;
const FONT_WEIGHT_STEP = 100;

function formatDisplayTime(time: Date): string {
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}

const Clock_26_09_29 = () => {
  const time = useClock();
  const displayTime = useMemo(() => formatDisplayTime(time), [time]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<RainEngine | null>(null);
  const optionsRef = useRef<RainOptions>({
    text: displayTime,
    fontSize: 300,
    pxSize: 2,
    dither: true,
    bgColor: '#000000',
    rainColor: '#ffffff',
    fontName: 'system',
    fontHref: null,
    fontWeight: 700,
    reducedMotion: false,
  });

  // HUD state
  const [fontSize, setFontSize] = useState(300);
  const [pxSize, setPxSize] = useState(2);
  const [dither, setDither] = useState(true);
  const [bgColor, setBgColor] = useState('#000000');
  const [rainColor, setRainColor] = useState('#ffffff');
  const [fontFamily, setFontFamily] = useState('system');
  const [fontWeight, setFontWeight] = useState(700);
  const [fps, setFps] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  const selectedFont =
    fontFamily === 'system' ? null : GOOGLE_FONTS.find((f) => f.name === fontFamily);
  const fontName = fontFamily === 'system' ? 'system' : selectedFont?.name ?? 'system';
  const fontHref = selectedFont ? selectedFont.href : null;

  // Keep the latest options on an instance variable so the canvas render loop
  // (owned by the engine) always reads the current values without restarting.
  // useLayoutEffect runs synchronously after commit and before paint/rAF, so the
  // first frame already sees the correct options.
  useLayoutEffect(() => {
    optionsRef.current = {
      text: displayTime,
      fontSize,
      pxSize,
      dither,
      bgColor,
      rainColor,
      fontName,
      fontHref,
      fontWeight,
      reducedMotion,
    };
  }, [
    displayTime,
    fontSize,
    pxSize,
    dither,
    bgColor,
    rainColor,
    fontName,
    fontHref,
    fontWeight,
    reducedMotion,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const engine = createRainEngine(canvas, () => optionsRef.current, setFps);
    engineRef.current = engine;

    return () => {
      engineRef.current = null;
      engine.destroy();
    };
  }, []);

  // Respect CSS `prefers-reduced-motion` so the simulation calms down when the
  // user asks for reduced motion (time remains visible via the text + SRTime).
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handler = (): void => setReducedMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => {
      mq.removeEventListener('change', handler);
    };
  }, []);

  return (
    <main className={styles.container}>
      <canvas ref={canvasRef} className={styles.canvas} />

      <div className={styles.hud} aria-label="Rain clock controls">
        <label>
          Font Size:
          <input
            type="range"
            min={FONT_SIZE_MIN}
            max={FONT_SIZE_MAX}
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </label>

        <label>
          Pixel Size:
          <input
            type="range"
            min={PX_SIZE_MIN}
            max={PX_SIZE_MAX}
            value={pxSize}
            onChange={(e) => setPxSize(Number(e.target.value))}
          />
        </label>

        <label>
          <input
            type="checkbox"
            checked={dither}
            onChange={(e) => setDither(e.target.checked)}
          />{' '}
          1-bit Dither
        </label>

        <label>
          BG{' '}
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
          />
        </label>
        <label>
          Rain{' '}
          <input
            type="color"
            value={rainColor}
            onChange={(e) => setRainColor(e.target.value)}
          />
        </label>

        <label>
          Font:{' '}
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
          >
            <option value="system">Default (Montserrat/Poppins/Inter)</option>
            {GOOGLE_FONTS.map((font) => (
              <option key={font.name} value={font.name}>
                {font.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Font Weight:
          <input
            type="number"
            min={FONT_WEIGHT_MIN}
            max={FONT_WEIGHT_MAX}
            step={FONT_WEIGHT_STEP}
            value={fontWeight}
            onChange={(e) => setFontWeight(Number(e.target.value))}
          />
        </label>

        <button
          type="button"
          onClick={() => engineRef.current?.rebuildMask()}
        >
          Apply
        </button>

        <div className={styles.fpsCounter}>FPS: {fps}</div>
      </div>

      <SRTime time={time} />
    </main>
  );
};

Clock_26_09_29.displayName = 'Clock_26_09_29';
export default Clock_26_09_29;
