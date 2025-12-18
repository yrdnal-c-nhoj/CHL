import React, { useEffect, useState } from 'react'

// local assets (same folder)
import backgroundImage from './bg.webp'
import font_2025_12_17 from './movie.ttf'

const TiltedReverseClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours24 = time.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = time.getMinutes()
  const ampm = hours24 >= 12 ? 'PM' : 'AM'

  const hourDigits = String(hours12)
  const minuteDigits = String(minutes).padStart(2, '0')

  const DigitBox = ({ value }) => (
    <div
      className="flicker"
      style={{
        width: '8vw',
        minWidth: '40px',
        height: '14vh',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 'min(16vh, 14vw)',
        lineHeight: 1,
        color: '#FBE6C5FF',
        transform: 'rotateX(180deg)', // flip each digit around on horizontal axis 180°
        filter: 'blur(1px)',
      }}
    >
      {value}
    </div>
  )

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'black',
        position: 'relative',
        overflow: 'visible',
        fontFamily: 'ClockFont',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* font face */}
      <style>{`
        @font-face {
          font-family: 'ClockFont';
          src: url(${font_2025_12_17}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% {
            opacity: 1;
          }
          20%, 24%, 55% {
            opacity: 0.4;
          }
        }

        .flicker {
          animation: flicker 1s infinite linear;
        }
      `}</style>

      {/* bottom image */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          // color: 'white',
          width: '100vw',
          height: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '55% bottom',
          filter: 'brightness(1.4) contrast(1) saturate(0.7) hue-rotate(30deg)',
          // opacity: 0.9,
        }}
      />

      {/* clock */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          right: '50%',
          transform: 'translate(50%, -50%) scale(0.8)',
          display: 'flex',
          alignItems: 'center',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          perspective: '1000px',
          transform: `
            translate(50%, -50%)
            perspective(1000px)
            rotateX(60deg)
            rotateY(-30deg)
            scale(0.8)
          `,
          '@media (max-width: 768px)': {
            transform: `
              translate(50%, -50%)
              perspective(800px)
              rotateX(60deg)
              rotateY(-30deg)
              scale(0.6)
            `,
          },
        }}
      >
        {/* hours */}
        {hourDigits.split('').map((d, i) => (
          <DigitBox key={`h-${i}`} value={d} />
        ))}

        {/* colon */}
        <div
          style={{
            fontSize: '0.1vh',
            lineHeight: 1,
            transform: 'scaleX(-1)',
            opacity: 0.9,
          }}
        >
          :
        </div>

        {/* minutes */}
        {minuteDigits.split('').map((d, i) => (
          <DigitBox key={`m-${i}`} value={d} />
        ))}

      </div>
    </div>
  )
}

export default TiltedReverseClock
