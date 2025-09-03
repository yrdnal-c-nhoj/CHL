import React, { useEffect, useRef } from 'react';
import backgroundImage from './images/pattern.jpeg';
import pizzaFace from './images/pie.png';
import hourSlice from './images/slice3.png';
import minuteSlice from './images/slice2.png';
import secondSlice from './images/slice1.png';

const PizzaClock = () => {
  const hourRef = useRef(null);
  const minuteRef = useRef(null);
  const secondRef = useRef(null);

  useEffect(() => {
    const updateClockSmooth = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = now.getHours() % 12 + m / 60;

      const hourDeg = h * 30;
      const minuteDeg = m * 6;
      const secondDeg = s * 6;

      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourDeg}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteDeg}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondDeg}deg)`;

      requestAnimationFrame(updateClockSmooth);
    };

    requestAnimationFrame(updateClockSmooth);
  }, []);

  return (
    <div style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
      width: '100vw',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <img
        src={backgroundImage}
        alt="Background"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(2.5)',
          zIndex: 0,
        }}
      />
      <div style={{
        position: 'relative',
        width: '80vmin',      // vmin ensures a square that fits within viewport
        height: '80vmin',
        aspectRatio: '1',
        backgroundImage: `url(${pizzaFace})`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        borderRadius: '50%',
        filter: 'saturate(1.6)',
        zIndex: 1,
      }}>
        <div
          ref={minuteRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 6,
          }}
        >
          <img
            src={minuteSlice}
            alt="Minute Hand"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              height: '55%',
              opacity: 0.8,
              filter: 'brightness(190%) contrast(120%)',
            }}
          />
        </div>

        <div
          ref={hourRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 9,
          }}
        >
          <img
            src={hourSlice}
            alt="Hour Hand"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              height: '34%',
              opacity: 0.8,
              filter: 'brightness(190%) contrast(200%)',
            }}
          />
        </div>

        <div
          ref={secondRef}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            transformOrigin: 'center center',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <img
            src={secondSlice}
            alt="Second Hand"
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -100%)',
              height: '50%',
              filter: 'brightness(290%) contrast(190%)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default PizzaClock;
