import React, { useState, useEffect, useRef, useMemo } from 'react';
import arrowImg from '../../../../assets/images/2026/26-03/26-03-23/arrow.webp?url';
import fontUrl from '../../../../assets/fonts/2026/26-03-23-arrow.ttf?url';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';

const FONT_FAMILY = 'ClockFont_Arrow';
const LOOP_MS = 10000;                    // full cycle time (intact → shatter → new clock)
const ANIMATION_DURATION_MS = 4200;       // length of the fly-off animation
const BASE_DELAY_S = 2.5;                 // seconds the clock stays fully intact before first shatter
const STAGGER_S = 0.35;                   // seconds between each digit starting its shatter

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

// Updated keyframes – one-shot fly-off (no return to center)
const STYLE_TAG = `
  @font-face {
    font-family: '${FONT_FAMILY}';
    src: url('${fontUrl}') format('truetype');
    font-display: swap;
  }

  @keyframes shatter {
    0%, 5% {
      opacity: 1;
      transform: translate3d(0, 0, 0) rotate(0deg);
      filter: blur(0px);
    }
    30% {
      transform: translate3d(var(--tx, 0), var(--ty, 0), var(--tz, 0))
                rotateX(var(--rx, 0)) rotateY(var(--ry, 0)) rotateZ(var(--rz, 0));
      opacity: 1;
    }
    100% {
      transform: translate3d(calc(var(--tx, 0) * 5), calc(var(--ty, 0) * 5), calc(var(--tz, 0) * 5))
                rotateX(var(--rx, 0)) rotateY(var(--ry, 0)) rotateZ(var(--rz, 0));
      opacity: 0;
      filter: blur(20px);
    }
  }
`;

// Inline style objects (unchanged except where noted)
const containerStyle: React.CSSProperties = {
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${arrowImg})`,
  backgroundPosition: 'center',
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundColor: '#080808',
  transform: 'rotate(180deg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
  perspective: '2000px',
};

const clockStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  fontFamily: `'${FONT_FAMILY}', "Courier New", monospace`,
  fontSize: 'clamp(3rem, 10vw, 8rem)',
  fontWeight: 'bold',
  color: 'white',
  textShadow: '0 0 20px rgba(0, 0, 0, 0.8)',
  transform: 'rotate(180deg)',
};

const digitsStyle: React.CSSProperties = {
  display: 'flex',
  gap: '0.1em',
  fontVariantNumeric: 'tabular-nums',
};

const charBoxStyle: React.CSSProperties = {
  position: 'relative',
  width: '0.7em',
  height: '1.2em',
};

const shardBaseStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backfaceVisibility: 'hidden',
  opacity: 1,                                      // ← was 0, now visible by default
  animationName: 'shatter',
  animationDuration: `${ANIMATION_DURATION_MS}ms`,
  animationTimingFunction: 'ease-in-out',
  animationIterationCount: 1,                      // ← one-shot (was infinite)
  animationFillMode: 'forwards',                   // ← stay at final state (out + invisible)
};

const shardInnerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // ← NO transform here anymore (this was the main reason the clock was invisible!)
};

const topShardClip: React.CSSProperties = {
  clipPath: 'inset(0 0 50% 0)',
};

const bottomShardClip: React.CSSProperties = {
  clipPath: 'inset(50% 0 0 0)',
};

interface ShardProps {
  char: string;
  delay: number;
  top: ReturnType<typeof getFlight>;
  bottom: ReturnType<typeof getFlight>;
}

const CharBox = React.memo(({ char, delay, top, bottom }: ShardProps) => (
  <div style={charBoxStyle}>
    {/* Top half shard */}
    <div
      style={{
        ...shardBaseStyle,
        ...topShardClip,
        animationDelay: `${delay}s`,
        '--tx': top.tx,
        '--ty': top.ty,
        '--tz': top.tz,
        '--rx': top.rx,
        '--ry': top.ry,
        '--rz': top.rz,
      } as React.CSSProperties}
    >
      <div style={shardInnerStyle}>{char}</div>
    </div>

    {/* Bottom half shard */}
    <div
      style={{
        ...shardBaseStyle,
        ...bottomShardClip,
        animationDelay: `${delay}s`,
        '--tx': bottom.tx,
        '--ty': bottom.ty,
        '--tz': bottom.tz,
        '--rx': bottom.rx,
        '--ry': bottom.ry,
        '--rz': bottom.rz,
      } as React.CSSProperties}
    >
      <div style={shardInnerStyle}>{char}</div>
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
    <div style={containerStyle}>
      <style>{STYLE_TAG}</style>
      <div style={clockStyle}>
        <div style={digitsStyle}>
          {chars.map((char, i) => {
            const delay = BASE_DELAY_S + (chars.length - 1 - i) * STAGGER_S;
            return (
              <CharBox
                key={`${i}-${loopKey}`}
                char={char}
                delay={delay}
                top={flights[i].top}
                bottom={flights[i].bottom}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ExplodingClock;