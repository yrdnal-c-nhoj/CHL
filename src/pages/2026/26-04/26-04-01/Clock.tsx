import React, { useMemo } from 'react';
import { useClockTime } from '@/utils/hooks';
import bgImage from '@/assets/images/2026/26-04/26-04-01/rococo.webp?url';
import bgImageBack from '@/assets/images/2026/26-04/26-04-01/Rococo.jpg?url';

const Clock: React.FC = () => {
  const time = useClockTime();

  const timeData = useMemo(() => {
    const h = time.getHours(); // 24-hour format, no leading zeros
    const m = time.getMinutes();
    
    const hourStr = h.toString();
    const minStr = m.toString().padStart(2, '0');
    
    return { 
      hours: hourStr,
      minutes: minStr,
      hourDigits: hourStr.split(''),
      minDigits: minStr.split('')
    };
  }, [time]);

  const getDigitRotation = (index: number, isHour: boolean, isOnes: boolean = false): string => {
    if (isHour) {
      // Hours: counterclockwise by 7°, each digit slightly different
      const baseRotation = -7;
      const offset = index === 0 ? -2 : 2; // First digit tilts more left, second more right
      return `rotate(${baseRotation + offset}deg)`;
    }
    // Minutes: tens and ones have different angles
    if (isOnes) {
      return 'rotate(12deg)'; // Ones: clockwise by 12°
    }
    return 'rotate(8deg)'; // Tens: clockwise by 8°
  };

  const getDigitSize = (digit: string, isHour: boolean) => {
    // '1' is slightly smaller
    const baseSize = digit === '1' ? '0.85em' : '1em';
    // Hours are bigger than minutes
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
    transform: 'translate(-3vw, -5vh)',
  };

  const hourContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.2em',
    // Individual digit rotations applied per digit
  };

  const minutesContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.15em',
    position: 'absolute',
    right: '-0.3em',
    bottom: '-1.1em',
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
          background: linear-gradient(135deg, #FFD414 0%, #EEF49C 12%, #FFFF00 24%, #FFFFFF 30%, #FFF8DC 36%, #C0C0C0 44%, #87CEEB 56%, #B0E0E6 68%, #FFFFFF 76%, #B0C4DE 84%, #FFD700 90%, #FFD414 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: bioShift 20s ease-in-out infinite, flash 8s ease-in-out infinite alternate, shimmer 6s ease-in-out infinite, pulseGlow 4s ease-in-out infinite;
          text-shadow: 
            0 0 10px rgba(255, 215, 0, 0.8),
            0 0 20px rgba(242, 242, 16, 0.6),
            0 0 30px rgba(192, 192, 192, 0.8),
            0 0 40px rgba(135, 206, 235, 0.4),
            2px 2px 4px rgba(0,0,0,0.5);
          filter: drop-shadow(0 0 15px gold) brightness(1.3);
          -webkit-text-stroke: 0.5px rgba(0,0,0,0.7);
          text-stroke: 0.5px rgba(0,0,0,0.7);
          paint-order: stroke fill;
          position: relative;
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
          background: repeating-radial-gradient(circle at 50% 50%, transparent 0px, transparent 3px, #FFD700 4px, #FFD700 6px, transparent 7px, transparent 10px);
          background-size: 20px 40px;
          -webkit-background-clip: text;
          background-clip: text;
          animation: lanternDots 12s linear infinite;
          pointer-events: none;
        }
   
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
          0%, 100% { filter: drop-shadow(0 0 15px gold) brightness(1.3) drop-shadow(0 0 30px #FFD700); }
          50% { filter: drop-shadow(0 0 25px #FFFF00) brightness(1.6) drop-shadow(0 0 50px #FFF8DC) drop-shadow(0 0 70px #FFD700); }
        }
        @keyframes sparkleSweep {
          0% { transform: translateX(-100%) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateX(100vw) rotate(360deg); opacity: 0; }
        }
        .digit-glam-0 { animation-delay: 0s, 0s, 0s, 0s; }
        .digit-glam-1 { animation-delay: 0s, 0.5s, 0.3s, 0.2s; }
        .digit-glam-2 { animation-delay: 0s, 1s, 0.6s, 0.4s; }
        .digit-glam-3 { animation-delay: 0s, 1.5s, 0.9s, 0.6s; }
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
        @keyframes diamondShine {
          0%, 100% { background-position: -100% -100%; opacity: 0; }
          50% { background-position: 100% 100%; opacity: 0.6; }
          75% { opacity: 1; }
        }
    
        .digit-one {
          /* transform handled inline */
        }
        .minute-tens {
          /* transform handled inline */
        }
        .minute-ones {
          /* transform handled inline */
        }
        @keyframes blink {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
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
          z-index: -2;
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
          background-size: 200%;
          background-position: center;
          z-index: -1;
          contain: strict;
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
            transform: scale(0.6) rotate(-3deg) translate(-80px, -70px) translateZ(0);
            filter: drop-shadow(0 0 30px gold) drop-shadow(0 0 60px #FFF8DC);
          }
        }
        .sparkle {
          position: absolute;
          width: 4px;
          height: 4px;
          background: white;
          border-radius: 50%;
          box-shadow: 0 0 10px 2px gold, 0 0 20px 4px #FFF8DC;
          animation: sparkle 1.5s ease-in-out infinite;
        }
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
      `}</style>
      <div className="clock-bg-back"></div>
      <div className="clock-bg"></div>
      <div style={containerStyle}>
        <div className="clock-wrapper" style={clockContainerStyle}>
          {/* Hours - tilted 10° counterclockwise, bigger */}
          <div style={hourContainerStyle}>
            {timeData.hourDigits.map((digit, i) => (
              <span 
                key={`h-${i}`} 
                className={`digit digit-glam-${i} ${digit === '1' ? 'digit-one' : ''}`}
                style={{ 
                  fontSize: getDigitSize(digit, true),
                  transform: `${getDigitRotation(i, true)} scale(${digit === '1' ? 0.92 : 1})`,
                }}
              >
                {digit}
              </span>
            ))}
          </div>
          
          {/* Minutes - diagonally below, different tilts */}
          <div style={minutesContainerStyle}>
            <span 
              className="digit digit-glam-2"
              style={{ 
                fontSize: getDigitSize(timeData.minDigits[0]!, false),
                transform: `${getDigitRotation(0, false, false)} scale(0.9)`,
              }}
            >
              {timeData.minDigits[0]}
            </span>
            <span 
              className="digit digit-glam-3"
              style={{ 
                fontSize: getDigitSize(timeData.minDigits[1]!, false),
                transform: `${getDigitRotation(0, false, true)} scale(0.75)`,
              }}
            >
              {timeData.minDigits[1]}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Clock;
