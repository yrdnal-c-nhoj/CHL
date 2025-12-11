import React, { useEffect, useState } from 'react'
import bgImage from './muybridge.webp'
import customFont_2025_1210 from './muyb.otf' // font imported as a blob via Vite

// Create a style for the font-face dynamically
const fontFaceStyle = {
  '@font-face': {
    fontFamily: 'MuybridgeFont',
    src: `url(${customFont_2025_1210}) format('opentype')`
  }
}

const elementColor = '#AE6AA7FF'

const digitBoxStyle = {
  position: 'relative',
  width: 'clamp(20px, 10vw, 50px)',
  aspectRatio: '0.7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontFamily: 'MuybridgeFont, serif',
  fontSize: 'clamp(24px, 12vw, 48px)',
  color: elementColor,
  textShadow: '0.5px 0.5px 0px black, -0.5px -0.5px 0px white',
  flexShrink: 1,
  minWidth: 0,
  overflow: 'hidden'
}

export default function DigitalClock () {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 100)
    return () => clearInterval(interval)
  }, [])

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
    backgroundPosition: 'center',
    backgroundColor: '#090909FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    touchAction: 'manipulation',
    WebkitOverflowScrolling: 'touch',
    overscrollBehavior: 'none'
  }

  const clockContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'MuybridgeFont, serif',
    width: '100%',
    maxWidth: '100vw',
    padding: '0 10px',
    boxSizing: 'border-box',
    transform: 'scale(0.9)'
  }

  const separatorStyle = {
    fontSize: 'clamp(24px, 12vw, 48px)',
    color: elementColor,
    margin: '0 1vw',
    fontWeight: 'bold',
    lineHeight: 1,
    paddingBottom: '0.5vw',
    flexShrink: 0
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
        }
        /* Prevent font boosting on mobile */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          * {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
          }
        }
      `}</style>
      <div style={clockContainerStyle}>
        <div style={digitBoxStyle} aria-hidden="true">{hours[0]}</div>
        <div style={digitBoxStyle} aria-hidden="true">{hours[1]}</div>
        <div style={separatorStyle} aria-hidden="true">:</div>
        <div style={digitBoxStyle} aria-hidden="true">{minutes[0]}</div>
        <div style={digitBoxStyle} aria-hidden="true">{minutes[1]}</div>
        <div style={separatorStyle} aria-hidden="true">:</div>
        <div style={digitBoxStyle} aria-hidden="true">{seconds[0]}</div>
        <div style={digitBoxStyle} aria-hidden="true">{seconds[1]}</div>
      </div>
    </div>
  )
}
