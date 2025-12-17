import { useState, useEffect } from 'react'

import bgImage from './steel.webp'
import digitTexture from './steel2.webp'

// Font imported with today's date (December 16, 2025)
import screw251214 from './screw.ttf?url'

export default function DigitalClock() {
  const [time, setTime] = useState(new Date())
  const [fontLoaded, setFontLoaded] = useState(false)

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Load and detect the custom font as early as possible
  useEffect(() => {
    if (!document.fonts) {
      setFontLoaded(true) // fallback if FontFaceSet API not supported
      return
    }

    const font = new FontFace('screw251214', `url(${screw251214})`)

    document.fonts.add(font)

    font.load().then(() => {
      setFontLoaded(true)
    }).catch(() => {
      setFontLoaded(true) // proceed even if load fails
    })

    // Also listen to the global fonts ready state for safety
    document.fonts.ready.then(() => {
      if (document.fonts.check('1em screw251214')) {
        setFontLoaded(true)
      }
    })
  }, [])

  const hours = time.getHours().toString().padStart(2, '0')
  const minutes = time.getMinutes().toString().padStart(2, '0')
  const seconds = time.getSeconds().toString().padStart(2, '0')

  const hoursDigits = hours.split('')
  const minutesDigits = minutes.split('')
  const secondsDigits = seconds.split('')

  const allDigits = [...hoursDigits, ...minutesDigits, ...secondsDigits]

  const [textureOffsets] = useState(() =>
    allDigits.map(() => ({
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
    }))
  )

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    fontFamily: fontLoaded
      ? '"screw251214", monospace'
      : 'monospace', // solid fallback before custom font loads
  }

  const clockStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '4vmin',
    alignItems: 'center',
    opacity: fontLoaded ? 1 : 0, // hide until font is ready (avoids FOUC)
    transition: 'opacity 0.2s ease-in',
  }

  const rowStyle = {
    display: 'flex',
    gap: '1.5vmin',
    alignItems: 'center',
  }

  const digitBoxStyle = {
    width: '14vmin',
    height: '14vmin',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }

  const digitStyle = {
    fontSize: '14vmin',
    fontFamily: 'inherit',
    lineHeight: '1',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    backgroundImage: `url(${digitTexture})`,
    backgroundSize: '320% 320%',
    backgroundRepeat: 'no-repeat',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
    WebkitTextFillColor: 'transparent',
    filter: 'contrast(1.15) brightness(1.05)',
    textShadow: `
      -0.08vh -0.08vh 0.18vh rgba(255,255,255,0.35),
       0.08vh  0.08vh 0.22vh rgba(0,0,0,0.55)
    `,
    transform: 'translateZ(0)',
    display: 'inline-block',
    whiteSpace: 'nowrap',
  }

  let textureIndex = 0

  const renderDigits = (digits, prefix) =>
    digits.map((digit, i) => {
      const offset = textureOffsets[textureIndex++]
      return (
        <span key={`${prefix}-${i}`} style={digitBoxStyle}>
          <span
            style={{
              ...digitStyle,
              backgroundPosition: `${offset.x}% ${offset.y}%`,
            }}
          >
            {digit}
          </span>
        </span>
      )
    })

  return (
    <div style={containerStyle}>
      {/* @font-face declared inline with Vite blob URL + font-display: swap */}
      <style>
        {`
          @font-face {
            font-family: 'screw251214';
            src: url(${screw251214}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
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