import React, { useState, useEffect } from 'react'
import bgImage from './roc.webp' 
import fontFile from './roc.ttf' 

export default function RococoClock() {
  const [now, setNow] = useState(new Date())
  const [digitStyles, setDigitStyles] = useState([])
  const [fontLoaded, setFontLoaded] = useState(false)
  
  const fontFamily = 'RococoFont'

  // Load the font when component mounts
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace(fontFamily, `url(${fontFile}) format('truetype')`)
        await font.load()
        document.fonts.add(font)
        setFontLoaded(true)
      } catch (error) {
        console.error('Failed to load font:', error)
        setFontLoaded(true) // Continue even if font fails to load
      }
    }

    loadFont()
    
    const interval = setInterval(() => setNow(new Date()), 3000)
    return () => clearInterval(interval)
  }, [fontFamily])

  // Show loading state until font is ready
  if (!fontLoaded) {
    return <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      backgroundColor: '#000',
      color: '#D3C4C0FF'
    }}>Loading...</div>
  }

  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const styles = []
    const totalDigits = 6
    const spacing = isMobile ? 6 : 8 // Reduced vertical spacing for top alignment

    for (let i = 0; i < totalDigits; i++) {
      // Logic for positioning relative to the TOP
      const y = i * spacing 
      const curveOffset = (totalDigits - 1 - i) * (isMobile ? 1.5 : 2.5)
      const x = curveOffset

      let zIndex = i < 2 ? 30 : i >= 4 ? 5 : 15
      
      let baseSize, maxSize
      if (i >= 4) {
        baseSize = isMobile ? 7 : 9
        maxSize = isMobile ? 18 : 25
      } else {
        baseSize = isMobile ? 9 : 11
        maxSize = isMobile ? 26 : 38
      }
      const scaleFactor = isMobile ? 0.7 : 1

      styles.push({
        display: 'inline-block',
        fontFamily: `'${fontFamily}', serif`,
        fontSize: `${baseSize + Math.random() * maxSize}vh`,
        color: '#D3C4C0FF',
        textShadow: `
          0.2vh 0.2vh 0.4vh rgba(255, 20, 147, 0.4),
          0.4vh 0.4vh 0.8vh rgba(50, 205, 50, 0.4),
          0 0 0.8vh rgba(255, 20, 147, 0.6),
          0 0 0.7vh rgba(50, 205, 50, 0.4)
        `,
        padding: `${0.1 + Math.random() * (isMobile ? 3 : 6)}vh ${ // Reduced padding
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
        transition: 'all 0.3s ease',
        boxSizing: 'border-box'
      })
    }
    setDigitStyles(styles)
  }, [fontId])

  const hours = now.getHours()
  const minutes = now.getMinutes()
  const isPM = hours >= 12
  const displayHours = hours % 12 === 0 ? 12 : hours % 12

  const hourDigits = displayHours.toString().split('')
  const minuteDigits = minutes.toString().padStart(2, '0').split('')
  const ampmDigits = (isPM ? 'pm' : 'am').split('')

  const containerStyle = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start', // Anchors to the top
    paddingTop: '2vh',       // Small margin from the very top edge
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundColor: '#000',
    overflow: 'hidden',
    position: 'relative',
    backgroundAttachment: 'fixed',
    boxSizing: 'border-box'
  }

  const rowStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'flex-start', // Ensure children start at the top of the row
    position: 'relative',
    width: '100%',
    height: 'auto'           // Changed from 100% to auto to prevent stretching
  }

  return (
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
        {ampmDigits.map((letter, idx) => (
          <div
            key={`ampm-${idx}`}
            style={digitStyles[hourDigits.length + minuteDigits.length + idx]}
          >
            {letter}
          </div>
        ))}
      </div>
    </div>
  )
}