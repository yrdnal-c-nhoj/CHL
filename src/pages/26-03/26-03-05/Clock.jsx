import React, { useState, useEffect, useRef } from 'react';
import { useFontLoader } from '../../../utils/fontLoader';

const Clock = () => {
  const [time, setTime] = useState('');
  const [bootText, setBootText] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [showFooter, setShowFooter] = useState(false);
  
  // Load VT323 font
  const fontReady = useFontLoader('VT323', 'https://fonts.gstatic.com/s/vt323/v18/pxiKyp0ihIEF2isfFJA.ttf');

  // 1. Clock Logic
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const h = now.getHours().toString().padStart(2, '0');
      const m = now.getMinutes().toString().padStart(2, '0');
      const s = now.getSeconds().toString().padStart(2, '0');
      setTime(`> ${h}:${m}:${s}`);
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 2. Sequential "Typing" Boot Logic
  useEffect(() => {
    const fullProtocol = `CONNECTING.....................<br/>
      HTTP/1.1 200 OK<br/>
      Server: Apache/2.2.8 (Ubuntu)<br/>
      CHL: Cubist Heart Laboratories<br/>
      BorrowedTime: 00:00:00<br/>
      ETag: '45b6-834-49130cc1182c0'<br/>
      Plus Ars Citius Omni Tempore Nam Quisque*<br/>
     Connection: close<br/>
      *More Art Faster FOr Everybody All The Time<br/>
      Content-Type: text/html<br/>`;

    let i = 0;
    const typingInterval = setInterval(() => {
      setBootText(fullProtocol.slice(0, i));
      i++;
      if (i > fullProtocol.length) {
        clearInterval(typingInterval);
        setShowEmail(true);
        // Delay the footer appearance slightly
        setTimeout(() => setShowFooter(true), 500);
      }
    }, 35);

    return () => clearInterval(typingInterval);
  }, []);

  // --- Styles Object ---
  const styles = {
    container: {
      background: '#050505',
      color: '#00fa00',
      fontFamily: "'VT323', monospace",
      width: '100vw',
      height: '100dvh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: 0,
      overflow: 'hidden',
      position: 'relative',
    },
    screen: {
      width: '95%',
      height: '95%',
      backgroundColor: '#001a00',
      position: 'relative',
      borderRadius: '2vh',
      border: '20px solid #1a1a1a',
      boxShadow: '0 0 50px rgba(0,0,0,1), inset 0 0 100px rgba(0,0,0,1)',
      overflow: 'hidden',
    },
    output: {
      padding: '4vh',
      height: '100%',
      boxSizing: 'border-box',
      textShadow: '0 0 8px rgba(0, 250, 0, 0.6)',
      animation: 'flicker 0.15s infinite',
    },
    timeHeader: {
      fontSize: '10vh',
      margin: '0 0 2vh 0',
      letterSpacing: '2px',
    },
    scanlines: {
      position: 'absolute',
      top: 0, left: 0, bottom: 0, right: 0,
      background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
      backgroundSize: '100% 4px, 3px 100%',
      pointerEvents: 'none',
      zIndex: 10,
    },
    vignette: {
      position: 'absolute',
      top: 0, left: 0, width: '100%', height: '100%',
      background: 'radial-gradient(circle, transparent 50%, rgba(0,0,0,0.7) 100%)',
      pointerEvents: 'none',
      zIndex: 11,
    },
    link: {
      color: '#00fa00',
      textDecoration: 'none',
      borderBottom: '1px solid #00fa00',
      transition: 'all 0.2s',
    }
  };

  return (
    <div style={styles.container}>
      {/* Global CSS for Animations */}
      <style>{`
        @keyframes flicker {
          0% { opacity: 0.98; }
          50% { opacity: 1; }
          100% { opacity: 0.99; }
        }

        .cursor {
          display: inline-block;
          width: 15px;
          height: 25px;
          background: #00fa00;
          margin-left: 5px;
          animation: blink 0.8s infinite;
          vertical-align: middle;
        }

        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }

        a:hover {
          background: #00fa00;
          color: #001a00 !important;
        }
      `}</style>

      <div style={styles.screen}>
        {/* Visual FX Layers */}
        <div style={styles.scanlines}></div>
        <div style={styles.vignette}></div>
        
        {/* Content */}
        <div style={styles.output}>
          <h1 style={styles.timeHeader}>{time}</h1>
          
          <div style={{ fontSize: '1.9vh', lineHeight: '1.7' }}>
            <p dangerouslySetInnerHTML={{ __html: bootText }} />
            
            {showEmail && (
              <p>
                E-MAIL: <a href="mailto:cubistheart@gmail.com" style={styles.link}>cubistheart@gmail.com</a>
                <span className="cursor"></span>
              </p>
            )}

            {showFooter && (
              <p style={{ marginTop: '2vh', color: 'rgba(0, 250, 0, 0.5)' }}>
                PRESS ANY KEY TO EXIT...
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;