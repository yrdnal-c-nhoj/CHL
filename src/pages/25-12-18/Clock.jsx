import React, { useEffect, useState } from 'react'
import dripFont from './drip.ttf'
import backgroundImage from './ci.webp'

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

  // Resolve font URL safely for production
  const dripFontUrl = new URL('./drip.ttf', import.meta.url).href

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
        fontFamily: 'DripFont, sans-serif',
        lineHeight: 1,
        color: '#F6DDB2FF',
        letterSpacing: '-0.1em',
        textShadow: '0 0 5px rgba(249, 222, 176, 0.7)',
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
      }}
    >
      {/* Inject font-face + flicker animation */}
      <style>{`
        @font-face {
          font-family: 'DripFont';
          src: url('${dripFontUrl}') format('truetype');
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

      {/* Bottom background image */}
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
          filter: 'brightness(1.4) contrast(1) saturate(0.7) hue-rotate(30deg)',
        }}
      />

      {/* Clock (tilted & reversed) */}
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
