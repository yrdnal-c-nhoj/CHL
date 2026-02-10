import React, { useEffect, useState, useMemo, memo, useRef } from 'react'

// --- Image Imports ---
import bg2 from '../../../assets/images/26-01-11/flam4.webp'
import bg1 from '../../../assets/images/26-01-11/flaa.webp'
import fontflam251211 from '../../../assets/fonts/26-01-11-flam.ttf'
import hourHandImg from '../../../assets/images/26-01-11/leg1.webp'
import minuteHandImg from '../../../assets/images/26-01-11/leg2.webp'
import secondHandImg from '../../../assets/images/26-01-11/flam.webp'

// --- CONFIG ---
const CONFIG = {
  clockSize: 'min(90vw, 90vh)',
  numeralRadius: 43,
  hands: [
    { img: secondHandImg,  height: 'clamp(200px, 55vw, 350px)', zIndex: 12 }, 
    { img: minuteHandImg,  height: 'clamp(150px, 48vw, 300px)', zIndex: 11 },  
    { img: hourHandImg,    height: 'clamp(100px, 29vw, 180px)', zIndex: 10 }   
  ],
  numerals: [
    { text: '12', deg: 0 }, { text: '1',  deg: 30 }, { text: '2',  deg: 60 },
    { text: '3',  deg: 90 }, { text: '4',  deg: 120 }, { text: '5',  deg: 150 },
    { text: '6',  deg: 180 }, { text: '7',  deg: 210 }, { text: '8',  deg: 240 },
    { text: '9',  deg: 270 }, { text: '10', deg: 300 }, { text: '11', deg: 330 }
  ]
}

// --- HOOKS ---
function useTime() {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    let intervalId
    const updateTime = () => {
      setTime(new Date())
    }
    intervalId = setInterval(updateTime, 50)
    return () => clearInterval(intervalId)
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

const NUMERAL_POSITIONS = CONFIG.numerals.map(({ text, deg }) => {
  const rad = (deg - 90) * (Math.PI / 180)
  return {
    text,
    x: 50 + CONFIG.numeralRadius * Math.cos(rad),
    y: 50 + CONFIG.numeralRadius * Math.sin(rad)
  }
})

// --- STYLES ---
const GlobalStyles = memo(() => (
  <style>{`
    @font-face {
      font-family: 'CustomFont251211';
      src: url(${fontflam251211}) format('truetype');
      font-display: swap;
    }
  `}</style>
))

const StaticBackground = memo(() => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none' }}>
    <div style={{
      position: 'absolute', width: '100%', height: '100%',
      backgroundImage: `url(${bg2})`, backgroundSize: 'cover', backgroundPosition: 'center',
      filter: 'hue-rotate(-40deg) saturate(0.7)', opacity: 0.5, zIndex: 5 
    }} />
    <div style={{
      position: 'absolute', width: '100%', height: '100%',
      backgroundImage: `url(${bg1})`, backgroundSize: 'cover', backgroundPosition: 'center',
      filter: 'brightness(1.7) contrast(0.8) hue-rotate(-40deg)'
    }} />
  </div>
))

const ClockNumeral = memo(({ text, x, y }) => (
  <div style={{
    position: 'absolute', left: `${x}%`, top: `${y}%`,
    transform: 'translate(-50%, -50%)', color: '#FC8EAC', opacity: 0.5,
    fontFamily: 'CustomFont251211, serif', fontSize: '31vh',
    textShadow: '-4vh -4vh 0px #3B020652, 4vh 4vh 0px #F5E5E8A8',
    zIndex: 1, pointerEvents: 'none'
  }}>
    {text}
  </div>
))

// --- CLOCK HAND COMPONENT ---
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
      zIndex: zIndex,
      transformOrigin: 'bottom center',
      transform: `translate(-50%, -100%) ${flip ? 'scaleX(-1)' : ''} rotate(${reverse ? -rotation : rotation}deg)`,
      pointerEvents: 'none',
      userSelect: 'none',
      willChange: 'transform',
      
      /* FIXED MASKING: 
         - to top: Starts at the bottom (clock center) and goes to the top (hand tip).
         - 0% (Bottom): 0.1 opacity
         - 100% (Top): 1.0 opacity
      */
      WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 50%)',
      maskImage: 'linear-gradient(to top, rgba(0,0,0,0.1) 0%, rgba(0,0,0,1) 50%)',
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%',
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat'
    }}
  />
))

const ClockFace = memo(({ angles }) => (
  <div style={{
    position: 'fixed', top: '50%', left: '50%',
    width: CONFIG.clockSize, height: CONFIG.clockSize,
    transform: 'translate(-50%, -50%)', zIndex: 10
  }}>
    {NUMERAL_POSITIONS.map((p, i) => (
      <ClockNumeral key={i} text={p.text} x={p.x} y={p.y} />
    ))}

    <div style={{ position: 'absolute', inset: 0 }}>
      {CONFIG.hands.map((hand, i) => (
        <ClockHand
          key={i}
          img={hand.img}
          height={hand.height}
          zIndex={hand.zIndex}
          rotation={i === 0 ? angles.second : i === 1 ? angles.minute : angles.hour}
          flip={i === 0}
          reverse={i === 0}
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
  const [ready, setReady] = useState(false)

  // Preload images for smooth initial render
  useEffect(() => {
    if (!preloadedRef.current) {
      [hourHandImg, minuteHandImg, secondHandImg].forEach(src => {
        const img = new Image()
        img.src = src
      })
      preloadedRef.current = true
    }
  }, [])

  // Gate visibility until next tick (gives time for font swap and background) 
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <GlobalStyles />
      <div style={{ opacity: ready ? 1 : 0, visibility: ready ? 'visible' : 'hidden', transition: 'opacity 0.3s ease' }}>
        <StaticBackground />
        <ClockFace angles={angles} />
      </div>
    </>
  )
}