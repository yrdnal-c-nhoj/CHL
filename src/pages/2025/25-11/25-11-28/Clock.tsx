import React, { useEffect, useState } from 'react';
import { useClockTime } from '@/utils/hooks';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import li251128font from '@/assets/fonts/25fonts/25-11-28-line.otf?url';
import patternImg from '@/assets/images/25_images/25-11/25-11-28/line.webp';
import styles from './Clock.module.css';

// Export assets for preloading
export const assets = [patternImg];

export const fontConfigs = [
  {
    fontFamily: 'Li251128font',
    fontUrl: li251128font,
    options: { weight: 'normal', style: 'normal' },
  },
];

export default function TimelineClock() {
  const now = useClockTime();
  const [isVertical, setIsVertical] = useState<boolean>(false);
  const [flash, setFlash] = useState<boolean>(false);
  const [comet, setComet] = useState<number>(-100);

  useSuspenseFontLoader(fontConfigs);

  // Orientation check
  useEffect(() => {
    const check = () => setIsVertical(window.innerWidth < window.innerHeight);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // EXISTING: Comet sweep
  useEffect(() => {
    const triggerComet: React.FC = () => {
      setComet(-20);
      const duration = 800 + Math.random() * 700;
      const timer = setTimeout(() => setComet(120), 50);
      setTimeout(() => setComet(-100), duration + 100);
      return () => clearTimeout(timer);
    };
    triggerComet();
    const interval = setInterval(triggerComet, 4000 + Math.random() * 5000);
    return () => clearInterval(interval);
  }, []);

  // EXISTING: Flash heartbeat
  useEffect(() => {
    const iv = setInterval(() => {
      setFlash(true);
      setTimeout(() => setFlash(false), 300);
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const seconds =
    now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
  const percent = (seconds / 86400) * 100;
  
  // Dynamic styles that cannot be easily moved to CSS Modules
  const dynamicStyles = {
    bar: { backgroundSize: isVertical ? '26vh 18vh' : '24vh 18vh' },
    nowLine: {
      top: isVertical ? `${percent}%` : 0,
      left: isVertical ? 0 : `${percent}%`,
      width: isVertical ? '100%' : '2.4px',
      height: isVertical ? '2.4px' : '100%',
    },
    comet: {
      top: isVertical ? `${comet}%` : '50%',
      left: isVertical ? '50%' : `${comet}%`,
      opacity: comet >= -20 && comet <= 120 ? 1 : 0,
    }
  };

  const ticks = Array.from({ length: 25 }, (_, h) => ({
    hour: h,
    pos: (h / 24) * 100,
  }));

  return (
    <main className={styles.container}>
      <div className={styles.timeline}>
        <div 
          className={styles.bar} 
          style={{ 
            backgroundImage: `url(${patternImg})`,
            ...dynamicStyles.bar 
          }} 
        />
        {/* Hour ticks (now diagonal) */}
        {ticks.map((t) => (
          <div 
            key={t.hour} 
            className={styles.tick} 
            style={{ left: `${t.pos}%`, top: `${t.pos}%` }}
          >
            {String(t.hour).padStart(2, '0')}
          </div>
        ))}
        
        <time className={`${styles.nowLine} ${flash ? styles.flash : ''}`} style={dynamicStyles.nowLine} dateTime={now.toISOString()} />
        <div className={styles.comet} style={dynamicStyles.comet} />
      </div>
    </main>
  );
}
