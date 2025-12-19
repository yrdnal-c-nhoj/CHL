import { useState, useEffect } from 'react';
import background from './swagr.webp';
import fontDate20251219 from './fa.ttf';

const styleInject = () => {
  const style = document.createElement('style');
  style.textContent = `
    @font-face {
      font-family: 'CustomFont';
      src: url('${fontDate20251219}') format('truetype');
    }
    .clock-container, .time-part {
      font-family: 'CustomFont', sans-serif;
    }
  `;
  document.head.appendChild(style);
};

export default function App() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    styleInject();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const isLargeScreen = window.innerWidth > 768;

  useEffect(() => {
    const handleResize = () => setTime(new Date());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
          height: '100dvh',
        }}
      >
        <div
          className="clock-container"
          style={{
            display: 'flex',
            flexDirection: isLargeScreen ? 'row' : 'column',
            gap: isLargeScreen ? '2vw' : '4vh',
            color: 'white',
            fontSize: isLargeScreen ? '15vw' : '20vw',
            letterSpacing: '0.5vw',
          }}
        >
          <div className="time-part">{hours}</div>
          <div className="time-part">{minutes}</div>
          <div className="time-part">{seconds}</div>
        </div>
      </div>
    </div>
  );
}
