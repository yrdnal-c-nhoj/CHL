import React, { useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import digi251103font from '@/assets/fonts/25fonts/25-11-03-bin3.ttf?url';
import tec251103font from '@/assets/fonts/25fonts/25-11-03-bin1.otf?url';
import styles from './Clock.module.css';

export const assets = [digi251103font, tec251103font];

const digitalFont = 'digitalFont';
const techFont = 'techFont';

function BinaryClockWithColumns() {
  const fontConfigs = useMemo(
    () => [
      {
        fontFamily: digitalFont,
        fontUrl: digi251103font,
        options: { weight: 'normal', style: 'normal' },
      },
      {
        fontFamily: techFont,
        fontUrl: tec251103font,
        options: { weight: 'normal', style: 'normal' },
      },
    ],
    [],
  );

  const fontsLoaded = useSuspenseFontLoader(fontConfigs);
  const time = useClock();
  const [overlayVisible, setOverlayVisible] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      const timer = setTimeout(() => setOverlayVisible(false), 100);
      return () => clearTimeout(timer);
    }
  }, [fontsLoaded]);

  const formatBinary = (num: number) =>
    num.toString(2).padStart(8, '0').split('');

  const renderColumn = (val: number) => {
    const bits = formatBinary(val);
    return (
      <div className={styles.column}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

        <div className={styles.binaryContainer}>
          {bits.map((bit, idx) => (
            <div
              key={idx}
              className={`${styles.bitCell} ${bit === '1' ? styles.bitOn : styles.bitOff}`}
            >
              {bit}
            </div>
          ))}
        </div>
        <div className={styles.digitBox}>{val.toString().padStart(2, '0')}</div>
      </div>
    );
  };

  const ms = Math.floor(time.getMilliseconds() / 10);

  return (
    <main className={styles.container}>
      {/* Loading Overlay */}
      <div
        className={styles.loadingOverlay}
        style={{ opacity: overlayVisible ? 1 : 0 }}
      />

      <div className={styles.columnsWrapper}>
        {renderColumn(time.getHours())}
        {renderColumn(time.getMinutes())}
        {renderColumn(time.getSeconds())}
        {renderColumn(ms)}
      </div>
    </main>
  );
}

const MemoizedBinaryClockWithColumns = React.memo(BinaryClockWithColumns);
MemoizedBinaryClockWithColumns.displayName = 'Clock_25_11_03';
export default MemoizedBinaryClockWithColumns;
