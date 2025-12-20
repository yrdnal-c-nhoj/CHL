import React, { useEffect, useState } from 'react';
import iceFont from './ice.ttf'; // import font as module
import BG_IMAGE_PATH from './forest.jpeg';

const FONT_FAMILY = 'DigitalClock';

export default function VerticalDigitalClock() {
  const [now, setNow] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // 1️⃣ Clock Timer
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 2️⃣ Font loading
  useEffect(() => {
    // Inject the font-face
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${FONT_FAMILY}';
        src: url('${iceFont}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    // Wait for the font to load
    document.fonts
      .load(`16px '${FONT_FAMILY}'`)
      .then(() => setFontLoaded(true))
      .catch(() => setFontLoaded(true)); // fallback even if load fails

    return () => {
      if (style.parentNode) style.parentNode.removeChild(style);
    };
  }, []);

  const pad = (num) => String(num).padStart(2, '0');
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const allDigits = [...hours, ...minutes, ...seconds];

  if (!fontLoaded) return null; // don't render until font is loaded

  return (
    <div
      style={{
        ...styles.root,
        backgroundImage: `url(${BG_IMAGE_PATH})`,
      }}
    >
      <div style={styles.clockContainer}>
        {allDigits.map((digit, i) => (
          <div
            key={i}
            style={{
              ...styles.digitBox,
              fontFamily: `'${FONT_FAMILY}', monospace`,
            }}
          >
            {digit}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  root: {
    position: 'fixed',
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'env(safe-area-inset)',
  },
  clockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5vh',
    maxHeight: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  digitBox: {
    fontSize: 'min(15vh, 26vw)',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    color: '#C2D2F5FF',
    textShadow: '0px 3px 0px #095477FF, 0px -3px 0px #F8F9FAFF, -1px -1px 3px #050009FF',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    lineHeight: 1,
    flexShrink: 0,
  },
};
