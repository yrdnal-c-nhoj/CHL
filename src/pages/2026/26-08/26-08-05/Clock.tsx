import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useMillisecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Assets
import fontUrl from '@/assets/fonts/26fonts/26-08-05.ttf?url';
import backgroundVideo from '@/assets/images/26_images/26-08/26-08-05/gravity.mp4';

export const assets: string[] = [backgroundVideo];

const fontConfigs: FontConfig[] = [
  { fontFamily: 'ClockFont_26_08_05', fontUrl },
];

// --- GRID & SPACING CONFIGURATION ---
const CLOCKS_PER_SET = 10;
// 20vh per clock leaves 20% of viewport height per slot.
const SPACING_VH = 20; 
const TOTAL_TRAVEL_VH = CLOCKS_PER_SET * SPACING_VH;

const KEYFRAMES_STYLE = `
@keyframes floatUp {
  0% {
    transform: translate(-50%, 0);
  }
  100% {
    transform: translate(-50%, -${TOTAL_TRAVEL_VH}vh);
  }
}
`;

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    backgroundColor: '#000',
    color: '#000',
    overflow: 'hidden',
    position: 'relative',
  },
  videoWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    filter: 'brightness(1.1) saturate(1.3) contrast(1.4)', // Adjusted for better visibility of the clocks
    zIndex: 1,
  },
  backgroundVideo: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  clockContainer: {
    position: 'absolute',
    top: 0, // Changed from '100vh' to 0 so clocks pre-fill the viewport immediately
    left: '50%',
    width: '100%',
    zIndex: 2,
    animation: 'floatUp 25s linear infinite',
    willChange: 'transform',
  },
  clockFace: {
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: "'ClockFont_26_08_05', sans-serif",
    fontSize: 'min(20vw, 13vh)',
    lineHeight: 1,
    whiteSpace: 'nowrap',
    textShadow: '18px 0px 0px #f97316, -18px 0px 0px #7799E1',
    height: `${SPACING_VH}vh`,
  },
  digitBox: {
    display: 'inline-block',
    width: '0.55em',
    textAlign: 'center',
  },
  separator: {
    display: 'inline-block',
    width: '0.25em',
    textAlign: 'center',
    transform: 'scale(1.2)',
    margin: '0 -0.02em',
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: 0,
  },
};

const DisplayDigits: React.FC<{ hours: string; minutes: string; seconds: string; milliseconds: string }> = React.memo(
  ({ hours, minutes, seconds, milliseconds }) => (
    <>
      <span style={styles.digitBox}>{hours[0]}</span>
      <span style={styles.digitBox}>{hours[1]}</span>
      <span style={styles.separator}>:</span>
      <span style={styles.digitBox}>{minutes[0]}</span>
      <span style={styles.digitBox}>{minutes[1]}</span>
      <span style={styles.separator}>:</span>
      <span style={styles.digitBox}>{seconds[0]}</span>
      <span style={styles.digitBox}>{seconds[1]}</span>
      <span style={styles.separator}>:</span>
      <span style={styles.digitBox}>{milliseconds[0]}</span>
      <span style={styles.digitBox}>{milliseconds[1]}</span>
    </>
  ),
);
DisplayDigits.displayName = 'DisplayDigits';

const ClockComponent: React.FC = () => {
  useSuspenseFontLoader(fontConfigs);
  const time = useMillisecondClock(16); // ~60fps for smooth updates

  const clocks = useMemo(
    () =>
      Array.from({ length: CLOCKS_PER_SET * 2 }, (_, i) => ({
        id: i,
        topOffset: `${i * SPACING_VH}vh`,
      })),
    [],
  );

  const { hours, minutes, seconds, milliseconds, isoTime } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    const ms = String(Math.floor(time.getMilliseconds() / 10)).padStart(2, '0');
    return {
      hours: h,
      minutes: m,
      seconds: s,
      milliseconds: ms,
      isoTime: `${h}:${m}:${s}.${ms}`,
    };
  }, [time]);

  return (
    <main style={styles.container}>
      <style>{KEYFRAMES_STYLE}</style>

      <div style={styles.videoWrapper}>
        <video
          src={backgroundVideo}
          style={styles.backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
        />
      </div>

      <time dateTime={isoTime} style={styles.srOnly}>
        {isoTime}
      </time>

      <div style={styles.clockContainer}>
        {clocks.map(({ id, topOffset }) => (
          <div key={id} style={{ ...styles.clockFace, top: topOffset }}>
            <DisplayDigits hours={hours} minutes={minutes} seconds={seconds} milliseconds={milliseconds} />
          </div>
        ))}
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_05';

export default MemoizedClock;