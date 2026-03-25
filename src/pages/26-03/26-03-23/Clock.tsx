import React, { useState, useEffect, useMemo } from 'react';
import arrowImg from '../../../assets/images/26-03/26-03-23/arrow.webp';
import fontUrl from '../../../assets/fonts/26-03-23-arrow.ttf?url';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

const FONT_FAMILY = 'ClockFont_Arrow';

const ExplodingClock: React.FC = () => {
  const fontConfigs = useMemo(() => [{ fontFamily: FONT_FAMILY, fontUrl }], []);
  useSuspenseFontLoader(fontConfigs);
  const [time, setTime] = useState({ hh: '00', mm: '00', period: 'AM' });
  const [sessionKey, setSessionKey] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const period = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      setTime({
        hh: String(hours).padStart(2, '0'),
        mm: String(now.getMinutes()).padStart(2, '0'),
        period
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    // 8-second loop
    const loop = setInterval(() => setSessionKey(k => k + 1), 8000);
    
    return () => {
      clearInterval(timer);
      clearInterval(loop);
    };
  }, []);

  const chars = useMemo(() => 
    [...time.hh, ...time.mm, ...time.period], 
    [time, sessionKey]
  );

  return (
    <div className="scene">
      <style>{`
        .scene {
          width: 100vw; height: 100dvh;
          background: url('${arrowImg}') center/cover no-repeat;
          background-color: #080808;
          transform: rotate(180deg);
          display: flex; align-items: center; justify-content: center;
          overflow: hidden;
          perspective: 2000px;
        }

        .clock-wrapper {
          display: flex;
          gap: 0.1em;
          transform: rotate(180deg);
        }

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
        }

        .top-shard { clip-path: inset(0 0 50% 0); }
        .bottom-shard { clip-path: inset(50% 0 0 0); }

        @keyframes rightToLeftSolidShatter {
          /* 0-10%: Appear and stay solid */
          0%, 5% { opacity: 0; transform: translate3d(0,0,0) rotate(0); filter: blur(10px); }
          15% { opacity: 1; transform: translate3d(0,0,0) rotate(0); filter: blur(0); }
          
          /* 50-55%: Violent jitter right before the break */
          50% { transform: translate3d(0,0,0); }
          52% { transform: translate3d(-2px, 2px, 0); }
          54% { transform: translate3d(2px, -2px, 0); }

          /* 55-100%: The Flight - Opacity stays 1 so they don't fade out */
          55% { opacity: 1; }
          95%, 100% { 
            opacity: 1; 
            transform: 
              translate3d(var(--tx), var(--ty), var(--tz)) 
              rotateX(var(--rx)) 
              rotateY(var(--ry)) 
              rotateZ(var(--rz)) 
              scale(1); /* Removed scale(0) to keep pieces large as they exit */
          }
        }
      `}</style>

      <div className="clock-wrapper">
        {chars.map((char, cIdx) => {
          const reverseDelay = (chars.length - 1 - cIdx) * 0.4;

          const getFlight = () => ({
            // Increased power (600vw) to ensure they clear the screen before the loop resets
            tx: `${(Math.random() - 0.5) * 600}vw`,
            ty: `${(Math.random() - 0.5) * 600}vh`,
            tz: `${(Math.random() - 0.5) * 4000}px`,
            rx: `${(Math.random() - 0.5) * 1440}deg`,
            ry: `${(Math.random() - 0.5) * 1440}deg`,
            rz: `${(Math.random() - 0.5) * 1440}deg`,
          });

          const top = getFlight();
          const bottom = getFlight();

          return (
            <div key={`char-${cIdx}-${sessionKey}`} className="char-box">
              <div
                className="top-shard shard"
                style={{
                  animationDelay: `${reverseDelay}s`,
                  ['--tx' as any]: top.tx,
                  ['--ty' as any]: top.ty,
                  ['--tz' as any]: top.tz,
                  ['--rx' as any]: top.rx,
                  ['--ry' as any]: top.ry,
                  ['--rz' as any]: top.rz,
                }}
              >
                {char}
              </div>

              <div
                className="bottom-shard shard"
                style={{
                  animationDelay: `${reverseDelay}s`,
                  ['--tx' as any]: bottom.tx,
                  ['--ty' as any]: bottom.ty,
                  ['--tz' as any]: bottom.tz,
                  ['--rx' as any]: bottom.rx,
                  ['--ry' as any]: bottom.ry,
                  ['--rz' as any]: bottom.rz,
                }}
              >
                {char}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExplodingClock;