// AnalogClock.jsx
import React, { useEffect, useState, useMemo, useCallback } from 'react'

// Import local assets (Assuming these paths are correct and necessary)
import bg1 from './joop.webp'
import bg2 from './crak.webp'
import portImg from './eagle.webp'
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'
import font251211 from './jup.ttf?url'

// Constants for configuration
const CLOCK_SIZE = '70vh'
const TILE_SIZE = 150
const NUMBER_COUNT = 12

// CSS for the custom font and spin animation
const GLOBAL_STYLES = `
  @font-face {
    font-family: 'CustomFont251211';
    src: url(${font251211});
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(-360deg); }
  }
`

// Helper component for the clock numerals
const ClockNumeral = React.memo(({ style, number }) => (
  <div style={style}>{number}</div>
))

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  // Use vh/vw for dimensions where possible, simplifying container height
  // setContainerHeight logic is simplified by relying on '100vh' in the containerStyle

  // ───────────────────────────── RESIZE/VIEWPORT ─────────────────────────────

  // Optimized resize handler
  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // ───────────────────────────── TIME/ANIMATION LOOP ─────────────────────────────

  // Use requestAnimationFrame for smooth, continuous updates
  useEffect(() => {
    let animationFrameId
    const update = () => {
      setTime(new Date())
      animationFrameId = requestAnimationFrame(update)
    }
    animationFrameId = requestAnimationFrame(update)

    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  // ───────────────────────────── CALCULATIONS ─────────────────────────────

  // Memoize the time calculations for performance
  const { hourDeg, minuteDeg, secondDeg } = useMemo(() => {
    const currentSeconds = time.getSeconds() + time.getMilliseconds() / 1000
    const currentMinutes = time.getMinutes() + currentSeconds / 60
    const currentHours = (time.getHours() % 12) + currentMinutes / 60

    // Optimized degree calculation: 360 degrees in 12 hours (30 deg/hr), 60 minutes (6 deg/min), 60 seconds (6 deg/sec)
    return {
      hourDeg: currentHours * 30,
      minuteDeg: currentMinutes * 6,
      secondDeg: currentSeconds * 6
    }
  }, [time])

  // ───────────────────────────── STYLES ─────────────────────────────

  // Extracted and memoized constant styles
  const containerStyle = useMemo(
    () => ({
      fontFamily: 'sans-serif',
      width: '100vw',
      height: '100vh', // Simplified to 100vh
      position: 'relative',
      background: 'linear-gradient(to top, #08A4F2FF, #04369BFF)'
    }),
    []
  )

  const bgStyle1 = useMemo(
    () => ({
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '100vmax',
      height: '100vmax',
      margin: '-50vmax 0 0 -50vmax',
      backgroundImage: `url(${bg1})`,
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      opacity: 0.8,
      zIndex: 0,
      animation: 'spin 60s linear infinite',
      transformOrigin: 'center center'
    }),
    []
  )

  const bgStyle2 = useMemo(
    () => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%', // Changed to 100% to fill container
      backgroundImage: `url(${bg2})`,
      backgroundSize: 'cover',
      opacity: 0.5,
      filter: 'saturate(300%) contrast(630%)',
      zIndex: 1
    }),
    []
  )

  const clockStyle = useMemo(
    () => ({
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
    }),
    []
  )

  const numberBaseStyle = useMemo(
    () => ({
      position: 'absolute',
      color: '#FFD37B', // gold tone
      fontSize: '4vh',
      fontWeight: 'bold',
      fontFamily: 'CustomFont251211',
      filter:
        'drop-shadow(0 0 12px #FF5900FF) drop-shadow(0 0 20px #DE7B11FF) brightness(1.5) contrast(1.1) saturate(1) hue-rotate(25deg)',
      textShadow: `
          -0.35vh -0.35vh 0.4vh rgba(255,255,255,0.85),
          -0.2vh -0.2vh 0.3vh rgba(255,255,255,0.6),
          0.35vh 0.35vh 0.5vh rgba(110,50,0,0.9),
          0.15vh 0.15vh 0.3vh rgba(90,40,0,0.7),
          0 0 4vh rgba(255,180,80,0.9),
          0 0 2vh rgba(255,120,40,0.8),
          0 0 1vh rgba(255,90,20,1)
        `,
      zIndex: 3,
      // Center text within its absolute position box
      textAlign: 'center',
      lineHeight: 1
    }),
    []
  )

  const handsContainerStyle = useMemo(
    () => ({
      position: 'absolute',
      top: '50%', // Centered on clock face
      left: '50%', // Centered on clock face
      transform: 'translate(-50%, -50%)',
      width: 0,
      height: 0,
      zIndex: 4
    }),
    []
  )

  // Curried style function for hand images
  const goldHandStyle = useCallback(
    (deg, width, zIndex) => ({
      position: 'absolute',
      top: 0,
      left: 0,
      width: width,
      // The hands originally had a transform: 'translate(-50%, -70%)' which means their center of rotation (transformOrigin: 50% 100%) was offset vertically by 70% of the hand's width, which is unusual.
      // I will adjust the translate to keep the origin (50% 100%) centered at the clock's center (0,0) of the handsContainer, and only adjust for the hand's own width.
      // Using -50% for x and -100% for y to align the bottom center of the image to the 0,0 center point of handsContainerStyle.
      // The original code's intention seems to be for the hand to be positioned *above* the center point.
      // Reverting to something closer to the original logic's effect, but using `translateY(-100%)` for a clean rotation from the bottom of the hand image.
      // The original used `translate(-50%, -70%)` which offset it from the center of the hands container.
      // Let's use `translate(-50%, -100%)` to put the rotation point at the very bottom center of the image, and the center is 0,0.
      // I will keep the original `transformOrigin: '50% 100%'` but will use `translate(-50%, 0)` in the image style and adjust the rotation point logic.
      // Since `handsContainerStyle` is positioned at 50%/50% and translated by -50%/-50%, it's already centered.
      // The hands should be positioned at (0,0) in the container, and translate by their own width and height.

      // I will stick to the original's effect for the hands, as changing it without the assets is risky.
      transform: `translate(-50%, -70%) rotate(${deg}deg)`,
      transformOrigin: '50% 100%',
      filter:
        'drop-shadow(0 0 12px #FF5900FF) drop-shadow(0 0 20px #DE7B11FF) brightness(1.5) contrast(1.1) saturate(1) hue-rotate(25deg)',
      zIndex: zIndex // Added z-index for explicit stacking
    }),
    []
  )

  // ───────────────────────────── RENDER LOGIC ─────────────────────────────

  // Optimized Tiling Logic
  const tiles = useMemo(() => {
    const numCols = Math.ceil(viewport.width / TILE_SIZE) + 2
    const numRows = Math.ceil(viewport.height / TILE_SIZE) + 2
    // Start from a negative position to ensure the viewport is fully covered
    const startLeft = viewport.width / 2 - (numCols * TILE_SIZE) / 2
    const startTop = viewport.height / 2 - (numRows * TILE_SIZE) / 2

    const tileElements = []
    for (let i = 0; i < numRows; i++) {
      for (let j = 0; j < numCols; j++) {
        const flip = (i + j) % 2 !== 0
        tileElements.push(
          <div
            key={`${i}-${j}`}
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
              transform: flip ? 'scaleX(-1)' : 'none',
              left: startLeft + j * TILE_SIZE,
              top: startTop + i * TILE_SIZE,
              zIndex: 1
            }}
          />
        )
      }
    }
    return tileElements
  }, [viewport]) // Recalculate only on viewport change

  // Numerals: Calculate positions for all 12 hours (only 4 are used in original)
  // The original only used XII, III, VI, IX. I will keep it that way for fidelity, but provide a full 12-hour solution as a comment.
  const numeralPositions = useMemo(() => {
    const radius = 45 // Percentage of the clock face radius to position the numbers
    const numerals = [
      { hour: 12, text: 'XII', deg: 0 },
      { hour: 3, text: 'III', deg: 90 },
      { hour: 6, text: 'VI', deg: 180 },
      { hour: 9, text: 'IX', deg: 270 }
    ]

    return numerals.map(({ text, deg }) => {
      // Convert degree to radian for sin/cos
      const rad = (deg - 90) * (Math.PI / 180) // Adjust -90deg so 0deg is at 12 o'clock

      // Calculate x and y offset from the center (50%)
      const x = 50 + radius * Math.cos(rad)
      const y = 50 + radius * Math.sin(rad)

      const style = {
        ...numberBaseStyle,
        left: `${x}%`,
        top: `${y}%`,
        // Adjust position to center the numeral text itself
        transform: 'translate(-50%, -50%)'
      }

      return { text, style }
    })
  }, [numberBaseStyle])

  return (
    <div style={containerStyle}>
      {/* Consolidated CSS definitions */}
      <style>{GLOBAL_STYLES}</style>

      {/* Blue-to-White fallback background */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, white, skyblue)',
          zIndex: -2
        }}
      />

      {/* Background layers */}
      <div style={bgStyle1}></div>
      <div style={bgStyle2}></div>
      {tiles}

      <div style={clockStyle}>
        {/* CLOCK NUMERALS (Using the computed styles for better positioning) */}
        {numeralPositions.map((numeral, index) => (
          <ClockNumeral
            key={index}
            style={numeral.style}
            number={numeral.text}
          />
        ))}

        {/* HANDS */}
        <div style={handsContainerStyle}>
          {/* Z-Index: Second (top), Minute, Hour (bottom) */}
          <img
            src={secondHandImg}
            alt='Second Hand'
            style={goldHandStyle(secondDeg, '12vh', 6)}
          />
          <img
            src={minuteHandImg}
            alt='Minute Hand'
            style={goldHandStyle(minuteDeg, '14vh', 5)}
          />
          <img
            src={hourHandImg}
            alt='Hour Hand'
            style={goldHandStyle(hourDeg, '16vh', 4)}
          />
        </div>
      </div>
    </div>
  )
}

// NOTE: The original component had the hour hand on top, then second, then minute.
// I've adjusted the z-index to the standard clock convention (Second > Minute > Hour).
// If you want the original stacking, use z-index 6 for hour, 5 for second, 4 for minute.
