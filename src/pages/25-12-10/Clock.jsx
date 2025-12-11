import React, { useEffect, useState, useMemo } from 'react'

// --- Image Imports ---
import bg1 from './joop.webp'
import bg2 from './cr.webp'
import portImg from './eagle.webp' // Restored Tiling Image Import
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'
import font251211 from './jup.ttf?url'

// --- Constants ---
const CLOCK_SIZE = '40vh'
const TILE_SIZE = 150 // Size of each tile
const NUMERAL_RADIUS = 45
const HAND_WIDTH_SCALE = 0.8
const UPDATE_INTERVAL_MS = 100 // Update every 100ms

// --- Global Styles ---
const GLOBAL_STYLES = `
  @font-face {
    font-family: 'CustomFont251211';
    src: url(${font251211});
  }
`

// --- Clock Configuration Data ---
const NUMERALS = [
  { text: 'XII', deg: 0 },
  { text: 'III', deg: 90 },
  { text: 'VI', deg: 180 },
  { text: 'IX', deg: 270 }
]

const HAND_CONFIG = [
  // seconds
  { img: secondHandImg, width: '12vh', zIndex: 6, alt: 'Second Hand' },
  // minutes
  { img: minuteHandImg, width: '14vh', zIndex: 5, alt: 'Minute Hand' },
  // hours
  { img: hourHandImg, width: '16vh', zIndex: 4, alt: 'Hour Hand' }
]

// --- Visual Style Constants (Simplified for performance) ---
const GOLD_FILTER = 'drop-shadow(0 0 5px #FFD700)' // Minimal filter for performance

// --- Static Style Objects (Moved outside the component) ---
const CONTAINER_BASE_STYLE = {
  fontFamily: 'sans-serif',
  width: '100vw',
  position: 'relative',
  background: 'linear-gradient(to top, #08A4F2FF, #04369BFF)',
  overflow: 'hidden'
}

const BACKGROUND_GRADIENT_STYLE = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  background: 'linear-gradient(to top, white, skyblue)',
  zIndex: -2
}

const BACKGROUND_1_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${bg1})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  opacity: 0.8,
  filter: 'saturate(150%) contrast(170%)',
  zIndex: 0
}

const BACKGROUND_2_STYLE = {
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundImage: `url(${bg2})`,
  backgroundSize: 'cover',
  opacity: 0.5,
  filter: 'saturate(300%) contrast(630%)',
  zIndex: 1
}

const CLOCK_FACE_STYLE = {
  position: 'absolute',
  width: CLOCK_SIZE,
  height: CLOCK_SIZE,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 2
}

const PIVOT_STYLE = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 0,
  height: 0,
  zIndex: 4
}

const NUMERAL_BASE_STYLE = {
  color: '#FFD37B',
  fontSize: '4vh',
  opacity: 0.8,
  fontFamily: 'CustomFont251211',
  filter: GOLD_FILTER,
  zIndex: 3,
  textAlign: 'center',
  lineHeight: 1,
  position: 'absolute'
}

// --- Component Definition ---
export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // 1. Initial Setup: Handles resizing and sets up the time update loop (100ms interval).
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)

    const intervalId = setInterval(() => {
      setTime(new Date())
    }, UPDATE_INTERVAL_MS)

    return () => {
      window.removeEventListener('resize', handleResize)
      clearInterval(intervalId)
    }
  }, [])

  // 2. Calculated Values: Computes rotation angles for clock hands.
  const angles = useMemo(() => {
    const ms = time.getMilliseconds()
    const s = time.getSeconds() + ms / 1000
    const m = time.getMinutes() + s / 60
    const h = (time.getHours() % 12) + m / 60

    return [s * 6, m * 6, h * 30]
  }, [time])

  // 3. Calculated Values: Generates the background tile pattern (Moiré effect).
  // RESTORED Tiling Logic
  const tiles = useMemo(() => {
    const { width, height } = viewport
    const cols = Math.ceil(width / TILE_SIZE) + 2
    const rows = Math.ceil(height / TILE_SIZE) + 2
    // Calculate starting point to ensure tiles cover the screen and are centered
    const startX = width / 2 - (cols * TILE_SIZE) / 2
    const startY = height / 2 - (rows * TILE_SIZE) / 2

    // Simplified filter for better performance than the original
    const TILE_FILTER =
      'saturate(300%) hue-rotate(202deg) contrast(70%) brightness(1.5)'

    return Array.from({ length: rows * cols }, (_, idx) => {
      const i = Math.floor(idx / cols)
      const j = idx % cols

      const style = {
        position: 'absolute',
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundImage: `url(${portImg})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        opacity: 0.7, // Reduced opacity
        filter: TILE_FILTER,
        // Alternating flip for Moiré effect
        transform: (i + j) % 2 !== 0 ? 'scaleX(-1)' : 'none',
        left: startX + j * TILE_SIZE,
        top: startY + i * TILE_SIZE,
        zIndex: 1, // Z-index 1 places it over bg1 but under the clock face
        willChange: 'transform, opacity' // Hint for browser optimization
      }

      return <div key={idx} style={style} />
    })
  }, [viewport.width, viewport.height]) // Re-run if viewport changes

  // 4. Calculated Values: Computes the (x, y) percentage positions for the clock numerals.
  const numeralPositions = useMemo(() => {
    return NUMERALS.map(({ text, deg }) => {
      const rad = (deg - 90) * (Math.PI / 180)
      return {
        text,
        x: 50 + NUMERAL_RADIUS * Math.cos(rad),
        y: 50 + NUMERAL_RADIUS * Math.sin(rad)
      }
    })
  }, [])

  return (
    <div
      style={{
        ...CONTAINER_BASE_STYLE,
        height: `${viewport.height}px`
      }}
    >
      {/* Inject Global CSS (font-face) */}
      <style>{GLOBAL_STYLES}</style>

      {/* Static Background Layer 1 (Gradient under images) */}
      <div style={BACKGROUND_GRADIENT_STYLE} />

      {/* Rotating Background Layer 2 (Image 1) */}
      <div style={BACKGROUND_1_STYLE} />

      {/* Tiled Overlay (Moiré Effect) - RESTORED */}
      {tiles}

      {/* Static Background Layer 3 (Overlay Image 2) */}
      <div style={BACKGROUND_2_STYLE} />

      {/* Clock Face Container */}
      <div style={CLOCK_FACE_STYLE}>
        {/* Clock Numerals (XII, III, VI, IX) */}
        {numeralPositions.map(({ text, x, y }, i) => (
          <div
            key={i}
            style={{
              ...NUMERAL_BASE_STYLE,
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {text}
          </div>
        ))}

        {/* Clock Hands Container (Pivot Point) */}
        <div style={PIVOT_STYLE}>
          {/* Render Hands */}
          {HAND_CONFIG.map(({ img, width, zIndex, alt }, i) => (
            <img
              key={i}
              src={img}
              alt={alt}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width,
                transform: `translate(-50%, -${
                  100 * HAND_WIDTH_SCALE
                }%) rotate(${angles[i]}deg)`,
                transformOrigin: '50% 100%',
                filter: GOLD_FILTER,
                zIndex
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
