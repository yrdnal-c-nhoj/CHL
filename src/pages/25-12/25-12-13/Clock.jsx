import React, { useState, useEffect, useMemo } from 'react'
import { useFontLoader } from '../../../utils/fontLoader'
import bgImage from '../../../assets/images/25-12-13/roc.webp' 
import fontFile from '../../../assets/fonts/25-12-13-cherub.ttf?url'; 

export default function RococoClock() {
  const [now, setNow] = useState(new Date())
  const fontFamily = 'RococoFont'
  const fontLoaded = useFontLoader(fontFamily, fontFile, { fallback: true, timeout: 3500 })

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Graceful configuration
  const digitConfigs = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      // Much slower: 8 to 14 seconds per loop
      duration: 8 + Math.random() * 6, 
      delay: Math.random() * -10,
      // Subtle drift
      rangeX: 2 + Math.random() * 3, 
      rangeY: 3 + Math.random() * 4,
      rotate: 5 + Math.random() * 15,
      scale: 1.05 + Math.random() * 0.1,
      // Responsive font sizes using clamp(min, preferred, max)
      // This ensures text is never too small on mobile or too huge on 4k
      fontSize: i >= 4 ? 'clamp(4rem, 8vh, 12vh)' : 'clamp(6rem, 15vh, 25vh)'
    }))
  }, [])

  const hours = now.getHours()
  const displayHours = hours % 12 === 0 ? 12 : hours % 12
  const hourDigits = displayHours.toString().split('')
  const minuteDigits = now.getMinutes().toString().padStart(2, '0').split('')
  const ampmDigits = (hours >= 12 ? 'pm' : 'am').split('')
  const allChars = [...hourDigits, ...minuteDigits, ...ampmDigits]

  return (
    <div style={{ ...containerStyle, opacity: fontLoaded ? 1 : 0, transition: 'opacity 0.4s ease' }}>
      <style>
        {`
          @keyframes rococoFloat {
            0%, 100% { 
              transform: translate(0, 0) rotate(0deg) scale(1); 
            }
            33% { 
              transform: translate(var(--rx), var(--ry)) rotate(var(--rot)) scale(var(--sc)); 
            }
            66% { 
              transform: translate(calc(var(--rx) * -0.8), calc(var(--ry) * 1.2)) rotate(calc(var(--rot) * -0.5)) scale(0.95); 
            }
          }
        `}
      </style>

      <div style={rowStyle}>
        {allChars.map((char, i) => {
          const config = digitConfigs[i]
          return (
            <div
              key={i}
              style={{
                ...baseDigitStyle,
                fontFamily: fontLoaded ? `'${fontFamily}', serif` : 'serif',
                fontSize: config.fontSize,
                // Using a "slow-in, slow-out" bezier curve for gracefulness
                animation: `rococoFloat ${config.duration}s infinite cubic-bezier(0.45, 0, 0.55, 1)`,
                animationDelay: `${config.delay}s`,
                '--rx': `${config.rangeX}vw`,
                '--ry': `${config.rangeY}vh`,
                '--rot': `${config.rotate}deg`,
                '--sc': config.scale,
                zIndex: i < 2 ? 30 : i >= 4 ? 5 : 15,
                // Soft entry to avoid a "pop" on load
                opacity: fontLoaded ? 1 : 0,
                transition: 'opacity 2s ease-in'
              }}
            >
              {char}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const containerStyle = {
  height: '100dvh',
  width: '100vw',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center', // Centered looks more graceful on various screen sizes
  backgroundImage: `url(${bgImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundColor: '#000',
  overflow: 'hidden',
  position: 'relative'
}

const rowStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap', // Allows digits to stack elegantly on very narrow phones
  justifyContent: 'center',
  alignItems: 'center',
  width: '90%',
  gap: '1rem'
}

const baseDigitStyle = {
  display: 'inline-block',
  color: 'white',
  textAlign: 'center',
  pointerEvents: 'none', // Prevents interaction from breaking the immersion
  textShadow: `
    0 0 10px rgba(255, 255, 255, 0.3),
    0.2vh 0.2vh 0.4vh rgba(255, 20, 147, 0.3),
    -0.2vh -0.2vh 0.4vh rgba(50, 205, 50, 0.3)
  `,
  willChange: 'transform' // Optimizes performance for constant motion
}