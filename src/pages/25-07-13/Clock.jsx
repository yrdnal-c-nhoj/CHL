import React, { useEffect, useRef } from 'react';
import rorFontUrl from './ror.ttf';

const RorschachClock = () => {
  const clockRef = useRef();
  const mirrorRef = useRef();

  // Load the custom font
  useEffect(() => {
    const font = new FontFace('ror', `url(${rorFontUrl})`);
    font.load().then((loaded) => {
      document.fonts.add(loaded);
    });
  }, []);

  const getRandomFontSize = (min = 5, max = 14) => {
    return (Math.random() * (max - min) + min).toFixed(2) + 'vh';
  };

  const getRandomAmpmSize = (min = 2, max = 4) => {
    return (Math.random() * (max - min) + min).toFixed(2) + 'vh';
  };

  const wrapDigits = (timeStr, ampm) => {
    const digitsHtml = timeStr
      .split('')
      .map((char, i) => `<span style="font-size: ${getRandomFontSize()};">${char}</span>`)
      .join('');

    const ampmHtml = ampm
      .split('')
      .map((char) => `<span class="ampm" style="font-size: ${getRandomAmpmSize()};">${char}</span>`)
      .join('');

    return digitsHtml + ampmHtml;
  };

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return {
      timeString: `${hours}:${minutes}`,
      ampm,
    };
  };

  const fadeUpdateClock = () => {
    if (!clockRef.current || !mirrorRef.current) return;

    clockRef.current.style.opacity = 0;
    mirrorRef.current.style.opacity = 0;

    setTimeout(() => {
      const now = new Date();
      const { timeString, ampm } = formatTime(now);
      const html = wrapDigits(timeString, ampm);

      clockRef.current.innerHTML = html;
      mirrorRef.current.innerHTML = html;

      clockRef.current.style.opacity = 1;
      mirrorRef.current.style.opacity = 1;
    }, 1500);
  };

  useEffect(() => {
    fadeUpdateClock();
    const interval = setInterval(fadeUpdateClock, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerStyle = {
    margin: 0,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0f0',
    position: 'relative',
    fontFamily: 'ror, monospace, sans-serif',
  };

  const clockContainerStyle = {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const clockStyle = (rotate, flip) => ({
    fontWeight: 'bold',
    color: '#333',
    whiteSpace: 'nowrap',
    display: 'flex',
    padding: 0,
    margin: 0,
    opacity: 1,
    transition: 'opacity 1.5s ease',
    transform: `rotate(${rotate}) ${flip ? 'scaleX(-1)' : ''}`,
  });

  return (
    <div style={containerStyle}>
     

      <div style={{ ...clockContainerStyle, left: 'calc(50% - 20vw)' }}>
        <div ref={mirrorRef} style={clockStyle('-90deg', true)} id="mirrorClock"></div>
      </div>

      <div style={{ ...clockContainerStyle, right: 'calc(50% - 20vw)' }}>
        <div ref={clockRef} style={clockStyle('90deg', false)} id="clock"></div>
      </div>
    </div>
  );
};

export default RorschachClock;
