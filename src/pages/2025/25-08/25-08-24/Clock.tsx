import React from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

import castelImage from '@/assets/images/25_images/25-08/25-08-24/castel.jpg';
import viaFont from '@/assets/fonts/25fonts/25-08-24-via.ttf?url';

export const assets = [castelImage, viaFont];

const fontConfig = {
  fontFamily: 'ClockFont_25_08_24',
  fontUrl: viaFont,
};

const toRoman = (num: number) => {
  const romanMap = [
    [1000, 'M'],
    [900, 'CM'],
    [500, 'D'],
    [400, 'CD'],
    [100, 'C'],
    [90, 'XC'],
    [50, 'L'],
    [40, 'XL'],
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let result = '';
  for (const [value, numeral] of romanMap) {
    while (num >= value) {
      result += numeral;
      num -= value;
    }
  }
  return result || 'N';
};

const Clock_25_08_24 = () => {
  const time = useClock();
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Format each component with fixed width: hours can be 1-4 chars, minutes/seconds 2 chars each (with leading zeros)
  const hourStr = toRoman(hours);
  const minuteStr = toRoman(minutes).padStart(2, '0');
  const secondStr = toRoman(seconds).padStart(2, '0');

  // Combine into a single string with colons
  const timeStr = `${hourStr}:${minuteStr}:${secondStr}`;
  const chars = timeStr.split('');

  return (
    <main
      className={styles.container}
      style={{ '--bg-image': `url(${castelImage})` }}
    >
      <SRTime time={time} />
      <div className={styles.timeWrapper} aria-hidden="true">
        {chars.map((char, index) => (
          <span key={index} className={styles.digitBox}>
            {char === ':' ? <span className={styles.colon}>:</span> : char}
          </span>
        ))}
      </div>
    </main>
  );
};

Clock_25_08_24.displayName = 'Clock_25_08_24';
export default Clock_25_08_24;
