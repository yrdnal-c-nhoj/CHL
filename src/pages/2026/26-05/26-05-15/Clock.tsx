import React from 'react';
import { useClockTime } from '@/utils/hooks/useClockTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import styles from './Clock.module.css';

import font from '@/assets/fonts/26fonts/26-05-15.ttf?url';
import backgroundImage from '@/assets/images/2026/26-05/26-05-15/rings.webp';

export const assets = [font, backgroundImage];

const fontConfig = {
  fontFamily: 'CustomFont',
  fontUrl: font,
};

const _clockSpacingVw = 15; // slightly less than font-size to bring them closer

const getOffsetClassName = (offset: number): string => {
  switch (offset) {
    case -10:
      return styles.clockRowOffsetNegative10!;
    case -9:
      return styles.clockRowOffsetNegative9!;
    case -8:
      return styles.clockRowOffsetNegative8!;
    case -7:
      return styles.clockRowOffsetNegative7!;
    case -6:
      return styles.clockRowOffsetNegative6!;
    case -5:
      return styles.clockRowOffsetNegative5!;
    case -4:
      return styles.clockRowOffsetNegative4!;
    case -3:
      return styles.clockRowOffsetNegative3!;
    case -2:
      return styles.clockRowOffsetNegative2!;
    case -1:
      return styles.clockRowOffsetNegative1!;

    case 0:
      return styles.clockRowOffset0!;
    case 1:
      return styles.clockRowOffset1!;
    case 2:
      return styles.clockRowOffset2!;
    case 3:
      return styles.clockRowOffset3!;
    case 4:
      return styles.clockRowOffset4!;
    case 5:
      return styles.clockRowOffset5!;
    case 6:
      return styles.clockRowOffset6!;
    case 7:
      return styles.clockRowOffset7!;
    case 8:
      return styles.clockRowOffset8!;

    default:
      return styles.clockRowOffset0!;
  }
};

const DigitalClock: React.FC = () => {
  const currentTime = useClockTime();

  useSuspenseFontLoader([fontConfig]);

  const rawHours = currentTime.getHours();
  const hours = (rawHours % 12 || 12).toString().padStart(2, '0');
  const minutes = currentTime.getMinutes().toString().padStart(2, '0');
  const ampm = rawHours >= 12 ? 'PM' : 'AM';
  const isoTime = currentTime.toISOString();
  const ariaLabel = `${hours}:${minutes} ${ampm}`;

  const offsets = [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <main className={styles.container}>
      <div className={styles.backgroundWrapper} aria-hidden="true">
        <img
          src={backgroundImage}
          alt=""
          className={styles.backgroundImage}
          decoding="async"
          loading="eager"
          draggable={false}
        />
      </div>

      {offsets.map((offset) => (
        <div
          key={offset}
          className={`${styles.clockRow} ${getOffsetClassName(offset)}`}
        >
          <time
            className={styles.clockDisplay}
            dateTime={isoTime}
            aria-label={ariaLabel}
          >
            <span className={styles.timeSegment}>{hours}{minutes}{ampm}</span>
          </time>
        </div>
      ))}
    </main>
  );
};

export default DigitalClock;