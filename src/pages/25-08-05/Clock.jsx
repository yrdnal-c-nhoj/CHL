import React, { useEffect, useRef } from 'react';
import num1 from './num1.png';
import num2 from './num2.png';
import num3 from './num3.png';
import num4 from './num4.png';
import num5 from './num5.png';
import num6 from './num6.png';
import num7 from './num7.png';
import num8 from './num8.png';
import num9 from './num9.png';
import num10 from './num10.png';
import num11 from './num11.png';
import num12 from './num12.png';

const numberImages = [num12, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11];

const Clock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours() % 12;

      secondRef.current.style.transform = `rotate(${sec * 6}deg)`;
      minuteRef.current.style.transform = `rotate(${min * 6}deg)`;
      hourRef.current.style.transform = `rotate(${(hr * 30) + (min / 2)}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position: 'relative',
      width: '80vmin',
      height: '80vmin',
      borderRadius: '50%',
      border: '0.5rem solid black',
      margin: 'auto',
      backgroundColor: '#fff',
    }}>
      {/* Number Images */}
      {numberImages.map((src, i) => {
        const angle = (i * 30 - 60) * (Math.PI / 180); // place 12 at top
        const radius = 35; // percentage
        const x = 50 + radius * Math.cos(angle);
        const y = 50 + radius * Math.sin(angle);
        return (
          <img
            key={i}
            src={src}
            alt={`num${i + 1}`}
            style={{
              position: 'absolute',
              width: '8%',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* Clock Hands */}
      <div ref={hourRef} style={{
        position: 'absolute',
        width: '2%',
        height: '20%',
        backgroundColor: 'black',
        top: '30%',
        left: '49%',
        transformOrigin: '50% 100%',
      }} />
      <div ref={minuteRef} style={{
        position: 'absolute',
        width: '1.5%',
        height: '30%',
        backgroundColor: 'gray',
        top: '20%',
        left: '49.25%',
        transformOrigin: '50% 100%',
      }} />
      <div ref={secondRef} style={{
        position: 'absolute',
        width: '1%',
        height: '35%',
        backgroundColor: 'red',
        top: '15%',
        left: '49.5%',
        transformOrigin: '50% 100%',
      }} />
    </div>
  );
};

export default Clock;
