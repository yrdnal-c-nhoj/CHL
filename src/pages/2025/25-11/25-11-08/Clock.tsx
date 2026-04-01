import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import type { FontConfig } from '../../../../types/clock';
import bgImageUrl from '../../../../assets/images/2025/25-11/25-11-08/eye.gif';
import dig2511088 from '../../../../assets/fonts/2025/25-11-08-eye3.ttf';
import ti251108 from '../../../../assets/fonts/2025/25-11-08-eye.ttf';
import styles from './Clock.module.css';

interface ClockProps {
  imageWidth?: string;
  imageHeight?: string;
}

const Clock: React.FC<ClockProps> = ({ imageWidth = '24vw', imageHeight = '16vw' }) => {
  const [now, setNow] = useState(() => new Date());
  const [elapsedMs, setElapsedMs] = useState<number>(0);

  const fontConfigs = useMemo<FontConfig[]>(() => [
    { fontFamily: 'DigitsFont-2025-11-10', fontUrl: dig2511088 },
    { fontFamily: 'Ti251108-2025-11-10', fontUrl: ti251108 },
  ], []);

  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    const start = Date.now();
    let frameId: number;
    
    const tick = () => {
      setNow(new Date());
      setElapsedMs(Date.now() - start);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const pad2 = (n) => n.toString().padStart(2, '0');

  // Convert to 12-hour format and get AM/PM
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; // Convert 0 to 12 for 12 AM
  const clock = `${hours}:${pad2(now.getMinutes())} ${ampm}`;

  const timerFontFamilyName = 'Ti251108-2025-11-10';

  const renderCheckerboardBG = () => {
    const tiles = [];
    const rows = 30;
    const cols = 30;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const flip = (r + c) % 2 === 1;
        tiles.push(
          <div
            key={`${r}-${c}`}
            style={{
              width: imageWidth,
              height: imageHeight,
              backgroundImage: `url(${bgImageUrl})`,
              transform: flip ? 'scaleX(-1)' : 'none',
            }}
            className={styles.tile}
          />,
        );
      }
    }
    return <div className={styles.bgGrid} style={{
      gridTemplateColumns: `repeat(30, ${imageWidth})`,
      gridAutoRows: `${imageHeight}`,
      marginLeft: `calc(-1 * ${imageWidth} / 2)`,
      marginTop: `calc(-1 * ${imageHeight} / 2)`,
    }}>{tiles}</div>;
  };

  const timerDigitBoxStyle = {
    fontFamily: `'${timerFontFamilyName}', monospace`,
    fontSize: '14vh',
    lineHeight: '1',
    width: 'auto',
    minWidth: '8vh',
    padding: '0 0.1vh',
    color: '#ff0000',
    textShadow: '0 0 1vh rgba(255, 0, 0, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '1vh',
    boxShadow: '0 0 1.5vh rgba(0, 0, 0, 0.5)',
    margin: '0 0.6vh',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s ease-out',
  };

  const timerDotBoxStyle = {
    ...timerDigitBoxStyle,
    width: '0.08vh',
    minWidth: '0.08vh',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none',
  };

  const renderTimerBoxed = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const s = Math.floor(totalSeconds % 60);
    const hundredths = Math.floor((ms % 1000) / 10);

    // Format as seconds.hundredths
    const timeStr = `${s}.${pad2(hundredths)}`;

    return (
      <div
        className={styles.timerContainer}
      >
        {timeStr.split('').map((ch, i) => (
          <span
            key={i}
            style={{
              ...(ch === '.' ? timerDotBoxStyle : timerDigitBoxStyle),
              opacity: 1,
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.bgLayer}>{renderCheckerboardBG()}</div>
      <div className={styles.clock}>
        {clock}
      </div>
      {renderTimerBoxed(elapsedMs)}
    </div>
  );
}

export default Clock;
