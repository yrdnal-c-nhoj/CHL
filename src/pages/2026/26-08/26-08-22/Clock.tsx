import wallFont from '@/assets/fonts/26fonts/26-08-22.ttf';
import bgImage from '@/assets/images/26_images/26-08/26-08-22/mars.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useEffect, useState, memo } from 'react';

const FONT_CONFIGS: FontConfig[] = [{ fontFamily: 'Wall_26-08-22', fontUrl: wallFont }];

const padZero = (num: number) => (num < 10 ? `0${num}` : `${num}`);

const Clock = () => {
  useSuspenseFontLoader(FONT_CONFIGS);

  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = padZero(time.getHours());
  const minutes = padZero(time.getMinutes());
  const seconds = padZero(time.getSeconds());

  const digits = [
    hours[0],
    hours[1],
    minutes[0],
    minutes[1],
    seconds[0],
    seconds[1],
  ];

  return (
    <>
      <style>{`
        @keyframes panBackground {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>

      <div
        style={{
          position: 'relative',
          width: '100vw',
          height: '100dvh',
          overflow: 'hidden',
          backgroundColor: '#000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        role="img"
        aria-label={`Current time: ${hours}:${minutes}:${seconds}`}
      >
        {/* Seamless Panorama Track */}
        <div
          style={{
            position: 'absolute',
            inset: '0 auto auto 0',
            height: '100%',
            width: '400%',
            display: 'flex',
            willChange: 'transform',
            animation: 'panBackground 40s linear infinite',
          }}
          aria-hidden="true"
        >
          <img
            src={bgImage}
            style={{
              height: '100%',
              width: '25%',
              objectFit: 'cover',
              flexShrink: 0,
              filter: 'brightness(1) contrast(1.2) saturate(1.3)',
            }}
            alt=""
          />
          <img
            src={bgImage}
            style={{
              height: '100%',
              width: '25%',
              objectFit: 'cover',
              flexShrink: 0,
              filter: 'brightness(1) contrast(1.2) saturate(1.3)',
              transform: 'scaleX(-1)',
            }}
            alt=""
          />
          <img
            src={bgImage}
            style={{
              height: '100%',
              width: '25%',
              objectFit: 'cover',
              flexShrink: 0,
              filter: 'brightness(1) contrast(1.2) saturate(1.3)',
            }}
            alt=""
          />
          <img
            src={bgImage}
            style={{
              height: '100%',
              width: '25%',
              objectFit: 'cover',
              flexShrink: 0,
              filter: 'brightness(1) contrast(1.2) saturate(1.3)',
              transform: 'scaleX(-1)',
            }}
            alt=""
          />
        </div>

        {/* Vertical Column of 6 Digits */}
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Wall_26-08-22', monospace",
            fontSize: '13vh',
            lineHeight: 1,
            pointerEvents: 'none',
            color: '#ffffff',
            mixBlendMode: 'difference',
          }}
        >
          {digits.map((digit, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              {digit}
            </div>
          ))}
        </div>

        <time
          dateTime={time.toISOString()}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            padding: 0,
            margin: '-1px',
            overflow: 'hidden',
            clip: 'rect(0, 0, 0, 0)',
            whiteSpace: 'nowrap',
            borderWidth: 0,
          }}
        >
          {`${hours}:${minutes}:${seconds}`}
        </time>
      </div>
    </>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_08_22';
export default MemoizedClock;
