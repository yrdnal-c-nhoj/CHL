import React, { useEffect, useState } from 'react';
import bgImage from './mu.jpg';
import fontUrl from './mult.ttf';

const CinemaClock = () => {
  const [time, setTime] = useState({ hours: '', minutes: '' });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes();

      hours = hours % 12 || 12;

      setTime({
        hours: String(hours),                    // no leading zero
        minutes: String(minutes).padStart(2, '0') // leading zero on minutes
      });
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const fontFace = `
    @font-face {
      font-family: 'mult';
      src: url(${fontUrl}) format('truetype');
    }
  `;

  const styles = {
    htmlBody: {
      margin: 0,
      padding: 0,
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      fontFamily: 'mult, monospace',
    },
    clock: {
      position: 'absolute',
      top: '32vh',
      color: 'rgb(137, 3, 3)',
      fontSize: '2.1rem',
      letterSpacing: '0.5rem',
      textTransform: 'uppercase',
      zIndex: 2,
    },
    bgImage: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '100% 100%',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'contrast(100%)',
      zIndex: 1,
      pointerEvents: 'none',
    }
  };

  return (
    <div style={styles.htmlBody}>
      <style>{fontFace}</style>
      <div style={styles.bgImage}></div>
      <div style={styles.clock}>
        {time.hours}{time.minutes}
      </div>
    </div>
  );
};

export default CinemaClock;
