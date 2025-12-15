import React, { useEffect, useState } from 'react'

// Import assets
import bgImage from './giraffe.webp'
import hourHandImggir from './hand3.gif'
import minnnuteHandImg from './hand1.gif'
import secondHandImg from './hand2.gif'
import customFont_2025_1206 from './gir.otf'
import tileImg from './run.webp'
import centerImg from './walk.webp'

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  // Handle resize + recalculate vmin
  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Inject custom font + mobile viewport fix
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${customFont_2025_1206}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }

      html, body, #root {
        margin: 0;
        padding: 0;
        height: 100%;
        overflow: hidden;
      }

      /* Critical mobile fix */
      body {
        height: 100dvh;
      }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style)
      }
    }
  }, [])

  // Smooth clock animation with requestAnimationFrame
  useEffect(() => {
    let rafId
    const tick = () => {
      setTime(new Date())
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const now = time

  // Precise angles including milliseconds
  const totalHours =
    now.getHours() +
    now.getMinutes() / 60 +
    now.getSeconds() / 3600 +
    now.getMilliseconds() / 3600000
  const totalMinutes =
    now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000
  const totalSeconds = now.getSeconds() + now.getMilliseconds() / 1000

  const hourDeg = totalHours * 30 // 360° / 12 = 30° per hour
  const minuteDeg = totalMinutes * 6 // 360° / 60 = 6° per minute
  const secondDeg = totalSeconds * 6 // 360° / 60 = 6° per second

  // Tiling system
  const tileSize = 10 // vmin
  const vmin = Math.min(viewport.width, viewport.height)
  const tileSizePx = (tileSize / 100) * vmin

  const horizontalTiles = Math.ceil(viewport.width / tileSizePx) + 3
  const verticalTiles = Math.ceil(viewport.height / tileSizePx) + 6 // extra buffer

  const renderRowTiles = rotationDeg =>
    Array.from({ length: horizontalTiles }, (_, i) => (
      <div
        key={`row-${i}`}
        style={{
          height: `${tileSize}vmin`,
          width: `${tileSize}vmin`,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundImage: `url(${tileImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: 'center'
          }}
        />
      </div>
    ))

  const renderColumnTiles = rotationDeg =>
    Array.from({ length: verticalTiles }, (_, i) => (
      <div
        key={`col-${i}`}
        style={{
          height: `${tileSize}vmin`,
          width: `${tileSize}vmin`,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            height: '100%',
            width: '100%',
            backgroundImage: `url(${tileImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: `rotate(${rotationDeg}deg)`,
            transformOrigin: 'center'
          }}
        />
      </div>
    ))

  // Clock numbers (1–12)
  const numbers = Array.from({ length: 12 }, (_, i) => i + 1)
  const numberStyle = num => {
    const angle = (num - 3) * 30 * (Math.PI / 180)
    const radius = 42
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)
    return {
      position: 'absolute',
      left: `calc(50% + ${x}%)`,
      top: `calc(50% + ${y}%)`,
      fontSize: 'clamp(5rem, 8vw, 8.5rem)',
      fontFamily: 'CustomClockFont',
      userSelect: 'none',
      color: 'white',
      textAlign: 'center',
      transform: 'translate(-50%, -50%)',
      textShadow: '1px 1px 0 #970909, -1px -1px 0 black',
      pointerEvents: 'none',
      willChange: 'transform'
    }
  }

  // Hand style factory
  const handStyle = (deg, width, transitionDuration = null) => ({
    position: 'absolute',
    width: `${width}%`,
    height: 'auto',
    maxHeight: '90%',
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: '50% 100%',
    top: '50%',
    left: '50%',
    transition: transitionDuration
      ? `transform ${transitionDuration}s linear`
      : 'none',
    zIndex: 10,
    filter:
      'drop-shadow(2px 2px 4px rgba(0,0,0,0.9)) drop-shadow(-2px -2px 4px rgba(255,255,255,0.7))',
    opacity: 0.85,
    pointerEvents: 'none',
    backfaceVisibility: 'hidden',
    imageRendering: 'crisp-edges'
  })

  // Center spinning image (counterclockwise, 1 full turn per minute)
  const centerDeg = -totalSeconds * 6 // 360° per 60s → -6° per second

  const centerImageStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '25vmin',
    height: '25vmin',
    transform: `translate(-50%, -50%) rotate(${centerDeg}deg)`,
    transformOrigin: '50% 50%',
    zIndex: 15,
    opacity: 0.75,
    pointerEvents: 'none'
  }

  // Main container styles (THE FIX IS APPLIED HERE)
  const outerContainerStyle = {
    height: '100%', // Changed from '100dvh' to '100%'
    width: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none',
    overscrollBehavior: 'none'
  }

  const clockContainerStyle = {
    width: 'min(85vmin, 95vw)',
    height: 'min(85vmin, 95vh)',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 5,
    aspectRatio: '1/1'
  }

  const rowContainerStyle = position => ({
    position: 'absolute',
    top: position === 'top' ? 0 : 'auto',
    bottom: position === 'bottom' ? 0 : 'auto',
    left: 0,
    width: '100%',
    display: 'flex',
    gap: 0,
    zIndex: 3
  })

  const columnContainerStyle = side => ({
    position: 'absolute',
    left: side === 'left' ? 0 : 'auto',
    right: side === 'right' ? 0 : 'auto',
    top: 0,
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    zIndex: 3
  })

  return (
    <div style={outerContainerStyle}>
      {/* Tiling borders */}
      <div style={rowContainerStyle('top')}>{renderRowTiles(180)}</div>
      <div style={rowContainerStyle('bottom')}>{renderRowTiles(0)}</div>
      <div style={columnContainerStyle('left')}>{renderColumnTiles(90)}</div>
      <div style={columnContainerStyle('right')}>{renderColumnTiles(270)}</div>

      {/* Clock face */}
      <div style={clockContainerStyle}>
        {numbers.map(num => (
          <div key={num} style={numberStyle(num)}>
            {num}
          </div>
        ))}

        {/* Hands */}
        <img
          src={minnnuteHandImg}
          alt='minute'
          style={handStyle(minuteDeg, 25, 60)}
        />
        <img
          src={hourHandImggir}
          alt='hour'
          style={handStyle(hourDeg, 28, 43200)}
        />
        <img
          src={secondHandImg}
          alt='second'
          style={handStyle(secondDeg, 26)}
        />

        {/* Spinning center */}
        <img src={centerImg} alt='center' style={centerImageStyle} />
      </div>
    </div>
  )
}
