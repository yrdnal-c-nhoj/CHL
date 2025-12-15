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
    const isMobile = window.innerWidth <= 768 // Check if mobile device
    const styles = []
    const totalDigits = 6
    const spacing = isMobile ? 8 : 12 // Vertical spacing between digits

    for (let i = 0; i < totalDigits; i++) {
      // Calculate curved position (gentle curve drifting right at top)
      const y = i * spacing
      // Create a gentle curve: higher digits (bottom) more left, lower digits (top) drift right
      const curveOffset = (totalDigits - 1 - i) * (isMobile ? 1.5 : 2.5) // Adjust curve strength
      const x = curveOffset

      // Determine z-index based on time component (hours highest, minutes middle, ampm lowest)
      let zIndex
      if (i < 2) {
        zIndex = 30 // Hours - highest
      } else if (i >= 4) {
        zIndex = 5 // AM/PM - lowest
      } else {
        zIndex = 15 // Minutes - middle
      }

      // Adjust sizes based on device and component type
      let baseSize, maxSize
      if (i >= 4) {
        // AM/PM - smaller
        baseSize = isMobile ? 7 : 9
        maxSize = isMobile ? 18 : 25
      } else {
        // Hours and Minutes - normal size
        baseSize = isMobile ? 9 : 11
        maxSize = isMobile ? 26 : 38
      }
      const scaleFactor = isMobile ? 0.7 : 1

      styles.push({
        display: 'inline-block',
        fontFamily: `'Roco Revival', serif`,
        fontSize: `${baseSize + Math.random() * maxSize}vh`,
        color: '#D3C4C0FF',
        textShadow: `
          2px 2px 4px rgba(255, 20, 147, 0.4),
          4px 4px 8px rgba(50, 205, 50, 0.4),
          0 0 8px rgba(255, 20, 147, 0.6),
          0 0 7px rgba(50, 205, 50, 0.4)
        `,
        padding: `${0.1 + Math.random() * (isMobile ? 5 : 11.3)}vh ${
          0.1 + Math.random() * 0.4
        }vh`,
        margin: `${0.01 + Math.random() * (isMobile ? 1.2 : 2.4)}vh`,
        position: 'absolute',
        zIndex: zIndex,
        transform: `
          translate(${x}vh, ${y}vh)
          rotate(${(Math.random() * 60 - 30) * scaleFactor}deg)
          skew(${(Math.random() * 15 - 7.5) * scaleFactor}deg, ${
          (Math.random() * 15 - 7.5) * scaleFactor
        }deg)
          scale(${0.8 + Math.random() * 0.4 * scaleFactor}, ${
          0.8 + Math.random() * 0.4 * scaleFactor
        })
        `,
        transformOrigin: 'center center',
        transition: 'all 0.3s ease' // Smooth transition on resize
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
    alignItems: 'flex-start',
    paddingTop: '15vh',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover', // Cover the entire container
    backgroundPosition: 'left', // Center the background
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#000', // Black background to fill any empty space
    overflow: 'hidden',
    position: 'relative',
    backgroundAttachment: 'fixed',
    '@media (max-width: 768px)': {
      backgroundSize: 'contain', // Use contain on mobile to ensure full visibility
      backgroundPosition: 'center center'
    }
  }

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'center',
    '@media (max-width: 768px)': {
      transform: 'scale(0.8)' // Slightly reduce size on mobile
    },
    '@media (max-width: 480px)': {
      transform: 'scale(0.6)' // Even smaller on very small devices
    }
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
            <div
              key={`ampm-${idx}`}
              style={digitStyles[hourDigits.length + minuteDigits.length + idx]}
            >
              {letter}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
