import React, { useEffect, useState } from 'react'
import backgroundImage from './ci.webp'
import cineFont from '../../assets/cine.ttf'

const TiltedReverseClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // Load font
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'IceFont';
        src: url(${cineFont}) format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);

    // Preload the font to ensure it's available
    const link = document.createElement('link');
    link.href = cineFont;
    link.rel = 'preload';
    link.as = 'font';
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(style);
      document.head.removeChild(link);
    };
  }, []);

  const hours24 = time.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = time.getMinutes()

  const hourDigits = String(hours12)
  const minuteDigits = String(minutes).padStart(2, '0')

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        background: 'black',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{`
        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
        }
        .flicker {
          animation: flicker 1s infinite linear;
        }
      `}</style>

      {/* Background */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom',
          filter: 'brightness(1.5) contrast(1.2) saturate(0.7) hue-rotate(45deg)',
        }}
      />

      {/* Clock */}
      <div
        style={{
          position: 'absolute',
          top: '4vh',
          right: '0vh',
          display: 'flex',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transform: `
            perspective(220vh)
            rotateX(222deg)
            rotateY(-148deg)
          `,
        }}
      >
        {hourDigits.split('').map((d, i) => (
          <div
            key={`h-${i}`}
            className="flicker"
            style={{
              width: '7vh',
              height: '22vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8vh',
              fontFamily: "'IceFont', 'Courier New', monospace",
              lineHeight: 1,
              color: '#F0DBB6FF',
              letterSpacing: '-0.1em',
              textShadow: '0 0 5px rgba(249, 222, 176, 0.7)',
              transform: 'rotateX(180deg)',
              filter: 'blur(1px)',
            }}
          >
            {d}
          </div>
        ))}
        {minuteDigits.split('').map((d, i) => (
          <div
            key={`m-${i}`}
            className="flicker"
            style={{
              width: '7vh',
              height: '22vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '8vh',
              fontFamily: "'IceFont', 'Courier New', monospace",
              lineHeight: 1,
              color: '#F0DBB6FF',
              letterSpacing: '-0.1em',
              textShadow: '0 0 5px rgba(249, 222, 176, 0.7)',
              transform: 'rotateX(180deg)',
              filter: 'blur(1px)',
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TiltedReverseClock
