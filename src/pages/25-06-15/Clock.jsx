import React, { useEffect } from 'react';
import fontUrl from './ZombieStitch.ttf';
import bgImageUrl from './stin.webp';
import overlayImageUrl from './stit.jpeg';

const StitchesClock = () => {
  useEffect(() => {
    // Inject font-face
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'ZombieStitch';
        src: url(${fontUrl}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const updateClock = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';

      h = h % 12 || 12;

      const hStr = String(h); // no leading zero
      const mStr = String(m).padStart(2, '0');
      const allChars = hStr + mStr + ampm;

      const container = document.getElementById('clockRow');
      if (!container) return;
      container.innerHTML = '';

      for (let i = 0; i < allChars.length; i++) {
        const ch = allChars[i];
        const span = document.createElement('span');
        span.className = 'digit';
        span.textContent = ch;
        Object.assign(span.style, styles.digit);
        container.appendChild(span);
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.body}>
      

      <div style={{ ...styles.bgImage, backgroundImage: `url(${bgImageUrl})` }} />
      <img src={overlayImageUrl} alt="stitched overlay" style={styles.bgOverlay} />

      <div id="clockRow" style={styles.clockRow}></div>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    background: '#d7d2d2',
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    fontFamily: 'ZombieStitch',
  },
  bgImage: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    // filter: 'brightness(120%) hue-rotate(18deg) saturate(20%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'auto',
      opacity: 0.3, // 
  },
  bgOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 1,
    objectFit: 'cover',
        filter: 'brightness(120%) hue-rotate(18deg) saturate(20%)',

      opacity: 0.5, // 
  },
  clockRow: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    zIndex: 2,
  },
  digit: {
    fontFamily: 'ZombieStitch',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '26vh',
    color: '#1f1d52',
    textShadow: 'rgba(236, 15, 15, 0.85) 0.1rem -0.1rem 0.5rem, rgba(236, 15, 15, 0.85) -0.1rem 0.1rem 0.5rem, rgba(255,255,255,0.75) 0.05rem -0.05rem 0rem',
  },
  
};

export default StitchesClock;
