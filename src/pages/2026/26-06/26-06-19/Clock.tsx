import glassVideo from '@/assets/images/26_images/26-06/26-06-19/glass.mp4';
import glassVideo2 from '@/assets/images/26_images/26-06/26-06-19/glass3.mp4';
import glassbreak from '@/assets/images/26_images/26-06/26-06-19/glassbreak.webp';
import type { FontConfig } from '@/types/clock';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useSecondClock } from '@/utils/hooks';
import React, { useMemo } from 'react';

import fontUrl from '@/assets/fonts/26fonts/26-06-19.otf?url';

// =========================
// ASSET EXPORTS (Required)
// =========================
export const assets = [glassVideo, glassbreak, glassVideo2];

const fontConfigs: FontConfig[] = [
  {
    fontFamily: 'ClockFont_26_06_19',
    fontUrl,
  },
];

const formatTime = (num: number): string => num.toString().padStart(2, '0');

const DigitalClock: React.FC = () => {
  const time = useSecondClock();
  useSuspenseFontLoader(fontConfigs);

  const { hours, minutes, ampm } = useMemo(() => {
    const h = time.getHours();
    const m = time.getMinutes();

    const ampm = h >= 12 ? 'PM' : 'AM';
    let hours12 = h % 12;
    if (hours12 === 0) hours12 = 12;

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
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        // Base background layer (Original)
        backgroundImage: `url(${glassbreak})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'contrast(1.2) brightness(1.7)',
      }}
    >
      {/* Flipped background layer sitting directly on top of the original */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${glassbreak})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          transform: 'scaleX(-1) scaleY(-1)', // Flips it horizontally and vertically
          mixBlendMode: 'screen', // Blends the breaks together cleanly over each other
          filter: 'contrast(1.2) brightness(1.7)', // Match the filter of the base layer
          opacity: 0.8,            // Adjust opacity if you want the original layer to show through more/less
          zIndex: 0,
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
          opacity: 0.2,
          filter: 'contrast(1.2) brightness(1.7)', // Match the filter of the base layer
          zIndex: 0,
        }}
      />
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
          filter: 'contrast(1.2) brightness(1.7)', // Match the filter of the base layer
          zIndex: 1, // Sits above both background layers
        }}
      />

      <time
        dateTime={time.toISOString()}
        style={{
          fontFamily: 'ClockFont_26_06_19, monospace',
          fontSize: '30vw',
          color: '#B4D0F139',
          fontVariantNumeric: 'tabular-nums',
          position: 'relative',
          zIndex: 2, // Sits above everything
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