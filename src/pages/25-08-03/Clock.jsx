import React, { useEffect, useRef } from 'react';
import bgImage from './sta.gif';
import overlay1 from './cur.webp';
import overlay2 from './pro.gif';
import clockFont from './st.ttf';

const goldGradient = 'linear-gradient(135deg, #ffd700, #ffec85, #b8860b, #f5d742)';

const OrnateClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      if (hourRef.current) {
        hourRef.current.style.transform = `rotate(${(hr + min / 60) * 30}deg)`;
      }
      if (minuteRef.current) {
        minuteRef.current.style.transform = `rotate(${(min + sec / 60) * 6}deg)`;
      }
      if (secondRef.current) {
        secondRef.current.style.transform = `rotate(${sec * 6}deg)`;
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const font = new FontFace('ClockFont', `url(${clockFont})`);
    font.load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
      })
      .catch((error) => console.error('Font loading failed:', error));
  }, []);

  const styles = {
    background: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100vw',      // full viewport width
      height: '100vh',     // full viewport height
      backgroundImage: `url(${bgImage})`,
      backgroundSize: '100% 100%', // stretch & distort fully
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      pointerEvents: 'none',
      zIndex: 2,
      filter: 'brightness(1.2)',
    },
    clockContainer: {
      position: 'absolute',
      bottom: '10vmin',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '35vmin',
      height: '35vmin',
      borderRadius: '50%',
      border: '2vmin solid gold',
      boxShadow: '0 0 3vmin gold, 0 0 2vmin #d4af37 inset',
      background: `
        radial-gradient(circle at 30% 30%, #fff8dc, #d4af37 70%),
        linear-gradient(135deg, #ffd700 25%, #b8860b 75%)
      `,
      backgroundBlendMode: 'overlay',
      overflow: 'hidden',
      zIndex: 2,
    },
    clockFace: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '90%',
      height: '90%',
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      backgroundColor: 'transparent',
      zIndex: 3,
    },
    overlay1: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100vw',      // full viewport width
      height: '100vh',     // full viewport height
      backgroundImage: `url(${overlay1})`,
      backgroundSize: '100% 100%', // stretch & distort fully
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      pointerEvents: 'none',
      zIndex: 20,
      filter: 'brightness(0.8)',
    },
    overlay2: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',      // full viewport width
      height: '100vh',     // full viewport height
      backgroundImage: `url(${overlay2})`,
      backgroundSize: '100% 100%', // stretch & distort fully
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center center',
      pointerEvents: 'none',
      zIndex: 21,
      filter: 'brightness(1.0)',
    },
    handBase: {
      position: 'absolute',
      bottom: '50%',
      left: '50%',
      transformOrigin: 'bottom center',
      transform: 'rotate(0deg)',
    },
    hourHand: {
      width: '1.2vmin',
      height: '25%',
      background: goldGradient,
      borderRadius: '0.2vmin',
      boxShadow: `
        inset 0 0 4px #fff8a6,  /* subtle highlight */
        0 0 5px #b8860b        /* glow for depth */
      `,
      zIndex: 10,
    },
    minuteHand: {
      width: '0.8vmin',
      height: '35%',
      background: goldGradient,
      borderRadius: '0.15vmin',
      boxShadow: `
        inset 0 0 3px #fff8a6,
        0 0 4px #b8860b
      `,
      zIndex: 11,
    },
    secondHand: {
      width: '0.4vmin',
      height: '40%',
      background: goldGradient,
      borderRadius: '0.1vmin',
      boxShadow: `
        inset 0 0 2px #fff8a6,
        0 0 3px #b8860b
      `,
      zIndex: 12,
    },
    number: {
      position: 'absolute',
      fontFamily: 'ClockFont, sans-serif',
      fontSize: '10vmin', // much bigger
      color: '#b8860b', // base gold color (dark goldenrod)
      background: 'linear-gradient(45deg, #ffd700, #fff8a6, #b8860b, #f5d742)', // gold gradient
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: `
        0 0 5px #ffd700,    /* bright outer glow */
        0 0 10px #ffec85,   /* softer glow */
        0 0 20px #b8860b,   /* deeper gold shadow */
        1px 1px 2px #222220FF /* subtle dark shadow for depth */
      `,
      textAlign: 'center',
      width: '20%',
      height: '20%',
      zIndex: 9,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const renderClockNumbers = () => {
    const positions = {
      12: -90,
      3: 0,
      0: 90,
      9: 180,
    };

    const radius = 35; // smaller radius to bring numbers closer to center

    return Object.entries(positions).map(([num, deg]) => {
      const angle = (deg * Math.PI) / 180;
      let x = 50 + radius * Math.cos(angle);
      let y = 50 + radius * Math.sin(angle);

      if (num === '6') {
        y -= 5; // lift the 6 upward more
      }

      return (
        <div
          key={num}
          style={{
            ...styles.number,
            left: `${x}%`,
            top: `${y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          {num}
        </div>
      );
    });
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <div style={styles.background} />
      <div style={styles.clockContainer}>
        <div style={styles.clockFace}>
          {renderClockNumbers()}
          <div ref={hourRef} style={{ ...styles.handBase, ...styles.hourHand }} />
          <div ref={minuteRef} style={{ ...styles.handBase, ...styles.minuteHand }} />
          <div ref={secondRef} style={{ ...styles.handBase, ...styles.secondHand }} />
        </div>
      </div>
      <div style={styles.overlay1} />
      <div style={styles.overlay2} />
    </div>
  );
};

export default OrnateClock;
