import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import arrowImg from '../../../assets/images/26-03/26-03-23/arrow.webp';
import fontUrl from '../../../assets/fonts/26-03-23-arrow.ttf?url';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

const FONT_FAMILY = 'ClockFont_Arrow';
const LOOP_MS = 8000;

const getFlight = () => ({
  tx: `${(Math.random() - 0.5) * 600}vw`,
  ty: `${(Math.random() - 0.5) * 600}vh`,
  tz: `${(Math.random() - 0.5) * 4000}px`,
  rx: `${(Math.random() - 0.5) * 1440}deg`,
  ry: `${(Math.random() - 0.5) * 1440}deg`,
  rz: `${(Math.random() - 0.5) * 1440}deg`,
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

// Static style — defined once outside the component, never regenerated
const STATIC_STYLE = `
  @font-face { font-family: '${FONT_FAMILY}'; src: url('${fontUrl}'); }

  .scene {
    width: 100vw; height: 100dvh;
    background: url('${arrowImg}') center/cover no-repeat;
    background-color: #080808;
    transform: rotate(180deg);
    display: flex; align-items: center; justify-content: center;
    overflow: hidden;
    perspective: 2000px;
  }
  .clock-wrapper { display: flex; gap: 0.1em; transform: rotate(180deg); }
  .char-box {
    position: relative; width: 0.7em; height: 1.2em;
    font-family: '${FONT_FAMILY}', 'Courier New', monospace;
    font-size: clamp(3rem, 15vw, 10rem);
    font-weight: 900; color: white;
    text-shadow: 0 0 25px rgba(0,0,0,0.6);
  }
  .shard {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    backface-visibility: hidden;
    opacity: 0;
    animation: shatter ${LOOP_MS}ms ease-in-out infinite;
  }
  .top-shard { clip-path: inset(0 0 50% 0); }
  .bottom-shard { clip-path: inset(50% 0 0 0); }

  @keyframes shatter {
    0%, 5%   { opacity: 0; transform: translate3d(0,0,0) rotate(0); filter: blur(10px); }
    15%      { opacity: 1; transform: translate3d(0,0,0) rotate(0); filter: blur(0); }
    50%      { transform: translate3d(0,0,0); }
    52%      { transform: translate3d(-2px, 2px, 0); }
    54%      { transform: translate3d(2px, -2px, 0); }
    55%      { opacity: 1; }
    95%, 100% {
      opacity: 1;
      transform:
        translate3d(var(--tx), var(--ty), var(--tz))
        rotateX(var(--rx)) rotateY(var(--ry)) rotateZ(var(--rz));
    }
  }
`;

interface ShardProps {
  char: string;
  delay: number;
  top: ReturnType<typeof getFlight>;
  bottom: ReturnType<typeof getFlight>;
}

// Memoized so a char-box only re-renders when its char or delay changes
const CharBox = React.memo(({ char, delay, top, bottom }: ShardProps) => (
  <div className="char-box">
    <div
      className="top-shard shard"
      style={{
        animationDelay: `${delay}s`,
        '--tx': top.tx, '--ty': top.ty, '--tz': top.tz,
        '--rx': top.rx, '--ry': top.ry, '--rz': top.rz,
      } as React.CSSProperties}
    >
      {char}
    </div>
    <div
      className="bottom-shard shard"
      style={{
        animationDelay: `${delay}s`,
        '--tx': bottom.tx, '--ty': bottom.ty, '--tz': bottom.tz,
        '--rx': bottom.rx, '--ry': bottom.ry, '--rz': bottom.rz,
      } as React.CSSProperties}
    >
      {char}
    </div>
  </div>
));
CharBox.displayName = 'CharBox';

const ExplodingClock: React.FC = () => {
  const fontConfigs = useMemo(() => [{ fontFamily: FONT_FAMILY, fontUrl }], []);
  useSuspenseFontLoader(fontConfigs);

  // Single state object — one setState, one re-render per tick
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
        // Only regenerate flights on loop reset
        const flights = newLoop
          ? cs.map(() => ({ top: getFlight(), bottom: getFlight() }))
          : prev.flights;

        return {
          chars: cs,
          flights,
          loopKey: newLoop ? prev.loopKey + 1 : prev.loopKey,
        };
      });
    };

    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="scene">
      <style>{STATIC_STYLE}</style>
      <div className="clock-wrapper">
        {chars.map((char, i) => (
          <CharBox
            key={`${i}-${loopKey}`}
            char={char}
            delay={(chars.length - 1 - i) * 0.4}
            top={flights[i].top}
            bottom={flights[i].bottom}
          />
        ))}
      </div>
    </div>
  );
};

export default ExplodingClock;