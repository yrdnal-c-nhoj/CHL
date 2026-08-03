import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useState } from 'react';

import bgImage from '@/assets/images/26_images/26-08/26-08-01/bg.webp';

export const assets: string[] = [bgImage];
// --- SSR-Safe & Efficient Responsive Hook ---
const useIsDesktop = (breakpointPx = 768) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(min-width: ${breakpointPx}px)`);
    setIsDesktop(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [breakpointPx]);

  return isDesktop;
};

const srOnlyStyle: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: 0,
};

const ClockComponent: React.FC = () => {
  const isDesktop = useIsDesktop();
  const time = useSecondClock();

  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  // --- Dynamic Styles ---
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e0e1dd',
    fontFamily: 'monospace',
    position: 'relative',
  };

  const backgroundStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: isDesktop
      ? `image(from url(${bgImage}) rotate 90deg)`
      : `url(${bgImage})`,
    backgroundPosition: 'center',
    backgroundSize: '100% 100%', // Stretches the image to fill the container, potentially distorting aspect ratio
    zIndex: -1,
  };

  // Shape size
  const shapeDimension = isDesktop ? '30vw' : '30dvh';

  // Independent font sizes
  const hoursFontSize = isDesktop ? '28vw' : '28dvh';
  const minutesFontSize = isDesktop ? '13vw' : '13dvh';
  const secondsFontSize = isDesktop ? '3vw' : '3dvh';

  const shapeBaseStyle: React.CSSProperties = {
    width: shapeDimension,
    height: shapeDimension,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    boxSizing: 'border-box',
    lineHeight: 1,
    letterSpacing: '-0.03em',
    textShadow:
      '0 0 5px rgba(0,0,0,0.5), 0 0 10px rgba(0,0,0,0.5)',
    userSelect: 'none',
  };

  const hoursStyle: React.CSSProperties = {
    ...shapeBaseStyle,
    fontSize: hoursFontSize,
    backgroundColor: '#FF0000',
    color: '#00FF00', // This color might need adjustment for the new font
    fontFamily: '"Pirata One", cursive',
    // Nudge the number up slightly for better optical centering
    paddingBottom: isDesktop ? '2vw' : '2dvh',
  };

  const minutesStyle: React.CSSProperties = {
    ...shapeBaseStyle,
    fontSize: minutesFontSize,
    backgroundColor: '#0000FF',
    borderRadius: '50%',
    color: '#FF7700',
    fontFamily: '"Teko", sans-serif',
  };

  const secondsStyle: React.CSSProperties = {
    ...shapeBaseStyle,
    fontSize: secondsFontSize,
    backgroundColor: '#FFFF00',
    color: '#8B00FF',
    clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
    fontFamily: '"Space Grotesk", sans-serif',
    // Nudge the number down to be optically centered in the triangle
    paddingTop: isDesktop ? '7vw' : '7dvh',
  };

  return (
    <main style={containerStyle}>
      <div aria-hidden="true" style={backgroundStyle} />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Pirata+One&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Teko&display=swap');
        `}
      </style>
      <time dateTime={time.toISOString()} style={srOnlyStyle}>
        {`${hours}:${minutes}:${seconds}`}
      </time>

      <div
        aria-hidden="true"
        style={{
          display: 'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isDesktop ? '1vw' : '1dvh',
          width: '100%',
          height: '100%',
          padding: isDesktop ? '1vw' : '1dvh',
          boxSizing: 'border-box',
        }}
      >
        <div style={hoursStyle}>{hours}</div>
        <div style={minutesStyle}>{minutes}</div>
        <div style={secondsStyle}>{seconds}</div>
      </div>
    </main>
  );
};

const MemoizedClock = React.memo(ClockComponent);
MemoizedClock.displayName = 'Clock_26_08_01';

export default MemoizedClock;