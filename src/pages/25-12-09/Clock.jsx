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
  width: 'clamp(20px, 8vw, 40px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  // margin: '0 2px',
  fontFamily: 'MuybridgeFont, serif',
  fontSize: 'clamp(24px, 10vw, 48px)',
  color: elementColor,
  textShadow: '0.5px 0.5px 0px black, -0.5px -0.5px 0px white'
}

export default function DigitalClock () {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 100)
    return () => clearInterval(interval)
  }, [])

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: '#090909FF',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const clockContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'MuybridgeFont, serif'
  }

  const separatorStyle = {
    fontSize: 'clamp(24px, 10vw, 48px)',
    color: elementColor,
    // margin: '0 10px',
    fontWeight: 'bold'
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
      `}</style>
      <div style={clockContainerStyle}>
        <div style={digitBoxStyle}>{hours[0]}</div>
        <div style={digitBoxStyle}>{hours[1]}</div>
        <div style={separatorStyle}>:</div>
        <div style={digitBoxStyle}>{minutes[0]}</div>
        <div style={digitBoxStyle}>{minutes[1]}</div>
        <div style={separatorStyle}>:</div>
        <div style={digitBoxStyle}>{seconds[0]}</div>
        <div style={digitBoxStyle}>{seconds[1]}</div>
      </div>
    </div>
  )
}
