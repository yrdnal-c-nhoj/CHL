import React, { useEffect, useState, useMemo } from 'react'

// --- Image Imports ---
import bg1 from './joop.webp'
import bg2 from './cr.webp'
import portImg from './eagle.webp'
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'
import font251211 from './jup.ttf?url'

// --- Constants ---
const CLOCK_SIZE = '40vh'
const TILE_SIZE = 150
const NUMERAL_RADIUS = 45
const HAND_WIDTH_SCALE = 0.8 // Scaling down transform to better align center

// --- Global Styles (CSS in JS approach for keyframes) ---
const GLOBAL_STYLES = `
  @font-face {
    font-family: 'CustomFont251211';
    src: url(${font251211});
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); } /* Changed to 360deg for standard clockwise spin */
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
  // seconds (angles[0])
  { img: secondHandImg, width: '12vh', zIndex: 6, alt: 'Second Hand' },
  // minutes (angles[1])
  { img: minuteHandImg, width: '14vh', zIndex: 5, alt: 'Minute Hand' },
  // hours (angles[2])
  { img: hourHandImg, width: '16vh', zIndex: 4, alt: 'Hour Hand' }
]

// --- Visual Style Constants ---
const GOLD_FILTER =
  'drop-shadow(0 0 12px #FF5900FF) drop-shadow(0 0 20px #DE7B11FF) brightness(1.5) contrast(1.1) saturate(1) hue-rotate(25deg)'

const GOLD_TEXT_SHADOW = `-0.35vh -0.35vh 0.4vh rgba(255,255,255,0.85),
  -0.2vh -0.2vh 0.3vh rgba(255,255,255,0.6),
  0.35vh 0.35vh 0.5vh rgba(110,50,0,0.9),
  0.15vh 0.15vh 0.3vh rgba(90,40,0,0.7),
  0 0 4vh rgba(255,180,80,0.9),
  0 0 2vh rgba(255,120,40,0.8),
  0 0 1vh rgba(255,90,20,1)`

// --- Component Definition ---
export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // 1. Initial Setup: Handles resizing and sets up the time update loop.
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    let frameId
    const update = () => {
      setTime(new Date())
      frameId = requestAnimationFrame(update)
    }
    frameId = requestAnimationFrame(update)
    return () => cancelAnimationFrame(frameId)
  }, [])

  // 2. Calculated Values: Computes rotation angles for clock hands.
  const angles = useMemo(() => {
    // Note: The GIF images appear to be designed with the clock center near the
    // base (bottom of the image). A standard rotation calculation is used here.
    const ms = time.getMilliseconds()
    const s = time.getSeconds() + ms / 1000
    const m = time.getMinutes() + s / 60
    const h = (time.getHours() % 12) + m / 60

    // Convert time units to degrees:
    // Second: 360 deg / 60 sec = 6 deg/sec
    // Minute: 360 deg / 60 min = 6 deg/min
    // Hour: 360 deg / 12 hours = 30 deg/hour
    return [s * 6, m * 6, h * 30]
  }, [time])

  // 3. Calculated Values: Generates the background tile pattern (Moiré effect).
  const tiles = useMemo(() => {
    const cols = Math.ceil(viewport.width / TILE_SIZE) + 2
    const rows = Math.ceil(viewport.height / TILE_SIZE) + 2
    const startX = viewport.width / 2 - (cols * TILE_SIZE) / 2
    const startY = viewport.height / 2 - (rows * TILE_SIZE) / 2

    return Array.from({ length: rows * cols }, (_, idx) => {
      const i = Math.floor(idx / cols)
      const j = idx % cols
      return (
        <div
          key={idx}
          style={{
            position: 'absolute',
            width: TILE_SIZE,
            height: TILE_SIZE,
            backgroundImage: `url(${portImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            opacity: 0.5,
            filter:
              'saturate(700%) hue-rotate(202deg) contrast(70%) brightness(3.0)',
            transform: (i + j) % 2 !== 0 ? 'scaleX(-1)' : 'none',
            left: startX + j * TILE_SIZE,
            top: startY + i * TILE_SIZE,
            zIndex: 1
          }}
        />
      )
    })
  }, [viewport.width, viewport.height])

  // 4. Calculated Values: Computes the (x, y) percentage positions for the clock numerals.
  const numeralPositions = useMemo(() => {
    return NUMERALS.map(({ text, deg }) => {
      // Convert degrees to radians, offset by 90deg so 0deg (XII) is at the top
      const rad = (deg - 90) * (Math.PI / 180)
      return {
        text,
        x: 50 + NUMERAL_RADIUS * Math.cos(rad),
        y: 50 + NUMERAL_RADIUS * Math.sin(rad)
      }
    })
  }, [])

  // 5. Fixed rotating background style object (For readability and easier inspection)
  const rotatingBackgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    // Full coverage for centered rotation
    backgroundImage: `url(${bg1})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    opacity: 0.8,
    filter: 'saturate(150%) contrast(170%)',
    zIndex: 0,
    animation: 'spin 60s linear infinite',
    // Rotates around the center of the component
    transformOrigin: 'center center'
  }

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        width: '100vw',
        height: `${viewport.height}px`, // Use viewport height directly for container
        position: 'relative',
        background: 'linear-gradient(to top, #08A4F2FF, #04369BFF)',
        overflow: 'hidden' // Important to hide the large rotating element's edges
      }}
    >
      {/* Inject Global CSS (keyframes, font-face) */}
      <style>{GLOBAL_STYLES}</style>

      {/* Static Background Layer 1 (Gradient under images) */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, white, skyblue)',
          zIndex: -2
        }}
      />

      {/* Rotating Background Layer 2 (Fixed issue by adjusting centering) */}
      <div style={rotatingBackgroundStyle} />

      {/* Static Background Layer 3 (Overlay) */}
      <div
        style={{
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
        }}
      />

      {/* Tiled Overlay (Moiré Effect) */}
      {tiles}

      {/* Clock Face Container */}

      <div
        style={{
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
        }}
      >
        {/* Clock Numerals (XII, III, VI, IX) */}
        {numeralPositions.map(({ text, x, y }, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
              color: '#FFD37B',
              fontSize: '4vh',
              opacity: 0.6,
              fontFamily: 'CustomFont251211',
              filter: GOLD_FILTER,
              textShadow: GOLD_TEXT_SHADOW,
              zIndex: 3,
              textAlign: 'center',
              lineHeight: 1
            }}
          >
            {text}
          </div>
        ))}

        {/* Clock Hands Container (Pivot Point) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 0,
            height: 0,
            zIndex: 4
          }}
        >
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
                // The images have the pivot point at the bottom, so they need:
                // 1. translate(-50%, -100%): Centers image horizontally, and moves base to pivot.
                // 2. rotate: Applies the calculated rotation angle.
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
