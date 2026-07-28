import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useEffect, useRef, useState } from 'react';

// Font import
import fontUrl from '@/assets/fonts/26fonts/26-07-25.otf?url';

export const assets = [fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_25',
    fontUrl,
  },
];

// Helper: Maps a Date object directly to its Hex and high-contrast Inverted Hex
function getHexColors(d: Date): { hex: string; textHex: string } {
  const r = Math.round((d.getHours() / 23) * 255);
  const g = Math.round((d.getMinutes() / 59) * 255);
  const b = Math.round((d.getSeconds() / 59) * 255);

  const rawHex = (r << 16) | (g << 8) | b;
  const hex = `#${rawHex.toString(16).padStart(6, '0')}`.toUpperCase();
  const textHex = `#${((0xffffff ^ rawHex) >>> 0).toString(16).padStart(6, '0')}`.toUpperCase();

  return { hex, textHex };
}

const pad2 = (num: number): string => (num < 10 ? `0${num}` : `${num}`);

const VISIBLE_CELLS = 13;
const BUFFER_CELLS = 5;
const STRIP_RADIUS = Math.floor(VISIBLE_CELLS / 2) + BUFFER_CELLS;

export default function HexClock() {
  const [now, setNow] = useState(() => new Date());
  const [subSecondProgress, setSubSecondProgress] = useState(0);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const animationFrameRef = useRef<number>();

  useSuspenseFontLoader(fontConfigs);

  // Load Google Font
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href =
      'https://fonts.googleapis.com/css2?family=Manrope:wght@600;700&display=swap';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Strict 1-second boundary tick
  useEffect(() => {
    const scheduleNextTick = () => {
      const current = new Date();
      const msUntilNextSecond = 1000 - current.getMilliseconds();

      timeoutRef.current = setTimeout(() => {
        setNow(new Date());
        scheduleNextTick();
      }, msUntilNextSecond);
    };

    scheduleNextTick();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Continuous frame loop for filmstrip movement
  useEffect(() => {
    const updateFrame = () => {
      setSubSecondProgress(new Date().getMilliseconds() / 1000);
      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };

    animationFrameRef.current = requestAnimationFrame(updateFrame);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Color calculation for current time
  const { hex: hexCode, textHex: invertedHex } = getHexColors(now);

  // Pre-formatted string representations
  const hoursStr = pad2(now.getHours());
  const minutesStr = pad2(now.getMinutes());
  const secondsStr = pad2(now.getSeconds());

  // Build filmstrip items efficiently
  const currentBaseSecond = Math.floor(now.getTime() / 1000);
  const stripItems = new Array(STRIP_RADIUS * 2 + 1);

  for (let idx = 0, offset = -STRIP_RADIUS; offset <= STRIP_RADIUS; idx++, offset++) {
    const epoch = currentBaseSecond + offset;
    const adjustedOffset = offset - subSecondProgress;
    const { hex, textHex } = getHexColors(new Date(epoch * 1000));

    stripItems[idx] = {
      key: epoch,
      offset: adjustedOffset,
      hex,
      textHex,
    };
  }

  return (
    <div
      style={{
        backgroundColor: hexCode,
        color: invertedHex,
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'Manrope', sans-serif",
        textAlign: 'center',
        paddingBottom: '3vh',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <style>{`


.top-explanation-bar {
  width: 100vw;
  max-width: 650px; /* Constrains line length so it's not full-bleed */
  margin: 0 auto;    /* Centers the bar */
  background-color: #565656;
  color: #A2A0A0;
  font-size: 0.75rem;
  line-height: 1.35;
  padding: 8px 16px;
  box-sizing: border-box;
  border-bottom: 1px solid #343232;
  text-align: center;
  letter-spacing: 0.2px;
  
  /* Prevents single-word overflow lines */
  text-wrap: balance; 
}





        .tech-shadow {
          text-shadow: 
            1px 1px 0px #000000,
           -1px -1px 0px #FFFFFF,
            1px -1px 0px #FFFFFF,
           -1px  1px 0px #FFFFFF,
            0px -1px 0px #FFFFFF,
           -1px  0px 0px #FFFFFF;
        }

        .readouts-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2vh;
          margin-top: auto;
          margin-bottom: auto;
          box-sizing: border-box;
        }

        /* Fixed-size boxed display container - EVENLY SPACED ACROSS ENTIRE WIDTH */
        .digital-time-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 6vw;
          box-sizing: border-box;
        }

        .digital-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(3rem, 10vw, 8rem);
          height: clamp(4.5rem, 13vh, 10rem);
          font-size: clamp(3.5rem, 10vh, 7.5rem);
          font-weight: 900;
          font-family: 'ClockFont_26_07_25', sans-serif;
        }

        .digital-colon {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: clamp(3.5rem, 10vh, 7.5rem);
          font-weight: 900;
          font-family: 'ClockFont_26_07_25', sans-serif;
          width: clamp(1.5rem, 4vw, 3.5rem);
        }

        /* Fixed-size boxed hex container - EVENLY SPACED ACROSS ENTIRE WIDTH */
        .hex-code-container {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 0 6vw;
          box-sizing: border-box;
        }

        .hex-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: clamp(2.2rem, 8vw, 6rem);
          height: clamp(3.5rem, 9vh, 7rem);
          font-size: clamp(2.8rem, 8vh, 5.5rem);
          font-weight: 800;
          font-family: 'ClockFont_26_07_25', sans-serif;
        }

        .hex-strip {
          position: relative;
          width: 100vw;
          height: clamp(42px, 7vh, 65px);
          overflow: hidden;
          margin-top: auto;
        }

        .hex-strip-cell {
          position: absolute;
          top: 0;
          left: 50%;
          width: calc(100vw / 13);
          height: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'ClockFont_26_07_25', sans-serif;
          font-weight: 800;
          letter-spacing: 0.5px;
          font-size: clamp(0.45rem, 1.1vh, 0.75rem);
          border-radius: 4px;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          will-change: transform;
        }

        .hex-strip-cell.is-current {
          font-size: clamp(0.55rem, 1.3vh, 0.9rem);
          border: 2px solid currentColor;
          border-radius: 6px;
        }
      `}</style>

      {/* Top Banner */}
      <div className="top-explanation-bar">
        Background color is time values (Hours/23, Mins/59, Secs/59) mapped onto the 0–255 RGB spectrum (16.7M colors).
        &nbsp;Text color is the mathematical opposite.
      </div>

      {/* Main Clock Readouts */}
      <div className="readouts-wrapper">
        {/* Digital Time Display */}
        <div className="digital-time-container">
          <div className="digital-box tech-shadow">{hoursStr[0]}</div>
          <div className="digital-box tech-shadow">{hoursStr[1]}</div>
          <div className="digital-colon tech-shadow">:</div>
          <div className="digital-box tech-shadow">{minutesStr[0]}</div>
          <div className="digital-box tech-shadow">{minutesStr[1]}</div>
          <div className="digital-colon tech-shadow">:</div>
          <div className="digital-box tech-shadow">{secondsStr[0]}</div>
          <div className="digital-box tech-shadow">{secondsStr[1]}</div>
        </div>

        

      {/* Full-bleed Sliding Hex Filmstrip */}
      <div className="hex-strip">
        {stripItems.map(({ key, offset, hex, textHex }) => {
          const distance = Math.abs(offset);
          const isCurrent = distance < 0.5;
          const scale = Math.max(0.85, 1.05 - distance * 0.03);

          return (
            <div
              key={key}
              className={`hex-strip-cell tech-shadow${isCurrent ? ' is-current' : ''}`}
              style={{
                backgroundColor: hex,
                color: textHex,
                transform: `translateX(calc(${offset} * 100% - 50%)) scale(${scale})`,
                zIndex: isCurrent ? 2 : 1,
              }}
            >
              {hex}
            </div>
          );
        })}
      </div>

        {/* Hex Code Readout */}
        <div className="hex-code-container">
          <div className="hex-box tech-shadow">{hexCode[0]}</div>
          <div className="hex-box tech-shadow">{hexCode[1]}</div>
          <div className="hex-box tech-shadow">{hexCode[2]}</div>
          <div className="hex-box tech-shadow">{hexCode[3]}</div>
          <div className="hex-box tech-shadow">{hexCode[4]}</div>
          <div className="hex-box tech-shadow">{hexCode[5]}</div>
          <div className="hex-box tech-shadow">{hexCode[6]}</div>
        </div>
      </div>

    </div>
  );
}