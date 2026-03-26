import React, { useState, useEffect, useMemo } from 'react';
import arrowImg from '../../../assets/images/26-03/26-03-23/arrow.webp';
import fontUrl from '../../../assets/fonts/26-03-23-arrow.ttf?url';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

const FONT_FAMILY = 'ClockFont_Arrow';

// 1. Move static styles outside the component to prevent re-injection
const styles = `
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
    position: relative;
    width: 0.7em; height: 1.2em;
    font-family: '${FONT_FAMILY}', 'Courier New', monospace;
    font-size: clamp(3rem, 15vw, 10rem);
    font-weight: 900;
    color: white;
    text-shadow: 0 0 25px rgba(0,0,0,0.6);
  }
  .shard {
    position: absolute;
    inset: 0;
    display: flex; align-items: center; justify-content: center;
    backface-visibility: hidden;
    opacity: 0;
    animation: rightToLeftSolidShatter 8s ease-in-out infinite;
    animation-delay: var(--delay);
  }
  .top-shard { clip-path: inset(0 0 50% 0); }
  .bottom-shard { clip-path: inset(50% 0 0 0); }

  @keyframes rightToLeftSolidShatter {
    0%, 5% { opacity: 0; transform: translate3d(0,0,0) rotate(0); filter: blur(10px); }
    15% { opacity: 1; transform: translate3d(0,0,0) rotate(0); filter: blur(0); }
    50% { transform: translate3d(0,0,0); }
    52% { transform: translate3d(-2px, 2px, 0); }
    54% { transform: translate3d(2px, -2px, 0); }
    55% { opacity: 1; }
    95%, 100% { 
      opacity: 1; 
      transform: translate3d(var(--tx), var(--ty), var(--tz)) rotateX(var(--rx)) rotateY(var(--ry)) rotateZ(var(--rz));
    }
  }
`;

// 2. Sub-component to isolate random math and prevent parent re-renders from cycling values
const AnimatedChar = React.memo(({ char, delay }: { char: string, delay: number }) => {
  const flightCoords = useMemo(() => {
    const getCoords = () => ({
      tx: `${(Math.random() - 0.5) * 600}vw`,
      ty: `${(Math.random() - 0.5) * 600}vh`,
      tz: `${(Math.random() - 0.5) * 4000}px`,
      rx: `${(Math.random() - 0.5) * 1440}deg`,
      ry: `${(Math.random() - 0.5) * 1440}deg`,
      rz: `${(Math.random() - 0.5) * 1440}deg`,
    });
    return { top: getCoords(), bottom: getCoords() };
  }, []); // Only calculated once per mount

  const cssVars = (side: 'top' | 'bottom') => ({
    '--delay': `${delay}s`,
    '--tx': flightCoords[side].tx,
    '--ty': flightCoords[side].ty,
    '--tz': flightCoords[side].tz,
    '--rx': flightCoords[side].rx,
    '--ry': flightCoords[side].ry,
    '--rz': flightCoords[side].rz,
  } as React.CSSProperties);

  return (
    <div className="char-box">
      <div className="top-shard shard" style={cssVars('top')}>{char}</div>
      <div className="bottom-shard shard" style={cssVars('bottom')}>{char}</div>
    </div>
  );
});

const ExplodingClock: React.FC = () => {
  const fontConfigs = useMemo(() => [{ fontFamily: FONT_FAMILY, fontUrl }], []);
  useSuspenseFontLoader(fontConfigs);

  const [timeStr, setTimeStr] = useState('');
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let h = now.getHours();
      const p = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      setTimeStr(`${String(h).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${p}`);
    };

    update();
    const t = setInterval(update, 1000);
    const l = setInterval(() => setSessionKey(k => k + 1), 8000);
    return () => { clearInterval(t); clearInterval(l); };
  }, []);

  // Split string into array for mapping
  const charArray = useMemo(() => timeStr.split(''), [timeStr]);

  return (
    <div className="scene">
      <style>{styles}</style>
      <div className="clock-wrapper">
        {charArray.map((char, i) => (
          <AnimatedChar 
            key={`${i}-${sessionKey}`} // Key change resets the animation & randomness every 8s
            char={char} 
            delay={(charArray.length - 1 - i) * 0.4} 
          />
        ))}
      </div>
    </div>
  );
};

export default ExplodingClock;