import React, { useState, useEffect, useRef } from 'react'
import bgImage from './roc.webp' // Background image in same folder
import rococoFont_251214 from './roc.ttf' // Font imported with today's date

export default function RococoClock () {
  const [now, setNow] = useState(new Date())
  const [digitStyles, setDigitStyles] = useState([])
  const animationRef = useRef()
  const lastUpdateTime = useRef(0)
  const offsets = useRef([])
  const speeds = useRef([])
  const rotations = useRef([])

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(interval)
  }, [])

  // Initialize animation values
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const totalDigits = 6
    
    // Initialize random offsets and speeds
    offsets.current = Array(totalDigits).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 20,
      y: (Math.random() - 0.5) * 20,
      rotation: (Math.random() - 0.5) * 30,
      scale: 0.9 + Math.random() * 0.2
    }));
    
    speeds.current = Array(totalDigits).fill(0).map(() => ({
      x: (Math.random() - 0.5) * 0.1,
      y: (Math.random() - 0.5) * 0.1,
      rotation: (Math.random() - 0.5) * 0.1,
      scale: 0.999 + (Math.random() * 0.002) // Very subtle scale change
    }));
    
    rotations.current = Array(totalDigits).fill(0).map(() => ({
      current: Math.random() * 360,
      speed: (Math.random() - 0.5) * 2
    }));
  }, [])

  // Animation loop
  useEffect(() => {
    const isMobile = window.innerWidth <= 768
    const totalDigits = 6
    const spacing = isMobile ? 8 : 12
    
    const animate = (timestamp) => {
      if (!lastUpdateTime.current) {
        lastUpdateTime.current = timestamp
      }
      
      const deltaTime = timestamp - lastUpdateTime.current
      lastUpdateTime.current = timestamp
      
      // Update positions and rotations
      const newStyles = []
      
      for (let i = 0; i < totalDigits; i++) {
        // Update offsets with smooth movement
        const offset = offsets.current[i]
        const speed = speeds.current[i]
        const rotation = rotations.current[i]
        
        // Update rotation
        rotation.current = (rotation.current + rotation.speed * deltaTime * 0.02) % 360
        
        // Update position with smooth random movement
        offset.x += speed.x * deltaTime * 0.1
        offset.y += speed.y * deltaTime * 0.1
        
        // Bounce off edges
        if (Math.abs(offset.x) > 20) speed.x *= -1
        if (Math.abs(offset.y) > 20) speed.y *= -1
        
        // Slight scale oscillation
        offset.scale = 0.9 + Math.sin(timestamp * 0.001 + i) * 0.1
        
        // Calculate base position
        const y = i * spacing
        const curveOffset = (totalDigits - 1 - i) * (isMobile ? 1.5 : 2.5)
        
        // Determine z-index based on time component
        let zIndex = i < 2 ? 30 : (i >= 4 ? 5 : 15)
        
        // Adjust sizes based on device and component type
        const baseSize = i >= 4 ? (isMobile ? 20 : 24) : (isMobile ? 28 : 32)
        const scaleFactor = isMobile ? 1.0 : 1.5
        
        // Create style with smooth animation
        newStyles.push({
          display: 'inline-block',
          fontFamily: `'Roco Revival', serif`,
          fontSize: `${baseSize + Math.sin(timestamp * 0.001 + i) * 4}vh`,
          color: '#D3C4C0FF',
          textShadow: `
            2px 2px 4px rgba(255, 20, 147, 0.4),
            4px 4px 8px rgba(50, 205, 50, 0.4),
            0 0 8px rgba(255, 20, 147, 0.6),
            0 0 7px rgba(50, 205, 50, 0.4)
          `,
          padding: `${3 + Math.sin(timestamp * 0.002 + i * 0.5) * 3}vh 2vh`,
          margin: '1vh',
          position: 'absolute',
          zIndex: zIndex,
          transform: `
            translate(calc(${curveOffset + offset.x}vh), calc(${y + offset.y}vh))
            rotate(${rotation.current}deg)
            scale(${offset.scale * scaleFactor})
          `,
          transformOrigin: 'center center',
          willChange: 'transform',
          transition: 'transform 0.1s linear'
        })
      }
      
      setDigitStyles(newStyles)
      animationRef.current = requestAnimationFrame(animate)
    }
    
    animationRef.current = requestAnimationFrame(animate)
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
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
