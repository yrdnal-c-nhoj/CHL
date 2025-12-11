import React, { useEffect, useState, useMemo } from 'react'

import bg1 from './joop.webp'
import bg2 from './cr.webp'
import portImg from './eagle.webp'
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'
import font251211 from './jup.ttf?url'

const CLOCK_SIZE = '40vh'
const TILE_SIZE = 150
const NUMERAL_RADIUS = 45

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

const NUMERALS = [
  { text: 'XII', deg: 0 },
  { text: 'III', deg: 90 },
  { text: 'VI', deg: 180 },
  { text: 'IX', deg: 270 }
]

const HAND_CONFIG = [
  { img: secondHandImg, width: '12vh', zIndex: 6, alt: 'Second Hand' },
  { img: minuteHandImg, width: '14vh', zIndex: 5, alt: 'Minute Hand' },
  { img: hourHandImg, width: '16vh', zIndex: 4, alt: 'Hour Hand' }
]

const GOLD_FILTER =
  'drop-shadow(0 0 12px #FF5900FF) drop-shadow(0 0 20px #DE7B11FF) brightness(1.5) contrast(1.1) saturate(1) hue-rotate(25deg)'

const GOLD_TEXT_SHADOW = `-0.35vh -0.35vh 0.4vh rgba(255,255,255,0.85),
  -0.2vh -0.2vh 0.3vh rgba(255,255,255,0.6),
  0.35vh 0.35vh 0.5vh rgba(110,50,0,0.9),
  0.15vh 0.15vh 0.3vh rgba(90,40,0,0.7),
  0 0 4vh rgba(255,180,80,0.9),
  0 0 2vh rgba(255,120,40,0.8),
  0 0 1vh rgba(255,90,20,1)`

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const [containerHeight, setContainerHeight] = useState(
    `${window.innerHeight}px`
  )

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight })
      setContainerHeight(`${window.innerHeight}px`)
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

  const angles = useMemo(() => {
    const ms = time.getMilliseconds()
    const s = time.getSeconds() + ms / 1000
    const m = time.getMinutes() + s / 60
    const h = (time.getHours() % 12) + m / 60

    return [s * 6, m * 6, h * 30]
  }, [time])

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
        fontFamily: 'sans-serif',
        width: '100vw',
        height: containerHeight,
        position: 'relative',
        background: 'linear-gradient(to top, #08A4F2FF, #04369BFF)'
      }}
    >
      <style>{GLOBAL_STYLES}</style>

      <div
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, white, skyblue)',
          zIndex: -2
        }}
      />

      <div
        style={{
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
          filter: 'saturate(150%) contrast(170%)',
          zIndex: 0,
          animation: 'spin 60s linear infinite',
          transformOrigin: 'center center'
        }}
      />

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

      {tiles}

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
              fontWeight: 'bold',
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
                transform: `translate(-50%, -70%) rotate(${angles[i]}deg)`,
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
