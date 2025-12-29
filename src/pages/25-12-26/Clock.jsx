import { useEffect, useState } from 'react'

// Asset paths
import bgImage from './sat.webp'
import overlayImage from './scythe.webp'
const FONT_PATH = './sat.ttf'
const FONT_FAMILY = 'SaturnFont'

// Custom hook for font loading
function useFontLoader(fontPath, fontFamily) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const fontUrl = new URL(fontPath, import.meta.url).href
    const style = document.createElement('style')
    
    style.textContent = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${fontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `
    
    document.head.appendChild(style)
    
    document.fonts.load(`1rem ${fontFamily}`).then(() => {
      setIsReady(true)
    })

    return () => {
      document.head.removeChild(style)
    }
  }, [fontPath, fontFamily])

  return isReady
}

// Custom hook for clock
function useClock() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  return time
}

// Format time with padding
function formatTime(date) {
  const pad = (n) => String(n).padStart(2, '0')
  return {
    hours: pad(date.getHours()),
    minutes: pad(date.getMinutes()),
    seconds: pad(date.getSeconds())
  }
}

// Overlay component
function ScytheOverlay({ rotation = 0, top = '40%' }) {
  return (
    <img
      src={overlayImage}
      alt=""
      style={{
        position: 'absolute',
        top,
        left: '50%',
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        width: '90vw',
        height: '100vw',
        objectFit: 'contain',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6,
      }}
    />
  )
}

// Main component
export default function SaturnClock() {
  const fontReady = useFontLoader(FONT_PATH, FONT_FAMILY)
  const now = useClock()

  if (!fontReady) return null

  const { hours, minutes } = formatTime(now)

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
      <ScytheOverlay rotation={0} top="40%" />
      <ScytheOverlay rotation={180} top="60%" />

      <div
        style={{
          width: '100vw',
          height: '100vw',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          position: 'relative',
        }}
      >
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
          {hours}{minutes}
        </div>
      </div>
    </div>
  )
}