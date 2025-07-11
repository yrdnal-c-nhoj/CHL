import React, { useEffect } from 'react';
import hummFont from './humm.ttf';
import hmmGif from './hmm.gif';
import hummPng from './humm.png';
import hum1 from './hum1.webp';
import hum2 from './hum2.webp';
import hum3 from './hum3.webp';
import hum4 from './hum4.gif';
import hum7 from './hum7.webp';
import hum8 from './hum8.gif';
import hum9 from './hum9.webp';

const floatingImages = [
  { src: hum1, animation: 'motion1' },
  { src: hum2, animation: 'motion2' },
  { src: hum3, animation: 'motion3' },
  { src: hum4, animation: 'motion4' },
  { src: hum8, animation: 'motion5' },
  { src: hum7, animation: 'motion6' },
  { src: hum9, animation: 'motion7' },
];

const HummingbirdClock = () => {
  useEffect(() => {
    // Inject font-face and animations
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'humm';
        src: url(${hummFont}) format('truetype');
      }

      @keyframes motion1 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.3rem, 0.3rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion2 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(-0.2rem, 0.4rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion3 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.5rem, -0.2rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion4 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.4rem, 0); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion5 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(-0.3rem, 0.6rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion6 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0, 0.5rem); }
        100% { transform: translate(0, 0); }
      }

      @keyframes motion7 {
        0% { transform: translate(0, 0); }
        50% { transform: translate(0.6rem, 0.3rem); }
        100% { transform: translate(0, 0); }
      }
    `;
    document.head.appendChild(style);

    const updateClock = () => {
      const now = new Date();
      const s = now.getSeconds();
      const m = now.getMinutes();
      const h = now.getHours() % 12;
      const secDeg = s * 6;
      const minDeg = m * 6 + s / 10;
      const hourDeg = h * 30 + m / 2;

      document.getElementById('second-hand').style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
      document.getElementById('minute-hand').style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
      document.getElementById('hour-hand').style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();

    const moveImage = (el, animation, index) => {
      const newX = Math.random() * (window.innerWidth - 80);
      const newY = Math.random() * (window.innerHeight - 80);
      // Unique durations and easing for each hummingbird
      const durations = [1200, 1500, 1000, 1300, 800, 1100, 1400];
      const easings = ['ease-in-out', 'ease-out', 'linear', 'ease-in', 'linear', 'ease-in-out', 'ease-out'];
      const duration = Math.random() * 600 + durations[index];
      const easing = easings[index];

      // Apply transition and position
      el.style.transition = `all ${duration}ms ${easing}`;
      el.style.left = `${newX}px`;
      el.style.top = `${newY}px`;

      // Apply vibration animation
      const vibrationDurations = [0.2, 0.18, 0.15, 0.22, 0.12, 0.17, 0.14];
      const vibrationEasing = index < 4 ? 'ease-in-out' : 'linear';
      el.style.animation = `${animation} ${vibrationDurations[index]}s infinite alternate ${vibrationEasing}`;

      // Schedule next move
      setTimeout(() => {
        moveImage(el, animation, index);
      }, duration);
    };

    const initializeImages = () => {
      floatingImages.forEach((_, i) => {
        const el = document.getElementById(`float-${i}`);
        if (el) {
          el.style.position = 'absolute'; // Ensure position is set
          // Set initial position immediately
          const initialX = Math.random() * (window.innerWidth - 80);
          const initialY = Math.random() * (window.innerHeight - 80);
          el.style.left = `${initialX}px`;
          el.style.top = `${initialY}px`;
          // Start movement and vibration immediately
          requestAnimationFrame(() => {
            moveImage(el, el.dataset.animation, i);
          });
        }
      });
    };

    // Initialize immediately
    requestAnimationFrame(initializeImages);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={styles.body}>
      <div style={{ ...styles.bgImageLayer, backgroundImage: `url(${hmmGif})`, zIndex: 1 }} />
      <div style={{ ...styles.bgImageLayer, backgroundImage: `url(${hmmGif})`, transform: 'scaleX(-1) rotate(90deg)', zIndex: 2 }} />
      <img src={hummPng} alt="BG" style={styles.bgImageFlipped} />

      <div style={styles.clock}>
        <div style={{ ...styles.number, ...styles.numTwelve }}>twelve</div>
        <div style={{ ...styles.number, ...styles.numThree }}>three</div>
        <div style={{ ...styles.number, ...styles.numSix }}>six</div>
        <div style={{ ...styles.number, ...styles.numNine }}>nine</div>

        <div id="hour-hand" style={{ ...styles.hand, ...styles.hourHand }} />
        <div id="minute-hand" style={{ ...styles.hand, ...styles.minuteHand }} />
        <div id="second-hand" style={{ ...styles.hand, ...styles.secondHand }} />
      </div>

      {floatingImages.map((img, i) => (
        <img
          key={i}
          id={`float-${i}`}
          src={img.src}
          alt={`Float ${i}`}
          data-animation={img.animation}
          style={styles.floatingImage}
        />
      ))}
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    height: '100vh',
    width: '100vw',
    background: '#e478d4',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bgImageLayer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity: 0.8,
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    zIndex: 1,
    filter: 'brightness(150%)',
  },
  bgImageFlipped: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    opacity: 0.8,
    zIndex: 3,
    transform: 'scaleX(-1)',
  },
  clock: {
    width: '95vh',
    height: '90vh',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 5,
  },
  number: {
    position: 'absolute',
    fontFamily: 'humm',
    fontSize: '14vh',
    color: '#0adb26',
    textShadow: '#f98f85 0 -2rem, #ed5ad2 0 2rem',
    opacity: 0.7,
    textAlign: 'center',
    transformOrigin: 'center',
  },
  numTwelve: {
    top: 0,
    left: '50%',
    transform: 'translateX(-50%) rotate(0deg)',
  },
  numThree: {
    top: '50%',
    right: 0,
    transform: 'translateY(-50%) rotate(90deg)',
  },
  numSix: {
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%) rotate(180deg)',
  },
  numNine: {
    top: '50%',
    left: 0,
    transform: 'translateY(-50%) rotate(270deg)',
  },
  hand: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    borderRadius: '0.8rem',
    opacity: 0.6,
    zIndex: 6,
  },
  hourHand: {
    background: '#f534e2a6',
    width: '1.5rem',
    height: '6rem',
  },
  minuteHand: {
    background: '#fca99a',
    width: '1rem',
    height: '9rem',
  },
  secondHand: {
    background: '#34f504',
    width: '0.3rem',
    height: '16rem',
  },
  floatingImage: {
    position: 'absolute',
    width: '8vh',
    height: '8vh',
    objectFit: 'cover',
    borderRadius: '1rem',
    zIndex: 7,
    pointerEvents: 'none',
  },
};

export default HummingbirdClock;