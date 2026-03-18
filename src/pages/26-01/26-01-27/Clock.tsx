import { useState, useEffect, useRef } from 'react';
import { useEnhancedFontLoader } from '../../../utils/enhancedFontLoader';
import backgroundImage from '../../../assets/images/26-01/26-01-27/pan.jpg';
import panFont from '../../../assets/fonts/26-01-27-pan.ttf';

export default function PanoramaClock() {
  const [timeString, setTimeString] = useState<any>('');
  const [bgDuration, setBgDuration] = useState<number>(0);
  const imgRef = useRef(null);

  const uniqueFontFamily = 'PanoramaClock_26-01-27';
  const fontLoaded = useEnhancedFontLoader(uniqueFontFamily, panFont);

  // 1. Calculate Background Speed based on Image Width
  const handleImageLoad: React.FC = () => {
    if (imgRef.current) {
      const width = imgRef.current.offsetWidth;
      const speed = 9; // Pixels per second (very slow scrolling)
      setBgDuration(width / speed);
    }
  };

  // 2. Inject Styles (animation only, no font-face)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      /* Background scrolls LEFT (0 to -50%) */
      .pz-bg-container {
        display: flex;
        height: 100dvh;
        width: max-content;
        animation: pz-bg-scroll  linear infinite;
        will-change: transform;
      }

      @keyframes pz-bg-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }

      /* Clock scrolls RIGHT (-50% to 0) */
      .pz-clock-wrapper {
        display: flex;
        width: max-content;
        animation: clockScroll 120s linear infinite;
        will-change: transform;
      }

      @keyframes clockScroll {
        0%   { transform: translateX(-50%); } 
        100% { transform: translateX(0); }
      }

      .pz-clock-display {
        color: rgba(10, 152, 168, 0.9);
        font-family: ${fontLoaded ? `'${uniqueFontFamily}', monospace` : 'monospace'};
        font-size: 15vh; 
        padding-right: 2vh;
        text-shadow:
          0px 2px 0vh rgba(235, 236, 240, 0.99),
          0px -2px 0vh rgba(247, 247, 245, 0.98);
        user-select: none;
        white-space: nowrap;
        opacity: 0.8;
      }
    `;
    document.head.appendChild(style);
    return () => {
      if (style.parentNode) document.head.removeChild(style);
    };
  }, [uniqueFontFamily, fontLoaded]);

  // 3. Update Time
  useEffect(() => {
    const updateTime: React.FC = () => {
      const now = new Date();
      setTimeString(
        now
          .toLocaleTimeString('en-US', {
            hour12: true,
            hour: 'numeric',
            minute: '2-digit',
          })
          .replace(' ', ''),
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

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
          bottom: '1vh',
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
