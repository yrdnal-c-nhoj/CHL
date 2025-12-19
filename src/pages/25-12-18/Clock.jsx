import React, { useEffect, useState } from 'react'

const TiltedReverseClock = () => {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hours24 = time.getHours()
  const hours12 = hours24 % 12 || 12
  const minutes = time.getMinutes()

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
        color: '#F9DEB0FF',
        fontFamily: 'ClockFont, monospace',
        transform: 'rotateX(180deg)',
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
        height: '100dvh',
        background: 'black',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: 'ClockFont, monospace',
      }}
    >
      {/* font + flicker injection */}
      <style>{`
        @font-face {
          font-family: 'ClockFont';
          src: url('/movie.ttf') format('truetype');
          font-weight: normal;
          font-style: normal;
          font-display: swap;
        }

        @keyframes flicker {
          0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
          20%, 24%, 55% { opacity: 0.4; }
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
          height: '100dvh',
          backgroundImage: `url(/ci.webp)`,
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left bottom',
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
        {hourDigits.split('').map((d, i) => (
          <DigitBox key={`h-${i}`} value={d} />
        ))}
        {minuteDigits.split('').map((d, i) => (
          <DigitBox key={`m-${i}`} value={d} />
        ))}
      </div>
    </div>
  )
}

export default TiltedReverseClock
