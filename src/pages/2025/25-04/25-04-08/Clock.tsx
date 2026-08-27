import { memo, useEffect, useRef, useMemo, useCallback } from 'react';
import { useMillisecondClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import sageFontUrl from '@/assets/fonts/25fonts/25-04-08-sage.ttf?url';
import styles from './Clock.module.css';

export const assets = [sageFontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'CactusClockFont',
    fontUrl: sageFontUrl,
    options: { weight: 'normal', style: 'normal' },
  },
];

const TripleCactusClock = () => {
  const clockRefs = {
    hours: useRef<HTMLDivElement>(null),
    minutes: useRef<HTMLDivElement>(null),
    seconds: useRef<HTMLDivElement>(null),
    milliseconds: useRef<HTMLDivElement>(null),
  };

  useSuspenseFontLoader(fontConfigs);
  const currentTime = useMillisecondClock();

  const setDigits = useCallback((container: HTMLDivElement | null, text: string): void => {
    if (!container) return;
    container.innerHTML = '';
    for (const char of text) {
      const span = document.createElement('span');
      span.textContent = char;
      Object.assign(span.style, {
        color: '#f3f586',
        fontSize: '12dvh',
        lineHeight: '8dvh',
        textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"',
        fontFamily: 'CactusClockFont, sans-serif',
      });
      container.appendChild(span);
    }
  }, []);

  const updateClock = useCallback((): void => {
    setDigits(clockRefs.hours.current, String(currentTime.getHours()).padStart(2, '0'));
    setDigits(clockRefs.minutes.current, String(currentTime.getMinutes()).padStart(2, '0'));
    setDigits(clockRefs.seconds.current, String(currentTime.getSeconds()).padStart(2, '0'));
    setDigits(clockRefs.milliseconds.current, String(currentTime.getMilliseconds()).padStart(3, '0'));
  }, [currentTime, setDigits]);

  useEffect(() => {
    updateClock();
  }, [updateClock]);

  return (
    <main className={styles.container} style={{
      margin: 0,
      padding: 0,
      boxSizing: 'border-box',
      height: '100%',
      overflow: 'hidden',
      background: '#01151d',
    }}>
      <time dateTime={currentTime.toISOString()} className={styles.srOnly}>{currentTime.toLocaleTimeString()}</time>

      <div
        className={styles.skyCycle}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100dvh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'column',
        }}
      >
        <div
          className={styles.sunVertical}
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              fontFamily: 'CactusClockFont',
            }}
          >
            <div style={{ display: 'flex', gap: '1.3dvh', margin: '1dvh 0' }} ref={clockRefs.hours} />
            <div style={{ display: 'flex', gap: '1.3dvh', margin: '1dvh 0' }} ref={clockRefs.minutes} />
            <div style={{ display: 'flex', gap: '1.3dvh', margin: '1dvh 0' }} ref={clockRefs.seconds} />
            <div style={{ display: 'flex', gap: '1.3dvh', margin: '1dvh 0' }} ref={clockRefs.milliseconds} />
          </div>
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '40dvh',
            width: '100%',
            height: 0,
            zIndex: 1,
            display: 'flex',
            justifyContent: 'center',
            gap: '1vw',
            opacity: 0.6,
          }}
        >
          {['#48638f', '#707d93', '#48638f'].map((color, i) => (
            <div
              key={i}
              style={{
                width: 0,
                height: 0,
                borderLeft: '15vw solid transparent',
                borderRight: '15vw solid transparent',
                borderBottom: `15dvh solid ${color}`,
              }}
            />
          ))}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            height: '27dvh',
            width: '100%',
            background: '#c5a770',
            zIndex: 2,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '15vw',
              marginBottom: '8dvh',
            }}
          >
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '2vw',
                  height: '15dvh',
                  background: '#228b22',
                  borderRadius: '1vw',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    width: '1vw',
                    height: '6dvh',
                    background: '#228b22',
                    borderRadius: '50% 50% 0 0',
                    left: '-1vw',
                    top: '20%',
                    transform: 'rotate(-40deg)',
                    transformOrigin: 'bottom right',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    width: '1vw',
                    height: '6dvh',
                    background: '#228b22',
                    borderRadius: '50% 50% 0 0',
                    right: '-1vw',
                    top: '10%',
                    transform: 'rotate(40deg)',
                    transformOrigin: 'bottom left',
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

const MemoizedTripleCactusClock = memo(TripleCactusClock);
MemoizedTripleCactusClock.displayName = 'Clock_25_04_08';
export default MemoizedTripleCactusClock;
