import React, { useEffect, useRef } from 'react';
import cloudyFont from './cloudy.ttf';
import cmoon from './cmoon.webp';
import clouGif from './clou.gif';
import clll from './clll.webp';

const CloudyNightClock = () => {
  const clockRef = useRef();

  useEffect(() => {
    // Inject font
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'cloudy';
        src: url(${cloudyFont}) format('truetype');
      }
    `;
    document.head.appendChild(style);

    const updateClock = () => {
      const now = new Date();
      let hours = now.getHours() % 12 || 12;
      const minutes = String(now.getMinutes()).padStart(2, '0');
      clockRef.current.textContent = `${hours}:${minutes}`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    margin: 0,
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #1d1d4f, #182c21)',
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  };

  const moonStyle = {
    position: 'absolute',
    left: '50%',
    top: '120vh',
    width: '22vh',
    height: '22vh',
    backgroundImage: `url(${cmoon})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translateX(-50%)',
    animation: 'moonRise 15s infinite ease-in-out',
    zIndex: 5,
  };

  const clockStyle = {
    fontFamily: 'cloudy, sans-serif',
    fontSize: '3.5rem',
    color: '#f9f6c2',
    textShadow: `
      0.2rem 0.2rem 0 rgba(69, 73, 52, 0.9),
      0.1rem 0.1rem 0 rgba(207, 250, 16),
      -0.1rem 0 0.4rem rgb(150, 228, 215)
    `,
    lineHeight: 1,
    textAlign: 'center',
    transform: 'translateY(2%)',
  };

  const cloudStyle = {
    width: '120vw',
    height: '90vh',
    backgroundImage: `url(${clouGif})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    animation: 'cloudSweep 15s infinite ease-in-out',
    zIndex: 10,
    filter: 'brightness(40%) contrast(200%) sepia(1) hue-rotate(190deg) saturate(2)',
    opacity: 0.7,
  };

  const bgImageStyle = {
    position: 'fixed',
    top: '-19vh',
    left: 0,
    height: '150vh',
    backgroundImage: `url(${clll})`,
    backgroundRepeat: 'repeat',
    zIndex: 2,
    opacity: 0.3,
    filter: 'brightness(60%)',
  };

  const titleStyle = {
    color: '#7e7f84',
    textShadow: '#100f0f 0.1rem 0',
    position: 'absolute',
    top: '1vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
  };

  const chltitleStyle = {
    fontFamily: '"Roboto Slab", serif',
    fontSize: '2.1vh',
    position: 'absolute',
    top: '0.5vh',
    right: '1vh',
    letterSpacing: '0.1vh',
  };

  const bttitleStyle = {
    fontFamily: '"Oxanium", serif',
    fontSize: '2.7vh',
    fontStyle: 'italic',
    letterSpacing: '-0.1vh',
  };

  const dateContainerStyle = {
    color: '#ebf9fb',
    position: 'absolute',
    bottom: '0.5vh',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '98%',
    display: 'flex',
    zIndex: 6,
  };

  const clocknameStyle = {
    fontFamily: '"Oxanium", serif',
    position: 'fixed',
    left: '50%',
    transform: 'translateX(-50%)',
    fontSize: '4vh',
    lineHeight: '4vh',
  };

  const dateLeftStyle = {
    fontSize: '3vh',
    fontFamily: '"Nanum Gothic Coding", monospace',
    position: 'relative',
    left: 0,
  };

  const dateRightStyle = {
    fontSize: '3vh',
    fontFamily: '"Nanum Gothic Coding", monospace',
    position: 'absolute',
    right: 0,
  };

  return (
    <div style={containerStyle}>

      <img src={clll} alt="bg" style={bgImageStyle} />

      <div style={moonStyle}>
        <div style={clockRef ? clockStyle : {}} ref={clockRef}>12:00</div>
      </div>

      <div style={cloudStyle}></div>

      <style>{`
        @keyframes moonRise {
          0% { top: 100vh; opacity: 0; }
          25% { top: 32vh; opacity: 1; }
          50% { top: 32vh; opacity: 1; }
          60% { top: 32vh; opacity: 0; }
          100% { top: 100vh; opacity: 0; }
        }

        @keyframes cloudSweep {
          0% {
            transform: translateX(-90vw);
            opacity: 0;
          }
          40% {
            transform: translateX(-90vw);
            opacity: 0;
          }
          50% {
            transform: translateX(0);
            opacity: 1;
          }
          65% {
            transform: translateX(0);
            opacity: 1;
          }
          80% {
            transform: translateX(90vw);
            opacity: 0;
          }
          100% {
            transform: translateX(90vw);
            opacity: 0;
          }
        }

        
       
      `}</style>
    </div>
  );
};

export default CloudyNightClock;
