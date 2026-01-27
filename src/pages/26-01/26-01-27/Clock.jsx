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

      .pz-bg-wrapper {
        position: absolute;
        inset: 0;
        overflow: hidden;
        background-color: #000;
      }

      .pz-bg-container {
        display: flex;
        height: 100%;
        /* Use 200% width of the container to hold two images side-by-side */
        width: 200%; 
        animation: pz-bg-scroll 30s linear infinite;
        will-change: transform;
      }

      .pz-bg-half {
        flex: 0 0 100%;
        height: 100%;
        background-image: url(${backgroundImage});
        background-size: cover; 
        background-repeat: no-repeat;
        background-position: center center;
      }

      @keyframes pz-bg-scroll {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); } /* Move by half the container width (one full image) */
      }

      .pz-clock-display {
        color: rgba(4, 137, 220, 0.9);
        font-family: '${uniqueFontFamily}', monospace;
        font-size: 10vh; 
        letter-spacing: 1vh;
        text-shadow:
          -1px -1px 0vh rgba(235, 236, 240, 0.99),
          1px 1px  0vh rgba(246, 213, 22, 0.98);
        user-select: none;
        white-space: nowrap;
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

  // We only need enough instances to cover 200% of the screen width for a seamless loop
  const clockInstances = Array.from({ length: 10 }, (_, i) => (
    <div key={i} className="pz-clock-display">{timeString}</div>
  ));

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
      <div className="pz-bg-wrapper">
        <div className="pz-bg-container">
          <div className="pz-bg-half" />
          <div className="pz-bg-half" />
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          display: 'flex',
          transform: 'translateY(-50%)',
          animation: 'clockScroll 20s linear infinite',
          zIndex: 10,
        }}
      >
        {/* Render twice to create the infinite loop effect */}
        <div style={{ display: 'flex' }}>{clockInstances}</div>
        <div style={{ display: 'flex' }}>{clockInstances}</div>
      </div>
    </div>
  );
}