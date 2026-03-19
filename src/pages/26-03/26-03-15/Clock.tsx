import React, { useState, useEffect, useMemo } from 'react';
import { useMultipleFontLoader } from '../../../utils/fontLoader';
import fontUrl from '../../../assets/fonts/26-03-15-shadow.otf';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  // Standardized font loading with font-display: swap to avoid FOUC
  const fontConfigs = [
    {
      fontFamily: '26-03-15-shadow',
      fontUrl: fontUrl,
      options: {
        weight: 'normal',
        style: 'normal'
      }
    }
  ];
  const fontsReady = useMultipleFontLoader(fontConfigs);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute values once per second
  const { digits, rotation } = useMemo(() => {
    const h = time.getHours().toString().padStart(2, '0');
    const m = time.getMinutes().toString().padStart(2, '0');
    const s = time.getSeconds().toString().padStart(2, '0');

    return {
      digits: [h[0], h[1], m[0], m[1], s[0], s[1]],
      rotation: -(time.getSeconds() / 60) * 360,
    };
  }, [time]);

  // Responsive sizing for better mobile centering
  const getResponsiveSize = () => {
    if (typeof window === 'undefined') return { width: 380, scale: 1 };
    
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    const isMobile = vw <= 480;
    const isSmallScreen = vw <= 768;
    
    if (isMobile) {
      return { width: Math.min(vw * 0.9, 320), scale: 0.8 }; // 90% width, scaled down
    } else if (isSmallScreen) {
      return { width: Math.min(vw * 0.8, 350), scale: 0.9 }; // 80% width, slightly scaled
    } else {
      return { width: Math.min(vw * 0.85, 420), scale: 1 }; // 85% width, full scale
    }
  };

  const responsive = getResponsiveSize();

  // Define styles after responsive is calculated
  const styles = {
    container: {
      minHeight: '100dvh',
      background:
        'radial-gradient(circle at center, #D3AEE7 0%, #CA79A1 30%, #A5DEDF 60%, #DCE77A 80%, #D4A64A 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
      border: '25px solid #FF1493',
      boxSizing: 'border-box',
    },
    wrapper: {
      display: 'flex',
      alignItems: 'baseline',
    },
    digitBox: {
      display: 'inline-block',
      width: `${responsive.width}px`, // Use responsive width instead of vw
      textAlign: 'center',
      transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', // Snappy rotation
      willChange: 'transform',
      zIndex: 2,
      transform: `scale(${responsive.scale})`, // Apply responsive scale
    },
    text: {
      fontFamily:
        '"26-03-15-shadow", "Avant Garde", "Century Gothic", sans-serif',
      color: '#1C0210',
      fontSize: `${responsive.width * 0.08}px`, // Responsive font size (8% of container width)
      margin: 0,
      filter: 'url(#deep-shadow)', // Applying the SVG filter here
      lineHeight: 1,
    },
  };

  // Show loading state while font loads
  if (!fontsReady) {
    return (
      <div style={{
        minHeight: '100dvh',
        background: 'radial-gradient(circle at center, #D3AEE7 0%, #CA79A1 30%, #A5DEDF 60%, #DCE77A 80%, #D4A64A 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        border: '25px solid #FF1493',
        boxSizing: 'border-box',
        color: '#1C0210',
        fontFamily: 'sans-serif'
      }}>
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* High-Performance SVG Shadow Filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="deep-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="8" result="blur" />
          <feOffset dx="0" dy="0" result="offsetBlur" />
          <feFlood floodColor="#FF69B4" result="color" />
          <feComposite
            in="color"
            in2="offsetBlur"
            operator="in"
            result="shadow"
          />

          {/* Layering for extreme length and darkness */}
          <feMorphology
            operator="dilate"
            radius="5"
            in="shadow"
            result="expandedShadow"
          />
          <feGaussianBlur
            in="expandedShadow"
            stdDeviation="40"
            result="finalBlur"
          />

          <feMerge>
            <feMergeNode in="finalBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </svg>

      <div className="clock-26-03-15" style={styles.container}>
        <div style={styles.wrapper}>
          {digits.map((digit, i) => (
            <div
              key={i}
              style={{
                ...styles.digitBox,
                transform: `rotate(${rotation}deg)`,
              }}
            >
              <span style={styles.text}>{digit}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Clock;
