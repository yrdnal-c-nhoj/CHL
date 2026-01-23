import React, { useEffect, useState } from 'react'
import bgImage from '../../../assets/clocks/26-01-12/lala.jpg'
import customFont_2025_1210 from '../../../assets/fonts/26-01-19-lala.ttf?url';

const elementColor = '#885B5D'

const digitBoxStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'MuybridgeFont, serif',
  fontSize: '8vh',
  color: elementColor,
  textShadow: '0.5px 0.5px 0px white, -0.5px -0.5px 0px white',
  flexShrink: 1,
  minWidth: 0,
  overflow: 'hidden'
}

export default function DigitalClock() {
  const [time, setTime] = useState(new Date())
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    // Load font before showing content
    const font = new FontFace('MuybridgeFont', `url(${customFont_2025_1210})`)
    
    font.load().then(() => {
      document.fonts.add(font)
      setFontLoaded(true)
    }).catch(err => {
      console.error('Font loading failed:', err)
      setFontLoaded(true) // Show content anyway after error
    })
  }, [])

  useEffect(() => {
    if (!fontLoaded) return
    const interval = setInterval(() => setTime(new Date()), 100)
    return () => clearInterval(interval)
  }, [fontLoaded])

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    minHeight: '-webkit-fill-available',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundColor: '#090909FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    touchAction: 'manipulation',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'none',
    opacity: fontLoaded ? 1 : 0,
    transition: 'opacity 0.3s ease-in'
  }

  const clockContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'MuybridgeFont, serif',
    width: '100%',
    maxWidth: '100vw',
    boxSizing: 'border-box',
    transform: 'scale(0.9)',
    position: 'absolute',
    bottom: '33vh',
    left: -7,
    right: 0
  }

 
  const hours = String(time.getHours()).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

  return (
    <div style={containerStyle}>
      <style>{`
        @font-face {
          font-family: 'MuybridgeFont';
          src: url(${customFont_2025_1210}) format('opentype');
          font-display: block;
        }
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          * {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
          }
        }
      `}</style>
      <div style={clockContainerStyle}>
        <div style={digitBoxStyle} aria-hidden='true'>
          {hours[0]}
        </div>
        <div style={digitBoxStyle} aria-hidden='true'>
          {hours[1]}
        </div>
        <div style={digitBoxStyle} aria-hidden='true'>
          {minutes[0]}
        </div>
        <div style={digitBoxStyle} aria-hidden='true'>
          {minutes[1]}
        </div>
      
      </div>
    </div>
  )
}
