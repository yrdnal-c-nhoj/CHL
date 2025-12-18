import React, { useEffect, useState, useLayoutEffect } from 'react'

// Import assets
import bgImage from './giraffe.webp'
import hourHandImggir from './hand3.gif'
import minnnuteHandImg from './hand1.gif'
import secondHandImg from './hand2.gif'
import customFont_2025_1206 from './gir.otf'
import tileImg from './run.webp'
import centerImg from './walk.webp'

export default function AnalogClock() {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  })

  // useLayoutEffect prevents the "flash" of incorrect positions on first mount
  useLayoutEffect(() => {
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

  // Inject styles including the custom font
  useEffect(() => {
    const style = document.createElement('style')
    style.innerHTML = `
      @font-face {
        font-family: 'CustomClockFont';
        src: url(${customFont_2025_1206}) format('truetype');
      }
      html, body, #root {
        margin: 0;
        padding: 0;
        height: 100%;
        width: 100%;
        overflow: hidden;
        background: #000;
      }
      body { height: 100dvh; }
    `
    document.head.appendChild(style)
    return () => {
      if (document.head.contains(style)) document.head.removeChild(style)
    }
  }, [])

  // Animation Loop
  useEffect(() => {
    let rafId
    const tick = () => {
      setTime(new Date())
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  // Time Calculations
  const now = time
  const totalHours = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600
  const totalMinutes = now.getMinutes() + now.getSeconds() / 60
  const totalSeconds = now.getSeconds() + now.getMilliseconds() / 1000

  const hourDeg = totalHours * 30
  const minuteDeg = totalMinutes * 6
  const secondDeg = totalSeconds * 6
  const centerDeg = -totalSeconds * 6

  // Tiling logic
  const vmin = Math.min(viewport.width, viewport.height)
  const tileSize = 10 // vmin
  const tileSizePx = (tileSize / 100) * vmin
  const horizontalTiles = Math.ceil(viewport.width / tileSizePx) + 2
  const verticalTiles = Math.ceil(viewport.height / tileSizePx) + 2

  const renderTiles = (count, rotation, isRow) =>
    Array.from({ length: count }, (_, i) => (
      <div key={i} style={{ height: `${tileSize}vmin`, width: `${tileSize}vmin`, overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: '100%',
          backgroundImage: `url(${tileImg})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          transform: `rotate(${rotation}deg)`
        }} />
      </div>
    ))

  // Component Styles
  const outerContainerStyle = {
    height: '100dvh',
    width: '100vw',
    position: 'fixed',
    top: 0,
    left: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none'
  }

  const clockContainerStyle = {
    width: 'min(80vmin, 90vw)',
    height: 'min(80vmin, 90vw)',
    position: 'relative',
    zIndex: 10
  }

  const numberStyle = (num) => {
    const angle = (num - 3) * 30 * (Math.PI / 180)
    const radius = 42 
    return {
      position: 'absolute',
      left: `calc(50% + ${radius * Math.cos(angle)}%)`,
      top: `calc(50% + ${radius * Math.sin(angle)}%)`,
      transform: 'translate(-50%, -50%)',
      fontSize: 'clamp(3rem, 10vmin, 6rem)',
      fontFamily: 'CustomClockFont, sans-serif',
      color: 'white',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
      userSelect: 'none',
      zIndex: 5
    }
  }

  const handStyle = (deg, width, zIndex) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: `${width}%`,
    height: 'auto',
    // translate(-50%, -90%) ensures the pivot point of the image sits exactly in the center
    transform: `translate(-50%, -90%) rotate(${deg}deg)`,
    transformOrigin: '50% 90%',
    zIndex: zIndex,
    filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))',
    pointerEvents: 'none',
    willChange: 'transform'
  })

  return (
    <div style={outerContainerStyle}>
      {/* Border Tiling */}
      <div style={{ position: 'absolute', top: 0, width: '100%', display: 'flex', zIndex: 3 }}>
        {renderTiles(horizontalTiles, 180, true)}
      </div>
      <div style={{ position: 'absolute', bottom: 0, width: '100%', display: 'flex', zIndex: 3 }}>
        {renderTiles(horizontalTiles, 0, true)}
      </div>
      <div style={{ position: 'absolute', left: 0, height: '100%', display: 'flex', flexDirection: 'column', zIndex: 3 }}>
        {renderTiles(verticalTiles, 90, false)}
      </div>
      <div style={{ position: 'absolute', right: 0, height: '100%', display: 'flex', flexDirection: 'column', zIndex: 3 }}>
        {renderTiles(verticalTiles, 270, false)}
      </div>

      {/* Clock Face */}
      <div style={clockContainerStyle}>
        {[...Array(12)].map((_, i) => (
          <div key={i + 1} style={numberStyle(i + 1)}>{i + 1}</div>
        ))}

        <img src={minnnuteHandImg} style={handStyle(minuteDeg, 37, 9)} alt="minute" />
        <img src={secondHandImg} style={handStyle(secondDeg, 40, 10)} alt="second" />
        <img src={hourHandImggir} style={handStyle(hourDeg, 37, 11)} alt="hour" /> 
      
        {/* Spinning Center Image */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '29vmin',
          height: '29vmin',
          transform: `translate(-50%, -50%) rotate(${centerDeg}deg)`,
          zIndex: 15
        }}>
          <img src={centerImg} style={{ width: '100%', height: '100%', objectFit: 'contain' }} alt="center" />
        </div>
      </div>
    </div>
  )
}