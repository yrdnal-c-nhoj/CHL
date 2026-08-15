import React, { useEffect, useState, useMemo } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import backgroundImg from '@/assets/images/25_images/25-11/25-11-29/squ.webp';
import fontUrl_20251128 from '@/assets/fonts/25fonts/25-11-29-roc.ttf?url';

export const assets = [];

function RococoDigitalClock() {
  const now = useMillisecondClock();
  const [morph, setMorph] = useState<number>(0);
  const [isVertical, setIsVertical] = useState<boolean>(false);

  const fontConfigs = useMemo<FontConfig[]>(
    () => [
      {
        fontFamily: 'RococoBlob',
        fontUrl: fontUrl_20251128,
        options: { weight: '800' },
      },
    ],
    [],
  );

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    setMorph(1);
    const tick = () => {
      setMorph((m) => m + 1);
      const timer = setTimeout(tick, 5000);
      return () => clearTimeout(timer);
    };
    const timer = setTimeout(tick, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    function check() {
      setIsVertical(window.innerWidth < window.innerHeight);
    }
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  const timeStr = `${hours}:${minutes}:${seconds}`;

  const rand = (seed) => {
    const x = Math.sin(seed) * 12345;
    return x - Math.floor(x);
  };

  const distortLetter = (char, i) => {
    const s = (morph + i + char.charCodeAt(0)) * 13.37;
    return {
      transform: `
        rotate(${-50 + rand(s) * 100}deg)
        skewX(${-65 + rand(s + 1) * 130}deg)
        skewY(${-50 + rand(s + 2) * 100}deg)
        scale(${0.5 + rand(s + 3) * 1.3}, ${0.7 + rand(s + 4) * 1.1})
        translateY(${-4 + rand(s + 5) * 8}vh)
        translateX(${-2 + rand(s + 6) * 4}vh)
      `,
      transition: 'transform 4.2s cubic-bezier(0.22, 0.88, 0.34, 0.98)',
    };
  };

  if (isVertical) {
    return (
      <main
        style={{
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${backgroundImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(1.2) contrast(1.4)',
          fontFamily: "'RococoBlob', serif",
          overflow: 'hidden',
          gap: '2vh',
          opacity: 1,
        }}
      >
      <time dateTime={now.toISOString()} className={styles.srOnly}>{now.toLocaleTimeString()}</time>

        {/* Font face is now loaded in the main effect */}
        <div style={{ display: 'flex', position: 'relative' }}>
          {hours.split('').map((char, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: '10vh',
                height: '18vh',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15vh',
                  lineHeight: '0.88',
                  opacity: 0.6,
                  color: '#352904FF',
                  userSelect: 'none',
                  willChange: 'transform',
                  ...distortLetter(char, i),
                }}
              >
                {char}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', position: 'relative' }}>
          {minutes.split('').map((char, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: '10vh',
                height: '18vh',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15vh',
                  lineHeight: '0.88',
                  opacity: 0.6,
                  color: '#352904FF',
                  userSelect: 'none',
                  willChange: 'transform',
                  ...distortLetter(char, i + 2),
                }}
              >
                {char}
              </span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', position: 'relative' }}>
          {seconds.split('').map((char, i) => (
            <div
              key={i}
              style={{
                position: 'relative',
                width: '10vh',
                height: '18vh',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15vh',
                  lineHeight: '0.88',
                  opacity: 0.9,
                  color: '#746A4D',
                  userSelect: 'none',
                  willChange: 'transform',
                  ...distortLetter(char, i + 4),
                }}
              >
                {char}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <main
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        // filter: "brightness(1.2) contrast(1.4)",
        fontFamily: "'RococoBlob', serif",
        overflow: 'hidden',
      }}
    >
      <time dateTime={now.toISOString()} className={styles.srOnly}>{now.toLocaleTimeString()}</time>
      <div
        style={{
          display: 'flex',
          position: 'relative',
        }}
      >
        {timeStr.split('').map((char, i) => (
          <div
            key={i}
            style={{
              position: 'relative',
              width: char === ':' ? '6vh' : '10vh',
              height: '18vh',
              flexShrink: 0,
            }}
          >
            <span
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: char === ':' ? '10vh' : '12vh',
                lineHeight: '0.88',
                opacity: 0.9,
                color: '#806107',
                userSelect: 'none',
                willChange: 'transform',
                ...distortLetter(char, i),
              }}
            >
              {char}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}

const MemoizedRococoDigitalClock = React.memo(RococoDigitalClock);
MemoizedRococoDigitalClock.displayName = 'Clock_25_11_29';
export default MemoizedRococoDigitalClock;
