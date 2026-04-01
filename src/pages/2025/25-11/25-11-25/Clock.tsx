import React, { useEffect, useState, useMemo } from 'react';

import backgroundImg from '@/assets/images/2025/25-11/25-11-25/npt.webp';
import fontClockUrl from '@/assets/fonts/2025/25-11-25-ntp.ttf?url';
import fontMarqueeUrl from '@/assets/fonts/2025/25-11-25-n2.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

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

  const wrapperStyle = useMemo(() => ({
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111',
    backgroundImage: `url(${backgroundImg}),
      linear-gradient(to right, rgba(200,200,200,0.05) 0.1vh, transparent 0.1vh),
      linear-gradient(to bottom, rgba(200,200,200,0.05) 0.1vh, transparent 0.1vh)`,
    backgroundSize: '25vh 15vh',
    backgroundPosition: 'center',
    filter: 'invert(1) saturate(7)',
    overflow: 'hidden',
    position: 'relative' as const,
  }), []);

  const clockStyle = {
    fontFamily: 'ClockFont, monospace',
    fontSize: isPortrait ? '13vh' : '15vh',
    lineHeight: '0.75',
    display: 'flex',
    flexDirection: (isPortrait ? 'column' : 'row') as any,
    zIndex: 2,
  };

  const marqueeStyle = {
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    fontSize: '49vh',
    fontFamily: 'MarqueeFont, serif',
    color: '#110101FF',
    textShadow: '#6EE612FF 1px 0',
    zIndex: 1,
    pointerEvents: 'none' as const,
    left: '50%',
    top: '50%',
    transform: isPortrait 
      ? `translate(-50%, -50%) translateX(${100 - marqueePos}vw)` 
      : `translate(-50%, -50%) translateY(${100 - marqueePos}vh) rotate(90deg)`,
  };

  return (
    <div style={wrapperStyle}>
      <div style={clockStyle}>
        {String(ntpSeconds).split('').map((digit, i) => (
          <span key={i} style={{
            color: digitColors[i]?.color || '#0ff',
            textShadow: `1.0vh 0 0 ${digitColors[i]?.shadowColor || '#0ff'}, 1px 0 black, 0 -1px 0 black`,
          }}>
            {digit}
          </span>
        ))}
      </div>

      {!isSynced && <div style={{ position: 'absolute', top: '2vh', right: '2vh', color: '#c8ff00' }}>Syncing...</div>}

      <div style={marqueeStyle}>
        {`${displayTime} NTP is a system that keeps computers accurate. `.repeat(5)}
      </div>
    </div>
  );
}