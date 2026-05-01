import React, { useMemo } from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import myFontWoff2 from '@/assets/fonts/2025/25-08-02-hea.ttf';
import bg2 from '@/assets/images/2025/25-08/25-08-02/em.webp';

const DigitalClock: React.FC = () => {
  const time = useClockTime();

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: 'hea',
      fontUrl: myFontWoff2,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  
  // Suspend until font is ready
  useSuspenseFontLoader(fontConfigs);

  const isoTime = time.toISOString();
  const displayTime = () => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const bgFilter = 'brightness(1.5) contrast(3.2)';

  const fullScreenBackgroundStyle = (image, opacity, zIndex, custom = {}) => ({
    position: 'absolute',
    backgroundImage: `url(${image})`,
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    opacity,
    zIndex,
    pointerEvents: 'none',
    filter: bgFilter,
    ...custom,
  });

  const clockContainerStyle = {
    position: 'relative',
    zIndex: 10,
    fontFamily: "'hea', monospace",
    fontSize: '0.5rem',
    color: '#CFEAEA',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <main>
      {/* Full-Screen Background Layer for bg2, stretched with distortion */}
      <div
        style={fullScreenBackgroundStyle(bg2, 1, 2, {
          backgroundSize: '100% 100%',
        })}
      />

      {/* Clock Display */}
      <time dateTime={isoTime} style={clockContainerStyle}>{displayTime()}</time>
    </main>
  );
};

export default DigitalClock;
