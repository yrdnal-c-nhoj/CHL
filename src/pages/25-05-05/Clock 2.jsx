import React, { useEffect, useState } from 'react';
import mapFont from './Map.ttf';

const WarholGraveCamClock = () => {
  const [time, setTime] = useState({
    hours: '00',
    minutes: '00',
    seconds: '00',
  });

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTime({
        hours: String(now.getHours()).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
      });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Inject font-face dynamically */}
      <style>{`
        @font-face {
          font-family: 'Map';
          src: url(${mapFont}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
          font-family: 'Map', sans-serif;
        }
      `}</style>

      {/* YouTube iframe full viewport */}
      <iframe
        src="https://www.youtube.com/embed/JHpJvvn9hvk?autoplay=1&mute=1"
        title="Live YouTube Stream"
        allow="autoplay; encrypted-media"
        allowFullScreen
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100vw',
          height: '100vh',
          border: 'none',
          zIndex: 1,
        }}
      />

      {/* Clock wrapper centered */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '2vmin',
          flexWrap: 'nowrap',
        }}
      >
        {/* Hours */}
        <div style={{ display: 'flex', gap: '0.5vmin' }}>
          <div
            style={{
              color: '#ef1337',
              fontSize: '8rem',
              width: '4.5rem',
              height: '6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            {time.hours[0]}
          </div>
          <div
            style={{
              color: '#ef1337',
              fontSize: '8rem',
              width: '4.5rem',
              height: '6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            {time.hours[1]}
          </div>
        </div>

        {/* Minutes */}
        <div style={{ display: 'flex', gap: '0.5vmin' }}>
          <div
            style={{
              color: '#ef1337',
              fontSize: '8rem',
              width: '4.5rem',
              height: '6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            {time.minutes[0]}
          </div>
          <div
            style={{
              color: '#ef1337',
              fontSize: '8rem',
              width: '4.5rem',
              height: '6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            {time.minutes[1]}
          </div>
        </div>

        {/* Seconds */}
        <div style={{ display: 'flex', gap: '0.5vmin' }}>
          <div
            style={{
              color: '#ef1337',
              fontSize: '8rem',
              width: '4.5rem',
              height: '6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            {time.seconds[0]}
          </div>
          <div
            style={{
              color: '#ef1337',
              fontSize: '8rem',
              width: '4.5rem',
              height: '6rem',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minWidth: '2rem',
              textAlign: 'center',
              boxSizing: 'border-box',
              userSelect: 'none',
            }}
          >
            {time.seconds[1]}
          </div>
        </div>
      </div>
    </>
  );
};

export default WarholGraveCamClock;
