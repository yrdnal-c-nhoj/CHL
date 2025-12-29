import { useEffect, useState } from 'react'

// ⏳ Assets (ensure these are in your /src folder)
import bgImage from './sat.webp'
import overlayImage from './scythe.webp'

// 🔤 Font configuration
const FONT_PATH = './sat.ttf'
const FONT_FAMILY = 'SaturnFont'

export default function SaturnClock() {
  const [fontReady, setFontReady] = useState(false)
  const [now, setNow] = useState(new Date())

  // ⏱ Clock tick
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  // 🔤 Font injection
  useEffect(() => {
    const fontUrl = new URL(FONT_PATH, import.meta.url).href
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: '${FONT_FAMILY}';
        src: url('${fontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `
    document.head.appendChild(style)

    document.fonts.load(`1rem ${FONT_FAMILY}`).then(() => {
      setFontReady(true)
    })

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  if (!fontReady) return null

  // ⌛ Time formatting
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#000',
      }}
    >
      {/* 1. Background Image Layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
        }}
      >
        <img
          src={bgImage}
          alt="Background"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block',
            // Applying filter directly to image for best results
            // filter: 'grayscale(40%) saturate(220%) brightness(5.7)',
          }}
        />
      </div>

      {/* 2. Overlay Images (Scythes) */}
      <img
        src={overlayImage}
        alt="Scythe Top"
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '85vw',
          height: 'auto',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5,
        }}
      />
      
      <img
        src={overlayImage}
        alt="Scythe Bottom"
        style={{
          position: 'absolute',
          top: '55%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(180deg)',
          width: '85vw',
          height: 'auto',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5,
        }}
      />
      
      {/* 3. Time Display Layer */}
      <div
        style={{
          zIndex: 2,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: 'min(20vw, 20vh)',
            letterSpacing: '0.05em',
            color: '#9CB5B8',
            textAlign: 'center',
            opacity: 0.4,
            textShadow: '0 0 20px rgba(0,0,0,0.5)',
            userSelect: 'none',
          }}
        >
          <div>{hh}</div>
          <div style={{ marginTop: '-2vh' }}>{mm}</div>
        </div>
      </div>
    </div>
  )
}