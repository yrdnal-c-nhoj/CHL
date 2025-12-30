import { useEffect, useState, useCallback } from 'react';

// Global styles for fade-in effect
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// ⏳ Assets (ensure these are in your /src folder)
import bgImage from './sat.webp';
import overlayImage from './scythe.webp';

// 🔤 Font configuration
const FONT_PATH = './sat.ttf'
const FONT_FAMILY = 'SaturnFont'

export default function SaturnClock() {
  const [fontReady, setFontReady] = useState(false)
  const [now, setNow] = useState(new Date())

  // ⏱ Clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // 🔤 Font loading with fallback
  const loadFont = useCallback(async () => {
    if (typeof document === 'undefined') return;
    
    try {
      const fontUrl = new URL(FONT_PATH, import.meta.url).href;
      const style = document.createElement('style');
      style.textContent = `
        @font-face {
          font-family: '${FONT_FAMILY}';
          src: url('${fontUrl}') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: optional;
        }
      `;
      
      document.head.appendChild(style);
      
      // Use FontFace API for better control
      const font = new FontFace(FONT_FAMILY, `url(${fontUrl})`, {
        style: 'normal',
        weight: '400',
        display: 'optional'
      });
      
      try {
        await font.load();
        document.fonts.add(font);
        setFontReady(true);
      } catch (e) {
        console.error('Font loading failed:', e);
        setFontReady(true); // Continue with fallback
      }
      
      return () => {
        document.head.removeChild(style);
      };
    } catch (e) {
      console.error('Font setup error:', e);
      setFontReady(true); // Continue with fallback
    }
  }, []);

  useEffect(() => {
    loadFont();
  }, [loadFont]);

  // Show loading state with black background
  if (!fontReady) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.7)'
      }} />
    );
  }

  // ⌛ Time formatting
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        opacity: 0,
        animation: 'fadeIn 0.5s ease-in forwards',
      }}
    >
      {/* 1. Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      />
      >
        <img
          src={bgImage}
          alt="Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            // Applying filter directly to image for best results
            // filter: 'grayscale(40%) saturate(220%) brightness(5.7)',
          }}
        />
      </div>

      {/* 2. Overlay Images (Scythes) */}
      <img
        src={overlayImage}
        alt="Scythe Top"
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          height: 'auto',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5,
        }}
      />
      
      <img
        src={overlayImage}
        alt="Scythe Bottom"
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(180deg)',
          width: '85vw',
          height: 'auto',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5,
        }}
      />
      
      {/* 3. Time Display Layer */}
      <div
        style={{
          zIndex: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 'min(20vw, 20vh)',
            letterSpacing: '0.05em',
            color: '#9CB5B8',
            textAlign: 'center',
            opacity: 0.4,
            textShadow: '0 0 20px rgba(0,0,0,0.5)',
            userSelect: 'none',
          }}
        >
          <div>{hh}</div>
          <div style={{ marginTop: '-2vh' }}>{mm}</div>
        </div>
      </div>
    </div>
  )
}