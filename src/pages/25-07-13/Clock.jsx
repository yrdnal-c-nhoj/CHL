import React, { useEffect, useRef } from 'react';
import rorFont from './ror.ttf'; // Local font in same folder

const RorschachClock = () => {
  const clockRef = useRef(null);
  const mirrorClockRef = useRef(null);

  useEffect(() => {
    const font = new FontFace('ror', `url(${rorFont})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);

      // Wait until font is loaded to begin
      const getRandomFontSize = (min = 5, max = 14) => {
        const value = Math.random() * (max - min) + min;
        return `${value}vh`;
      };

      const wrapDigits = (timeStr, ampm) => {
        const digitsHtml = timeStr
          .split('')
          .map(char => {
            const size = getRandomFontSize();
            return `<span style="font-size: ${size};">${char}</span>`;
          })
          .join('');

        const ampmHtml = ampm
          .split('')
          .map(char => {
            const size = getRandomFontSize(2, 4);
            return `<span class="ampm" style="font-size: ${size};">${char}</span>`;
          })
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
          ampm
        };
      };

      const fadeUpdateClock = () => {
        const clock = clockRef.current;
        const mirrorClock = mirrorClockRef.current;

        if (clock && mirrorClock) {
          clock.style.opacity = 0;
          mirrorClock.style.opacity = 0;

          setTimeout(() => {
            const { timeString, ampm } = formatTime(new Date());
            const wrapped = wrapDigits(timeString, ampm);
            clock.innerHTML = wrapped;
            mirrorClock.innerHTML = wrapped;

            clock.style.opacity = 1;
            mirrorClock.style.opacity = 1;
          }, 1500);
        }
      };

      fadeUpdateClock();
      const interval = setInterval(fadeUpdateClock, 5000);
      return () => clearInterval(interval);
    });
  }, []);

  const baseContainerStyle = {
    fontFamily: `'ror', monospace, sans-serif`,
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  };

  const clockStyle = {
    fontWeight: 'bold',
    color: '#333',
    whiteSpace: 'nowrap',
    display: 'flex',
    padding: 0,
    margin: 0,
    opacity: 1,
    transition: 'opacity 1.5s ease',
  };

  const leftContainerStyle = {
    ...baseContainerStyle,
    left: 'calc(50% - 20vw)',
  };

  const rightContainerStyle = {
    ...baseContainerStyle,
    right: 'calc(50% - 20vw)',
  };

  const leftClockStyle = {
    ...clockStyle,
    transform: 'rotate(-90deg) scaleX(-1)',
  };

  const rightClockStyle = {
    ...clockStyle,
    transform: 'rotate(90deg)',
  };

  const bodyStyle = {
    margin: 0,
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f0f0',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div style={bodyStyle}>
      <div style={leftContainerStyle}>
        <div ref={mirrorClockRef} style={leftClockStyle}>00:00<span className="ampm">AM</span></div>
      </div>
      <div style={rightContainerStyle}>
        <div ref={clockRef} style={rightClockStyle}>00:00<span className="ampm">AM</span></div>
      </div>
    </div>
  );
};

export default RorschachClock;
