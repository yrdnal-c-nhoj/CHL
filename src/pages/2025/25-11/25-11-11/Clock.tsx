// src/components/CustomFontMirroredClock.jsx
import React, { useState, useEffect } from 'react';
import { useSuspenseFontLoader } from '../../../../utils/fontLoader';
import todayFont251125 from '../../../../assets/fonts/25-11-11-digi.ttf?url';
import bgFront from '../../../../assets/images/2025/25-11/25-11-11/bg.webp'; // top layer
import bgBack from '../../../../assets/images/2025/25-11/25-11-11/bg1.jpg'; // back layer

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
  const [time, setTime] = useState(getCurrentTime());

  function getCurrentTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  // Use Suspense loader for fonts
  useSuspenseFontLoader(fontConfigs);

  useEffect(() => {
    let frameId: number;
    const tick = () => {
      setTime(getCurrentTime());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

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
    fontSize: '13vw',
    color: '#F70E12E5',
    textShadow: '1px 1px 0px #F1EAEBA0, -1px -1px 0px #0E0D0DFF',
    transform: 'scaleX(-1) translateX(-1vw)',
    textAlign: 'center',
    zIndex: 2,
  };

  return (
    <div style={containerStyle}>
      <style>{fontStyle}</style>
      <div style={mirroredClockStyle}>{time}</div>
    </div>
  );
}
