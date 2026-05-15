import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import cinzel20251010 from '@/assets/fonts/2025/25-10-09-d1.ttf';
import roboto20251010 from '@/assets/fonts/2025/25-10-09-d2.ttf';
import orbitron20251010 from '@/assets/fonts/2025/25-10-09-d3.otf';

interface TimeState {
  h: number;
  m: number;
  s: number;
}

export default function ConcentricClock() {
  const time = useClockTime();
  const [gateReady, setGateReady] = useState(false);

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`,
      );
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const fontConfigs = useMemo(() => [
    { fontFamily: 'HoursFont', fontUrl: cinzel20251010 },
    { fontFamily: 'MinutesFont', fontUrl: roboto20251010 },
    { fontFamily: 'SecondsFont', fontUrl: orbitron20251010 }
  ], []);

  // Use the standardized suspense loader
  useSuspenseFontLoader(fontConfigs);

  const currentTime = useMemo<TimeState>(() => ({
    h: time.getHours() % 12 || 12,
    m: time.getMinutes(),
    s: time.getSeconds(),
  }), [time]);

  useEffect(() => {
    const t = setTimeout(() => setGateReady(true), 100);
    return () => {
      clearTimeout(t);
    };
  }, []);

  const renderRing = (
    count: number,
    radiusVh: number,
    type: keyof TimeState,
    offset = { x: 0, y: 0 }
  ) => {
    const items = [];
    const current = currentTime[type];
    const fontFamily: string =
      type === 'h' ? 'HoursFont' : type === 'm' ? 'MinutesFont' : 'SecondsFont';
    const currentOffset = (360 / count) * current;

    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i - currentOffset;
      const rad = (angle * Math.PI) / 180;
      const x = radiusVh * Math.cos(rad) + offset.x;
      const y = radiusVh * Math.sin(rad) + offset.y;

      let value;
      if (type === 'h') value = i === 0 ? 12 : i;
      else value = i.toString().padStart(2, '0');

      const isCurrent =
        (type === 'h' &&
          value === (currentTime.h === 0 ? 12 : currentTime.h)) ||
        (type === 'm' && i === currentTime.m) ||
        (type === 's' && i === currentTime.s);

      items.push(
        <div
          key={`${type}-${i}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${x}vh, ${y}vh)`,
            fontFamily,
            fontSize: type === 'h' ? '20vh' : type === 'm' ? '17vh' : '8vh',
            fontWeight: isCurrent ? 700 : 300,
            color: isCurrent ? '#F4800BFF' : 'rgba(255, 150, 200)',
            textShadow: isCurrent
              ? `
    -1px -1px 0 #FFFFFF,
    1px -1px 0 #FFFFFF,
    -1px 1px 0 #FFFFFF,
    1px 1px 0 #FFFFFF,
    0 0 0.5vh #FFFFFF,
    0 0 2vh #00FF73FF,
    0 0 4vh #00FFE5FF,
    0 0 6vh #84FF00FF
  `
              : '0 0 0.8vh rgba(25, 10, 80)',

            opacity: isCurrent ? 1 : 0.4,
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',

            // 🆕 Add this line:
            zIndex: isCurrent ? 10 : 1,
          }}
        >
          {value}
        </div>,
      );
    }
    return items;
  };

  return (
    <div
      style={{
        opacity: gateReady ? 1 : 0,
        transition: 'opacity 0.5s ease-in-out',
        backgroundColor: '#530B7CFF'
      }}
    >
      <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: 'calc(var(--vh, 1vh) * 100)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background:
          'radial-gradient(circle at center, #530B7CFF 30%, #6B11BAFF 100%)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100vh',
          height: '100vh',
        }}
      >
        {renderRing(12, 62, 'h', { x: -79, y: -42 })}
        {renderRing(60, 139, 'm', { x: -149, y: -14 })}
        {renderRing(60, 72, 's', { x: -75, y: 11 })}
      </div>
      </div>
    </div>
  );
}
