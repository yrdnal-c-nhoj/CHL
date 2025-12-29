import { useEffect, useState } from 'react'

// ⏳ Background image (same folder)
import bgImage from './sat.webp'

// 🖼️ Overlay image (same folder)
import overlayImage from './scythe.webp'

// 🔤 Font file (same folder)
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

  // 🔤 Font injection + load blocking
  useEffect(() => {
    const fontUrl = new URL(FONT_PATH, import.meta.url).href

    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: '${FONT_FAMILY}';
        src: url('${fontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
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

  // 🚫 Block rendering until font is ready
  if (!fontReady) return null

  // ⌛ Time formatting
  const hh = String(now.getHours()).padStart(2, '0')
  const mm = String(now.getMinutes()).padStart(2, '0')
  const ss = String(now.getSeconds()).padStart(2, '0')

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Overlay image */}
      <img
        src={overlayImage}
        alt="Overlay"
        style={{
          position: 'absolute',
          top: '40%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '90vw',
          height: '100vw',
          // maxWidth: '60dvh',
          // maxHeight: '60dvh',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.6,
        }}
      />
      
      {/* Overlay image rotated 180° */}
      <img
        src={overlayImage}
        alt="Overlay Rotated"
        style={{
          position: 'absolute',
          top: '60%',
          left: '50%',
          transform: 'translate(-50%, -50%) rotate(180deg)',
        width: '90vw',
          height: '100vw',
          // maxWidth: '60dvh',
          // maxHeight: '60dvh',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.6,
        }}
      />
      
      {/* Saturn containment ring */}
      <div
        style={{
          width: '100vw',
          height: '100vw',
          // maxWidth: '70dvh',
          // maxHeight: '70dvh',
          borderRadius: '50%',
          // border: '0.25vw solid rgba(255,255,255,0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          // backdropFilter: 'blur(0.4vw)',
          zIndex: 2,
          position: 'relative',
        }}
      >
        {/* Time */}
        <div
          style={{
            fontFamily: FONT_FAMILY,
            fontSize: '18vh',
            letterSpacing: '0.4vw',
            color: '#7C9497',
            textAlign: 'center',
            lineHeight: '1',
            opacity: 0.5,
            textShadow: '1px 1px 0 white, -1px -1px 0 black',
          }}
        >
          {hh}{mm}
         
        </div>
      </div>
    </div>
  )
}
