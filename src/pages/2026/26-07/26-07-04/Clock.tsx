import glassbreak from '@/assets/images/26_images/26-07/26-07-03/kitty.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useEffect, useMemo, useState } from 'react';

// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-07-03.ttf?url';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassbreak];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_19',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const DigitalClock: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);
  const isMobile = useIsMobile();

  const { hours, minutes, ampm } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();

    const ampm = h >= 12 ? 'pm' : 'am';
    let hours12 = h % 12;
    if (hours12 === 0) hours12 = 12; // Handle midnight (0) and noon (12)

    return {
      hours: hours12.toString(),
      minutes: formatTime(m),
      ampm,
    };
  }, [time]);

  return (
    <main
      style={{
        position: 'relative',
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        overflow: 'hidden', // Hide video overflow
        margin: 0,
        padding: 0,
        backgroundImage: `url(${glassbreak})`,
        backgroundSize: 'cover',
        filter: 'contrast(0.9) brightness(1.1)',
        backgroundPosition: 'center',
      }}
    >
    
      {/* The time element's style is dynamically adjusted based on screen size */}
      <time
        dateTime={time.toISOString()}
        style={{
          fontFamily: 'ClockFont_26_06_19, monospace',
          fontSize: '8vh',
          color: '#B4D0F1BF',
          fontVariantNumeric: 'tabular-nums',
          position: 'absolute',
          zIndex: 2,
          // Centered on mobile
          ...(isMobile && {
            bottom: '2vh',
            left: '50%',
            transform: 'translateX(-50%)',
          }),
          // Flushed right on desktop
          ...(!isMobile && {
            bottom: '2vh',
            right: '2vw',
          }),
        }}
      >
        {hours}:{minutes}
        <span style={{ fontSize: '9vh', marginLeft: '0.1em' }}>
          {ampm}
        </span>
      </time>
    </main>
  );
};

export default DigitalClock;
