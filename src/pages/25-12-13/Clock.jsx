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
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
  }

  const clockStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 'min(4vh, 4vw)',
    alignItems: 'center',
    padding: '20px',
    maxHeight: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    justifyContent: 'center',
    flex: '1 1 auto'
  }

  const rowStyle = {
    display: 'flex',
    gap: 'min(2vw, 2vh)',
    justifyContent: 'center',
    alignItems: 'center'
  }

  // Transparent digit container (no plate)
  const digitBox = {
    width: 'min(12vh, 12vw)',
    height: 'min(12vh, 12vw)',
    minWidth: '40px',
    minHeight: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flexShrink: 0
  }

  // Machined steel digit
  const digitStyle = {
    fontSize: 'min(12vh, 12vw)',
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
    -0.28vh -0.28vh 0.1vh rgba(255,255,255,0.35),
     0.28vh  0.28vh 0.1vh rgba(0,0,0,0.55)
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
