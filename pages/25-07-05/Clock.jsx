import React, { useEffect, useState } from 'react';
import vegasFont from './vegas.ttf';

const VegasClock = () => {
  const [time, setTime] = useState(() => {
    const now = new Date();
    const h = now.getHours() % 12 || 12;
    return {
      hours: String(h).padStart(2, '0'),
      minutes: String(now.getMinutes()).padStart(2, '0'),
      seconds: String(now.getSeconds()).padStart(2, '0'),
    };
  });

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'vegas';
        src: url(${vegasFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const interval = setInterval(() => {
      const now = new Date();
      const h = now.getHours() % 12 || 12;
      setTime({
        hours: String(h).padStart(2, '0'),
        minutes: String(now.getMinutes()).padStart(2, '0'),
        seconds: String(now.getSeconds()).padStart(2, '0'),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    fontFamily: 'sans-serif',
  };

  const iframeStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100vw',
    height: '100vh',
    border: 'none',
    zIndex: 1,
  };

  const wrapperStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 'max-content',
    maxWidth: '100vw',
    zIndex: 10,
  };

  const clockContainerStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '1vmin',
    whiteSpace: 'nowrap',
    maxWidth: '100vw',
    overflow: 'hidden',
  };

  const digitGroupStyle = {
    fontFamily: 'vegas, sans-serif',
    display: 'flex',
    gap: '0.1vmin',
  };

  const digitBoxStyle = {
    color: '#edcb0b',
    textShadow:
      '#c406fe 0 0.2rem, #f84802 0 -0.2rem, #48d9e9 0.2rem 0, #f84802 -0.2rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '3.5rem',
    width: '1rem',
    height: '4rem',
    minWidth: '2.2rem',
    textAlign: 'center',
    boxSizing: 'border-box',
    zIndex: 19,
  };


  return (
    <div style={containerStyle}>
    
      <iframe
        style={iframeStyle}
        src="https://www.youtube.com/embed/jtvmwjzZY0c?si=TNdQG5g7_q2UBXa-&autoplay=1&mute=1"
        title="Vegas Clock Background Video"
        allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>

      <div style={wrapperStyle}>
        <div style={clockContainerStyle}>
          <div style={digitGroupStyle}>
            <div style={digitBoxStyle}>{time.hours[0]}</div>
            <div style={digitBoxStyle}>{time.hours[1]}</div>
          </div>
          <div style={digitGroupStyle}>
            <div style={digitBoxStyle}>{time.minutes[0]}</div>
            <div style={digitBoxStyle}>{time.minutes[1]}</div>
          </div>
          <div style={digitGroupStyle}>
            <div style={digitBoxStyle}>{time.seconds[0]}</div>
            <div style={digitBoxStyle}>{time.seconds[1]}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VegasClock;
