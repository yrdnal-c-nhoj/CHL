import type { FontConfig } from '@/types/clock';
import { calculateAngles } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-08-02.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-02/aurora.mp4';

export const assets: string[] = [backgroundVideo, fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_08_02',
    fontUrl,
  },
];

const CLOCK_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);

const StaticGlobalStyles: React.FC = () => (
  <style>{`
    @keyframes auroraShift {
      0% {
        background-position: 0% 50%;
        filter: hue-rotate(0deg) brightness(1);
      }
      50% {
        background-position: 100% 50%;
        filter: hue-rotate(35deg) brightness(1.5);
      }
      100% {
        background-position: 0% 50%;
        filter: hue-rotate(-25deg) brightness(0.4);
      }
    }

    /* Keyframes match initial blur to avoid snaps */
    @keyframes auroraPulseNumber {
      0% {
        filter: blur(1.5px) drop-shadow(0 0 8px rgba(0, 255, 170, 0.8));
        opacity: 0.85;
      }
      50% {
        filter: blur(3px) drop-shadow(0 0 16px rgba(0, 200, 255, 0.9));
        opacity: 0.65;
      }
      100% {
        filter: blur(1.8px) drop-shadow(0 0 12px rgba(186, 85, 211, 0.8));
        opacity: 0.95;
      }
    }

    @keyframes auroraHandGlow {
      0% {
        filter: blur(1.5px) drop-shadow(0 0 12px rgba(0, 255, 170, 0.8));
        opacity: 0.9;
      }
      50% {
        filter: blur(3.5px) drop-shadow(0 0 22px rgba(0, 200, 255, 0.9));
        opacity: 1;
      }
      100% {
        filter: blur(2px) drop-shadow(0 0 15px rgba(186, 85, 211, 0.8));
        opacity: 0.85;
      }
    }

    @keyframes auroraSecondRibbon {
      0% {
        filter: blur(0.8px) drop-shadow(0 0 10px rgba(244, 63, 94, 0.9));
      }
      100% {
        filter: blur(2.2px) drop-shadow(0 0 18px rgba(236, 72, 153, 0.9));
      }
    }
  `}</style>
);

const ClockComponent: React.FC = () => {
  const time = useMillisecondClock();

  useSuspenseFontLoader(fontConfigs);

  const {
    hour: hourAngle,
    minute: minuteAngle,
    second: secondAngle,
  } = useMemo(() => calculateAngles(time), [time]);

  const styles: { [key: string]: React.CSSProperties } = {
    container: {
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#050a14',
      color: '#eee',
      position: 'relative',
    },
    backgroundVideo: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      transform: 'translate(-50%, -50%)',
      zIndex: 1,
      filter: 'saturate(1.8) contrast(1.1) brightness(0.8)',
    },
    analogClock: {
      position: 'relative',
      zIndex: 2,
      width: '90vmin',
      height: '90vmin',
      borderRadius: '50%',
      backgroundSize: '200% 200%',
      animation: 'auroraShift 14s ease infinite alternate',
    },
    face: {
      position: 'relative',
      width: '100%',
      height: '100%',
    },
    number: {
      position: 'absolute',
      fontSize: 'clamp(2.2rem, 12vmin, 5rem)',
      fontFamily: 'ClockFont_26_08_02, serif', // Apply the custom font here
      color: 'rgba(205, 245, 73, 0.41)',
      userSelect: 'none',
      zIndex: 3, 
      filter: 'blur(1.5px) drop-shadow(0 1px 0 rgb(12, 106, 75))',
      // opacity: 0.85,
      willChange: 'filter, transform, opacity',
      animation: 'auroraPulseNumber 6s ease-in-out infinite alternate',
    },
    handWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
    },
    hourHand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: '12px',
      height: '28%',
      transformOrigin: '50% 100%',
      background: 'linear-gradient(to top, rgba(9, 177, 121, 0.9), rgba(183, 255, 0, 0.6), transparent)',
      borderRadius: '50% 50% 0 0',
      animation: 'auroraHandGlow 7s ease-in-out infinite alternate',
      zIndex: 4,
    },
    minuteHand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: '8px',
      height: '60%',
      transformOrigin: '50% 100%',
      background: 'linear-gradient(to top, rgba(140, 255, 0, 0.9), rgba(13, 189, 122, 0.7), transparent)',
      borderRadius: '50% 50% 0 0',
      animation: 'auroraHandGlow 5s ease-in-out infinite alternate-reverse',
      zIndex: 5,
    },
    secondHand: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      width: '3px',
      height: '60%',
      transformOrigin: '50% 100%',
      background: 'linear-gradient(to top, #E0D90A, rgba(8, 178, 56, 0.8), transparent)',
      animation: 'auroraSecondRibbon 3s ease-in-out infinite alternate',
      zIndex: 6,
    },
    centerGlow: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: '20px',
      height: '20px',
      background: 'radial-gradient(circle, #FFFFFF5F 0%, rgba(0, 255, 200, 0.44) 50%, transparent 100%)',
      boxShadow: '0 0 20px rgba(0, 255, 200, 0.4), 0 0 40px rgb(186, 85, 211)',
      borderRadius: '50%',
      filter: 'blur(1px)',
      zIndex: 7,
    },
    srOnly: {
      position: 'absolute',
      width: '1px',
      height: '1px',
      padding: 0,
      margin: '-1px',
      overflow: 'hidden',
      clip: 'rect(0, 0, 0, 0)',
      whiteSpace: 'nowrap',
      borderWidth: 0,
    },
  };

  return (
    <main style={styles.container}>
      <StaticGlobalStyles />

      <video
        autoPlay
        loop
        muted
        playsInline
        style={styles.backgroundVideo}
        src={backgroundVideo}
      />

      <time dateTime={time.toISOString()} style={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div style={styles.analogClock}>
        <div style={styles.face}>
          {CLOCK_NUMBERS.map((num) => {
            const angle = (num * 30 - 90) * (Math.PI / 180);
            const radius = 44;
            const left = 50 + radius * Math.cos(angle);
            const top = 50 + radius * Math.sin(angle);
            const delay = (num * 0.4) % 3;

            return (
              <span
                key={num}
                style={{
                  ...styles.number,
                  left: `${left}%`,
                  top: `${top}%`,
                  transform: `translate(-50%, -50%) rotate(${num * 30}deg)`,
                  animationDelay: `${delay}s`,
                }}
              >
                {num}
              </span>
            );
          })}

          <div style={styles.handWrapper}>
            <div
              style={{
                ...styles.hourHand,
                transform: `translateX(-50%) rotate(${hourAngle}deg)`,
              }}
            />
          </div>

          <div style={styles.handWrapper}>
            <div
              style={{
                ...styles.minuteHand,
                transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
              }}
            />
          </div>

          <div style={styles.handWrapper}>
            <div
              style={{
                ...styles.secondHand,
                transform: `translateX(-50%) rotate(${secondAngle}deg)`,
              }}
            />
          </div>

          <div style={styles.centerGlow} />
        </div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_02';

export default MemoizedClock;