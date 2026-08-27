import { memo, useMemo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import bgImage from '@/assets/images/25_images/25-12/25-12-13/roc.webp';
import fontFile from '@/assets/fonts/25fonts/25-12-13-cherub.ttf?url';
import styles from './Clock.module.css';

export const assets = [bgImage, fontFile];

const fontFamily = 'RococoFont';

const fontConfigs: FontConfig[] = [
  { fontFamily, fontUrl: fontFile },
];

const RococoClock = () => {
  const now = useMillisecondClock();
  useSuspenseFontLoader(fontConfigs);

  const digitConfigs = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      duration: 8 + Math.random() * 6,
      delay: Math.random() * -10,
      rangeX: 2 + Math.random() * 3,
      rangeY: 3 + Math.random() * 4,
      rotate: 5 + Math.random() * 15,
      scale: 1.05 + Math.random() * 0.1,
      fontSize: i >= 4 ? 'clamp(4rem, 8vh, 12vh)' : 'clamp(6rem, 15vh, 25vh)',
    })),
    [],
  );

  const hours = now.getHours();
  const displayHours = hours % 12 === 0 ? 12 : hours % 12;
  const hourDigits = displayHours.toString().split('');
  const minuteDigits = now.getMinutes().toString().padStart(2, '0').split('');
  const ampmDigits = (hours >= 12 ? 'pm' : 'am').split('');
  const allChars = [...hourDigits, ...minuteDigits, ...ampmDigits];

  return (
    <main className={styles.container} style={{
      ...containerStyle,
      opacity: 1,
      transition: 'opacity 0.4s ease',
    }}>
      <time dateTime={now.toISOString()} className={styles.srOnly}>{now.toLocaleTimeString()}</time>

      <div style={rowStyle}>
        {allChars.map((char, i) => {
          const config = digitConfigs[i];
          return (
            <div
              key={i}
              className={styles.rococoFloat}
              style={{
                ...baseDigitStyle,
                fontFamily: `'${fontFamily}', serif`,
                fontSize: config.fontSize,
                animation: `rococoFloat ${config.duration}s infinite cubic-bezier(0.45, 0, 0.55, 1)`,
                animationDelay: `${config.delay}s`,
                '--rx': `${config.rangeX}vw`,
                '--ry': `${config.rangeY}dvh`,
                '--rot': `${config.rotate}deg`,
                '--sc': config.scale,
                zIndex: i < 2 ? 30 : i >= 4 ? 5 : 15,
                opacity: 1,
                transition: 'opacity 2s ease-in',
              }}
            >
              {char}
            </div>
          );
        })}
      </div>
    </main>
  );
};

const containerStyle = {
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#000',
  overflow: 'hidden',
  position: 'relative',
} as const;

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  alignItems: 'center',
  width: '90%',
  gap: '1rem',
} as const;

const baseDigitStyle = {
  display: 'inline-block',
  color: '#F3DBCF',
  textAlign: 'center',
  pointerEvents: 'none',
  textShadow: `
    0 0 10px rgba(255, 255, 255, 0.77),
    0.2dvh 0.2dvh 0.4dvh rgba(169, 19, 99, 0.81),
    -0.2dvh -0.2dvh 0.4dvh rgba(50, 205, 50, 0.72)
  `,
  willChange: 'transform',
} as const;

const MemoizedRococoClock = memo(RococoClock);
MemoizedRococoClock.displayName = 'Clock_25_12_13';
export default MemoizedRococoClock;
