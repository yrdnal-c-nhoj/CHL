import React, { useState, useEffect, useRef } from 'react';
import OrbitronFont from './orb.ttf';
import CinzelFont from './cinz.ttf';

const UnixEpochClock = () => {
  const [timestamp, setTimestamp] = useState('');
  const [lastTimestamp, setLastTimestamp] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isDigitChanging, setIsDigitChanging] = useState(false);
  const intervalRef = useRef(null);

  // Inject fonts with @font-face
  useEffect(() => {
    const fontVariation = new Date().getTime(); // Variation based on current time
    
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'OrbitronCustom-${fontVariation}';
        src: url('${OrbitronFont}') format('woff2');
        font-weight: 100 900;
        font-display: block;
      }
      
      @font-face {
        font-family: 'CinzelCustom-${fontVariation}';
        src: url('${CinzelFont}') format('woff2');
        font-weight: 100 900;
        font-display: block;
      }
    `;
    
    document.head.appendChild(style);

    // Preload fonts
    const preloadFont = (url, family) => {
      return new Promise((resolve) => {
        const font = new FontFace(family, `url(${url})`);
        font.load().then(() => {
          document.fonts.add(font);
          resolve();
        }).catch(() => resolve()); // Continue even if font fails
      });
    };

    Promise.all([
      preloadFont(OrbitronFont, `OrbitronCustom-${fontVariation}`),
      preloadFont(CinzelFont, `CinzelCustom-${fontVariation}`)
    ]).then(() => {
      setFontLoaded(true);
    });

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Update timestamp
  useEffect(() => {
    if (!fontLoaded) return;

    const updateTime = () => {
      const now = Math.floor(Date.now() / 1000);
      const newTimestamp = now.toString();
      
      if (lastTimestamp !== newTimestamp) {
        setIsDigitChanging(true);
        setTimeout(() => setIsDigitChanging(false), 500);
      }
      
      setTimestamp(newTimestamp);
      setLastTimestamp(newTimestamp);
    };

    updateTime();
    intervalRef.current = setInterval(updateTime, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [fontLoaded, lastTimestamp]);

  // Generate particles
  const generateParticles = () => {
    return Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 0.375 + 0.125, // 0.125rem to 0.5rem
      delay: Math.random() * 8,
      duration: Math.random() * 6 + 4,
      color: ['#ff0080', '#00ff80', '#8000ff', '#ff8000', '#00ffff', '#ffff00'][Math.floor(Math.random() * 6)]
    }));
  };

  const particles = generateParticles();
  const fontVariation = new Date().getTime();

  // Loading screen
  if (!fontLoaded) {
    return (
      <div style={{
        width: '100vw',
        height: '100dvh',
        backgroundColor: '#000000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        margin: 0,
        padding: 0
      }}>
        <div style={{
          color: '#00ff88',
          fontSize: '1.5rem',
          fontFamily: 'monospace',
          animation: 'pulse 2s ease-in-out infinite'
        }}>
          Loading Epic Timeline...
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  const currentYear = ((Date.now() - new Date('1970-01-01T00:00:00Z').getTime()) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);

  return (
    <>
      <style>{`
        @keyframes backgroundShift {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          25% { filter: hue-rotate(90deg) brightness(1.2); }
          50% { filter: hue-rotate(180deg) brightness(0.8); }
          75% { filter: hue-rotate(270deg) brightness(1.1); }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); }
          25% { transform: translateY(-1.25rem) translateX(0.625rem) rotate(90deg); }
          50% { transform: translateY(-0.625rem) translateX(-0.625rem) rotate(180deg); }
          75% { transform: translateY(-1.875rem) translateX(0.3125rem) rotate(270deg); }
        }
        
        @keyframes sparkle {
          0% { opacity: 0.3; transform: scale(0.8); filter: brightness(1); }
          100% { opacity: 1; transform: scale(1.5); filter: brightness(2); }
        }
        
        @keyframes epicGradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes lightning {
          0%, 90%, 100% { opacity: 0; transform: translateY(-50%) scale(0.5); }
          10%, 80% { opacity: 1; transform: translateY(-50%) scale(1.5); }
        }
        
        @keyframes titlePulse {
          0%, 100% { transform: scale(1) rotateY(0deg); }
          50% { transform: scale(1.1) rotateY(5deg); }
        }
        
        @keyframes storyGlow {
          0%, 100% { textShadow: 0 0 1.25rem rgba(255, 215, 0, 0.5); }
          50% { textShadow: 0 0 1.875rem rgba(255, 215, 0, 0.8), 0 0 3.125rem rgba(255, 255, 255, 0.3); }
        }
        
        @keyframes timestampRainbow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes megaPulse {
          0%, 100% { 
            transform: scale(1);
            filter: drop-shadow(0 0 1.25rem rgba(0, 255, 136, 0.8));
          }
          50% { 
            transform: scale(1.15);
            filter: drop-shadow(0 0 2.5rem rgba(0, 255, 136, 1)) drop-shadow(0 0 5rem rgba(255, 0, 255, 0.6));
          }
        }
        
        @keyframes hyperFloat {
          0%, 100% { transform: translateY(0) rotateX(0deg); }
          25% { transform: translateY(-0.9375rem) rotateX(5deg); }
          50% { transform: translateY(-0.5rem) rotateX(-3deg); }
          75% { transform: translateY(-0.75rem) rotateX(2deg); }
        }
        
        @keyframes hyperRotate {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
          100% { transform: rotate(360deg) scale(1); }
        }
        
        @keyframes detailsPulse {
          0%, 100% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        
        @keyframes warningGlow {
          0%, 100% { color: rgba(255, 100, 100, 0.8); }
          50% { color: rgba(255, 150, 150, 1); textShadow: 0 0 1.5625rem rgba(255, 100, 100, 0.9); }
        }
        
        @keyframes waveExpand {
          0% { transform: scale(0); opacity: 1; }
          100% { transform: scale(4); opacity: 0; }
        }
        
        @keyframes digitTransform {
          0% { transform: rotateY(0deg) scale(1); }
          50% { transform: rotateY(180deg) scale(0.8) rotateX(45deg); }
          100% { transform: rotateY(360deg) scale(1); }
        }
      `}</style>
      
      <div style={{
        background: `
          radial-gradient(ellipse at 30% 20%, #ff0080 0%, transparent 50%),
          radial-gradient(ellipse at 70% 80%, #00ff80 0%, transparent 50%),
          radial-gradient(ellipse at 10% 90%, #8000ff 0%, transparent 50%),
          radial-gradient(ellipse at 90% 10%, #ff8000 0%, transparent 50%),
          linear-gradient(135deg, #0a0014 0%, #1a0033 25%, #330066 50%, #001122 75%, #000011 100%)
        `,
        overflow: 'hidden',
        height: '100dvh',
        width: '100vw',
        fontFamily: `OrbitronCustom-${fontVariation}, monospace`,
        position: 'relative',
        animation: 'backgroundShift 15s ease-in-out infinite',
        margin: 0,
        padding: 0
      }}>
        {/* Cosmic Particles */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}>
          {particles.map(particle => (
            <div
              key={particle.id}
              style={{
                position: 'absolute',
                background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                borderRadius: '50%',
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}rem`,
                height: `${particle.size}rem`,
                animation: `float ${particle.duration}s ease-in-out infinite, sparkle 2s ease-in-out infinite alternate`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </div>

        {/* Energy Waves */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '18.75rem',
          height: '18.75rem',
          pointerEvents: 'none',
          zIndex: -1
        }}>
          {[0, 1, 2, 3].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: '0.125rem solid rgba(0, 255, 136, 0.3)',
                borderRadius: '50%',
                animation: 'waveExpand 4s ease-out infinite',
                animationDelay: `${i}s`
              }}
            />
          ))}
        </div>

        {/* Main Container */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100dvh',
          position: 'relative',
          zIndex: 10,
          padding: '2rem'
        }}>
          {/* Epic Title */}
          <div style={{
            fontFamily: `CinzelCustom-${fontVariation}, serif`,
            fontSize: '3rem',
            fontWeight: 700,
            background: 'linear-gradient(45deg, #ffd700, #ffaa00, #ff6600, #ff0066, #aa00ff, #0066ff, #00aaff, #00ffaa)',
            backgroundSize: '400% 400%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'epicGradient 3s ease-in-out infinite, titlePulse 4s ease-in-out infinite',
            marginBottom: '1rem',
            textShadow: '0 0 3.125rem rgba(255, 215, 0, 0.8)',
            letterSpacing: '0.25rem',
            textAlign: 'center',
            position: 'relative'
          }}>
            <span style={{
              position: 'absolute',
              left: '-3.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '2rem',
              animation: 'lightning 2s ease-in-out infinite'
            }}>⚡</span>
            THE UNIX EPOCH
            <span style={{
              position: 'absolute',
              right: '-3.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '2rem',
              animation: 'lightning 2s ease-in-out infinite reverse'
            }}>⚡</span>
          </div>

          {/* Origin Story */}
          <div style={{
            fontFamily: `CinzelCustom-${fontVariation}, serif`,
            fontSize: '1.3rem',
            color: 'rgba(255, 215, 0, 0.9)',
            textAlign: 'center',
            marginBottom: '2rem',
            maxWidth: '50rem',
            lineHeight: 1.0,
            fontWeight: 600,
            textShadow: '0 0 1.25rem rgba(255, 215, 0, 0.5)',
            animation: 'storyGlow 5s ease-in-out infinite',
            letterSpacing: '0.0625rem'
          }}>
            On January 1st, 1970, at precisely 00:00:00 UTC, the digital universe began counting.<br />
            This moment - <strong>THE UNIX EPOCH</strong> - became the foundation of time itself in computing.<br />
            Every second since that legendary midnight has been faithfully recorded...
          </div>

          {/* Timestamp */}
          <div style={{
            fontSize: '5.5rem',
            fontWeight: 900,
            background: 'linear-gradient(45deg, #00ff88, #00ccff, #ff00ff, #ffaa00, #ff0066, #aa00ff)',
            backgroundSize: '300% 300%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: `timestampRainbow 2s ease-in-out infinite, megaPulse 3s ease-in-out infinite, hyperFloat 8s ease-in-out infinite${isDigitChanging ? ', digitTransform 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)' : ''}`,
            letterSpacing: '0.75rem',
            position: 'relative',
            textShadow: '0 0 1.875rem #00ff88, 0 0 3.75rem #00ccff, 0 0 5.625rem #ff00ff',
            filter: 'drop-shadow(0 0 1.25rem rgba(0, 255, 136, 0.8))'
          }}>
            <div style={{
              position: 'absolute',
              top: '-1.25rem',
              left: '-1.25rem',
              right: '-1.25rem',
              bottom: '-1.25rem',
              background: 'conic-gradient(from 0deg, #ff0080, #8000ff, #0080ff, #00ff80, #ff8000, #ff0080)',
              borderRadius: '1.25rem',
              animation: 'hyperRotate 4s linear infinite',
              zIndex: -1,
              opacity: 0.6,
              filter: 'blur(0.625rem)'
            }} />
            {timestamp}
          </div>

          {/* Epoch Details */}
          <div style={{
            fontFamily: `OrbitronCustom-${fontVariation}, monospace`,
            fontSize: '1.1rem',
            color: 'rgba(0, 255, 255, 0.9)',
            marginTop: '2rem',
            fontWeight: 400,
            letterSpacing: '0.125rem',
            textAlign: 'center',
            animation: 'detailsPulse 4s ease-in-out infinite',
            textShadow: '0 0 0.625rem rgba(0, 255, 255, 0.5)'
          }}>
            SECONDS SINCE THE DAWN OF DIGITAL TIME<br />
            January 1, 1970 • 00:00:00 UTC
          </div>

          {/* Warning Note */}
          <div style={{
            fontFamily: `CinzelCustom-${fontVariation}, serif`,
            fontSize: '1rem',
            color: 'rgba(255, 100, 100, 0.8)',
            marginTop: '1.5rem',
            fontStyle: 'italic',
            animation: 'warningGlow 3s ease-in-out infinite',
            textShadow: '0 0 0.9375rem rgba(255, 100, 100, 0.6)'
          }}>
            Warning: Y2K38 Problem approaching in 2038! ⚠️
          </div>

          {/* Years Counter */}
          <div style={{
            position: 'absolute',
            bottom: '3.125rem',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: `OrbitronCustom-${fontVariation}, monospace`,
            fontSize: '1.2rem',
            color: 'rgba(255, 255, 255, 0.7)',
            textShadow: '0 0 0.625rem rgba(255, 255, 255, 0.5)',
            animation: 'detailsPulse 6s ease-in-out infinite'
          }}>
            {currentYear} YEARS OF DIGITAL HISTORY
          </div>
        </div>
      </div>
    </>
  );
};

export default UnixEpochClock;