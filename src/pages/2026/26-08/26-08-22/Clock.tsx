import shapesFont from '@/assets/fonts/26fonts/26-07-13.ttf?url';
import clockVideo from '@/assets/images/26_images/26-07/26-07-13/click.mp4';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import { memo, useMemo } from 'react';
import styles from './Clock.module.css';

export const assets = [clockVideo, shapesFont];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ShapesFont',
    fontUrl: shapesFont,
    options: {
      weight: 'normal',
      style: 'normal',
    },
  },
];

const DIGIT_TO_SHAPE_MAP: Record<string, string> = {
  '0': 'A',
  '1': 'R',
  '2': 'j',
  '3': '8',
  '4': 'm',
  '5': 'l',
  '6': '6',
  '7': 'o',
  '8': 'K',
  '9': '3',
};

const Clock = () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const timeString = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  }, [time]);

  const digits = timeString.split('');

  const displayed = useMemo(
    () => digits.map((d) => DIGIT_TO_SHAPE_MAP[d] ?? d),
    [digits]
  );

  return (
    <main className={styles.clockWrapper}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>
        {time.toLocaleTimeString()}
      </time>

      <div className={styles.background}>
        <video
          className={styles.backgroundVideo}
          src={clockVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <time
        dateTime={time.toISOString()}
        aria-label="A digital clock displaying the time using abstract shapes."
        className={styles.clockContainer}
      >
        {displayed.map((letter, index) => (
          <div key={index} className={styles.digit}>
            {letter}
          </div>
        ))}
      </time>
    </main>
  );
};

const MemoizedClock = memo(Clock);
MemoizedClock.displayName = 'Clock_26_07_13';
export default MemoizedClock;