// src/components/PyramidzBackground.jsx
import { useState, useEffect } from 'react';
// Vite public folder imports (root-relative → auto-hashed in prod)
import backgroundImage from '../../assets/clocks/26-01-05/pyr.webp';
import gizaFont from '../../assets/fonts/26-01-05-giza.otf';

export default function PyramidzBackground() {
  const [fontReady, setFontReady] = useState(false);
  const [timeString, setTimeString] = useState('');

  // Generate unique font-family name: Giza_20260107
  const dateStr = '20260107'; // January 07, 2026
  const uniqueFontFamily = `Giza_${dateStr}`;

  // 1. Inject @font-face once + marquee styles (cleaned up on unmount)
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${uniqueFontFamily}';
        src: url(${gizaFont}) format('opentype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
      .pz-marquee-wrapper {
        display: flex;
        width: fit-content;
        animation: pz-marquee 1000s linear infinite;
        margin-top: -12vh;
      }
      .pz-marquee-group {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        white-space: nowrap;
        
        /* 1. LOWER TEXT OPACITY: Reduced from 58 to 15 (hex) */
        color: rgba(242, 208, 38, 0.04); 
        
        font-family: '${uniqueFontFamily}', system-ui, sans-serif;
        font-size: 130vh;
        letter-spacing: -3vh;

        /* 2. STRONGER SHADOWS: Increased alpha values significantly */
        text-shadow:
          -1vh -1vh 0vh rgba(65, 106, 241, 0.29),   /* Deep Blue - 80% opaque */
          1vh 1vh 0vh rgba(249, 200, 23, 0.12);   /* Red - 60% opaque */
      }
      @keyframes pz-marquee {
        0%   { transform: translateX(0);    }
        100% { transform: translateX(-50%); }
      }
    `;
    document.head.appendChild(style);

    // Cleanup
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, [uniqueFontFamily]);

  // 2. Wait for font to be usable
  useEffect(() => {
    if (!document.fonts) {
      setFontReady(true);
      return;
    }

    let mounted = true;
    document.fonts
      .load(`12px ${uniqueFontFamily}`)
      .then(() => {
        if (mounted) setFontReady(true);
      })
      .catch((err) => {
        console.warn(' ', err);
        if (mounted) setFontReady(true);
      });

    return () => {
      mounted = false;
    };
  }, [uniqueFontFamily]);

  // 3. Clock update
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
      });
      const formatted = time
        .replace(/^0/, '')
        .replace(/\s+/g, '');
      setTimeString(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Block render until font is confirmed loaded
  if (!fontReady) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100dvh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        // Fade in once ready
        animation: 'pzFadeIn 125ms ease-out forwards',
      }}
    >
      <style>{`
        @keyframes pzFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .pz-background::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image: url(${backgroundImage});
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          /* Filter applied ONLY to background image */
          filter: brightness(0.7) contrast(1.5);
        }
      `}</style>
      <div className="pz-background" style={{ position: 'absolute', inset: 0 }}></div>

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          overflow: 'hidden',
          pointerEvents: 'none',
        }}
      >
        <div className="pz-marquee-wrapper">
          <div className="pz-marquee-group">
            {timeString.repeat(20)}
          </div>
          <div className="pz-marquee-group">
            {timeString.repeat(20)}
          </div>
        </div>
      </div>
    </div>
  );
}
