import React, { useEffect, useState } from 'react'
import bgImage from './wheel.svg'
import clockFont_251213 from './wheel.otf' // ← today’s date in variable name

export default function AnalogBackgroundClock () {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100)
    return () => clearInterval(id)
  }, [])

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000
  const minutes = now.getMinutes() + seconds / 60
  const hours = (now.getHours() % 12) + minutes / 60

  /* ---------------- FONT INJECTION ---------------- */

  const fontStyle = `
    @font-face {
      font-family: 'ClockDigits251213';
      src: url(${clockFont_251213}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `

  /* ---------------- COLOR CYCLING ---------------- */

  const cycleProgress = (Date.now() % 15000) / 15000
  const getBrightness = offset =>
    (Math.sin((cycleProgress + offset) * Math.PI * 2) + 1) / 2

  const makeHand = (brightness, width, height, rotation) => {
    const v = Math.round(brightness * 255)
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width,
      height,
      background: `rgb(${v},${v},${v})`,
      transformOrigin: '50% 100%',
      transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
      borderRadius: '1vh',
      boxShadow: `0 4px 10px rgb(${255 - v},${255 - v},${255 - v})`,
      opacity: 0.85
    }
  }

  const hourHand = makeHand(getBrightness(0), '2vh', '14vh', hours * 30)
  const minuteHand = makeHand(getBrightness(0.25), '1.5vh', '20vh', minutes * 6)
  const secondHand = makeHand(getBrightness(0.5), '0.5vh', '30vh', seconds * 6)

  /* ---------------- BACKGROUND ---------------- */

  const hue = ((Date.now() / 30000) * 360) % 360
  const gradient = `hsl(${hue}, 100%, 50%)`

  /* ---------------- LETTERS ---------------- */

  const letters = 'ABCDEFGHIJKL'.split('')
  const numbers = []
  for (let i = 0; i < 12; i++) {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    const x = 35 * Math.cos(angle)
    const y = 35 * Math.sin(angle)

    numbers.push(
      <div
        key={i}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(${x}vh, ${y}vh) translate(-50%, -50%)`,
          fontSize: '4vh',
          fontFamily: 'ClockDigits251213',
          fontWeight: 'normal',

          /* 🔥 TRUE OPPOSITE COLOR OF WHAT’S UNDER IT */
          color: 'white',
          mixBlendMode: 'difference',

          userSelect: 'none',
          pointerEvents: 'none'
        }}
      >
        {letters[i]}
      </div>
    )
  }

  return (
    <>
      {/* Inject font-face */}
      <style>{fontStyle}</style>

      {/* Gradient */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: gradient,
          zIndex: 1
        }}
      />

      {/* Wheel image */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          zIndex: 2
        }}
      />

      {/* Clock */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '80vh',
            height: '80vh',
            borderRadius: '50%'
          }}
        >
          {numbers}
          <div style={hourHand} />
          <div style={minuteHand} />
          <div style={secondHand} />
        </div>
      </div>
    </>
  )
}
