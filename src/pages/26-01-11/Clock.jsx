import React, { useEffect, useState, useMemo, memo, useRef } from 'react'

// --- Image Imports ---
import bg2 from '../../assets/clocks/26-01-15/flam4.webp'
import bg1 from '../../assets/clocks/26-01-15/flaa.webp'
import hourHandImg from '../../assets/clocks/26-01-15/leg1.webp'
import minuteHandImg from '../../assets/clocks/26-01-15/leg2.webp'
import secondHandImg from '../../assets/clocks/26-01-15/flam.webp'
import fontflam251211 from '../../assets/fonts/26-01-15-flam.ttf'

// --- CONFIG ---
const CONFIG = {
  clockSize: 'min(90vw, 90vh)',
  numeralRadius: 43,
  hands: [
    { img: secondHandImg,  height: 'clamp(200px, 55vw, 350px)', zIndex: 8 },  // second hand - longest & on top
    { img: minuteHandImg,  height: 'clamp(150px, 48vw, 300px)', zIndex: 7 },  // minute hand
    { img: hourHandImg,    height: 'clamp(100px, 29vw, 180px)', zIndex: 6 }   // hour hand - shortest
  ],
  numerals: [
    { text: '12', deg: 0 },
    { text: '1',  deg: 30 },
    { text: '2',  deg: 60 },
    { text: '3',  deg: 90 },
    { text: '4',  deg: 120 },
    { text: '5',  deg: 150 },
    { text: '6',  deg: 180 },
    { text: '7',  deg: 210 },
    { text: '8',  deg: 240 },
    { text: '9',  deg: 270 },
    { text: '10', deg: 300 },
    { text: '11', deg: 330 }
  ],
  tileSize: 100
}

// --- HOOKS ---
function useTime() {
  const [time, setTime] = useState(() => new Date())

  useEffect(() => {
    let animationFrameId
    const updateTime = () => {
      setTime(new Date())
      animationFrameId = requestAnimationFrame(updateTime)
    }

    animationFrameId = requestAnimationFrame(updateTime)

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return time
}

function useClockAngles(time) {
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
      src: url(${fontflam251211}) format('truetype');
      font-display: swap;
    }
    @keyframes scrollUp {
      from { transform: translateY(0); }
      to { transform: translateY(-66.66%); }
    }
  `}</style>
))

// --- STATIC BG ---
const StaticBackground = memo(() => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1,
      pointerEvents: 'none'
    }}
  >
    {/* Background image without filter */}
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bg2})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'hue-rotate(-40deg) saturate(0.7)',
        opacity: 0.5,
        zIndex: 5 
      }}
    />
    
    {/* Foreground image with filter */}
    <div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundImage: `url(${bg1})`,
        backgroundSize: 'cover',
        // opacity: 0.7,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        filter: 'brightness(1.7) contrast(0.8) hue-rotate(-40deg)'
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
      color: '#FC8EAC',
      opacity: 0.5,
      fontFamily: 'CustomFont251211, serif',
      fontSize: '31vh',
      textShadow: '-4vh -4vh 0px #3B020652, 4vh 4vh 0px #F5E5E8A8',
      zIndex: 1 ,
      pointerEvents: 'none'
    }}
  >
    {text}
  </div>
))

// --- CLOCK HAND ---
const ClockHand = memo(({ img, height, rotation, flip, reverse, zIndex }) => (
  <img
    src={img}
    alt=""
    draggable={false}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      height: height,
      width: 'auto',
      maxWidth: '100%', // safety
      transform: `translate(-50%, -100%) ${flip ? 'scaleX(-1)' : ''} rotate(${reverse ? -rotation : rotation}deg)`,
      transformOrigin: 'bottom center',
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
        transform: 'translate(-50%, -50%)',
        width: '100%',
        height: '100%'
      }}
    >
      {CONFIG.hands.map((hand, i) => (
        <ClockHand
          key={i}
          img={hand.img}
          height={hand.height}
          zIndex={hand.zIndex}
          rotation={
            i === 0 ? angles.second :
            i === 1 ? angles.minute :
            angles.hour
          }
          flip={i === 0}      // second hand flip
          reverse={i === 0}   // second hand reverse direction
        />
      ))}
    </div>
  </div>
))

// --- MAIN COMPONENT ---
export default function AnalogClock() {
  const time = useTime()
  const angles = useClockAngles(time)
  const preloadedRef = useRef(false)

  // Preload images
  useEffect(() => {
    if (!preloadedRef.current) {
      [hourHandImg, minuteHandImg, secondHandImg].forEach(src => {
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
