import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { memo, useEffect, useMemo, useRef, useState } from 'react';

// --- Image Imports ---
import font251211 from '@/assets/fonts/25fonts/25-12-20-feather.otf';
import hourHandImg from '@/assets/images/25_images/25-12/25-12-20/fea1.webp';
import minuteHandImg from '@/assets/images/25_images/25-12/25-12-20/fea2.webp';
import secondHandImg from '@/assets/images/25_images/25-12/25-12-20/fea3.webp';
import bg1 from '@/assets/images/25_images/25-12/25-12-20/nest.jpg';

export const assets = [bg1, hourHandImg, minuteHandImg, secondHandImg, font251211];

const CLOCK_SIZE = 'min(90vw, 90vh)';
const HAND_SPECS = [
  { img: secondHandImg, width: '22vw', max: '200px', zIndex: 9 },
  { img: minuteHandImg, width: '28vw', max: '200px', zIndex: 8 },
  { img: hourHandImg, width: '19vw', max: '96px', zIndex: 7 },
];

export const fontConfigs = [{ fontFamily: 'CustomFont251211', fontUrl: font251211 }];

// --- Pre-calculated Numeral Positions ---
const NUMERAL_POSITIONS = ['12', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].map((text, i) => {
  const rad = (i * 30 - 90) * (Math.PI / 180);
  return {
    text,
    x: `${50 + 43 * Math.cos(rad)}%`,
    y: `${50 + 43 * Math.sin(rad)}%`,
  };
});

// --- HOOKS ---
function useTime() {
  const [time, setTime] = useState(() => new Date());
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      setTime(new Date());
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return time;
}

// --- COMPONENTS ---
const StaticBackground = memo(() => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none',
      backgroundImage: `url(${bg1})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      filter: 'contrast(0.9) brightness(3.5) saturate(0.2)',
    }}
  />
));

const ClockNumeral = memo(({ text, x, y }: { text: string; x: string; y: string }) => (
  <span
    style={{
      position: 'absolute',
      left: x,
      top: y,
      transform: 'translate(-50%, -50%)',
      color: '#05121CFF',
      fontFamily: 'CustomFont251211, serif',
      fontSize: 'clamp(7rem, 9vw, 8.5rem)',
      textShadow: '1px 1px 0px #B48811FF',
      pointerEvents: 'none',
    }}
  >
    {text}
  </span>
));

const ClockHand = memo(({ img, width, max, rotation, zIndex }: { img: string; width: string; max: string; rotation: number; zIndex: number }) => (
  <img
    decoding="async"
    loading="lazy"
    src={img}
    alt=""
    draggable={false}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `clamp(30px, ${width}, ${max})`,
      transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
      transformOrigin: 'bottom center',
      zIndex,
      pointerEvents: 'none',
      userSelect: 'none',
      willChange: 'transform',
    }}
  />
));

// --- MAIN COMPONENT ---
export default function AnalogClock() {
  const time = useTime();
  useSuspenseFontLoader(fontConfigs);

  const angles = useMemo(() => {
    const ms = time.getMilliseconds();
    const s = time.getSeconds() + ms / 1000;
    const m = time.getMinutes() + s / 60;
    const h = (time.getHours() % 12) + m / 60;
    return [s * 6, m * 6, h * 30]; // Ordered matching HAND_SPECS: second, minute, hour
  }, [time]);

  return (
    <>
      <StaticBackground />
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          width: CLOCK_SIZE,
          height: CLOCK_SIZE,
          transform: 'translate(-50%, -50%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        {NUMERAL_POSITIONS.map((p, i) => (
          <ClockNumeral key={i} text={p.text} x={p.x} y={p.y} />
        ))}
        {HAND_SPECS.map((h, i) => (
          <ClockHand
            key={i}
            img={h.img}
            width={h.width}
            max={h.max}
            zIndex={h.zIndex}
            rotation={angles[i]}
          />
        ))}
      </div>
    </>
  );
}