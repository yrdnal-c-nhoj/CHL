import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-06-17.ttf?url';
import carVideo from '@/assets/images/26_images/26-06/26-06-17/avalanche.mp4';
import styles from './Clock.module.css';

export const assets = [carVideo];

const fontConfigs: FontConfig[] = [{ fontFamily: 'ClockFont', fontUrl }];

const WORK_EMOJIS = ['💻', '📝', '📊', '☕'];
const PLAY_EMOJIS = ['🎮', '🎧', '🎨', '🍿'];

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
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock();

  const { hourAngle, minuteAngle, secondAngle, isWorkPeriod, isoTime } = useMemo(() => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const ms = time.getMilliseconds();

    return {
      hourAngle: ((hours % 12) + minutes / 60) * 30,
      minuteAngle: (minutes + seconds / 60) * 6,
      secondAngle: (seconds + ms / 1000) * 6,
      isWorkPeriod: getIsWorkPeriod(seconds),
      isoTime: time.toISOString(),
    };
  }, [time]);

  const activeEmojis = isWorkPeriod ? WORK_EMOJIS : PLAY_EMOJIS;

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
    <main className={styles.container}>
      <div className={styles.videoOverlay} />
      <video
        className={styles.videoBackground}
        autoPlay
        loop
        muted
        playsInline
        src={carVideo}
      />
      <time dateTime={isoTime} className={styles.semanticTime}>{time.toLocaleTimeString()}</time>
      <div className={styles.clockContainer}>
        {/* Emoji Track */}
        <div className={styles.emojiTrack}>
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
              '--tick-width': tick.isHour ? '4px' : '2px',
              '--tick-height': tick.isHour ? '14px' : '8px',
              '--tick-color': tick.isHour ? '#fff' : 'rgba(255,255,255,0.5)',
              transform: `translate(-50%, -150px) rotate(${tick.angle}deg)`,
            } as React.CSSProperties}
            className={styles.tick}
          />
        ))}

        {/* Hour Numbers */}
        {numbers.map(({ num, x, y }) => (
          <div
            key={num}
            style={{
              left: `${x}px`,
              top: `${y}px`,
            }}
            className={styles.number}
          >
            {num}
          </div>
        ))}

        {/* Hands */}
        <ClockHand angle={hourAngle} length={70} width={6} color="#ffffff" type="hour" />
        <ClockHand angle={minuteAngle} length={100} width={4} color="#e0e0e0" type="minute" />
        <ClockHand angle={secondAngle} length={115} width={2} color="#ff4d4d" type="second" />
      </div>

      <div className={styles.statusDisplay}>
        {isWorkPeriod ? 'FOCUS PERIOD' : 'REST PERIOD'}
      </div>
    </main>
  );
};

const MemoizedAnalogClock = React.memo(AnalogClock);
MemoizedAnalogClock.displayName = 'Clock_2026_06_17';

export default MemoizedAnalogClock;