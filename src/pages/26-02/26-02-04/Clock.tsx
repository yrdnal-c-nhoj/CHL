import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useSuspenseFontLoader } from '../../../utils/fontLoader';

// Assets
import digitalFontUrl from '../../../assets/fonts/26-02-04-trans.ttf?url';
import digitalBgImage from '../../../assets/images/26-02/26-02-04/trans.webp';
import backgroundImage from '../../../assets/images/26-02/26-02-04/tran.jpg';

// Custom hook for smooth time updates using requestAnimationFrame
const useSmoothTime = (updateInterval: number = 1000) => {
  const [time, setTime] = useState(new Date());
  const lastUpdateRef = useRef<number>(0);

  useEffect(() => {
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      // Update based on interval to avoid excessive updates
      if (timestamp - lastUpdateRef.current >= updateInterval) {
        setTime(new Date());
        lastUpdateRef.current = timestamp;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [updateInterval]);

  return time;
};

const CONFIG = {
  use24Hour: false,
};

// Interface for time formatting result
interface TimeFormat {
  hh: string;
  mm: string;
}

const DigitalClockTemplate: React.FC = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [animationName, setAnimationName] = useState<string>('');
  const [showContent, setShowContent] = useState(false);

  // Use Suspense-compatible font loading
  useSuspenseFontLoader([
    {
      fontFamily: 'BorrowedDigital',
      fontUrl: digitalFontUrl,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ]);

  // Show content immediately with Suspense
  useEffect(() => {
    setShowContent(true);
  }, []);

  // Use smooth time updates with requestAnimationFrame
  const time = useSmoothTime(1000); // Update every second

  // Time formatting - move before conditional return
  const { hh, mm }: TimeFormat = useMemo(() => {
    const hours24 = time.getHours();
    const hours = CONFIG.use24Hour ? hours24 : hours24 % 12 || 12;
    const pad = (n) => String(n).padStart(2, '0');
    return {
      hh: pad(hours),
      mm: pad(time.getMinutes()),
    };
  }, [time]);

  // Device detection and animation setup - move before conditional return
  useEffect(() => {
    // Device Detection
    const checkDevice = () => setIsMobile(window.innerWidth <= 768);
    checkDevice();
    window.addEventListener('resize', checkDevice);

    // Create unique animation name and scoped style element
    const uniqueAnimationName = `copper-shimmer-${Date.now()}`;
    setAnimationName(uniqueAnimationName);

    const style = document.createElement('style');
    style.textContent = `
      @keyframes ${uniqueAnimationName} {
        0% { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
    `;
    document.head.appendChild(style);

    return () => {
      window.removeEventListener('resize', checkDevice);
      if (style && style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);


  // ────────────────────────────────────────────────
  //                STYLES
  // ────────────────────────────────────────────────

  const containerStyle = {
    position: 'fixed',
    inset: 0,
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    // Suspense handles loading state, no need for manual opacity/visibility toggles
    opacity: 1,
    transition: 'opacity 0.3s ease',
    visibility: 'visible',
  };
  const bgBaseStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundSize: '100% 100%', // Forces the image to stretch to both edges
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  };

  const timeRowStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    gap: isMobile ? '2dvh' : '2vw',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
  };

  const digitStyle = {
    fontSize: isMobile ? '35dvh' : '30vw',
    lineHeight: 1,
    fontFamily: "'BorrowedDigital', monospace",
    fontVariantNumeric: 'tabular-nums',
    userSelect: 'none',

    // 1. The Gradient
    backgroundImage:
      'linear-gradient(90deg, #b87333 0%, #f4a460 25%, #ecc591 50%, #f4a460 75%, #b87333 100%)',
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: animationName ? `${animationName} 4s linear infinite` : 'none',

    // 2. The Border (The Secret Sauce)
    WebkitTextStroke: '0.5vh #43B3AE',
    paintOrder: 'stroke fill', // Draws the stroke first so it doesn't get eaten by the gradient

    // 3. The Safety Net
    // If the stroke is still invisible, this filter will force a 1px "halo"
    filter:
      'drop-shadow(0.5vh 0 0 #43B3AE) drop-shadow(-0.5vh 0 0 #43B3AE) drop-shadow(0 1px 0 #43B3AE) drop-shadow(0 -1px 0 #43B3AE)',
  };
  return (
    <div style={containerStyle}>
      <div
        style={{
          ...bgBaseStyle,
          backgroundImage: `url(${backgroundImage})`,
          zIndex: 1,
        }}
      />
      <div
        style={{
          ...bgBaseStyle,
          backgroundImage: `url(${digitalBgImage})`,
          zIndex: 2,
          filter: 'brightness(100%) saturate(10%)',
        }}
      />

      <div style={timeRowStyle}>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={digitStyle}>{hh[0]}</span>
          <span style={digitStyle}>{hh[1]}</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span style={digitStyle}>{mm[0]}</span>
          <span style={digitStyle}>{mm[1]}</span>
        </div>
      </div>
    </div>
  );
};

export default DigitalClockTemplate;
