import React, { useEffect, useRef } from 'react';
import backgroundImg from '../../../assets/images/25-04/25-04-18/Antarctica.jpg';
import styles from './Clock.module.css';

const AntarcticaClock: React.FC = () => {
  const clockRef = useRef<HTMLDivElement>(null);
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clock = clockRef.current;
    if (!clock) return;

    // Clear any existing ticks (in case of remount)
    while (clock.firstChild) {
      clock.removeChild(clock.firstChild);
    }

    // Create tick marks
    for (let i = 0; i < 60; i++) {
      const tick = document.createElement('div');
      tick.className = `${styles.tick} ${i % 5 === 0 ? styles.major : ''}`;
      tick.style.transform = `rotate(${i * 6}deg)`;
      clock.appendChild(tick);
    }

    // Append hands
    if (hourRef.current) clock.appendChild(hourRef.current);
    if (minuteRef.current) clock.appendChild(minuteRef.current);
    if (secondRef.current) clock.appendChild(secondRef.current);

    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ms = now.getMilliseconds();

      const hourAngle = hours * 30 + minutes / 2;
      const minuteAngle = minutes * 6 + seconds / 10;
      const baseSecondAngle = seconds * 6;
      const progress = ms / 1000;
      const secondAngle = baseSecondAngle + progress * 6;

      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourAngle}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteAngle}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondAngle}deg)`;
    };

    requestAnimationFrame(updateClock);
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.bgContainer}>
        <img
          decoding="async"
          loading="lazy"
          src={backgroundImg}
          alt="Antarctica"
          className={styles.bgImage}
        />
      </div>

          .hour-hand {
            width: 3.7vw;
            height: 17vh;
          }

          .minute-hand {
            width: 2vw;
            height: 33vh;
          }

          .second-hand {
            width: 0.3vw;
            height: 100vh;
            background-color: rgb(72, 219, 242);
          }

          .center {
            position: absolute;
            width: 1.5vh;
            height: 1.5vh;
            background-color: #333;
            border-radius: 50%;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10;
          }

          @keyframes slow-rotate {
            0% {
              transform: rotate(0deg) scale(1.5);
            }
            100% {
              transform: rotate(-360deg) scale(1.5);
            }
          }

          .bgimage {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
            filter: contrast(0.4);
            z-index: 0; /* changed from -1 */
            animation: slow-rotate 440s linear infinite;
            transform-origin: center center;
          }
        `}
      </style>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100dvh',
          width: '100vw',
          margin: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <img
          decoding="async"
          loading="lazy"
          src={backgroundImg}
          alt="Antarctica"
          className="bgimage"
        />
        <div
          ref={clockRef}
          className="clock"
          style={{
            position: 'relative',
            width: '50vh',
            height: '30vh',
            borderRadius: '50%',
            zIndex: 1, // added this so clock is above background image
          }}
        >
          <div className="center" />
          <div ref={hourRef} className="hand hour-hand" />
          <div ref={minuteRef} className="hand minute-hand" />
          <div ref={secondRef} className="hand second-hand" />
        </div>
      </div>
    </>
  );
};

export default AntarcticaClock;
