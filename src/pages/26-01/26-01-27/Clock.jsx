import { useState, useEffect } from 'react';
import backgroundImage from '../../../assets/clocks/26-01-27/pan.jpg';
import gizaFont from '../../../assets/fonts/26-01-27-pan.ttf';

export default function PanoramaClock() {
  const [fontReady, setFontReady] = useState(false);
  const [timeString, setTimeString] = useState('');

  const dateStr = '20260107';
  const uniqueFontFamily = `Giza_${dateStr}`;

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

      /* Background Container: Exactly 200% width of viewport */
      .pz-bg-container {
        display: flex;
        height: 100%;
        width: 200vw; 
        animation: pz-bg-scroll 30s linear infinite;
        will-change: transform;
      }

      .pz-bg-half {
        width: 100vw;
        height: 100%;
        background-image: url(${backgroundImage});
        background-size: cover; 
        background-repeat: no-repeat;
        background-position: center center;
      }

      @keyframes pz-bg-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-100vw); }
      }

      .pz-clock-display {
        color: rgba(10, 152, 168, 0.9);
        font-family: '${uniqueFontFamily}', monospace;
        font-size: 10vh; 
        padding-right: 5vh; /* Spacing between time instances */
        text-shadow:
          -1px -1px 0vh rgba(235, 236, 240, 0.99),
          1px 1px  0vh rgba(247, 247, 245, 0.98);
        user-select: none;
        white-space: nowrap;
      }

      /* Infinite Text Ribbon */
      .pz-clock-wrapper {
        display: flex;
        width: max-content;
        animation: clockScroll 40s linear infinite;
        will-change: transform;
      }

      @keyframes clockScroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); } 
      }
    `;
    document.head.appendChild(style);
    return () => { if (style.parentNode) document.head.removeChild(style); };
  }, [uniqueFontFamily]);

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

  // Render a few instances to fill the width
  const clockGroup = (
    <div style={{ display: 'flex' }}>
      {Array.from({ length: 8 }, (_, i) => (
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
      <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
        <div className="pz-bg-container">
          <div className="pz-bg-half" />
          <div className="pz-bg-half" />
        </div>
      </div>

      {/* CLOCK LAYER */}
      <div
        style={{
          position: 'absolute',
          bottom: '5vh',
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