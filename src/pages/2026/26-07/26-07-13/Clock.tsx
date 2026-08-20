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

const clockStyles: Record<string, React.CSSProperties> = {
  clockWrapper: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#191B1B',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    filter: 'brightness(1) contrast(1.2) saturate(6)',
  },
  clockContainer: {
    fontFamily: 'ShapesFont, monospace',
    position: 'relative',
    zIndex: 2,
    display: 'grid',
    color: '#FBA433',
    justifyItems: 'center',
    alignItems: 'center',
    textShadow: '2px 2px 0px #C5B0F0, -2px 2px 0px #22045F',
  },
  digit: {
    lineHeight: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '1ch',
    fontVariantNumeric: 'tabular-nums',
  },
};

const Clock =  () => {
  useSuspenseFontLoader(fontConfigs);

  const time = useSecondClock();

  const timeString = useMemo(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return pad(time.getHours()) + pad(time.getMinutes()) + pad(time.getSeconds());
  }, [time]);

  const digits = timeString.split('');

  const displayed = useMemo(() =>
    digits.map((d) => DIGIT_TO_SHAPE_MAP[d] ?? d),
    [digits]);

  return (
    <main style={clockStyles.clockWrapper} className={styles.container}>
      <time dateTime={time.toISOString()} className={styles.srOnly}>{time.toLocaleTimeString()}</time>

      <div style={clockStyles.background}>
        <video
          style={clockStyles.backgroundVideo}
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
        style={clockStyles.clockContainer}
        className={styles.responsiveClockGrid}
      >
        {displayed.map((letter, index) => (
          <div key={index} style={clockStyles.digit} className={styles.responsiveDigit}>
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
