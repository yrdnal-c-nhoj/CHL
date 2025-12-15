import React, { useState, useEffect } from 'react'
import bgImage from './roc.webp' // Background image in same folder
import rococoFont_251214 from './roc.ttf' // Font imported with today's date

export default function RococoClock () {
  const [now, setNow] = useState(new Date())
  const [digitStyles, setDigitStyles] = useState([])

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  // Generate styles once when component mounts
  useEffect(() => {
    const styles = []
    const totalDigits = 6
    const radius = -11 // Reduced radius for closer spacing

    for (let i = 0; i < totalDigits; i++) {
      // Calculate position along the curve with 15° clockwise tilt
      const baseAngle = (i - (totalDigits - 1) / 2) * 33 // Reduced spread to 12 degrees per digit
      const tiltedAngle = baseAngle + 50 // Add 30° clockwise tilt to entire curve
      const x = Math.sin((tiltedAngle * Math.PI) / 180) * Math.abs(radius)
      const y = (1 - Math.cos((baseAngle * Math.PI) / 180)) * radius

      styles.push({
        display: 'inline-block',
        fontFamily: `'Roco Revival', serif`,
        fontSize: `${5 + Math.random() * 29}vh`,
        color: '#D3C4C0FF',
        textShadow: `
          2px 2px 4px rgba(255, 20, 147, 0.4),
          4px 4px 8px rgba(50, 205, 50, 0.4),
          0 0 8px rgba(255, 20, 147, 0.6),
          0 0 7px rgba(50, 205, 50, 0.4)
        `,
        padding: `${0.1 + Math.random() * 11.3}vh ${
          0.1 + Math.random() * 0.4
        }vh`,
        margin: `${0.01 + Math.random() * 2.4}vh`,
        position: 'absolute',
        transform: `
          translate(${x}vh, ${y}vh)
          rotate(${Math.random() * 60 - 30}deg)
          skew(${Math.random() * 15 - 7.5}deg, ${Math.random() * 15 - 7.5}deg)
          scale(${0.8 + Math.random() * 0.4}, ${0.8 + Math.random() * 0.4})
        `,
        transformOrigin: 'center center'
      })
    }
    setDigitStyles(styles)
  }, [])

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const isPM = hours >= 12
  const displayHours = hours % 12 === 0 ? 12 : hours % 12

  const hourDigits = displayHours.toString().split('')
  const minuteDigits = minutes.toString().padStart(2, '0').split('')

  const containerStyle = {
    fontFamily: `'Roco Revival', serif`,
    height: '100vh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'auto 100%', // Height 100%, width auto to maintain aspect ratio
    backgroundPosition: 'center', // Center the background
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#000', // Black background to fill any empty space
    overflow: 'hidden',
    position: 'relative', // For potential absolute positioning of children
    backgroundAttachment: 'fixed' // Optional: keeps the background fixed during scroll
  }

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const ampm = (isPM ? 'pm' : 'am').split('')

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'Roco Revival';
            src: url(${rococoFont_251214}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>
      <div style={containerStyle}>
        <div style={rowStyle}>
          {hourDigits.map((digit, idx) => (
            <div key={`h-${idx}`} style={digitStyles[idx]}>
              {digit}
            </div>
          ))}
          {minuteDigits.map((digit, idx) => (
            <div key={`m-${idx}`} style={digitStyles[hourDigits.length + idx]}>
              {digit}
            </div>
          ))}
          {ampm.map((letter, idx) => (
            <div key={`ampm-${idx}`} style={digitStyles[4 + idx]}>
              {letter}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
