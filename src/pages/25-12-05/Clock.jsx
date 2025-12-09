import React, { useEffect, useState } from 'react'

// Import today's date font
import font_2025_12_06 from './magic.ttf'

// Import background image
import bgImage from './magic.webp'

export default function BoxedDigitalClock () {
  const [time, setTime] = useState(new Date())
  const [visible, setVisible] = useState(false) // Clock visibility for glitch
  const [randomOpacity, setRandomOpacity] = useState(0.2) // Random opacity for glitches

  // -------------------------------
  // Update clock every second
  // -------------------------------
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // -------------------------------
  // Random glitch in/out
  // -------------------------------
  useEffect(() => {
    // Start after 1 second
    const startTimeout = setTimeout(() => {
      const glitchLoop = () => {
        // Random delay ~0-500ms for next glitch
        const delay = 500 + Math.random() * 500

        // Set random opacity for this glitch
        setRandomOpacity(Math.random() * 0.8)

        // Show clock briefly (~1/16 second)
        setVisible(true)
        setTimeout(() => setVisible(false), 62) // 1/16 second

        // Schedule next glitch
        setTimeout(glitchLoop, delay)
      }
      glitchLoop()
    }, 1000)

    return () => clearTimeout(startTimeout)
  }, [])

  const hours = time.getHours().toString().padStart(2, '0').split('')
  const minutes = time.getMinutes().toString().padStart(2, '0').split('')
  const seconds = time.getSeconds().toString().padStart(2, '0').split('')

  const containerStyle = {
    fontFamily: 'CustomFont_2025_12_06',
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    flexDirection: 'column',
    color: '#fff',
    boxSizing: 'border-box',
    overflow: 'hidden',
    fontFeatureSettings: "'tnum'",
    position: 'relative'
  }

  const overlayStyle = {
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    background:
      'radial-gradient(circle,  rgba(18, 110, 128, 0.3) 0%,  rgba(128, 0, 128, 0.2) 100%)',
    pointerEvents: 'none'
  }

  const clockStyle = {
    display: visible ? 'flex' : 'none', // Show only during glitch
    gap: '1vw',
    alignItems: 'center',
    fontSize: '8vh',
    opacity: randomOpacity,
    transform: visible
      ? `translateX(${Math.random() * 4 - 2}px)`
      : 'translateX(0)', // slight horizontal jitter
    filter: visible
      ? `blur(${Math.random() * 1.5}px) brightness(${1 + Math.random() * 0.5})`
      : 'none',
    transition: 'all 0.05s linear'
  }

  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: '6vh',
    height: '8vh',
    borderRadius: '1vh'
  }

  const separatorStyle = {
    margin: '0 1vw'
  }

  return (
    <div style={containerStyle}>
      <style>
        {`
          @font-face {
            font-family: 'CustomFont_2025_12_06';
            src: url(${font_2025_12_06}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>

      <div style={overlayStyle}></div>

      <div style={clockStyle}>
        {hours.map((digit, i) => (
          <div key={`h${i}`} style={digitBoxStyle}>
            {digit}
          </div>
        ))}

        <div style={separatorStyle}>:</div>

        {minutes.map((digit, i) => (
          <div key={`m${i}`} style={digitBoxStyle}>
            {digit}
          </div>
        ))}

        <div style={separatorStyle}>:</div>

        {seconds.map((digit, i) => (
          <div key={`s${i}`} style={digitBoxStyle}>
            {digit}
          </div>
        ))}
      </div>
    </div>
  )
}
