import React, { useState, useEffect, useMemo } from 'react';

const RotatingAnalemmaClock = () => {
  const [time, setTime] = useState(new Date());
  const [rotation, setRotation] = useState(0);
  const [isReady, setIsReady] = useState(false);

  // 1. Generate Unique Font Family Name
  const fontFamilyName = useMemo(() => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `Font_${today}_${randomStr}`;
  }, []);

  useEffect(() => {
    // 2. Inject @font-face and Global Styles
    const styleElement = document.createElement('style');
    styleElement.id = `style-${fontFamilyName}`;
    styleElement.innerHTML = `
      @font-face {
        font-family: '${fontFamilyName}';
        src: url('/fonts/25-12-30-analemma.ttf') format('truetype');
        font-display: block;
      }
      @font-face {
        font-family: 'AnaFont';
        src: url('/fonts/25-12-27-ana.ttf') format('truetype');
        font-display: block;
      }
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
    `;
    document.head.appendChild(styleElement);

    // 3. Wait for Font Loading
    document.fonts.load(`1em ${fontFamilyName}`)
      .then(() => {
        // Successful load
        setIsReady(true);
      })
      .catch((err) => {
        console.error("Font failed to load:", err);
        setIsReady(true); // Proceed with fallback font
      });

    // 4. Clock Interval
    const timer = setInterval(() => {
      const now = new Date();
      setTime(now);
      
      // Calculate rotation: 360 degrees over 60 seconds (counter-clockwise)
      const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
      setRotation(-(seconds / 60) * 360);
    }, 100);

    // 5. Cleanup on Unmount
    return () => {
      clearInterval(timer);
      const injectedStyle = document.getElementById(`style-${fontFamilyName}`);
      if (injectedStyle) injectedStyle.remove();
    };
  }, [fontFamilyName]);

  const calculateAnalemma = (dayOfYear) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    // Standard Declination formula
    const declination = 23.44 * Math.sin(toRad((360 / 365) * (dayOfYear - 81)));
    const B = toRad((360 / 365) * (dayOfYear - 81));
    // Equation of Time formula
    const eot = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
    
    return {
      // Centered on 150 (middle of 300 width)
      x: 150 + (eot * 4), 
      y: 150 - (declination * 5),
      rawEot: eot,
      rawDec: declination
    };
  };

  const { pathData, currentPos } = useMemo(() => {
    let points = [];
    for (let i = 0; i <= 365; i++) {
      const pos = calculateAnalemma(i);
      points.push(`${pos.x},${pos.y}`);
    }
    const start = new Date(time.getFullYear(), 0, 0);
    const dayOfYear = Math.floor((time - start) / (1000 * 60 * 60 * 24));
    
    return {
      pathData: `M ${points.join(' L ')}`,
      currentPos: calculateAnalemma(dayOfYear)
    };
  }, [time.getFullYear()]);

  const styles = {
    container: {
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#414343',
      color: '#F9E82D',
      fontFamily: 'monospace',
      margin: 0,
      padding: '2dvh 0',
      overflow: 'hidden',
      boxSizing: 'border-box',
      position: 'relative',
      opacity: isReady ? 1 : 0,
      transition: 'opacity 0.125s ease-in', // 1/8 second fade-in
    },
    sideLabelLeft: {
      position: 'absolute',
      left: '3vw',
      top: '50%',
      transform: 'translateY(-50%) rotate(180deg)',
      writingMode: 'vertical-rl',
      fontSize: '2.5vh',
      color: '#FDFEFE',
      letterSpacing: '0.2em',
      fontFamily: 'AnaFont, sans-serif',
      fontSize: '3.3vh',
      letterSpacing: '0.2em',
      zIndex: 10
    },
    sideLabelRight: {
      position: 'absolute',
      right: '3vw',
      top: '50%',
      transform: 'translateY(-50%)',
      writingMode: 'vertical-lr',
      fontFamily: 'AnaFont, sans-serif',
      fontSize: '3.3vh',
      color: '#F7FBFB',
      letterSpacing: '0.2em',
      zIndex: 10
    },
    clockContainer: {
      width: '100%',  // padding: '0 2vw',
      boxSizing: 'border-box',
      // marginTop: '2vh',
      zIndex: 5
    },
    clock: {
      display: 'flex',
      justifyContent: 'space-between',
      width: '100%',
      fontFamily: `'${fontFamilyName}', monospace`,
      letterSpacing: '0.1em',
      // fontSize: 'clamp(1rem, 10vw, 8rem)'
    },
    svgWrapper: {
      flex: 1,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 0,
      zIndex: 1 // Lower z-index so side labels stay interactive/visible
    },
    svg: {
      height: '80%',
      width: 'auto',
      maxWidth: '95vw',
      overflow: 'visible' // Key for preventing clipping
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.sideLabelLeft}>
       ekvacio de tempo: {currentPos.rawEot.toFixed(2)} min
      </div>

      <div style={styles.sideLabelRight}>
        sun-deklinacio: {currentPos.rawDec.toFixed(2)}°
      </div>

      <div style={styles.clockContainer}>
        <div style={styles.clock}>
          {(() => {
            const timeStr = time.toLocaleTimeString([], { 
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
              hourCycle: 'h12'
            })
            .replace(':', '')  // Remove colon
            .replace(/([0-9])\s+([AP]M)/, '$1$2')  // Remove space before AM/PM
            .toUpperCase();  // Ensure consistent case
            
            // Split into individual characters and map to spans with equal flex
            return Array.from(timeStr).map((char, index) => (
              <span key={index} style={{ flex: 1, textAlign: 'center' }}>{char}</span>
            ));
          })()}
        </div>
      </div>

      <div style={styles.svgWrapper}>
        {/* Increased viewBox width to 300 to allow for rotation width */}
        <svg viewBox="0 0 300 300" style={styles.svg}>
          {/* Static Background Grid */}
          <line x1="150" y1="0" x2="150" y2="300" stroke="#222" strokeWidth="1" />
          <line x1="0" y1="150" x2="300" y2="150" stroke="#222" strokeWidth="1" />

          {/* Rotating Group - Pivoting on 150, 150 */}
          <g transform={`rotate(${rotation}, 150, 150)`}>
            <path 
              d={pathData} 
              fill="none" 
              stroke="rgba(255, 255, 255)" 
              strokeWidth="2" 
            />
            
            <text x="150" y="10" textAnchor="middle" fill="#F29380" fontSize="18" fontWeight="bold">SOMERO</text>
            <text x="150" y="300" textAnchor="middle" fill="#83F7FB" fontSize="18" fontWeight="bold" transform="rotate(180 150 295)">VINTRO</text>
            
            {/* The dot is placed last so it has the "highest z-index" in the SVG */}
            <circle 
              cx={currentPos.x} 
              cy={currentPos.y} 
              r="22" 
              fill="#FFFF00"
              style={{ filter: 'drop-shadow(0 0 18px #FFFF00)' }}
            />
          </g>
        </svg>
      </div>

      <div style={{ height: '5vh' }} />
    </div>
  );
};

export default RotatingAnalemmaClock;
