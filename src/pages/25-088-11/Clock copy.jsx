import React, { useState, useEffect } from 'react';
import orbitronFont from './line.ttf'; // Your local font file
import featuredImage from './f.gif'; // Your local image file

// Create a style tag with font-face scoped inside component using a React style element + a unique class
const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) =>
    date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

  const formatDate = (date) =>
    date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Unique classname prefix to avoid style leakage
  const prefix = 'digital-clock';

  // Scoped styles object (inline styles for parts where possible)
  const styles = {
    container: {
      minHeight: '100vh',
      background:
        'linear-gradient(135deg, #0f172a 0%, #5b21b6 50%, #0f172a 100%)',
      fontFamily: `'Orbitron', monospace`,
      color: '#22d3ee', // cyan-400
      display: 'flex',
      flexDirection: 'column',
    },
    mobileHeader: {
      width: '100vw',
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(0.5rem)',
      borderBottom: '0.15rem solid rgba(6,182,212,0.3)', // cyan-400/30
      padding: '1rem',
      textAlign: 'center',
    },
    mobileTime: {
      fontWeight: 700,
      fontSize: '2rem', // ~32px
      letterSpacing: '0.15rem',
      marginBottom: '0.25rem',
    },
    mobileDate: {
      fontSize: '1rem',
      opacity: 0.7,
    },
    mobileImageContainer: {
      padding: '1rem',
      minHeight: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageWrapper: {
      position: 'relative',
      borderRadius: '1rem',
      overflow: 'visible',
      cursor: 'pointer',
    },
    imageGlow: {
      position: 'absolute',
      top: '-0.25rem',
      bottom: '-0.25rem',
      left: '-0.25rem',
      right: '-0.25rem',
      borderRadius: '1rem',
      background:
        'linear-gradient(90deg, #06b6d4, #8b5cf6)', // cyan to purple gradient
      filter: 'blur(1rem)',
      opacity: 0.3,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
    },
    imageGlowHover: {
      opacity: 0.6,
    },
    image: {
      width: '90vw',
      maxWidth: '40rem', // ~640px but rem-based (40 * 16px default)
      height: '42vh',
      objectFit: 'cover',
      borderRadius: '1rem',
      boxShadow:
        '0 0 2rem rgba(0,0,0,0.7)',
      position: 'relative',
      zIndex: 1,
    },
    desktopWrapper: {
      display: 'none',
      height: '100vh',
    },
    desktopWrapperActive: {
      display: 'flex',
      flexDirection: 'row',
    },
    desktopImageContainer: {
      flex: 1,
      padding: '2rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    desktopImage: {
      width: '80vw',
      maxWidth: '50rem', // ~800px
      height: '48vh',
      objectFit: 'cover',
      borderRadius: '1rem',
      boxShadow:
        '0 0 2rem rgba(0,0,0,0.7)',
      position: 'relative',
      zIndex: 1,
    },
    desktopGlow: {
      position: 'absolute',
      top: '-0.25rem',
      bottom: '-0.25rem',
      left: '-0.25rem',
      right: '-0.25rem',
      borderRadius: '1rem',
      background:
        'linear-gradient(90deg, #06b6d4, #8b5cf6)',
      filter: 'blur(1rem)',
      opacity: 0.3,
      transition: 'opacity 0.3s ease',
      pointerEvents: 'none',
      zIndex: 0,
    },
    desktopClockContainer: {
      width: '20rem', // 20 * 16 = 320px approx, but rem-based
      backgroundColor: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(0.5rem)',
      borderLeft: '0.15rem solid rgba(6,182,212,0.3)',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: '#22d3ee',
    },
    desktopTimeVertical: {
      fontWeight: 900,
      fontSize: '4rem',
      letterSpacing: '0.25rem',
      lineHeight: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      userSelect: 'none',
      marginBottom: '2rem',
    },
    timeSegment: {
      marginBottom: '0.5rem',
      textAlign: 'center',
    },
    colon: {
      color: 'rgba(34, 211, 238, 0.3)', // cyan-300/50
      fontSize: '2rem',
      userSelect: 'none',
      lineHeight: 1,
      marginBottom: '0.5rem',
    },
    dateTop: {
      fontSize: '1.25rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
    },
    dateBottom: {
      fontSize: '1rem',
      opacity: 0.7,
      lineHeight: 1.4,
      textAlign: 'center',
    },
    borderTop: {
      borderTop: '0.15rem solid rgba(6,182,212,0.3)',
      paddingTop: '1.5rem',
      width: '100%',
      marginBottom: '1.5rem',
    },
    pulseDotsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '0.5rem',
    },
    pulseDot: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      backgroundColor: '#22d3ee',
      animation: 'pulse 1.2s infinite',
    },
  };

  // Add animation delay styles dynamically for dots
  const pulseDotStyle = (delay) => ({
    ...styles.pulseDot,
    animationDelay: delay,
  });

  // Media query handling for display toggling
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle hover glow effect for images
  const [hovered, setHovered] = useState(false);

  return (
    <>
      {/* Scoped font-face for local font */}
      <style>{`
        @font-face {
          font-family: 'Orbitron';
          src: url(${orbitronFont}) format('truetype');
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.4;
            transform: scale(0.8);
          }
        }
      `}</style>

      <div style={styles.container} className={prefix}>
        {/* Mobile Layout */}
        {!isLargeScreen && (
          <>
            <div style={styles.mobileHeader}>
              <div style={styles.mobileTime}>{formatTime(time)}</div>
              <div style={styles.mobileDate}>{formatDate(time)}</div>
            </div>

            <div style={styles.mobileImageContainer}>
              <div
                style={styles.imageWrapper}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <div
                  style={{
                    ...styles.imageGlow,
                    ...(hovered ? styles.imageGlowHover : {}),
                  }}
                />
                <img
                  src={featuredImage}
                  alt="Featured content"
                  style={styles.image}
                />
              </div>
            </div>
          </>
        )}

        {/* Desktop Layout */}
        {isLargeScreen && (
          <div style={{ ...styles.desktopWrapper, ...styles.desktopWrapperActive }}>
            <div
              style={styles.desktopImageContainer}
              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <div style={{ position: 'relative' }}>
                <div
                  style={{
                    ...styles.desktopGlow,
                    ...(hovered ? { opacity: 0.6 } : {}),
                  }}
                />
                <img src={featuredImage} alt="Featured content" style={styles.desktopImage} />
              </div>
            </div>

            <div style={styles.desktopClockContainer}>
              <div style={styles.desktopTimeVertical}>
                {formatTime(time)
                  .split(':')
                  .map((segment, index) => (
                    <div key={index} style={styles.timeSegment}>
                      {segment}
                      {index < 2 && <div style={styles.colon}>:</div>}
                    </div>
                  ))}
              </div>

              <div style={styles.borderTop}>
                <div style={styles.dateTop}>{formatDate(time).split(',')[0]}</div>
                <div style={styles.dateBottom}>
                  {formatDate(time).split(',').slice(1).join(',').trim()}
                </div>
              </div>

              <div style={styles.pulseDotsContainer}>
                {[0, 0.3, 0.6].map((delay, i) => (
                  <div key={i} style={pulseDotStyle(`${delay}s`)} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DigitalClock;
