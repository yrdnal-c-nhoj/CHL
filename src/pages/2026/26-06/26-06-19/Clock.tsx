import glassVideo from '@/assets/images/26_images/26-06/26-06-19/glass.mp4';
import glassVideo2 from '@/assets/images/26_images/26-06/26-06-19/glass2.mp4';
import glassbreak from '@/assets/images/26_images/26-06/26-06-19/glassbreak.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime } from '@/utils/hooks';
import React, { useMemo } from 'react';

// Import the font with the corresponding date from the assets folder
import fontUrl from '@/assets/fonts/26fonts/26-06-19.otf?url';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassVideo, glassVideo2,glassbreak];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_19',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const DigitalClock: React.FC = () => {
  const time = useClockTime();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, ampm } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();

    const ampm = h >= 12 ? 'PM' : 'AM';
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
        position: 'relative', // Needed for positioning the video overlay
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        overflow: 'hidden', // Hide video overflow
        margin: 0,
        padding: 0,
        backgroundImage: `url(${glassbreak})`,
        backgroundSize: 'cover',
        filter: 'contrast(1.2) brightness(1.7)',
        backgroundPosition: 'center',
      }}
    >
      <video
        src={glassVideo}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.4,
          filter: 'contrast(1.9) brightness(0.7)',
          zIndex: 1, // Sit above the background but below the time
        }}
      />
       <video
        src={glassVideo2}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0.3,
          filter: 'contrast(1.9) brightness(0.7)',
          zIndex: 2, // Sit above the background but below the time
        }}
      />
      <time
        dateTime={time.toISOString()}
        style={{
          fontFamily: 'ClockFont_26_06_19, monospace',
          fontSize: '30vw',
          color: '#B4D0F139',
          fontVariantNumeric: 'tabular-nums',
          position: 'relative', // Ensure time is on top of the video
          zIndex: 2,
        }}
      >
        {hours}:{minutes}
        <span style={{ fontSize: '28vw', marginLeft: '0.25em' }}>
          {ampm}
        </span>
      </time>
    </main>
  );
};

export default DigitalClock;
