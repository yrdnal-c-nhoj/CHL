import React, { useEffect, useState } from 'react';

// Define paths as constants. In Vite, files in /public are served from the root /
const FONT_PATH = '/assets/ice.ttf';
const BG_IMAGE_PATH = '/assets/forest.jpeg';
const FONT_FAMILY = 'ClockFont251215';

export default function VerticalDigitalClock() {
  const [now, setNow] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // 1. Clock Timer
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // 2. Robust Font Loading
  useEffect(() => {
    const loadFont = async () => {
      try {
        // Use the FontFace API to load the font from the public folder
        const font = new FontFace(FONT_FAMILY, `url(${FONT_PATH})`);
        const loadedFace = await font.load();
        document.fonts.add(loadedFace);
        setFontLoaded(true);
      } catch (err) {
        console.error('Font loading failed, falling back to system font:', err);
        setFontLoaded(true); // Reveal clock anyway so it's not invisible
      }
    };

    loadFont();
  }, []);

  const pad = (num) => String(num).padStart(2, '0');
  const hours = pad(now.getHours());
  const minutes = pad(now.getMinutes());
  const seconds = pad(now.getSeconds());
  const allDigits = [...hours, ...minutes, ...seconds];

  return (
    <div style={{ ...styles.root, backgroundImage: `url(${BG_IMAGE_PATH})` }}>
      {/* Global Style Injection for the @font-face */}
      <style>
        {`
          @font-face {
            font-family: '${FONT_FAMILY}';
            src: url('${FONT_PATH}') format('truetype');
            font-display: block;
          }
        `}
      </style>

      <div style={styles.clockContainer}>
        {allDigits.map((digit, i) => (
          <div
            key={i}
            style={{
              ...styles.digitBox,
              opacity: fontLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease-in',
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
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // Added safe area insets for mobile notched devices
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
  },
  clockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5vh',
    maxHeight: '100%',
    padding: '20px',
    boxSizing: 'border-box',
  },
  digitBox: {
    fontFamily: `${FONT_FAMILY}, serif`,
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