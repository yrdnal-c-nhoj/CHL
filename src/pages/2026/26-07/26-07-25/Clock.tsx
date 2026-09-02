import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useEffect, memo } from 'react';
import { useClock, useSmoothClock } from '@/utils/hooks';
import styles from './Clock.module.css';

import fontUrl from '@/assets/fonts/26fonts/26-07-25.otf?url';

export const assets = [fontUrl];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_07_25',
    fontUrl,
  },
];

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

function HexClock() {
  const now = useClock();
  const subSecondProgress = useSmoothClock().getMilliseconds() / 1000;

  useSuspenseFontLoader(fontConfigs);

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

  const { hex: hexCode, textHex: invertedHex } = getHexColors(now);

  const hoursStr = pad2(now.getHours());
  const minutesStr = pad2(now.getMinutes());
  const secondsStr = pad2(now.getSeconds());

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
    <main
      style={{
        backgroundColor: hexCode,
        color: invertedHex,
        height: '100dvh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: "'Manrope', sans-serif",
        textAlign: 'center',
        paddingBottom: '3dvh',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
      className={styles.container}
    >
      <time dateTime={now.toISOString()} className={styles.srOnly}>{now.toLocaleTimeString()}</time>

      {/* Top Banner */}
      <div className={styles.topExplanationBar}>
        The background color is time values (Hours/23, Mins/59, Secs/59) mapped onto the 0–255 RGB spectrum (16.7M colors).
        &nbsp;The text color is the mathematical opposite.
      </div>

      {/* Main Clock Readouts */}
      <div className={styles.readoutsWrapper}>
        {/* Digital Time Display */}
        <div className={styles.digitalTimeContainer}>
          <div className={`${styles.digitalBox} ${styles.techShadow}`}>{hoursStr[0]}</div>
          <div className={`${styles.digitalBox} ${styles.techShadow}`}>{hoursStr[1]}</div>
          <div className={`${styles.digitalColon} ${styles.techShadow}`}>:</div>
          <div className={`${styles.digitalBox} ${styles.techShadow}`}>{minutesStr[0]}</div>
          <div className={`${styles.digitalBox} ${styles.techShadow}`}>{minutesStr[1]}</div>
          <div className={`${styles.digitalColon} ${styles.techShadow}`}>:</div>
          <div className={`${styles.digitalBox} ${styles.techShadow}`}>{secondsStr[0]}</div>
          <div className={`${styles.digitalBox} ${styles.techShadow}`}>{secondsStr[1]}</div>
        </div>

        {/* Full-bleed Sliding Hex Filmstrip */}
        <div className={styles.hexStrip}>
          {stripItems.map(({ key, offset, hex, textHex }) => {
            const distance = Math.abs(offset);
            const isCurrent = distance < 0.5;
            const scale = Math.max(0.85, 1.05 - distance * 0.03);

            return (
              <div
                key={key}
                className={`${styles.hexStripCell} ${styles.techShadow}${isCurrent ? ` ${styles.isCurrent}` : ''}`}
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
        <div className={styles.hexCodeContainer}>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[0]}</div>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[1]}</div>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[2]}</div>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[3]}</div>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[4]}</div>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[5]}</div>
          <div className={`${styles.hexBox} ${styles.techShadow}`}>{hexCode[6]}</div>
        </div>
      </div>

    </main>
  );
}

const MemoizedHexClock = memo(HexClock);
MemoizedHexClock.displayName = 'Clock_26_07_25';
export default MemoizedHexClock;
