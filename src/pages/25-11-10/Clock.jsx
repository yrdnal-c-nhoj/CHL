import React, { useEffect, useState } from 'react';
import one from './1.gif';
import two from './2.webp';
import three from './3.webp';
import four from './4.webp';
import five from './5.webp';
import six from './6.webp';
import seven from './7.webp';
import eight from './8.webp';
import nine from './9.webp';
import ten from './10.png';
import eleven from './11.webp';
import twelve from './12.webp';
import hourHand from './hour.webp';
import minuteHand from './min.webp';
import secondHand from './sec.webp';
import pageBackground from './ponggg.gif';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  // Smooth continuous update using requestAnimationFrame
  useEffect(() => {
    let frameId;
    const updateTime = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(updateTime);
    };
    frameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Smooth time calculations
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000;
  const minutes = time.getMinutes() + seconds / 60;
  const hours = (time.getHours() % 12) + minutes / 60;
  const secondDeg = seconds * 6;
  const minuteDeg = minutes * 6;
  const hourDeg = hours * 30;

  const clockSize = '90vh';
  const numberSize = '20vh';
  const handWidth = '10vmin';
  const hourHandLength = '30vmin';
  const minuteHandLength = '38vmin';
  const secondHandLength = '42vmin';
  const radius = '32vmin';

  const numberPositions = [
    { src: twelve, angle: 0 },
    { src: one, angle: 30 },
    { src: two, angle: 60 },
    { src: three, angle: 90 },
    { src: four, angle: 120 },
    { src: five, angle: 150 },
    { src: six, angle: 180 },
    { src: seven, angle: 210 },
    { src: eight, angle: 240 },
    { src: nine, angle: 270 },
    { src: ten, angle: 300 },
    { src: eleven, angle: 330 },
  ];

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Full-screen, no-clip, stretching background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${pageBackground})`,
          backgroundSize: '100% 100%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          filter: 'invert(100%)',
          opacity: 0.8,
          zIndex: 0,
        }}
      />
      {/* Clock container */}
      <div
        style={{
          width: clockSize,
          height: clockSize,
          position: 'relative',
          borderRadius: '50%',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        {/* Number images around the circle */}
        {numberPositions.map(({ src, angle }, index) => {
          const rad = (angle * Math.PI) / 180;
          const x = `calc(50% + ${radius} * ${Math.sin(rad)} - ${numberSize} / 2)`;
          const y = `calc(50% - ${radius} * ${Math.cos(rad)} - ${numberSize} / 2)`;
          return (
            <img
              key={index}
              src={src}
              alt={`number-${index + 1}`}
              style={{
                position: 'absolute',
                width: numberSize,
                height: numberSize,
                left: x,
                top: y,
                transform: `rotate(${angle}deg)`,
                transformOrigin: 'center center',
                objectFit: 'contain',
                zIndex: 2,
                opacity: 0.8,
              }}
            />
          );
        })}
        {/* Hour hand */}
        <img
          src={hourHand}
          alt="hour hand"
          style={{
            position: 'absolute',
            width: handWidth,
            height: hourHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${hourHandLength} * 0.75)`,
            transform: `rotate(${hourDeg}deg)`,
            transformOrigin: 'center 75%',
            objectFit: 'contain',
            zIndex: 3,
            opacity: 0.8,
          }}
        />
        {/* Minute hand */}
        <img
          src={minuteHand}
          alt="minute hand"
          style={{
            position: 'absolute',
            width: handWidth,
            height: minuteHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${minuteHandLength} * 0.75)`,
            transform: `rotate(${minuteDeg}deg)`,
            transformOrigin: 'center 75%',
            objectFit: 'contain',
            zIndex: 3,
            opacity: 0.8,
          }}
        />
        {/* Smooth second hand */}
        <img
          src={secondHand}
          alt="second hand"
          style={{
            position: 'absolute',
            width: handWidth,
            height: secondHandLength,
            left: `calc(50% - ${handWidth} / 2)`,
            top: `calc(50% - ${secondHandLength} * 0.75)`,
            transform: `rotate(${secondDeg}deg)`,
            transformOrigin: 'center 75%',
            objectFit: 'contain',
            zIndex: 4,
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};

export default Clock;