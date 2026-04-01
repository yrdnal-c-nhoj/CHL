import React, { useMemo } from 'react';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import { useSecondClock } from '../../../../utils/useSmoothClock';
import highwayBg from '../../../../assets/images/2026/26-03/26-03-26/highway.webp';
import overFont from '../../../../assets/fonts/2026/26-03-26-over.otf';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const time = useSecondClock();

  const fontConfigs = [
    {
      fontFamily: 'OverFont',
      fontUrl: overFont,
    }
  ];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  const fontFamily = fontsLoaded ? 'OverFont, Courier New, monospace' : 'Courier New, monospace';

  const timeDigits = useMemo(() => {
    const rawHours = time.getHours();
    const isPm = rawHours >= 12;
    const hours12 = rawHours === 0 ? 12 : rawHours > 12 ? rawHours - 12 : rawHours;

    const formatTimeUnit = (unit: number) => unit.toString().padStart(2, '0');

    const hours = hours12.toString();
    const minutes = formatTimeUnit(time.getMinutes());

    return {
      hours: hours.split(''),
      minutes: minutes.split(''),
      amPm: isPm ? 'PM' : 'AM',
    };
  }, [time]);

  return (
    <div className={styles.container} style={{ '--bg-image': `url(${highwayBg})` } as React.CSSProperties}>
      <div className={styles.background} />

      <div className={styles.clockWrapper}>
        {[
          ...timeDigits.hours,
          ...timeDigits.minutes,
          ...timeDigits.amPm.split('')
        ].map((char, index) => (
          <span 
            key={index} 
            className={styles.digit}
            data-char={char}
            style={{ fontFamily, '--digit-index': index } as React.CSSProperties}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

export default Clock;
