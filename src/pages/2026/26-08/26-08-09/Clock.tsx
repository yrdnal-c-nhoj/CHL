import rubikVideo from '@/assets/images/26_images/26-08/26-08-12/rubik.mp4?url';
import { useSecondClock } from '@/utils/hooks';
import type { CSSProperties } from 'react';
import React, { memo, useMemo } from 'react';

export const assets: string[] = [rubikVideo];

interface ClockProps {
  /** Size of each video tile in CSS units (e.g. '200px', '20vw', '15rem') */
  tileSize?: string;
  /** Number of tile copies to render to cover large or high-resolution screens */
  tileCount?: number;
}

const containerStyle: CSSProperties = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100vw',
  height: '100dvh',
  backgroundColor: '#000',
  color: '#e0e0e0',
  fontFamily: "'Courier New', Courier, monospace",
  overflow: 'hidden',
};

const videoGridWrapperStyle: CSSProperties = {
  position: 'absolute',
  inset: 0,
  zIndex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
};

const tileVideoStyle: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
};

const digitalClockStyle: CSSProperties = {
  position: 'relative',
  zIndex: 2,
  fontSize: '18vmin',
  fontWeight: 'bold',
  letterSpacing: '0.05em',
  textShadow: '0 0 5px #00bfff, 0 0 10px #00bfff, 0 0 20px #00bfff',
  pointerEvents: 'none',
};

const Clock_26_08_12: React.FC<ClockProps> = ({
  tileSize = '300px',
  tileCount = 64,
}) => {
  const time = useSecondClock();

  const { timeString, accessibleTime } = useMemo(() => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const ampm = time.getHours() >= 12 ? 'PM' : 'AM';
    const hours12 = String(time.getHours() % 12 || 12);

    return {
      timeString: `${hours}:${minutes}:${seconds}`,
      accessibleTime: `${hours12}:${minutes}:${seconds} ${ampm}`,
    };
  }, [time]);

  // Dynamically compute the grid style based on the configurable tile size
  const videoGridStyle: CSSProperties = useMemo(
    () => ({
      display: 'grid',
      gridTemplateColumns: `repeat(auto-fit, minmax(${tileSize}, 1fr))`,
      gridAutoRows: tileSize,
      width: 'max(200vw, 2000px)',
      height: 'max(200vh, 2000px)',
      justifyContent: 'center',
      alignContent: 'center',
      flexShrink: 0,
    }),
    [tileSize]
  );

  return (
    <main style={containerStyle}>
      <div style={videoGridWrapperStyle}>
        <div style={videoGridStyle}>
          {Array.from({ length: tileCount }).map((_, i) => (
            <video
              key={i}
              src={rubikVideo}
              autoPlay
              muted
              loop
              playsInline
              style={tileVideoStyle}
            />
          ))}
        </div>
      </div>

      <time dateTime={time.toISOString()} style={digitalClockStyle}>
        {timeString}
      </time>

      <span aria-live="polite" style={{ display: 'none' }}>
        {accessibleTime}
      </span>
    </main>
  );
};

const MemoizedClock = memo(Clock_26_08_12);
MemoizedClock.displayName = 'Clock_26_08_12';

export default MemoizedClock;