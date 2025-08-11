import React, { useEffect, useState } from 'react';
import bgImage from './q.webp';
import myFont from './q.otf';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [offsetX, setOffsetX] = useState(0);

  useEffect(() => {
    const timeInterval = setInterval(() => setTime(new Date()), 40);

    // Toggle between 0 and 1 pixel offset 10 times per second
    const jumpInterval = setInterval(() => {
      setOffsetX((prev) => (prev === 0 ? 1 : 0));
    }, 100);

    return () => {
      clearInterval(timeInterval);
      clearInterval(jumpInterval);
    };
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const hundredths = Math.floor(time.getMilliseconds() / 10)
    .toString()
    .padStart(2, '0');

  const DigitBox = ({ children }) => (
    <div
      style={{
        width: '1.5ch',
        textAlign: 'center',
        display: 'inline-block',
        userSelect: 'none',
      }}
    >
      {children}
    </div>
  );



  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${myFont}) format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          html, body, #root {
            margin: 0; padding: 0; height: 100%;
            font-family: 'MyCustomFont', monospace, sans-serif;
          }
        `}
      </style>

      <div
        style={{
          height: '100vh',
          width: '100vw',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: '110% 110%',
          backgroundPosition: `${offsetX}px 0px`, // horizontal jump
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '10vh',
          color: '#fff',
          textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
          userSelect: 'none',
          transition: 'none', // disable smooth transition for jump
        }}
      >
        <DigitBox>{hours[0]}</DigitBox>
        <DigitBox>{hours[1]}</DigitBox>
       
        <DigitBox>{minutes[0]}</DigitBox>
        <DigitBox>{minutes[1]}</DigitBox>
      
        <DigitBox>{seconds[0]}</DigitBox>
        <DigitBox>{seconds[1]}</DigitBox>
  
        <DigitBox>{hundredths[0]}</DigitBox>
        <DigitBox>{hundredths[1]}</DigitBox>
      </div>
    </>
  );
}
