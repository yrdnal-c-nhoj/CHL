import { memo, useEffect, useMemo, useState } from 'react';
import { useSecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import AsteriskFont1 from '@/assets/fonts/26fonts/26-02-17-ast.otf?url';
import AsteriskFont2 from '@/assets/fonts/26fonts/26-02-17-aster.otf?url';
import styles from './Clock.module.css';

export const assets = [AsteriskFont1, AsteriskFont2];

const generateChars = (): string[] => {
  const charPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
  for (let i = charPool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [charPool[i], charPool[j]] = [charPool[j], charPool[i]];
  }
  return charPool.slice(0, 12).filter((char) => char !== undefined);
};

interface StreamData {
  chars: string[];
  duration: number;
  delay: number;
  easing: string;
}

const BackgroundGrid = ({ windowSize, cellSize }) => {
  const columnCount = Math.ceil(windowSize.width / cellSize);
  const rowsPerColumn = 20;

  const streams = useMemo(() =>
    Array.from({ length: columnCount }, (): StreamData => ({
      chars: Array.from({ length: rowsPerColumn }, () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        return chars[Math.floor(Math.random() * chars.length)];
      }),
      duration: 20 + Math.random() * 30,
      delay: Math.random() * -30,
      easing: ['ease-in-out', 'ease-out', 'ease-in', 'ease-in-out'][Math.floor(Math.random() * 4)] || 'ease-in-out',
    })),
    [columnCount],
  );

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        display: 'flex',
        pointerEvents: 'none',
        opacity: 0.3,
        overflow: 'hidden',
      }}
    >
      {streams.map((stream, colIdx) => (
        <div
          key={colIdx}
          className={styles.rainRise}
          style={{
            width: cellSize,
            display: 'flex',
            flexDirection: 'column',
            animationDelay: `${stream.delay}s`,
          }}
        >
          {[...stream.chars, ...stream.chars, ...stream.chars].map((char, i) => (
            <div
              key={i}
              style={{
                height: cellSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'AsteriskFont1, sans-serif',
                fontSize: '1.8rem',
                color: '#B103F6',
                userSelect: 'none',
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

const AsteriskClock =  () => {
  const time = useSecondClock();
  const [clockChars, setClockChars] = useState<string[]>(generateChars);
  const [visible, setVisible] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  const cellSize = 50;

  const fontConfigs = useMemo(
    () => [
      { fontFamily: 'AsteriskFont1', fontUrl: AsteriskFont1, options: { weight: 'normal', style: 'normal' } },
      { fontFamily: 'AsteriskFont2', fontUrl: AsteriskFont2, options: { weight: 'normal', style: 'normal' } },
    ],
    [],
  );
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (time.getSeconds() % 3 === 0) {
      setVisible(false);
      setTimeout(() => {
        setClockChars(generateChars());
        setVisible(true);
      }, 400);
    }
  }, [time]);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const secondAngle = seconds * 6 - 90;
  const minuteAngle = minutes * 6 + seconds * 0.1 - 90;
  const hourAngle = hours * 30 + minutes * 0.5 - 90;

  return (
    <main className={styles.container} style={{
      width: '100vw',
      height: '100vh',
      minHeight: '100dvh',
      backgroundColor: '#CFF6DA',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <BackgroundGrid windowSize={windowSize} cellSize={cellSize} />

      <div
        style={{
          position: 'relative',
          width: 'min(75vw, 75vh)',
          height: 'min(75vw, 75vh)',
          zIndex: 10,
          border: '2px solid rgba(0,0,0,0.05)',
          borderRadius: '50%',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        >
          {clockChars.map((char, i) => {
            const angle = i * 30 - 90;
            const x = 50 + 42 * Math.cos((angle * Math.PI) / 180);
            const y = 50 + 42 * Math.sin((angle * Math.PI) / 180);
            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: 'translate(-50%, -50%)',
                  fontFamily: 'AsteriskFont2, sans-serif',
                  fontSize: 'clamp(3rem, 14vh, 8rem)',
                  color: '#1C1C19',
                  textShadow: '2px 2px 0px #FBEF05',
                  userSelect: 'none',
                }}
              >
                {char}
              </div>
            );
          })}
        </div>

        <svg
          viewBox="0 0 200 200"
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        >
          <line x1="100" y1="100" x2={100 + 30 * Math.cos((hourAngle * Math.PI) / 180)} y2={100 + 30 * Math.sin((hourAngle * Math.PI) / 180)} stroke="#333" strokeWidth="6" strokeLinecap="round" />
          <line x1="100" y1="100" x2={100 + 45 * Math.cos((minuteAngle * Math.PI) / 180)} y2={100 + 45 * Math.sin((minuteAngle * Math.PI) / 180)} stroke="#333" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          <line x1="100" y1="100" x2={100 + 55 * Math.cos((secondAngle * Math.PI) / 180)} y2={100 + 55 * Math.sin((secondAngle * Math.PI) / 180)} stroke="#ff3333" strokeWidth="2" strokeLinecap="round" />
          <circle cx="100" cy="100" r="3" fill="#333" />
        </svg>
      </div>
    </main>
  );
};

const MemoizedAsteriskClock = memo(AsteriskClock);
MemoizedAsteriskClock.displayName = 'Clock_26_02_17';
export default MemoizedAsteriskClock;
