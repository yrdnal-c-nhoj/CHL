import React, { useEffect, useState, useMemo } from 'react';

import backgroundImg from '@/assets/images/2025/25-11/25-11-25/npt.webp';
import fontClockUrl from '@/assets/fonts/2025/25-11-25-ntp.ttf?url';
import fontMarqueeUrl from '@/assets/fonts/2025/25-11-25-n2.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';
import styles from './Clock.module.css';

export { backgroundImg };

const NTP_EPOCH_OFFSET = 2208988800;
const MS_PER_SECOND = 1000;

function useNtpOffset() {
  const [offset, setOffset] = useState<number>(0);
  const [isSynced, setIsSynced] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const fetchTime = async () => {
      try {
        const start = performance.now();
        const res = await fetch('https://worldtimeapi.org/api/timezone/Etc/UTC');
        const data = await res.json();
        const networkDelay = (performance.now() - start) / 2;
        if (isMounted) {
          setOffset(new Date(data.utc_datetime).getTime() - (Date.now() + networkDelay));
          setIsSynced(true);
        }
      } catch (e) {
        if (isMounted) setIsSynced(true); 
      }
    };
    fetchTime();
    return () => { isMounted = false; };
  }, []);

  return { offset, isSynced };
}

export const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont', fontUrl: fontClockUrl, options: { display: 'swap' } },
  { fontFamily: 'MarqueeFont', fontUrl: fontMarqueeUrl, options: { display: 'swap' } },
];

export default function NtpClock() {
  const { offset, isSynced } = useNtpOffset();
  useSuspenseFontLoader(fontConfigs);

  const [ntpSeconds, setNtpSeconds] = useState<number>(0);
  const [digitColors, setDigitColors] = useState<{ color: string; shadowColor: string }[]>([]);
  const [marqueePos, setMarqueePos] = useState<number>(0);
  const [displayTime, setDisplayTime] = useState("");
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    setIsPortrait(window.innerHeight > window.innerWidth);
    
    const tick = () => {
      const nowTime = Date.now() + offset;
      const newSeconds = Math.floor(nowTime / MS_PER_SECOND) + NTP_EPOCH_OFFSET;
      const strSec = String(newSeconds);

      setNtpSeconds(newSeconds);
      setDisplayTime(new Date(nowTime).toLocaleString([], { timeZoneName: 'short' }));
      
      // Generate colors only for the length of the current timestamp
      setDigitColors(Array.from({ length: strSec.length }, () => {
        const h = Math.random() * 360;
        return {
          color: `hsl(${h}, 200%, 50%)`,
          shadowColor: `hsl(${(h + 180) % 360}, 200%, 60%)`,
        };
      }));
    };

    tick();
    const interval = setInterval(tick, MS_PER_SECOND);
    return () => clearInterval(interval);
  }, [offset]);

  useEffect(() => {
    let frame = requestAnimationFrame(function step() {
      setMarqueePos(prev => (prev > 200 ? 0 : prev + 0.7)); // Reset loop at 200 units
      frame = requestAnimationFrame(step);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div 
      className={styles.wrapper} 
      style={{ '--bg-img': `url(${backgroundImg})` } as React.CSSProperties}
    >
      <div className={`${styles.clock} ${isPortrait ? styles.portrait : styles.landscape}`}>
        {String(ntpSeconds).split('').map((digit, i) => (
          <span 
            key={i} 
            className={styles.digit}
            style={{
              '--digit-color': digitColors[i]?.color || '#0ff',
              '--digit-shadow': digitColors[i]?.shadowColor || '#0ff',
            } as React.CSSProperties}
          >
            {digit}
          </span>
        ))}
      </div>

      {!isSynced && <div className={styles.syncStatus}>Syncing...</div>}

      <div 
        className={`${styles.marquee} ${isPortrait ? styles.portrait : styles.landscape}`}
        style={{
          '--marquee-pos': `${100 - marqueePos}`
        } as React.CSSProperties}
      >
        {`${displayTime} NTP is a system that keeps computers accurate. `.repeat(5)}
      </div>
    </div>
  );
}