import { useState, useEffect, useRef } from 'react';

import backgroundImage from '@/assets/images/26_images/26-01/26-01-27/pan.jpg';
import panFont from '@/assets/fonts/26fonts/26-01-27-pan.ttf';
import { useClock } from '@/utils/hooks';
export const assets = [backgroundImage, panFont];

export default function PanoramaClock() {
  const [timeString, setTimeString] = useState<any>('');
  const [bgDuration, setBgDuration] = useState<number>(0);
  const imgRef = useRef(null);

  const uniqueFontFamily = 'PanoramaClock_26-01-27';
  const fontLoaded = useEnhancedFontLoader(uniqueFontFamily, panFont);

  // 1. Calculate Background Speed based on Image Width
  const handleImageLoad =  () => {
    if (imgRef.current) {
      const width = imgRef.current.offsetWidth;
      const speed = 9; // Pixels per second (very slow scrolling)
      setBgDuration(width / speed);
    }
  };

  // 2. Inject Styles (animation only, no font-face)
  useEffect(() => {
      updateTime();
    }, [time]);

  if (!fontLoaded) return null;

  const clockGroup = (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="pz-clock-display">
          {timeString}
        </div>
      ))}
    </div>
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        backgroundColor: '#000',
      }}
    >
      {/* BACKGROUND LAYER */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          className="pz-bg-container"
          style={{ animationDuration: `${bgDuration}s` }}
        >
          <img
            decoding="async"
            loading="lazy"
            ref={imgRef}
            onLoad={handleImageLoad}
            src={backgroundImage}
            alt="panorama-1"
            style={{ height: '100%', display: 'block' }}
          />
          <img
            decoding="async"
            loading="lazy"
            src={backgroundImage}
            alt="panorama-2"
            style={{ height: '100%', display: 'block' }}
          />
        </div>
      </div>

      {/* CLOCK LAYER (Opposite Direction) */}
      <div
        style={{
          position: 'absolute',
          bottom: '1dvh',
          left: 0,
          zIndex: 10,
        }}
      >
        <div className="pz-clock-wrapper">
          {clockGroup}
          {clockGroup}
        </div>
      </div>
    </div>
  );
}
