import React, { useEffect, useState, useMemo, memo } from 'react'

// --- Image Imports ---
import bg1 from './j.webp'
import bg2 from './jj.webp'
import portImg from './eagle.webp'
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'
import font251211 from './jup.ttf?url'

// --- CONFIG ---
const CONFIG = {
  clockSize: 'min(90vw, 90vh)',
  numeralRadius: 43,
  hands: [
    { img: secondHandImg, width: '18vw', max: '175px', z: 4 },
    { img: minuteHandImg, width: '22vw', max: '160px', z: 5 },
    { img: hourHandImg, width: '20vw', max: '120px', z: 6 }
  ],
  numerals: [
    { text: 'XII', deg: 0 },
    { text: 'III', deg: 90 },
    { text: 'VI', deg: 180 },
    { text: 'IX', deg: 270 }
  ]
}

// --- HOOKS ---
function useTime () {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

function useClockAngles (time) {
  return useMemo(() => {
    const s = time.getSeconds() + time.getMilliseconds() / 1000
    const m = time.getMinutes() + s / 60
    const h = (time.getHours() % 12) + m / 60
    return { second: s * 6, minute: m * 6, hour: h * 30 }
  }, [time])
}

// --- GLOBAL FONT ---
const GlobalStyles = memo(() => (
  <style jsx global>{`
    @font-face {
      font-family: 'CustomFont251211';
      src: url(${font251211}) format('truetype');
      font-display: swap;
    }
  `}</style>
))

// --- INFINITE UPWARD SCROLLING BG1 (JOOP) ---
const InfiniteScrollingBG = memo(() => {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        zIndex: 1,
        pointerEvents: 'none'
      }}
    >
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '300%',
          backgroundImage: `url(${bg1})`,
          backgroundSize: '130% auto',
          backgroundRepeat: 'repeat-y',
          backgroundPosition: 'center top',
          animation: 'scrollUp 36s linear infinite',
          opacity: 0.8
        }}
      />
      <style jsx>{`
        @keyframes scrollUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(-66.66%);
          }
        }
      `}</style>
    </div>
  )
})

// --- STATIC BG2 (JJ) ---
const BackgroundImage2 = memo(() => (
  <div
    style={{
      position: 'fixed',
      inset: 0,
      backgroundImage: `url(${bg2})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      zIndex: 10,
      filter: 'saturate(3.5) contrast(1.5) brightness(17.5)',
      pointerEvents: 'none'
    }}
  />
))

// --- TILED EAGLE LAYER ---
const TiledBackground = memo(() => {
  const tileSize = 100
  const cols = Math.ceil(window.innerWidth / tileSize) + 3
  const rows = Math.ceil(window.innerHeight / tileSize) + 3
  const tiles = []

  for (let r = -2; r < rows; r++) {
    for (let c = -2; c < cols; c++) {
      const flip = (r + c) % 2 === 1
      tiles.push(
        <div
          key={`${r}-${c}`}
          style={{
            position: 'fixed',
            width: tileSize,
            height: tileSize,
            background: `url(${portImg}) center/contain no-repeat`,
            opacity: 0.5,
            filter: 'hue-rotate(190deg) saturate(7.5)',
            transform: flip ? 'scaleX(-1)' : 'none',
            left: c * tileSize - tileSize,
            top: r * tileSize - tileSize,
            zIndex: 3,
            pointerEvents: 'none'
          }}
        />
      )
    }
  }
  return <>{tiles}</>
})

// --- NUMERAL ---
const ClockNumeral = memo(({ text, x, y }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      color: '#EAC555FF',
      fontFamily: 'CustomFont251211, serif',
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      textShadow: '2px 2px 0px rgba(120,120,230)',
      zIndex: 3,
      pointerEvents: 'none'
    }}
  >
    {text}
  </div>
))

// --- CLOCK HAND ---
const ClockHand = memo(({ img, width, max, rotation, z }) => (
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
      filter: 'drop-shadow(2px 2px 0px rgba(120,120,230))'
    }}
  />
))

// --- CLOCK FACE ---
const ClockFace = memo(({ angles }) => {
  const positions = CONFIG.numerals.map(({ text, deg }) => {
    const rad = (deg - 90) * (Math.PI / 180)
    return {
      text,
      x: 50 + CONFIG.numeralRadius * Math.cos(rad),
      y: 50 + CONFIG.numeralRadius * Math.sin(rad)
    }
  })

  return (
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
      {positions.map((p, i) => (
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
            z={h.z}
          />
        ))}
      </div>
    </div>
  )
})

// --- MAIN COMPONENT ---
export default function AnalogClock () {
  const time = useTime()
  const angles = useClockAngles(time)

  // Preload hand images
  useEffect(() => {
    ;[hourHandImg, minuteHandImg, secondHandImg].forEach(src => {
      const img = new Image()
      img.src = src
    })
  }, [])

  return (
    <>
      <GlobalStyles />

      {/* Gradient base */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'linear-gradient(to bottom, #124CDEFF, #1380CDFF)',
          zIndex: 0,
          pointerEvents: 'none'
        }}
      />

      {/* Infinite scrolling Joop background */}
      <InfiniteScrollingBG />

      {/* JJ overlay */}
      <BackgroundImage2 />

      {/* Eagle tiles */}
      <TiledBackground />

      {/* Clock */}
      <ClockFace angles={angles} />
    </>
  )
}
