import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import React, { useEffect, useMemo, useRef } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-06-17.ttf?url';
import carVideo from '@/assets/images/26_images/26-06/26-06-17/avalanche.mp4';

export const assets = [carVideo];

const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont', fontUrl }];

const WORK_EMOJIS = ['💻', '📝', '📊', '☕'];
const PLAY_EMOJIS = ['🎮', '🎧', '🎨', '🍿'];

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#000',
  },
  videoOverlay: {
    position: 'absolute',
    inset: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1,
  },
  videoBackground: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 0,
  },
  clockContainer: {
    position: 'relative',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emojiTrack: {
    position: 'absolute',
    inset: 0,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    pointerEvents: 'none',
  },
  timeWrapper: {
    position: 'absolute',
    bottom: '20px',
    zIndex: 10,
    fontFamily: 'ClockFont, sans-serif',
    color: 'white',
    fontSize: '1rem',
  },
};

/**
  Determines whether the given second falls into a 25m work or 5m play cycle
  (0-24s: Work | 25-29s: Play | 30-54s: Work | 55-59s: Play)
 */
const getIsWorkPeriod = (seconds: number): boolean => {
  return (seconds >= 0 && seconds < 25) || (seconds >= 30 && seconds < 55);
};

interface HandProps {
  angle: number;
  length: number;
  width: number;
  color: string;
  type: 'hour' | 'minute' | 'second';
}

const ClockHand: React.FC<HandProps> = React.memo(({ angle, length, width, color, type }) => {
  const zIndex = type === 'second' ? 30 : type === 'minute' ? 20 : 10;
  const borderRadius = type === 'second' ? '1px' : `${width / 2}px`;

  const handStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
    borderRadius,
    zIndex,
  };

  return <div style={handStyle} data-hand-type={type} />;
});

ClockHand.displayName = 'ClockHand';

const AnalogClock: React.FC = () => {
  const rafRef = useRef<number | null>(null);
  const [, forceRender] = React.useReducer((x) => x + 1, 0);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const animate = () => {
      forceRender();
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  const ms = now.getMilliseconds();
  const isoTime = now.toISOString();

  // Evaluate interval state based on 25/5 Pomodoro threshold points
  const isWorkPeriod = getIsWorkPeriod(seconds);
  const activeEmojis = isWorkPeriod ? WORK_EMOJIS : PLAY_EMOJIS;

  const hourAngle = ((hours % 12) + minutes / 60) * 30;
  const minuteAngle = (minutes + seconds / 60) * 6;
  const secondAngle = (seconds + ms / 1000) * 6;

  const tickMarks = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      angle: i * 6,
      isHour: i % 5 === 0,
    }));
  }, []);

  const numbers = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i === 0 ? 12 : i;
      const angle = i * 30;
      const radian = (angle - 90) * (Math.PI / 180);
      const radius = 120;
      return {
        num,
        x: 160 + radius * Math.cos(radian),
        y: 160 + radius * Math.sin(radian),
      };
    });
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.videoOverlay} />
      <video
        style={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />

      <div style={styles.clockContainer}>
        {/* Emoji Track */}
        <div style={styles.emojiTrack}>
          {activeEmojis.map((emoji, idx) => (
            <span key={idx} style={{ margin: '0 8px' }}>
              {emoji}
            </span>
          ))}
        </div>

        {/* Ticks */}
        {tickMarks.map((tick) => (
          <div
            key={tick.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: tick.isHour ? '4px' : '2px',
              height: tick.isHour ? '14px' : '8px',
              backgroundColor: tick.isHour ? '#fff' : 'rgba(255,255,255,0.5)',
              transformOrigin: 'center top',
              transform: `translate(-50%, -150px) rotate(${tick.angle}deg)`,
            }}
          />
        ))}

        {/* Hour Numbers */}
        {numbers.map(({ num, x, y }) => (
          <div
            key={num}
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              color: '#fff',
              fontFamily: 'ClockFont, sans-serif',
              fontSize: '1.2rem',
            }}
          >
            {num}
          </div>
        ))}

        {/* Hands */}
        <ClockHand angle={hourAngle} length={70} width={6} color="#ffffff" type="hour" />
        <ClockHand angle={minuteAngle} length={100} width={4} color="#e0e0e0" type="minute" />
        <ClockHand angle={secondAngle} length={115} width={2} color="#ff4d4d" type="second" />
      </div>

      <time dateTime={isoTime} style={styles.timeWrapper}>
        {isWorkPeriod ? 'FOCUS PERIOD' : 'REST PERIOD'}
      </time>
    </div>
  );
};

export default AnalogClock;