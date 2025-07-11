import React, { useEffect, useRef } from 'react';
import libreBaskerville from './LibreBaskerville.ttf';
import monofett from './Monofett-Regular.ttf';
import nanumCoding from './NanumGothicCoding.ttf';
import oxanium from './Oxanium-VariableFont_wght.ttf';
import robotoSlab from './RobotoSlab-VariableFont_wght.ttf';

function BounceClock() {
  const roomRef = useRef(null);

  useEffect(() => {
    const room = roomRef.current;

    const fontStyles = `
      @font-face {
        font-family: 'Libre Baskerville';
        src: url(${libreBaskerville}) format('truetype');
      }
      @font-face {
        font-family: 'Monofett';
        src: url(${monofett}) format('truetype');
      }
      @font-face {
        font-family: 'Nanum Gothic Coding';
        src: url(${nanumCoding}) format('truetype');
      }
      @font-face {
        font-family: 'Oxanium';
        src: url(${oxanium}) format('truetype');
      }
      @font-face {
        font-family: 'Roboto Slab';
        src: url(${robotoSlab}) format('truetype');
      }
    `;

    const styleEl = document.createElement('style');
    styleEl.textContent = fontStyles;
    document.head.appendChild(styleEl);

    function createClock() {
      const sizes = [
        { size: 3, gravity: 1.0 },
        { size: 5, gravity: 0.5 },
        { size: 7, gravity: 0.01 },
        { size: 10, gravity: 0.05 },
        { size: 13, gravity: 0.001 }
      ];

      const { size, gravity } = sizes[Math.floor(Math.random() * sizes.length)];

      const clock = document.createElement("div");
      clock.className = "clock";
      clock.style.width = `${size}rem`;
      clock.style.height = `${size}rem`;
      clock.style.left = `${Math.random() * 100}vw`;
      clock.style.top = `-20vh`;

      const color = `hsl(${Math.floor(Math.random() * 360)}, 10%, 30%)`;
      clock.style.background = color;
      clock.style.boxShadow = `0 0 ${size * 0.2}rem ${color}`;

      const hour = document.createElement("div");
      hour.className = "hand hour";
      hour.style.width = `${size * 0.05}rem`;
      hour.style.height = `${size * 0.25}rem`;
      hour.style.top = `${size * 0.25}rem`;
      hour.style.left = `${(size / 2) - (size * 0.05) / 2}rem`;

      const minute = document.createElement("div");
      minute.className = "hand minute";
      minute.style.width = `${size * 0.025}rem`;
      minute.style.height = `${size * 0.4}rem`;
      minute.style.top = `${size * 0.1}rem`;
      minute.style.left = `${(size / 2) - (size * 0.025) / 2}rem`;

      clock.appendChild(hour);
      clock.appendChild(minute);
      room.appendChild(clock);

      let y = -20;
      let velocity = 0;
      const bounce = 0.7;

      function animate() {
        velocity += gravity;
        y += velocity;

        if (y > window.innerHeight * 0.01 * (100 - size)) {
          y = window.innerHeight * 0.01 * (100 - size);
          velocity *= -bounce;
        }

        clock.style.top = `${(y / window.innerHeight) * 100}vh`;
        requestAnimationFrame(animate);
      }

      animate();
      updateHands(hour, minute);

      setTimeout(() => {
        clock.classList.add("fade-out");
        clock.addEventListener("transitionend", () => {
          if (clock.parentElement) {
            clock.parentElement.removeChild(clock);
          }
        });
      }, 30000);
    }

    function updateHands(hour, minute) {
      const now = new Date();
      const h = now.getHours();
      const m = now.getMinutes();
      hour.style.transform = `rotate(${(h % 12) * 30 + m * 0.5}deg)`;
      minute.style.transform = `rotate(${m * 6}deg)`;
    }

    const interval = setInterval(createClock, 1000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(styleEl);
    };
  }, []);

  return (
    <div style={styles.body}>
      <div style={styles.titleContainer}>
        <div style={styles.chltitle}>Cubist Heart Laboratories</div>
        <div style={styles.bttitle}>BorrowedTime</div>
      </div>
      <div style={styles.dateContainer}>
        <a href="../fireworks/" style={{ ...styles.date, ...styles.dateleft }}>04/29/25</a>
        <a href="../index.html" style={styles.clockname}>Bounce</a>
        <a href="../slowlightning/" style={{ ...styles.date, ...styles.dateright }}>05/01/25</a>
      </div>
      <div ref={roomRef} style={styles.room} />
    </div>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    height: '100vh',
    background: 'linear-gradient(to top, #9ea4a0, #d7d7d8)',
    fontFamily: 'sans-serif',
    position: 'relative',
  },
  room: {
    position: 'relative',
    width: '100vw',
    height: '100vh',
    overflow: 'hidden',
  },
  titleContainer: {
    color: '#cacccb',
    textShadow: '#82877e 0.05rem 0',
    position: 'absolute',
    top: '0.5vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98vw',
    display: 'flex',
    zIndex: 6,
  },
  chltitle: {
    fontFamily: 'Roboto Slab',
    fontSize: '2.1vh',
    position: 'absolute',
    top: '0.3vh',
    right: '1vw',
    letterSpacing: '0.1vh',
  },
  bttitle: {
    position: 'relative',
    left: 0,
    fontFamily: 'Oxanium',
    fontSize: '2.7vh',
    fontStyle: 'italic',
    letterSpacing: '-0.1vh',
  },
  dateContainer: {
    color: '#bcb885',
    position: 'absolute',
    bottom: '0.5vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98vw',
    display: 'flex',
    zIndex: 6,
  },
  date: {
    fontFamily: 'Nanum Gothic Coding',
    fontSize: '3vh',
  },
  dateleft: {
    position: 'relative',
    left: 0,
  },
  dateright: {
    position: 'absolute',
    right: 0,
  },
  clockname: {
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'Oxanium',
    fontSize: '4vh',
    lineHeight: '4vh',
  },
};

// Global CSS classes injected into the page for animation
const globalCSS = document.createElement("style");
globalCSS.textContent = `
.clock {
  position: absolute;
  border-radius: 50%;
  transition: transform 5s ease, opacity 5s ease;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.3);
  will-change: transform, opacity;
}
.hand {
  position: absolute;
  transform-origin: bottom center;
  border-radius: 0.2rem;
}
.hour {
  background: rgb(192, 188, 188);
}
.minute {
  background: rgb(216, 209, 153);
}
.fade-out {
  transform: scale(0);
  opacity: 0;
}
a {
  color: inherit;
  text-decoration: none;
}
a:hover {
  color: #e8ecec;
  background-color: rgb(21, 0, 255);
}
`;
document.head.appendChild(globalCSS);

export default BounceClock;
