import React, { useEffect } from 'react';
import rrrrFont from './rrrr.ttf';

const RollingClock = () => {
  useEffect(() => {
    const ticker = document.getElementById("ticker");
    const clockSpeed = 40;
    const screenWidth = window.innerWidth;

    function createClock() {
      const clockContainer = document.createElement("div");
      clockContainer.className = "clock-container";
      clockContainer.style.left = screenWidth + "px";

      const clock = document.createElement("div");
      clock.className = "clock";

      for (let i = 1; i <= 12; i++) {
        const num = document.createElement("div");
        num.className = "number";
        num.innerText = i;
        const angle = (i - 3) * 30 * (Math.PI / 180);
        const r = 40;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);
        num.style.left = `${x}%`;
        num.style.top = `${y}%`;
        num.style.transform = `translate(-50%, -50%) rotate(${(i - 3) * 30}deg)`;
        clock.appendChild(num);
      }

      const hourHand = document.createElement("div");
      hourHand.className = "hand hour";
      const minuteHand = document.createElement("div");
      minuteHand.className = "hand minute";
      const secondHand = document.createElement("div");
      secondHand.className = "hand";
      const centerDot = document.createElement("div");
      centerDot.className = "center-dot";

      clock.appendChild(hourHand);
      clock.appendChild(minuteHand);
      clock.appendChild(secondHand);
      clock.appendChild(centerDot);
      clockContainer.appendChild(clock);
      ticker.appendChild(clockContainer);

      function updateHands() {
        const now = new Date();
        const utc = now.getTime() + now.getTimezoneOffset() * 60000;
        const edt = new Date(utc - 4 * 3600000);
        const sec = edt.getSeconds();
        const min = edt.getMinutes();
        const hr = edt.getHours();

        secondHand.style.transform = `rotate(${sec * 6}deg)`;
        minuteHand.style.transform = `rotate(${min * 6 + sec * 0.1}deg)`;
        hourHand.style.transform = `rotate(${(hr % 12) * 30 + min * 0.5}deg)`;
      }

      updateHands();
      setInterval(updateHands, 1000);

      const clockWidth = 300;
      const totalTravel = screenWidth + clockWidth + 100;
      const start = performance.now();

      function animate(now) {
        const elapsed = now - start;
        const distance = (elapsed / 2000) * clockSpeed;
        const angle = -(distance / (Math.PI * clockWidth)) * 360;
        clockContainer.style.left = `${screenWidth - distance}px`;
        clockContainer.style.transform = `translateY(-50%) rotate(${angle}deg)`;
        if (distance < totalTravel) {
          requestAnimationFrame(animate);
        } else {
          clockContainer.remove();
        }
      }

      requestAnimationFrame(animate);
    }

    createClock();
    const intervalId = setInterval(createClock, 3500);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div style={styles.wrapper}>
      <style>{`
        @font-face {
          font-family: 'rrrr';
          src: url(${rrrrFont}) format('truetype');
        }

        #ticker {
          position: absolute;
          top: 50%;
          left: 0;
          width: 100vw;
          height: 100dvh;
          transform: translateY(-50%);
        }

        .clock-container {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 400px;
          height: 400px;
        }

        .clock {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }

        .number {
          position: absolute;
          font-family: 'rrrr', sans-serif;
          font-size: 1.2rem;
          color: #C9F7E3FF;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          background: white;
          border-radius: 0.5rem;
        }

        .hand.hour {
          height: 60px;
          width: 8px;
          background: green;
        }

        .hand.minute {
          height: 90px;
          width: 6px;
          background: blue;
        }

        .hand {
          height: 600px;
          width: 2px;
          background: cyan;
        }

        .center-dot {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 19px;
          height: 19px;
          background: black;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
      `}</style>
      <div id="ticker" />
    </div>
  );
};

const styles = {
  wrapper: {
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    height: '100vh',
    width: '100vw',
    backgroundImage: 'radial-gradient(#301e01 11px, transparent 11px), radial-gradient(#301e01 11px, transparent 11px)',
    backgroundSize: '56px 56px',
    backgroundPosition: '0 0, 28px 28px',
    backgroundColor: '#4b1a03',
    position: 'relative',
    fontFamily: "'rrrr', sans-serif",
  },
};

export default RollingClock;
