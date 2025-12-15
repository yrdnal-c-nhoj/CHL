import { useState, useEffect } from 'react'
import bgImage from './steel.webp'
import digitTexture from './steel2.webp'
import screw251214 from './screw.ttf'

export default function DigitalClock () {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  const hoursDigits = hours.split('')
  const minutesDigits = minutes.split('')
  const secondsDigits = seconds.split('')

  const allDigits = [...hoursDigits, ...minutesDigits, ...secondsDigits]

  // Stable per-digit random texture offsets
  const [textureOffsets] = useState(() =>
    allDigits.map(() => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100)
    }))
  )

  const containerStyle = {
    width: '100vw',
    height: '100dvh', // Dynamic viewport height — adjusts for mobile UI bars
    fallback: '100vh', // Fallback for very old browsers
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden'
  }

  const clockStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4vmin', // Reduced gap, scales with screen
    alignItems: 'center'
  }

  const rowStyle = {
    display: 'flex',
    gap: '1.5vmin', // Scaled spacing between digits
    justifyContent: 'center',
    alignItems: 'center'
  }

  const digitBox = {
    width: '14vmin', // Slightly smaller for mobile fit
    height: '14vmin',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  }

  const digitStyle = {
    fontSize: '14vmin', // Key change: vmin scales perfectly on mobile
    fontFamily: 'screw251214',
    lineHeight: '1',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    transform: 'translateZ(0)',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    backgroundImage: `url(${digitTexture})`,
    backgroundSize: '320% 320%',
    backgroundRepeat: 'no-repeat',
    color: 'transparent',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    filter: 'contrast(1.15) brightness(1.05)',
    textShadow: `
      -0.08vh -0.08vh 0.18vh rgba(255,255,255,0.35),
       0.08vh 0.08vh 0.22vh rgba(0,0,0,0.55)
    `
  }

  let textureIndex = 0
  const renderDigits = (digits, prefix) =>
    digits.map((digit, i) => {
      const o = textureOffsets[textureIndex++]
      return (
        <span key={`${prefix}${i}`} style={digitBox}>
          <span
            style={{
              ...digitStyle,
              backgroundPosition: `${o.x}% ${o.y}%`
            }}
          >
            {digit}
          </span>
        </span>
      )
    })

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: 'screw251214';
            src: url(${screw251214});
          }
        `}
      </style>
      <div style={clockStyle}>
        <div style={rowStyle}>{renderDigits(hoursDigits, 'h')}</div>
        <div style={rowStyle}>{renderDigits(minutesDigits, 'm')}</div>
        <div style={rowStyle}>{renderDigits(secondsDigits, 's')}</div>
      </div>
    </div>
  )
}
