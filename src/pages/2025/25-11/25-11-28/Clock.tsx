import li251128font from '@/assets/fonts/25fonts/25-11-28-line.otf?url';
import patternImg from '@/assets/images/25_images/25-11/25-11-28/line.webp';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styles from './Clock.module.css';

export const assets = [patternImg];

const fontConfigs = [
  {
    fontFamily: 'Li251128font',
    fontUrl: li251128font,
    options: { weight: 'normal', style: 'normal' },
  },
];

const TimelineClock = () => {
  const now = useMillisecondClock();
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);
  const [comet, setComet] = useState<number>(-100);

  useSuspenseFontLoader(fontConfigs);

  const triggerComet = useCallback(() => {
    setComet(-20);
    const duration = 800 + Math.random() * 700;
    const timer = setTimeout(() => setComet(120), 50);
    setTimeout(() => setComet(-100), duration + 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const scheduleComet = () => {
      triggerComet();
      const delay = 4000 + Math.random() * 5000;
      const timer = setTimeout(scheduleComet, delay);
      return () => clearTimeout(timer);
    };
    const timer = setTimeout(scheduleComet, 0);
    return () => clearTimeout(timer);
  }, [triggerComet]);

  useEffect(() => {
    const scheduleFlash = () => {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
      const timer = setTimeout(scheduleFlash, 3000);
      return () => clearTimeout(timer);
    };
    const timer = setTimeout(scheduleFlash, 0);
    return () => clearTimeout(timer);
  }, []);

  const seconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const percent = (seconds / 86400) * 100;

  const dynamicStyles = useMemo(() => ({
    bar: { backgroundSize: isVertical ? '26vh 18vh' : '24vh 18vh' },
    nowLine: {
      top: isVertical ? `${percent}%` : 0,
      left: isVertical ? 0 : `${percent}%`,
      width: isVertical ? '100%' : '2.4px',
      height: isVertical ? '2.4px' : '100%',
      backgroundColor: '#007bff',
    },
    comet: {
      top: isVertical ? `${comet}%` : '50%',
      left: isVertical ? '50%' : `${comet}%`,
      opacity: comet >= -20 && comet <= 120 ? 1 : 0,
    }
  }), [isVertical, percent, comet]);

  const ticks = Array.from({ length: 25 }, (_, h) => ({
    hour: h,
    pos: (h / 24) * 100,
  }));

  return (
    <main className={styles.container}>
      <div className={styles.timeline}>
        <div
          className={styles.bar}
          style={{ backgroundColor: '#007bff' }}
        />
        {ticks.map((t) => (
          <div
            key={t.hour}
            className={styles.tick}
            style={{ left: `${t.pos}%`, top: `${t.pos}%` }}
          >
            {String(t.hour).padStart(2, '0')}
          </div>
        ))}

        <time className={styles.srOnly} dateTime={now.toISOString()}>
          {now.toLocaleTimeString()}
        </time>
        <div className={styles.comet} style={dynamicStyles.comet} />
      </div>
    </main>
  );
};

const MemoizedTimelineClock = React.memo(TimelineClock);
MemoizedTimelineClock.displayName = 'Clock_25_11_28';
export default MemoizedTimelineClock;
