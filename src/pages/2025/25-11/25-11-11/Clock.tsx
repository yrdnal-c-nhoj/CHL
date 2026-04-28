// src/components/CustomFontMirroredClock.jsx
import React from 'react';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import { useClockTime, formatTime } from '@/utils/clockUtils';
import todayFont251125 from '@/assets/fonts/2025/25-11-11-digi.ttf?url';
import bgFront from '@/assets/images/2025/25-11/25-11-11/bg.webp'; // top layer
import bgBack from '@/assets/images/2025/25-11/25-11-11/bg1.jpg'; // back layer

// Export assets so parent loaders (Today.jsx) can preload them
export { bgFront, bgBack };

// Export font config so parent loaders can preload them
export const fontConfigs = [
  {
    fontFamily: 'TodayFont',
    fontUrl: todayFont251125,
  },
];

export default function CustomFontMirroredClock() {
  // Use Suspense loader for fonts
  useSuspenseFontLoader(fontConfigs);

  // Using the standardized BTS hook
  const time = useClockTime('seconds');
  const { hours, minutes, seconds } = formatTime(time, '24h');
  const timeString = `${hours}:${minutes}:${seconds}`;

  // Note: Even though useSuspenseFontLoader loads the font, defining the @font-face
  // here ensures the browser maps the family name correctly in all contexts.
  // We use font-display: block to prevent FOUT if suspense boundary isn't hit.
  const fontStyle = `
    @font-face { font-family: 'TodayFont'; src: url(${todayFont251125}) format('truetype'); font-display: block; }
  `;

  const topImageSize = '90% auto'; // front image size
  const backImageSize = '380% auto'; // back image size

  const containerStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundImage: `url(${bgFront}), url(${bgBack})`,
    backgroundRepeat: 'no-repeat, no-repeat',
    // front (center), back (10vw left)
    backgroundPosition: 'center center, calc(50% - 4vw) center',
    backgroundSize: `${topImageSize}, ${backImageSize}`,
    backgroundColor: '#000',
  };

  const mirroredClockStyle = {
    fontFamily: 'TodayFont, monospace',
    fontSize: '15vw',
    color: '#F70E12E5',
    textShadow: '1px 1px 0px #F1EAEBA0, -1px -1px 0px #0E0D0DFF',
    transform: 'scaleX(-1) translateX(-1vw)',
    zIndex: 2,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '0.5vw',
  };

  return (
    <main style={containerStyle}>
      <style>{fontStyle}</style>
      <time dateTime={timeString} style={mirroredClockStyle}>
        {timeString.split('').map((char, index) => (
          <span
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: char === ':' ? '4vw' : '11vw',
            }}
          >
            {char}
          </span>
        ))}
      </time>
    </main>
  );
}
