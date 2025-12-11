import React, { useEffect, useState, useMemo, memo } from 'react'

// --- Image Imports ---
import bg1 from './joop.webp'
import bg2 from './cr.webp'
import portImg from './eagle.webp'
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'
import font251211 from './jup.ttf?url'

// --- Configuration ---
const CONFIG = {
  clock: {
    size: '40vh',
    numeralRadius: 45,
    updateInterval: 100
  },
  tile: {
    size: 150,
    opacity: 0.7,
    filter: 'saturate(300%) hue-rotate(202deg) contrast(70%) brightness(1.5)'
  },
  effects: {
    goldFilter: 'drop-shadow(0 0 5px #FFD700)'
  },
  hands: [
    { img: secondHandImg, width: '12vh', zIndex: 6, alt: 'Second Hand' },
    { img: minuteHandImg, width: '14vh', zIndex: 5, alt: 'Minute Hand' },
    { img: hourHandImg, width: '16vh', zIndex: 4, alt: 'Hour Hand' }
  ],
  numerals: [
    { text: 'XII', deg: 0 },
    { text: 'III', deg: 90 },
    { text: 'VI', deg: 180 },
    { text: 'IX', deg: 270 }
  ]
}

// --- Hooks ---
function useTime (interval = 100) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), interval)
    return () => clearInterval(id)
  }, [interval])

  return time
}

function useViewport () {
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return viewport
}

function useClockAngles (time) {
  return useMemo(() => {
    const ms = time.getMilliseconds()
    const s = time.getSeconds() + ms / 1000
    const m = time.getMinutes() + s / 60
    const h = (time.getHours() % 12) + m / 60

    return {
      second: s * 6,
      minute: m * 6,
      hour: h * 30
    }
  }, [time])
}

// --- Components ---
const GlobalStyles = memo(() => (
  <style>{`
    @font-face {
      font-family: 'CustomFont251211';
      src: url(${font251211});
    }
  `}</style>
))

const BackgroundLayer = memo(({ image, opacity, filter, zIndex }) => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `url(${image})`,
      backgroundSize: 'cover',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      opacity,
      filter,
      zIndex
    }}
  />
))

const TiledBackground = memo(({ viewport }) => {
  const tiles = useMemo(() => {
    const { width, height } = viewport
    const { size, opacity, filter } = CONFIG.tile

    const cols = Math.ceil(width / size) + 2
    const rows = Math.ceil(height / size) + 2
    const startX = width / 2 - (cols * size) / 2
    const startY = height / 2 - (rows * size) / 2

    return Array.from({ length: rows * cols }, (_, idx) => {
      const row = Math.floor(idx / cols)
      const col = idx % cols

      return (
        <div
          key={idx}
          style={{
            position: 'absolute',
            width: size,
            height: size,
            backgroundImage: `url(${portImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            opacity,
            filter,
            transform: (row + col) % 2 !== 0 ? 'scaleX(-1)' : 'none',
            left: startX + col * size,
            top: startY + row * size,
            zIndex: 1,
            willChange: 'transform, opacity'
          }}
        />
      )
    })
  }, [viewport])

  return <>{tiles}</>
})

const ClockNumeral = memo(({ text, x, y }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -50%)',
      color: '#FFD37B',
      fontSize: '4vh',
      opacity: 0.8,
      fontFamily: 'CustomFont251211',
      filter: CONFIG.effects.goldFilter,
      zIndex: 3,
      textAlign: 'center',
      lineHeight: 1
    }}
  >
    {text}
  </div>
))

const ClockHand = memo(({ image, width, rotation, zIndex, alt }) => (
  <img
    src={image}
    alt={alt}
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width,
      transform: `translate(-50%, -80%) rotate(${rotation}deg)`,
      transformOrigin: '50% 100%',
      filter: CONFIG.effects.goldFilter,
      zIndex
    }}
  />
))

const ClockFace = memo(({ angles }) => {
  const numeralPositions = useMemo(() => {
    return CONFIG.numerals.map(({ text, deg }) => {
      const rad = (deg - 90) * (Math.PI / 180)
      return {
        text,
        x: 50 + CONFIG.clock.numeralRadius * Math.cos(rad),
        y: 50 + CONFIG.clock.numeralRadius * Math.sin(rad)
      }
    })
  }, [])

  return (
    <div
      style={{
        position: 'absolute',
        width: CONFIG.clock.size,
        height: CONFIG.clock.size,
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
      {numeralPositions.map(({ text, x, y }, i) => (
        <ClockNumeral key={i} text={text} x={x} y={y} />
      ))}

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
        {CONFIG.hands.map(({ img, width, zIndex, alt }, i) => {
          const rotations = [angles.second, angles.minute, angles.hour]
          return (
            <ClockHand
              key={i}
              image={img}
              width={width}
              rotation={rotations[i]}
              zIndex={zIndex}
              alt={alt}
            />
          )
        })}
      </div>
    </div>
  )
})

// --- Main Component ---
export default function AnalogClock () {
  const time = useTime(CONFIG.clock.updateInterval)
  const viewport = useViewport()
  const angles = useClockAngles(time)

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        width: '100vw',
        height: `${viewport.height}px`,
        position: 'relative',
        background: 'linear-gradient(to top, #08A4F2FF, #04369BFF)',
        overflow: 'hidden'
      }}
    >
      <GlobalStyles />

      {/* Gradient Base */}
      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, white, skyblue)',
          zIndex: -2
        }}
      />

      {/* Background Layers */}
      <BackgroundLayer
        image={bg1}
        opacity={0.8}
        filter='saturate(150%) contrast(170%)'
        zIndex={0}
      />

      <TiledBackground viewport={viewport} />

      <BackgroundLayer
        image={bg2}
        opacity={0.5}
        filter='saturate(300%) contrast(630%)'
        zIndex={1}
      />

      {/* Clock */}
      <ClockFace angles={angles} />
    </div>
  )
}
