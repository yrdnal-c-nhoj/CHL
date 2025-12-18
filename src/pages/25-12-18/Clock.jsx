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
        width: '10vh',
        height: '18vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16vh',
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
        width: '100vw',
        height: '100dvh', // Modern fix: uses dynamic viewport height (adjusts for mobile UI bars)
        background: 'black',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'ClockFont',
      }}
    >
      {/* font face + flicker animation */}
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

      {/* bottom background image */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100vw',
          height: '100dvh', // Also use 100dvh here to match container
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '60% bottom',
          filter: 'brightness(1.4) contrast(1) saturate(0.7) hue-rotate(30deg)',
        }}
      />

      {/* clock (tilted & reversed) */}
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
        {/* hours */}
        {hourDigits.split('').map((d, i) => (
          <DigitBox key={`h-${i}`} value={d} />
        ))}

        {/* colon (mirrored) */}
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