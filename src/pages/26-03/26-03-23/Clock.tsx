import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import arrowImg from '../../../assets/images/26-03/26-03-23/arrow.webp';
import fontUrl from '../../../assets/fonts/26-03-23-arrow.ttf?url';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

const FONT_FAMILY = 'ClockFont_Arrow';

interface FlightParams {
  tx: string;
  ty: string;
  tz: string;
  rx: string;
  ry: string;
  rz: string;
}

const ExplodingClock: React.FC = () => {
  const fontConfigs = useMemo(() => [{ fontFamily: FONT_FAMILY, fontUrl }], []);
  useSuspenseFontLoader(fontConfigs);

  const [time, setTime] = useState({ hh: '00', mm: '00', period: 'AM' });
  const [sessionKey, setSessionKey] = useState(0);

  // Pre-generate flight paths once per session (much better than per render)
  const flightCacheRef = useRef<Map<string, { top: FlightParams; bottom: FlightParams }>>(new Map());

  const updateTime = useCallback(() => {
    const now = new Date();
    let hours = now.getHours();
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;

    setTime({
      hh: String(hours).padStart(2, '0'),
      mm: String(now.getMinutes()).padStart(2, '0'),
      period,
    });
  }, []);

  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);

    // 8-second explosion cycle
    const loop = setInterval(() => {
      setSessionKey((k) => k + 1);
    }, 8000);

    return () => {
      clearInterval(timer);
      clearInterval(loop);
    };
  }, [updateTime]);

  // Memoize characters + regenerate flight paths only when session changes
  const { chars, flightData } = useMemo(() => {
    const currentChars = [...time.hh, ...time.mm, ...time.period];

    // Clear old cache when session changes
    if (flightCacheRef.current.size > 0) {
      flightCacheRef.current.clear();
    }

    const newFlightData = currentChars.map((_, cIdx) => {
      const key = `char-${cIdx}-${sessionKey}`;

      if (!flightCacheRef.current.has(key)) {
        const getFlight = (): FlightParams => ({
          tx: `${(Math.random() - 0.5) * 600}vw`,
          ty: `${(Math.random() - 0.5) * 600}vh`,
          tz: `${(Math.random() - 0.5) * 4000}px`,
          rx: `${(Math.random() - 0.5) * 1440}deg`,
          ry: `${(Math.random() - 0.5) * 1440}deg`,
          rz: `${(Math.random() - 0.5) * 1440}deg`,
        });

        flightCacheRef.current.set(key, {
          top: getFlight(),
          bottom: getFlight(),
        });
      }

      return flightCacheRef.current.get(key)!;
    });

    return {
      chars: currentChars,
      flightData: newFlightData,
    };
  }, [time, sessionKey]);

  const reverseDelay = useCallback((index: number) => {
    return (chars.length - 1 - index) * 0.4;
  }, [chars.length]);

  return (
    <div className="scene">
      <style>{`
        .scene {
          width: 100vw;
          height: 100dvh;
          background: url('${arrowImg}') center/cover no-repeat;
          background-color: #080808;
          transform: rotate(180deg);
          display: flex;
          align-items: center;
          justify-content: center;
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
          width: 0.7em;
          height: 1.2em;
          font-family: '${FONT_FAMILY}', 'Courier New', monospace;
          font-size: clamp(3rem, 15vw, 10rem);
          font-weight: 900;
          color: white;
          text-shadow: 0 0 25px rgba(0,0,0,0.6);
        }

        .shard {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          backface-visibility: hidden;
          opacity: 0;
          animation: rightToLeftSolidShatter 8s ease-in-out infinite;
          will-change: transform, opacity, filter;
        }

        .top-shard { clip-path: inset(0 0 50% 0); }
        .bottom-shard { clip-path: inset(50% 0 0 0); }

        @keyframes rightToLeftSolidShatter {
          0%, 5% {
            opacity: 0;
            transform: translate3d(0,0,0) rotate(0);
            filter: blur(10px);
          }
          15% {
            opacity: 1;
            transform: translate3d(0,0,0) rotate(0);
            filter: blur(0);
          }
          50% { transform: translate3d(0,0,0); }
          52% { transform: translate3d(-2px, 2px, 0); }
          54% { transform: translate3d(2px, -2px, 0); }
          55% { opacity: 1; }
          95%, 100% {
            opacity: 1;
            transform:
              translate3d(var(--tx), var(--ty), var(--tz))
              rotateX(var(--rx))
              rotateY(var(--ry))
              rotateZ(var(--rz))
              scale(1);
          }
        }
      `}</style>

      <div className="clock-wrapper">
        {chars.map((char, cIdx) => {
          const delay = reverseDelay(cIdx);
          const flight = flightData[cIdx];

          return (
            <div key={`char-${cIdx}-${sessionKey}`} className="char-box">
              {/* Top Shard */}
              <div
                className="top-shard shard"
                style={{
                  animationDelay: `${delay}s`,
                  '--tx': flight.top.tx,
                  '--ty': flight.top.ty,
                  '--tz': flight.top.tz,
                  '--rx': flight.top.rx,
                  '--ry': flight.top.ry,
                  '--rz': flight.top.rz,
                } as React.CSSProperties}
              >
                {char}
              </div>

              {/* Bottom Shard */}
              <div
                className="bottom-shard shard"
                style={{
                  animationDelay: `${delay}s`,
                  '--tx': flight.bottom.tx,
                  '--ty': flight.bottom.ty,
                  '--tz': flight.bottom.tz,
                  '--rx': flight.bottom.rx,
                  '--ry': flight.bottom.ry,
                  '--rz': flight.bottom.rz,
                } as React.CSSProperties}
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