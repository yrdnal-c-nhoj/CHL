import { useSmoothClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import type { FontConfig } from '@/types/clock';

import batsVideo from '@/assets/images/26_images/26-11/26-11-22/bats.webm';
import clockFont from '@/assets/fonts/26fonts/26-11-22.ttf?url';

import styles from './Clock.module.css';

export const assets = [batsVideo, clockFont];

const fontConfig: FontConfig = {
  fontFamily: 'ClockFont_26_11_22',
  fontUrl: clockFont,
};

const DIGIT_TO_LETTER: Record<string, string> = {
  '0': 'd',
  '1': 'k',
  '2': 'g',
  '3': 'y',
  '4': 'w',
  '5': 'l',
  '6': 'c',
  '7': 'p',
  '8': 'o',
  '9': 'i',
};

const Clock_26_11_22 = () => {
  const time = useSmoothClock(16);
  useSuspenseFontLoader([fontConfig]);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeString = `${hours}${minutes}${seconds}`;
  const letterTime = timeString
    .split('')
    .map((ch) => DIGIT_TO_LETTER[ch] ?? ch)
    .join('');

  return (
    <main className={styles.container}>
      <SRTime time={time} />
      <video
        src={batsVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className={styles.backgroundVideo}
      />
      <div className={styles.content} aria-hidden="true">
        {letterTime}
      </div>
    </main>
  );
};

Clock_26_11_22.displayName = 'Clock_26_11_22';

export default Clock_26_11_22;
