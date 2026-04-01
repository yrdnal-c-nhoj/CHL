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
  };

  const hourContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '0.2em',
    transform: 'rotate(-10deg)', // Hours tilted 10° counterclockwise
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
          background: linear-gradient(135deg, #00FFCC 0%, #39FF14 15%, #FFFF00 30%, #00FFFF 45%, #BF00FF 55%, #FF00FF 70%, #1B03FF 85%, #39FF14 100%);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          -webkit-text-fill-color: transparent;
          animation: bioShift 10s ease-in-out infinite, flash 4s ease-in-out infinite alternate, pinkFlash 15s ease-in-out infinite;
          text-shadow: 
            0 0 10px rgba(0, 255, 204, 0.8),
            0 0 20px rgba(57, 255, 20, 0.6),
            0 0 30px rgba(0, 255, 255, 0.8),
            0 0 40px rgba(191, 0, 255, 0.4),
            2px 2px 4px rgba(0,0,0,0.5);
          filter: drop-shadow(0 0 15px #00FFCC) brightness(1.2);
          -webkit-text-stroke: 0.5px rgba(0,0,0,0.7);
          text-stroke: 0.5px rgba(0,0,0,0.7);
          paint-order: stroke fill;
        }
        @keyframes bioShift {
          0% { background-position: 0% 50%; filter: drop-shadow(0 0 10px #00FFCC) brightness(1.1); }
          25% { background-position: 50% 100%; filter: drop-shadow(0 0 30px #39FF14) brightness(1.5); }
          50% { background-position: 100% 50%; filter: drop-shadow(0 0 40px #00FFFF) brightness(1.8); }
          75% { background-position: 50% 0%; filter: drop-shadow(0 0 30px #1B03FF) brightness(1.5); }
          100% { background-position: 0% 50%; filter: drop-shadow(0 0 10px #00FFCC) brightness(1.1); }
        }
        @keyframes flash {
          0% { opacity: 0.9; }
          100% { opacity: 1; filter: drop-shadow(0 0 40px #FFF) brightness(1.8); }
        }
        @keyframes pinkFlash {
          0%, 92%, 100% { filter: drop-shadow(0 0 15px #00FFCC) brightness(1.2); }
          94% { filter: drop-shadow(0 0 50px #FF1493) brightness(2); text-shadow: 0 0 20px #FF1493, 0 0 40px #FF69B4; }
          96% { filter: drop-shadow(0 0 15px #00FFCC) brightness(1.2); }
          98% { filter: drop-shadow(0 0 60px #FF1493) brightness(2.2); text-shadow: 0 0 30px #FF1493, 0 0 50px #FF69B4; }
        }
        .digit-one {
          transform: scale(0.92);
        }
        .minute-tens {
          transform: rotate(5deg) scale(0.9); /* 5° clockwise */
        }
        .minute-ones {
          transform: rotate(10deg) scale(0.75); /* 10° clockwise, smaller */
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
        }
        @media (orientation: landscape) and (min-width: 1024px) {
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
        @media (min-width: 1024px) {
          .clock-wrapper {
            transform: scale(0.6) rotate(-3deg) translate(-80px, -70px);
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
                className={`digit ${digit === '1' ? 'digit-one' : ''}`}
                style={{ fontSize: getDigitSize(digit, true) }}
              >
                {digit}
              </span>
            ))}
          </div>
          
          {/* Minutes - diagonally below, different tilts */}
          <div style={minutesContainerStyle}>
            <span 
              className="digit minute-tens"
              style={{ fontSize: getDigitSize(timeData.minDigits[0]!, false) }}
            >
              {timeData.minDigits[0]}
            </span>
            <span 
              className="digit minute-ones"
              style={{ fontSize: getDigitSize(timeData.minDigits[1]!, false) }}
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
