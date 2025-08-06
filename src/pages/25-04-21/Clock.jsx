import React, { useEffect } from 'react';
import backgroundImg from './Untitled.jpeg';
import leftHalfImg from './peacock.gif';
import rightHalfImg from './peee.webp';
import cornerImg from './Pea.gif';
import hourImg from './Peaco.png';
import minuteImg from './fea.png';
import secondImg from './Peacok.gif';

const PeacockClock = () => {
  useEffect(() => {
    const hourHand = document.querySelector('.hour');
    const minuteHand = document.querySelector('.minute');
    const secondHand = document.querySelector('.second');

    const updateClockSmooth = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const s = now.getSeconds() + ms / 1000;
      const m = now.getMinutes() + s / 60;
      const h = now.getHours() % 12 + m / 60;

      hourHand.style.transform = `rotate(${h * 30}deg)`;
      minuteHand.style.transform = `rotate(${m * 6}deg)`;
      secondHand.style.transform = `rotate(${s * 6}deg)`;

      requestAnimationFrame(updateClockSmooth);
    };

    requestAnimationFrame(updateClockSmooth);
  }, []);

  const rotatingWrapperStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '100vw',
    height: '100vh',
    transform: 'translate(-50%, -50%)',
    transformOrigin: 'center center',
    pointerEvents: 'none',
  };

  const splitContainerStyle = {
    display: 'flex',
    width: '100%',
    height: '100%',
  };

  const halfStyle = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const keyframes = `
    @keyframes rotate {
      from { transform: translate(-50%, -50%) rotate(0deg); }
      to { transform: translate(-50%, -50%) rotate(360deg); }
    }
  `;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        backgroundImage: `url(${backgroundImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        fontFamily: '"Oxanium", "Libre Baskerville", "Roboto Slab", "Syne Mono", "Nanum Gothic Coding", sans-serif',
      }}
    >
      <style>{keyframes}</style>

      <img
        src={cornerImg}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          opacity: 0.6,
          height: 'auto',
          zIndex: 5,
        }}
        alt="corner"
      />
      <img
        src={cornerImg}
        style={{
          transform: 'scale(-1, -1)',
          position: 'fixed',
          bottom: 0,
          right: 0,
          opacity: 0.5,
          height: 'auto',
          zIndex: 5,
        }}
        alt="corner mirrored"
      />

      <div
        className="rotate-cw"
        style={{
          ...rotatingWrapperStyle,
          animation: 'rotate 180s linear infinite',
          zIndex: 1,
          opacity: 0.7,
        }}
      >
        <div style={splitContainerStyle}>
          <div style={{ ...halfStyle, backgroundImage: `url(${leftHalfImg})` }}></div>
          <div style={{ ...halfStyle, backgroundImage: `url(${rightHalfImg})` }}></div>
        </div>
      </div>

      <div
        className="rotate-ccw"
        style={{
          ...rotatingWrapperStyle,
          animation: 'rotate 175s linear infinite reverse',
          zIndex: 2,
          opacity: 0.5,
        }}
      >
        <div style={splitContainerStyle}>
          <div style={{ ...halfStyle, backgroundImage: `url(${leftHalfImg})` }}></div>
          <div style={{ ...halfStyle, backgroundImage: `url(${rightHalfImg})` }}></div>
        </div>
      </div>

      <div
        className="clock-wrapper"
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: '80vmin',
          aspectRatio: '1 / 1',
          transform: 'translate(-50%, -50%)',
          zIndex: 9,
        }}
      >
        <div
          className="clock"
          style={{
            position: 'absolute',
            top: '30vh',
            left: 0,
            width: '100%',
            height: '100%',
            filter: 'saturate(1.6)',
            zIndex: 9,
          }}
        >
          <div className="hand minute" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, transformOrigin: 'center', pointerEvents: 'none' }}>
            <img src={minuteImg} alt="minute hand" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', height: '44vh', zIndex: 6, filter: 'brightness(120%)' }} />
          </div>
          <div className="hand hour" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, transformOrigin: 'center', pointerEvents: 'none' }}>
            <img src={hourImg} alt="hour hand" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)', height: '44vh', zIndex: 9, filter: 'contrast(120%) brightness(100%)' }} />
          </div>
          <div className="hand second" style={{ position: 'absolute', width: '100%', height: '100%', top: 0, left: 0, transformOrigin: 'center', pointerEvents: 'none' }}>
            <img src={secondImg} alt="second hand" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%) rotate(240deg)', height: '36vh', filter: 'brightness(160%)' }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PeacockClock;
