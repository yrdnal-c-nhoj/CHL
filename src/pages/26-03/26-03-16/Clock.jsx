import React, { useState, useEffect } from 'react';
import bgImage from '../../../assets/images/26-03/26-03-16/metrop.webp'; // keep your background if desired, or replace with solid color

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000', // stark industrial black
        backgroundImage: `url(${bgImage})`, // optional — consider removing or using a very dark/gray industrial photo
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Helvetica, Arial, sans-serif', // clean sans-serif fallback
      }}
    >
      {/* Main clock face — crisp, functional circle with subtle industrial frame */}
      <div
        style={{
          width: '380px',
          height: '380px',
          position: 'relative',
          borderRadius: '50%',
        }}
      >
        {/* Minimal hour markers — simple white bars, longer at cardinals */}
        {[...Array(12)].map((_, i) => {
          const isCardinal = i % 3 === 0;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: isCardinal ? '4px' : '2px',
                height: isCardinal ? '28px' : '14px',
                backgroundColor: '#eee', // off-white for high contrast
                top: '20px',
                left: '50%',
                transform: `translateX(-50%) rotate(${i * 30}deg)`,
                transformOrigin: '50% 160px',
              }}
            />
          );
        })}

        {/* Minute tick marks — small lines between hour markers */}
        {[...Array(60)].map((_, i) => {
          // Skip positions where hour markers already exist
          if (i % 5 === 0) return null;

          return (
            <div
              key={`tick-${i}`}
              style={{
                position: 'absolute',
                width: '1px',
                height: '8px',
                backgroundColor: '#aaa', // lighter gray for minute marks
                top: '25px',
                left: '50%',
                transform: `translateX(-50%) rotate(${i * 6}deg)`,
                transformOrigin: '50% 165px',
              }}
            />
          );
        })}

        {/* Hands — pure geometry, no gradients, no clip-path tricks */}
        {/* Hour hand — short, broad, rectangular with slight taper */}
        <div
          style={{
            position: 'absolute',
            width: '16px',
            height: '80px',
            backgroundColor: '#eee',
            left: '50%',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${hourAngle}deg)`,
            borderRadius: '8px 8px 2px 2px', // very slight rounding only at tip
          }}
        />

        {/* Minute hand — longer, thinner */}
        <div
          style={{
            position: 'absolute',
            width: '10px',
            height: '130px',
            backgroundColor: '#eee',
            left: '50%',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${minuteAngle}deg)`,
            borderRadius: '5px 5px 1px 1px',
          }}
        />

        {/* Second hand — very thin, red accent (common in functionalist designs for visibility) */}
        <div
          style={{
            position: 'absolute',
            width: '3px',
            height: '160px',
            backgroundColor: '#DA4008', // Bauhaus often used primary red accents
            left: '50%',
            bottom: '50%',
            transformOrigin: '50% 100%',
            transform: `translateX(-50%) rotate(${secondAngle}deg)`,
            transition: 'transform 0.05s linear', // smooth but mechanical feel
          }}
        >
          {/* Tiny counterbalance circle — functional, not decorative */}
          <div
            style={{
              position: 'absolute',
              top: '-6px',
              left: '-3.5px',
              width: '1px',
              height: '1px',
              backgroundColor: '#c00',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Center pivot — simple chrome-like industrial bolt */}
        <div
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            backgroundColor: '#222',
            // border: '2px solid #555', // steel/chrome look
            borderRadius: '50%',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 10,
          }}
        />
      </div>
    </div>
  );
};

export default Clock;
