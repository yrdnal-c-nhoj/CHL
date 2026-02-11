import { useState, useEffect, useRef } from 'react';
import backgroundImage from '../../../assets/images/26-01-27/pan.jpg';
import gizaFont from '../../../assets/fonts/26-01-27-pan.ttf';

export default function PanoramaClock() {
  const [fontReady, setFontReady] = useState(false);
  const [timeString, setTimeString] = useState('');
  const [bgDuration, setBgDuration] = useState(0);
  const imgRef = useRef(null);

  const dateStr = '20260107';
  const uniqueFontFamily = `Giza_${dateStr}`;

  // 1. Calculate Background Speed based on Image Width
  const handleImageLoad = () => {
    if (imgRef.current) {
      const width = imgRef.current.offsetWidth;
      const speed = 9; // Pixels per second (very slow scrolling)
      setBgDuration(width / speed);
    }
  };

  // 2. Inject Styles (including reversed clock animation)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${uniqueFontFamily}';
        src: url(${gizaFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

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
        font-family: '${uniqueFontFamily}', monospace;
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
    return () => { if (style.parentNode) document.head.removeChild(style); };
  }, [uniqueFontFamily]);

  // 3. Load Font
  useEffect(() => {
    const loadFont = async () => {
      try {
        if (document.fonts) await document.fonts.load(`12px ${uniqueFontFamily}`);
      } catch (e) {
        console.warn(e);
      } finally {
        setFontReady(true);
      }
    };
    loadFont();
  }, [uniqueFontFamily]);

  // 4. Update Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toLocaleTimeString('en-US', {
        hour12: true, 
        hour: 'numeric', 
        minute: '2-digit'
      }).replace(' ', ''));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!fontReady) return null;

  const clockGroup = (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className="pz-clock-display">{timeString}</div>
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
          <img decoding="async" loading="lazy" 
            ref={imgRef}
            onLoad={handleImageLoad}
            src={backgroundImage} 
            alt="panorama-1" 
            style={{ height: '100%', display: 'block' }} 
          />
          <img decoding="async" loading="lazy" 
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