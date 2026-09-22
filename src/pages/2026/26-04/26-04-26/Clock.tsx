
import { memo, useMemo } from 'react';
import { useSmoothClock } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import bgVideo from '@/assets/images/26_images/26-04/26-04-26/jetson.mp4';
import jetFont from '@/assets/fonts/26fonts/26-04-26-jet.ttf?url';

import styles from './Clock.module.css';

export const assets = [bgVideo, jetFont];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'Jet',
    fontUrl: jetFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const Clock = () => {
  const time = useSmoothClock();

  useSuspenseFontLoader(fontConfigs);

  const { displayHours, displayMinutes, displaySeconds } = useMemo(() => {
    const rawHours = time.getHours();
    const hours = rawHours % 12 || 12;

    return {
      displayHours: formatTime(hours),
      displayMinutes: formatTime(time.getMinutes()),
      displaySeconds: formatTime(time.getSeconds()),
    };
  }, [time]);

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative' as const,
    overflow: 'hidden',
    margin: 0,
    padding: 0,
  };

  const videoStyle = {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
    zIndex: 0,
  };

  const digitStyle = {
    fontSize: 'clamp(2rem, 8vw, 6rem)',
    color: '#fff',
    minWidth: '0.8em',
    lineHeight: 1,
    textShadow: `
      0 0 10px rgba(255, 100, 50, 0.8),
      0 0 20px rgba(255, 100, 50, 0.6),
      0 0 40px rgba(255, 50, 100, 0.4),
      2px 2px 0 rgba(0, 0, 0, 0.8),
      -1px -1px 0 #fff
    `,
    WebkitTextStroke: '1px rgba(0, 0, 0, 0.3)',
  };

  const timeStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5rem',
    fontFamily: 'Jet',
  };

  const digitBoxStyle = {
    width: 'clamp(1.5rem, 7vw, 5rem)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const separatorStyle = {
    ...digitStyle,
    margin: '0 0.25rem',
    transform: 'translateY(-0.05em)',
  };

  const clockWrapperStyle = {
    position: 'relative' as const,
    zIndex: 1,
    width: '90vw',
    maxWidth: '800px',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <main className={styles.container} style={containerStyle}>
      <time
        dateTime={time.toISOString()}
        className={styles.srOnly}
      >
        {time.toLocaleTimeString()}
      </time>

      <video
        src={bgVideo}
        autoPlay
        loop
        muted
        playsInline
        style={videoStyle}
      />

      <div style={clockWrapperStyle}>
        <time
          style={timeStyle}
          dateTime={time.toISOString()}
          aria-label={`${displayHours}:${displayMinutes}:${displaySeconds}`}
        >
          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayHours[0]}</span>
          </div>

          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayHours[1]}</span>
          </div>

          <span style={separatorStyle}>:</span>

          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayMinutes[0]}</span>
          </div>

          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displayMinutes[1]}</span>
          </div>

          <span style={separatorStyle}>:</span>

          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displaySeconds[0]}</span>
          </div>

          <div style={digitBoxStyle}>
            <span style={digitStyle}>{displaySeconds[1]}</span>
          </div>
        </time>
      </div>
    </main>
  );
};

const MemoizedClock = memo(Clock);

MemoizedClock.displayName = 'Clock_26_04_26';

export default MemoizedClock;
