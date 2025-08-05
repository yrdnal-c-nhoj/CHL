import React, { useEffect } from 'react';
import kla from './kla.webp';
import klax from './klax.png';
import klaxon from './klaxon.png';
import klaHand from './kla.png';
import klaxFont from './klax.ttf';
import overlayImage from './klax.webp';


const romanNumerals = ["xii", "i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi"];

const KlaxonClock = () => {
  useEffect(() => {
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
      @font-face {
        font-family: 'klax';
        src: url(${klaxFont}) format('truetype');
      }
    `;
    document.head.appendChild(fontStyle);

    const clock = document.getElementById('clock');
    const numberElements = [];

    romanNumerals.forEach((num, i) => {
      const angleDeg = i * 30;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = 43;

      const x = 50 + radius * Math.sin(angleRad);
      const y = 50 - radius * Math.cos(angleRad);

      const el = document.createElement('div');
      el.className = 'number';
      el.style.left = `${x}%`;
      el.style.top = `${y}%`;
      el.textContent = num;
      el.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
      el.dataset.angle = angleDeg;
      el.isFlashing = false;
      el.lastPassedTime = 0;
      numberElements.push(el);
      clock.appendChild(el);
    });

    const flashStartOffset = 6;
    const flashEndOffset = 6;
    const lingerDuration = 300;

    const updateClock = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes();
      const hr = now.getHours();

      const secondDeg = sec * 6;
      const minuteDeg = min * 6 + sec * 0.1;
      const hourDeg = (hr % 12) * 30 + min * 0.5;

      document.getElementById("second").style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      document.getElementById("minute").style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      document.getElementById("hour").style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;

      const normalizedSecond = secondDeg % 360;

      numberElements.forEach(el => {
        const numAngle = parseFloat(el.dataset.angle);
        let startAngle = (numAngle - flashStartOffset + 360) % 360;
        let endAngle = (numAngle + flashEndOffset) % 360;

        let insideZone = false;
        if (startAngle < endAngle) {
          insideZone = normalizedSecond >= startAngle && normalizedSecond <= endAngle;
        } else {
          insideZone = normalizedSecond >= startAngle || normalizedSecond <= endAngle;
        }

        if (insideZone) {
          el.isFlashing = true;
          el.lastPassedTime = performance.now();
          el.classList.add('flash-red');
        } else {
          const nowTime = performance.now();
          if (el.isFlashing && nowTime - el.lastPassedTime < lingerDuration) {
            el.classList.add('flash-red');
          } else {
            el.isFlashing = false;
            el.classList.remove('flash-red');
          }
        }
      });

      requestAnimationFrame(updateClock);
    };

    requestAnimationFrame(updateClock);
  }, []);

  const formatDate = offset => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${String(d.getFullYear()).slice(-2)}`;
  };

  return (
    <div style={styles.body}>
      <div style={styles.bgImage}></div>

 <div style={styles.overlay}></div>

      <div style={styles.clockWrapper}>
        <div style={styles.clock} id="clock">
          <img src={klax} alt="Hour Hand" className="hand hour" id="hour" style={styles.handHour} />
          <img src={klaxon} alt="Minute Hand" className="hand minute" id="minute" style={styles.handMinute} />
          <img src={klaHand} alt="Second Hand" className="hand second" id="second" style={styles.handSecond} />
        </div>
      </div>

      <style>{`
        .number {
          position: absolute;
          font-size: 29.5vh;
          font-weight: bold;
          transform-origin: center center;
          z-index: 6;
          opacity: 0.8;
          font-family: 'klax', serif;
        }

        .flash-red {
          animation: flash 0.01s ease-in-out alternate infinite;
        }

        @keyframes flash {
          from {
            color: rgb(246, 114, 37);
          }
          to {
            color: rgb(247, 46, 6);
            text-shadow:
              0 0 1rem rgb(11, 237, 211),
              0 0 2rem rgb(237, 11, 11),
              0 0 5rem rgb(238, 8, 54),
              0 0 5rem rgb(238, 8, 85);
          }
        }
      `}</style>
    </div>
  );
};

const styles = {
  body: {
    margin: 0,
    padding: 0,
    height: '100vh',
    width: '100vw',
    background: '#0c0c0c',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: 'klax, serif',
  },
  bgImage: {
    backgroundImage: `url(${kla})`,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'brightness(50%)',
    zIndex: 1,
    pointerEvents: 'none',
  },
  overlay: {
  backgroundImage: `url(${overlayImage})`,
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundSize: '190%', // Scale up the image
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  zIndex: 2,
  pointerEvents: 'none',
  opacity: 0.7,
  mixBlendMode: 'screen',
},


  clockWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    zIndex: 5,
  },
  clock: {
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    position: 'relative',
    color: 'rgb(241, 231, 244)',
  },
  handHour: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    transform: 'translateX(-50%)',
    height: '35%',
    filter: 'sepia(100%) saturate(150%) hue-rotate(-10deg) brightness(90%) contrast(120%)',
    zIndex: 7,
    pointerEvents: 'none',
  },
  handMinute: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    transform: 'translateX(-50%)',
    height: '45%',
    zIndex: 7,
    pointerEvents: 'none',
  },
  handSecond: {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    transform: 'translateX(-50%)',
    height: '55%',
    zIndex: 7,
    pointerEvents: 'none',
  },
};

export default KlaxonClock;
