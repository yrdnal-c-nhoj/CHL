import React, { useState, useEffect, useCallback, useMemo } from 'react';

/**
 * Digital Clock Component with Optical Illusion Pattern
 * 
 * Features:
 * - Real-time digital clock with hours, minutes, seconds
 * - Optical illusion pattern using repeating conic gradients
 * - Responsive design: stacked on mobile, horizontal on desktop
 * - Individual digit boxes to prevent layout jumping
 * - Red text shadow outline for visual enhancement
 * - Clean, modern React architecture with performance optimizations
 */

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  // Load Google Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Silkscreen&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Check if font is loaded
    const checkFont = () => {
      document.fonts.load('12px Silkscreen').then(() => {
        setFontLoaded(true);
      }).catch(() => {
        setFontLoaded(true); // Fallback
      });
    };
    
    link.onload = checkFont;
    checkFont(); // Also check in case font is already cached
    
    // Fallback timeout in case font loading takes too long
    const fallbackTimeout = setTimeout(() => {
      setFontLoaded(true);
    }, 3000);
    
    return () => {
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Memoize time formatting to prevent unnecessary recalculations
  const timeDigits = useMemo(() => {
    const formatTimeUnit = (unit) => unit.toString().padStart(2, '0');
    
    const hours = formatTimeUnit(time.getHours());
    const minutes = formatTimeUnit(time.getMinutes());
    const seconds = formatTimeUnit(time.getSeconds());

    return {
      hours: hours.split(''),
      minutes: minutes.split(''),
      seconds: seconds.split('')
    };
  }, [time]);

  // Render individual digit with consistent styling
  const Digit = useCallback(({ digit, type, index }) => (
    <span style={digitBoxStyles}>
      {digit}
    </span>
  ), []);

  // Render time unit (hours, minutes, or seconds)
  const TimeUnit = useCallback(({ digits, label }) => (
    <div style={digitalDigitStyles}>
      {digits.map((digit, index) => (
        <Digit 
          key={`${label}-${index}`} 
          digit={digit} 
          type={label} 
          index={index} 
        />
      ))}
    </div>
  ), [Digit]);

  // Styles using regular CSS-in-JS objects
  const containerStyles = {
    '--pixel-size': '130px',
    background: 'repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 32.5px 130px',
    margin: 0,
    display: 'grid',
    minHeight: '100vh',
    placeItems: 'center',
    overflow: 'hidden',
    width: '100vw',
    height: '100dvh',
    opacity: fontLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease'
  };

  const clockWrapperStyles = {
    display: 'flex',
    flexDirection: 'column',
    // gap: '10px',
    alignItems: 'center',
    '@media (min-width: 769px)': {
      flexDirection: 'row',
      // gap: '30px'
    }
  };

  const digitalDigitStyles = {
    fontSize: 'clamp(4rem, 20vw, 15rem)',
    fontFamily: "'Silkscreen', monospace",
    // fontWeight: 'bold',
    lineHeight: 1,
    display: 'flex',
    // gap: '0.05em',
    background: 'repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 32.5px 130px',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(1px 0px 5px #39A94F5C)'
  };

  const digitBoxStyles = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: '0.6em',
    height: '1em',
    background: 'repeating-conic-gradient(#fff 0 25%, #000 0 50%) 0 0 / 32.5px 130px',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    color: 'transparent',
    filter: 'drop-shadow(1px 0px 5px #AA11118A)'
  };

  // Responsive styles
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  if (isMobile) {
    clockWrapperStyles.flexDirection = 'column';
    clockWrapperStyles.gap = '10px';
  } else {
    clockWrapperStyles.flexDirection = 'row';
    clockWrapperStyles.gap = '30px';
  }

  return (
    <div style={containerStyles}>
      <div style={clockWrapperStyles}>
        <TimeUnit digits={timeDigits.hours} label="hours" />
        <TimeUnit digits={timeDigits.minutes} label="minutes" />
        <TimeUnit digits={timeDigits.seconds} label="seconds" />
      </div>
    </div>
  );
};

export default Clock;
