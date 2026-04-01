import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/useSmoothClock';
import ci2602Font from '@/assets/fonts/pin.ttf?url';

const OVAL = {
  RADIUS_X: 800,
  RADIUS_Z: 600,
  OFFSET_Z: -300,
  SPEED: 0.05,
};

export const fontConfigs = [
  {
    fontFamily: 'Cine',
    fontUrl: ci2602Font,
    options: { weight: 'normal', style: 'normal' },
  },
];

const OutwardDistortedClock: React.FC = () => {
  const time = useMillisecondClock();
  
  useSuspenseFontLoader(fontConfigs);

  const { digits, phase } = useMemo(() => {
    const h = (time.getHours() % 12 || 12).toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');
    const p = time.getHours() >= 12 ? 'pm' : 'am';

    return {
      digits: `${h}${m}${s}${p}`.split(''),
      phase: (time.getTime() / 1000) * OVAL.SPEED * 2 * Math.PI,
    };
  }, [time]);


  return (
    <div
      style={{
        ...containerStyle,
      }}
    >
      <div style={ringStyle}>
        {digits.map((char, i) => (
          <Digit
            key={i}
            char={char}
            index={i}
            total={digits.length}
            phase={phase}
          />
        ))}
      </div>
    </div>
  );
};

interface DigitProps {
  char: string;
  index: number;
  total: number;
  phase: number;
}

const Digit: React.FC<DigitProps> = ({ char, index, total, phase }) => {
  const angle = (index / total) * 2 * Math.PI - phase;
  const x = Math.sin(angle) * OVAL.RADIUS_X;
  const z = Math.cos(angle) * OVAL.RADIUS_Z + OVAL.OFFSET_Z;
  const rotationY = (angle * 180) / Math.PI;
  const isBack = Math.cos(angle) < 0;

  const distance = Math.abs(z - OVAL.OFFSET_Z);
  const scaleFactor = 1 + (distance / OVAL.RADIUS_Z) * 0.5;
  const fontSize = `${29 * scaleFactor}vh`;

  const style: React.CSSProperties = {
    ...digitBaseStyle,
    color: isBack ? '#08EEFA' : '#18080D',
    textShadow: isBack
      ? '15px 0 0px #270B05, 2px 2px 0 #0055ff'
      : '5px 52px 0px #A95C6100',
    zIndex: Math.round(z),
    opacity: isBack ? 0.9 : 0.2,
    transform: `translate(-50%, -50%) translate3d(${x}px, 0px, ${z}px) rotateY(${rotationY}deg)`,
    fontSize,
  };

  return <div style={style}>{char}</div>;
};

const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #782D3A 0%, #4F0546 100%)',
  overflow: 'hidden',
  perspective: '1200px',
  fontFamily: '"Cine", "Arial Black", sans-serif',
};

const ringStyle: React.CSSProperties = {
  position: 'relative',
  transformStyle: 'preserve-3d',
  width: '100%',
  height: '100%',
  transform: 'rotateX(10deg)',
};

const digitBaseStyle: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  fontSize: '29vh',
  backfaceVisibility: 'visible',
  WebkitBackfaceVisibility: 'visible',
  whiteSpace: 'pre',
  pointerEvents: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  transition: 'color 0.1s ease, text-shadow 0.1s ease',
};

export default OutwardDistortedClock;
