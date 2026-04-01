import React, { useState, useEffect, useRef, useMemo } from 'react';
import arrowImg from '@/assets/images/2026/26-03/26-03-23/arrow.webp?url';
import fontUrl from '@/assets/fonts/2026/26-03-23-arrow.ttf?url';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

const FONT_FAMILY = 'ClockFont_Arrow';
const LOOP_MS = 10000;
const ANIMATION_DURATION_MS = 4200;
const BASE_DELAY_S = 2.5;
const STAGGER_S = 0.35;

const getFlight = () => ({
  tx: `${(Math.random() - 0.5) * 220}vw`,
  ty: `${(Math.random() - 0.5) * 220}vh`,
  tz: `${(Math.random() - 0.5) * 2200}px`,
  rx: `${(Math.random() - 0.5) * 720}deg`,
  ry: `${(Math.random() - 0.5) * 720}deg`,
  rz: `${(Math.random() - 0.5) * 720}deg`,
});

const getTime = () => {
  const now = new Date();
  let hours = now.getHours();
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return {
    hh: String(hours).padStart(2, '0'),
    mm: String(now.getMinutes()).padStart(2, '0'),
    period,
  };
};

// Font face definition only - keyframes moved to CSS Module
const STYLE_TAG = `
  @font-face {
    font-family: '${FONT_FAMILY}';
    src: url('${fontUrl}') format('truetype');
    font-display: swap;
  }
`;

interface ShardProps {
  char: string;
  delay: number;
  top: ReturnType<typeof getFlight>;
  bottom: ReturnType<typeof getFlight>;
}

const CharBox = React.memo(({ char, delay, top, bottom }: ShardProps) => (
  <div className={styles.charBox}>
    {/* Top half shard */}
    <div
      className={`${styles.shard} ${styles.topShard}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${ANIMATION_DURATION_MS}ms`,
        '--tx': top.tx,
        '--ty': top.ty,
        '--tz': top.tz,
        '--rx': top.rx,
        '--ry': top.ry,
        '--rz': top.rz,
      } as React.CSSProperties}
    >
      <div className={styles.shardInner}>{char}</div>
    </div>

    {/* Bottom half shard */}
    <div
      className={`${styles.shard} ${styles.bottomShard}`}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${ANIMATION_DURATION_MS}ms`,
        '--tx': bottom.tx,
        '--ty': bottom.ty,
        '--tz': bottom.tz,
        '--rx': bottom.rx,
        '--ry': bottom.ry,
        '--rz': bottom.rz,
      } as React.CSSProperties}
    >
      <div className={styles.shardInner}>{char}</div>
    </div>
  </div>
));
CharBox.displayName = 'CharBox';

const ExplodingClock: React.FC = () => {
  const fontConfigs = useMemo(
    () => [{ fontFamily: FONT_FAMILY, fontUrl }],
    []
  );
  useSuspenseFontLoader(fontConfigs);

  const [{ chars, flights, loopKey }, setState] = useState(() => {
    const t = getTime();
    const cs = [...t.hh, ...t.mm, ...t.period];
    return {
      chars: cs,
      flights: cs.map(() => ({ top: getFlight(), bottom: getFlight() })),
      loopKey: 0,
    };
  });

  const loopKeyRef = useRef(loopKey);
  loopKeyRef.current = loopKey;

  useEffect(() => {
    let nextLoop = Date.now() + LOOP_MS;

    const tick = () => {
      const now = Date.now();
      const t = getTime();
      const cs = [...t.hh, ...t.mm, ...t.period];
      const newLoop = now >= nextLoop;

      if (newLoop) nextLoop += LOOP_MS;

      setState(prev => {
        const newFlights = newLoop
          ? cs.map(() => ({ top: getFlight(), bottom: getFlight() }))
          : prev.flights;

        return {
          chars: cs,
          flights: newFlights,
          loopKey: newLoop ? prev.loopKey + 1 : prev.loopKey,
        };
      });
    };

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${arrowImg})` }}>
      <style>{STYLE_TAG}</style>
      <div className={styles.clock}>
        <div className={styles.digits}>
          {chars.map((char, i) => {
            const delay = BASE_DELAY_S + (chars.length - 1 - i) * STAGGER_S;
            return (
              <CharBox
                key={`${i}-${loopKey}`}
                char={char}
                delay={delay}
                top={flights[i]!.top}
                bottom={flights[i]!.bottom}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplodingClock;