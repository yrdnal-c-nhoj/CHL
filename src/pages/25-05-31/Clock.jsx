import React, { useEffect, useRef } from 'react';
import elWebp from './el.webp';
import el1 from './el1.png';
import el2 from './el2.png';
import el3 from './el3.png';
import eleGif from './ele.gif';

const ElephantClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();
  const orbitRef = useRef();

  useEffect(() => {
    const hourHand = hourRef.current;
    const minuteHand = minuteRef.current;
    const secondHand = secondRef.current;
    const orbitingImage = orbitRef.current;

    let hourSway = { amplitude: 0, frequency: 0, nextUpdate: 0 };
    let minuteSway = { amplitude: 0, frequency: 0, nextUpdate: 0 };

    const randomizeSway = (sway) => {
      sway.amplitude = Math.random() * 5;
      sway.frequency = 0.001 + Math.random() * 0.003;
      sway.nextUpdate = Date.now() + 3000 + Math.random() * 5000;
    };

    randomizeSway(hourSway);
    randomizeSway(minuteSway);

    let orbitAngle = 0;
    const orbitRadius = 40;

    let frameId;

    const updateClock = () => {
      const now = new Date();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      const preciseSeconds = seconds + milliseconds / 1000;
      const minutes = now.getMinutes();
      const hours = now.getHours();
      const t = Date.now();

      const secondDeg = preciseSeconds * 6 + 5 * Math.sin(t / 150) + Math.random() * 1;

      const minuteDegBase = minutes * 6 + seconds * 0.1;
      const hourDegBase = (hours % 12) * 30 + minutes * 0.5;

      if (t > hourSway.nextUpdate) randomizeSway(hourSway);
      if (t > minuteSway.nextUpdate) randomizeSway(minuteSway);

      const hourDeg = hourDegBase + hourSway.amplitude * Math.sin(t * hourSway.frequency);
      const minuteDeg = minuteDegBase + minuteSway.amplitude * Math.sin(t * minuteSway.frequency);

      hourHand.style.transform = `translate(-50%, -50%) rotate(${hourDeg}deg)`;
      minuteHand.style.transform = `translate(-50%, -50%) rotate(${minuteDeg}deg)`;
      secondHand.style.transform = `translate(-50%, -50%) rotate(${secondDeg}deg)`;

      orbitAngle -= 0.12;
      const rad = (orbitAngle * Math.PI) / 180;
      const x = 50 + orbitRadius * Math.cos(rad);
      const y = 50 + orbitRadius * Math.sin(rad);
      orbitingImage.style.left = `${x}%`;
      orbitingImage.style.top = `${y}%`;
      orbitingImage.style.transform = `translate(-50%, -50%) rotate(${orbitAngle + 90}deg)`;

      frameId = requestAnimationFrame(updateClock);
    };

    updateClock();
    return () => cancelAnimationFrame(frameId);
  }, []);

  const numbers = [];
  for (let i = 1; i <= 12; i++) {
    const angle = (i * 30 * Math.PI) / 180;
    const x = 50 + 40 * Math.sin(angle) * (80 / 60);
    const y = 50 - 40 * Math.cos(angle);
    numbers.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          transform: 'translate(-50%, -50%)',
          fontSize: '8vmin',
          color: '#949393',
          textShadow: '#0a0909 -1px 0px 0px',
          width: '10vmin',
          textAlign: 'center',
        }}
      >
        {i}
      </div>
    );
  }

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        background: '#7e7c79',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        fontFamily: 'sans-serif',
      }}
    >
      <img
        src={elWebp}
        alt="Background"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          objectFit: 'cover',
          filter: 'saturate(50%)',
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: '100vmin',
          height: '100vmin',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '80vmin',
            height: '80vmin',
            borderRadius: '50%',
            zIndex: 2,
          }}
        >
          {numbers}

          <div style={handStyle}>
            <img
              ref={hourRef}
              src={el2}
              alt="Hour Hand"
              style={{
                height: '45%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: 'translate(-50%, -50%)',
                filter: 'saturate(60%)',
              }}
            />
          </div>
          <div style={handStyle}>
            <img
              ref={minuteRef}
              src={el1}
              alt="Minute Hand"
              style={{
                height: '55%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: 'translate(-50%, -50%)',
                filter: 'saturate(130%)',
              }}
            />
          </div>
          <div style={handStyle}>
            <img
              ref={secondRef}
              src={el3}
              alt="Second Hand"
              style={{
                height: '65%',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transformOrigin: 'bottom center',
                transform: 'translate(-50%, -50%)',
                filter: 'saturate(20%) contrast(70%)',
              }}
            />
          </div>

          <img
            ref={orbitRef}
            src={eleGif}
            alt=""
            aria-hidden="true"
            role="presentation"
            style={{
              position: 'absolute',
              width: '20vmin',
              height: '20vmin',
              transform: 'translate(-50%, -50%)',
              zIndex: 1,
              filter: 'saturate(20%)',
              left: '50%',
              top: '50%',
            }}
          />
        </div>
      </div>
    </div>
  );
};

const handStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  opacity: 0.8,
  zIndex: 5,
};

export default ElephantClock;
