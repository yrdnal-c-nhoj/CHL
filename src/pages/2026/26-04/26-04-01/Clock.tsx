import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import bgImage from '@/assets/images/2026/26-04/26-04-01/rococo.webp?url';
import bgImageBack from '@/assets/images/2026/26-04/26-04-01/Rococo.jpg?url';
import bgImageMiddle from '@/assets/images/2026/26-04/26-04-01/1silk.webp?url';

const Clock: React.FC = () => {
  const time = useClockTime();

  const timeData = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();
    const hourStr = h.toString();
    const minStr = m.toString().padStart(2, '0');

    return {
      hourDigits: hourStr.split(''),
      minDigits: minStr.split('')
    };
  }, [time]);

  const getDigitRotation = (index: number, isHour: boolean, isOnes: boolean = false): string => {
    if (isHour) {
      const baseRotation = -17;
      const offset = index === 0 ? -2 : 2;
      return `rotate(${baseRotation + offset}deg)`;
    }
    if (isOnes) {
      return 'rotate(-29deg)';
    }
    return 'rotate(28deg)';
  };

  const getDigitSize = (isHour: boolean) => {
    const baseSize = '10vh';
    const scale = isHour ? 1.8 : 1;
    return `calc(${baseSize} * ${scale})`;
  };

  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  };

  const clockContainerStyle: React.CSSProperties = {
    position: 'relative',
    fontFamily: 'monospace',
    fontWeight: 300,
    fontSize: 'clamp(4rem, 15vw, 12rem)',
    color: '#fff',
    width: '80vw',
    height: '80vh',
  };

  const hourGroupStyle: React.CSSProperties = {
    position: 'absolute',
    top: '15%',
    left: '15%',
    display: 'flex',
    gap: '0.3em',
    fontSize: 'clamp(4rem, 15vw, 12rem)',
    transform: 'rotate(-12deg)',
  };

  const minuteGroupStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: '15%',
    left: '15%',
    display: 'flex',
    gap: '0.2em',
    fontSize: 'clamp(3rem, 10vw, 8rem)',
    transform: 'rotate(8deg)',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fleur+De+Leah&family=Pinyon+Script&display=swap');

        .digit {
          display: inline-block;
          line-height: 1;
          transition: transform 0.3s ease;
          font-family: 'Fleur De Leah', cursive;
          background: linear-gradient(135deg, #8B6914 0%, #B8860B 15%, #DAA520 30%, #CD853F 45%, #B8860B 60%, #8B7355 75%, #A0522D 90%, #8B6914 100%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: shimmer 6s ease-in-out infinite, pulseGlow 4s ease-in-out infinite;
          text-shadow:
            0 0 8px rgba(139, 105, 20, 0.5),
            0 0 16px rgba(184, 134, 11, 0.3),
            0 0 24px rgba(205, 133, 63, 0.2),
            2px 2px 4px rgba(0,0,0,0.6);
          filter: drop-shadow(0 0 8px rgba(184, 134, 11, 0.4)) brightness(0.95);
          // -webkit-text-stroke: 0.5px rgba(0,0,0,0.7);
          // text-stroke: 0.5px rgba(0,0,0,0.7);
          // paint-order: stroke fill;
          // position: relative;
          will-change: transform, filter, background-position;
          transform: translateZ(0);
          backface-visibility: hidden;
        }
        .digit::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 3px, #FFBB00 4px, #FFB300 6px, transparent 7px, transparent 10px);
          background-size: 20px 40px;
          -webkit-background-clip: text;
          background-clip: text;
          animation: lanternDots 12s linear infinite;
          pointer-events: none;
        }

        .digit::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.8) 50%, transparent 70%);
          background-size: 200% 200%;
          -webkit-background-clip: text;
          background-clip: text;
          animation: diamondShine 8s ease-in-out infinite;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
        .digit-glam-0 { animation-delay: 0s, 0s; }
        .digit-glam-1 { animation-delay: 0s, 0.5s; }
        .digit-glam-2 { animation-delay: 0s, 1s; }
        .digit-glam-3 { animation-delay: 0s, 1.5s; }

        @keyframes diamondShine {
          0%, 100% { background-position: -100% -100%; opacity: 0; }
          50% { background-position: 100% 100%; opacity: 0.6; }
          75% { opacity: 1; }
        }

        @keyframes shimmer {
          0% { background-position: -200% 0%; }
          50% { background-position: 200% 0%; }
          100% { background-position: -200% 0%; }
        }

        @keyframes pulseGlow {
          0%, 100% { filter: drop-shadow(0 0 15px gold) brightness(1.3) drop-shadow(0 0 30px #FFBB00); }
          50% { filter: drop-shadow(0 0 25px #FFD900) brightness(1.6) drop-shadow(0 0 50px #FFF8DC) drop-shadow(0 0 70px #FFB300); }
        }

        .clock-bg-back {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          background-image: url(${bgImageBack});
          background-size: 100% 100%;
          background-repeat: no-repeat;
          background-position: center;
          filter: saturate(1.1) brightness(1.2) hue-rotate(-30deg);
          z-index: -2;
          contain: strict;
          content-visibility: auto;
        }
        .clock-bg-middle {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          background-image: url(${bgImageMiddle});
          background-size: contain;
          background-position: center;
          filter: saturate(0.8) brightness(1.5) hue-rotate(80deg);
          opacity: 0.7;
          z-index: -1;
          contain: strict;
          content-visibility: auto;
        }
        .clock-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100dvh;
          background-image: url(${bgImage});
          background-size: 175%;
          background-position: center;
          z-index: 0;
          opacity: 0.6;
          filter: hue-rotate(-20deg) contrast(150%) saturate(80%);
          contain: strict;  
           transform: rotate(180deg);
          content-visibility: auto;
        }
        @media (orientation: landscape) and (min-width: 600px) {
          .clock-bg {
            transform: rotate(-90deg);
            background-size: 175%;
            width: 100dvh;
            height: 100vw;
            top: 50%;
            left: 50%;
            transform-origin: center;
            margin-top: -50vw;
            margin-left: -50dvh;
          }
        }
        @media (min-width: 700px) {
          .clock-wrapper {
            contain: layout style;
            transform: scale(0.6) translate(-80px, -70px) translateZ(0);
          }
        }
        @media (max-width: 600px) {
          .hour-group {
            top: 30% !important;
            left: 15% !important;
          }
          .minute-group {
            top: 55% !important;
            bottom: auto !important;
            left: 15% !important;
          }
        }
      `}</style>
      <div className="clock-bg-back"></div>
      <div className="clock-bg-middle"></div>
      <div className="clock-bg"></div>
      <div style={containerStyle}>
        <div className="clock-wrapper" style={clockContainerStyle}>
          <div className="hour-group" style={hourGroupStyle}>
            {timeData.hourDigits.map((digit, i) => (
              <span
                key={`h-${i}`}
                className={`digit digit-glam-${i}`}
                style={{ display: 'inline-block' }}
              >
                {digit}
              </span>
            ))}
          </div>
          <div className="minute-group" style={minuteGroupStyle}>
            {timeData.minDigits.map((digit, i) => (
              <span
                key={`m-${i}`}
                className={`digit digit-glam-${i + 2}`}
                style={{ display: 'inline-block' }}
              >
                {digit}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;
