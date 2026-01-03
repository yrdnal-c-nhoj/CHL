import React, { useEffect, useState, useMemo, memo, useRef } from 'react'

// --- Image Imports ---
import bg1 from '../../assets/clocks/25-12-20/nest.jpg'
import hourHandImg from '../../assets/clocks/25-12-20/fea1.webp'
import minuteHandImg from '../../assets/clocks/25-12-20/fea2.webp'
import secondHandImg from '../../assets/clocks/25-12-20/fea3.webp'
import font251211 from '../../assets/fonts/feather.otf?url';

// --- CONFIG ---
const CONFIG = {
  clockSize: 'min(90vw, 90vh)',
  numeralRadius: 43,
  hands: [
    { img: secondHandImg, width: '22vw', max: '200px' },
    { img: minuteHandImg, width: '28vw', max: '200px' },
    { img: hourHandImg, width: '19vw', max: '96px' }
  ],
  numerals: [
    { text: '12', deg: 0 },
    { text: '1', deg: 30 },
    { text: '2', deg: 60 },
    { text: '3', deg: 90 },
    { text: '4', deg: 120 },
    { text: '5', deg: 150 },
    { text: '6', deg: 180 },
    { text: '7', deg: 210 },
    { text: '8', deg: 240 },
    { text: '9', deg: 270 },
    { text: '10', deg: 300 },
    { text: '11', deg: 330 }
  ],
  tileSize: 100
}

// --- HOOKS ---
function useTime () {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    let animationFrameId

    const updateTime = () => {
      setTime(new Date())
      animationFrameId = requestAnimationFrame(updateTime)
    }

    // Start the animation loop
    animationFrameId = requestAnimationFrame(updateTime)

    // Cleanup function to cancel the animation frame when component unmounts
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  return time
}

function useClockAngles (time) {
  return useMemo(() => {
    const ms = time.getMilliseconds()
    const s = time.getSeconds() + ms / 1000
    const m = time.getMinutes() + s / 60
    const h = (time.getHours() % 12) + m / 60
    return { second: s * 6, minute: m * 6, hour: h * 30 }
  }, [time])
}

// Pre-calculate numeral positions (only once)
const NUMERAL_POSITIONS = CONFIG.numerals.map(({ text, deg }) => {
  const rad = (deg - 90) * (Math.PI / 180)
  return {
    text,
    x: 50 + CONFIG.numeralRadius * Math.cos(rad),
    y: 50 + CONFIG.numeralRadius * Math.sin(rad)
  }
})

// --- GLOBAL FONT ---
const GlobalStyles = memo(() => (
  <style>{`
    @font-face {
      font-family: 'CustomFont251211';
      src: url(${font251211}) format('truetype');
      font-display: swap;
    }
    @keyframes scrollUp {
      from { transform: translateY(0); }
      to { transform: translateY(-66.66%); }
    }
  `}</style>
))

// --- STATIC BG1 ---
const StaticBackground = memo(() => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none'
    }}
  >
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bg1})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'contrast(0.9) brightness(3.5) saturate(0.2)',
      }}
    />
  </div>
))



// --- NUMERAL ---
const ClockNumeral = memo(({ text, x, y }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      color: '#05121CFF',
      fontFamily: 'CustomFont251211, serif',
      fontSize: 'clamp(7rem, 9vw, 8.5rem)',
      textShadow: '1px 1px 0px #B48811FF',
      zIndex: 0,
      pointerEvents: 'none'
    }}
  >
    {text}
  </div>
))

// --- CLOCK HAND ---
const ClockHand = memo(({ img, width, max, rotation }) => (
  <img
    src={img}
    alt=''
    draggable={false}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: `clamp(30px, ${width}, ${max})`,
      transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
      transformOrigin: 'bottom center',
      zIndex: 7,
      pointerEvents: 'none',
      userSelect: 'none',
      willChange: 'transform'
    }}
  />
))

// --- CLOCK FACE ---
const ClockFace = memo(({ angles }) => (
  <div
    style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      width: CONFIG.clockSize,
      height: CONFIG.clockSize,
      transform: 'translate(-50%, -50%)',
      borderRadius: '50%',
      zIndex: 10
    }}
  >
    {NUMERAL_POSITIONS.map((p, i) => (
      <ClockNumeral key={i} text={p.text} x={p.x} y={p.y} />
    ))}

    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {CONFIG.hands.map((h, i) => (
        <ClockHand
          key={i}
          img={h.img}
          width={h.width}
          max={h.max}
          rotation={
            i === 0 ? angles.second : i === 1 ? angles.minute : angles.hour
          }
        />
      ))}
    </div>
  </div>
))

// --- MAIN COMPONENT ---
export default function AnalogClock () {
  const time = useTime()
  const angles = useClockAngles(time)
  const preloadedRef = useRef(false)

  // Preload hand images once
  useEffect(() => {
    if (!preloadedRef.current) {
      ;[hourHandImg, minuteHandImg, secondHandImg].forEach(src => {
        const img = new Image()
        img.src = src
      })
      preloadedRef.current = true
    }
  }, [])

  return (
    <>
      <GlobalStyles />
      <StaticBackground />
      <ClockFace angles={angles} />
    </>
  )
}
