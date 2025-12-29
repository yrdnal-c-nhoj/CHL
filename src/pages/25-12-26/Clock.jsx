import { useEffect, useState } from 'react';

// Add global styles for fade-in animation
if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  document.head.appendChild(style);
}

// Asset imports
import bgImage from './sat.webp'
import overlayImage from './scythe.webp'
import fontFile from './sat.ttf?url'  // ?url tells Vite to copy the file to output

const FONT_FAMILY = 'SaturnFont'

// Custom hook for font loading
function useFontLoader(fontUrl, fontFamily) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    const loadFont = async () => {
      try {
        // Create a new FontFace instance
        const font = new FontFace(
          fontFamily,
          `url('${fontUrl}') format('truetype')`,
          {
            style: 'normal',
            weight: '400',
            display: 'swap'
          }
        )

        // Add to document.fonts
        document.fonts.add(font)

        // Load the font
        await font.load()
        
        // Mark as ready
        setIsReady(true)
      } catch (error) {
        console.error('Failed to load font:', error)
        // Continue with fallback font
        setIsReady(true)
      }
    }

    loadFont()

    // No need to clean up FontFace as it's generally safe to keep it
  }, [fontUrl, fontFamily])

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
        filter: 'saturate(0.7) hue-rotate(-190deg) brightness(0.9)', // Example filters
        opacity: 0.6,
      }}
    />
  )
}

// Main component
export default function SaturnClock() {
  const fontReady = useFontLoader(fontFile, FONT_FAMILY)
  const now = useClock()

  // Show loading state with black background
  if (!fontReady) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,0.7)'
      }}>
        Loading...
      </div>
    );
  }

  const { hours, minutes } = formatTime(now)

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        opacity: 0,
        animation: 'fadeIn 0.5s ease-in forwards',
      }}
    >
      {/* Background image with filters applied only to it */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          filter: 'saturate(0.5) hue-rotate(140deg) brightness(1.9)', // Example filters
          zIndex: 0,
        }}
      />
      
      {/* Content layer - no filters applied */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
    </div>
  )
}
