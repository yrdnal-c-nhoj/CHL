// AnalogClock.jsx
import React, { useEffect, useState } from 'react'
// Import local assets
import bg1 from './joop.webp'
import bg2 from './cr.webp'
import portImg from './eagle.webp'
import hourHandImg from './oa.gif'
import minuteHandImg from './oak.gif'
import secondHandImg from './nk.gif'

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const [viewport, setViewport] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  useEffect(() => {
    const handleResize = () =>
      setViewport({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const id = requestAnimationFrame(function update () {
      setTime(new Date())
      requestAnimationFrame(update)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const seconds = time.getSeconds() + time.getMilliseconds() / 1000
  const minutes = time.getMinutes() + seconds / 60
  const hours = (time.getHours() % 12) + minutes / 60

  const hourDeg = hours * 30
  const minuteDeg = minutes * 6
  const secondDeg = seconds * 6

  // ──────────────────────── ONLY THESE TWO CHANGES BELOW ────────────────────────

  const handsContainerStyle = {
    position: 'absolute',
    top: '35%',
    left: '50%',
    transform: 'translate(-50%, -50%)', // center the hands at clock center
    width: 0,
    height: 0,
    zIndex: 4
  }

  const goldHandStyle = (deg, width) => ({
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    transform: `translate(-50%, -70%) rotate(${deg}deg)`,
    transformOrigin: '50% 100%',
    filter:
      'drop-shadow(0 0 12px #FF5900FF) drop-shadow(0 0 20px #DE7B11FF) brightness(1.5) contrast(1.1) saturate(1) hue-rotate(25deg)'
  })

  // ──────────────────────── REST OF YOUR CODE 100% UNCHANGED ────────────────────────

  const tileSize = 150
  const numCols = Math.ceil(viewport.width / tileSize) + 2
  const numRows = Math.ceil(viewport.height / tileSize) + 2
  const startLeft = viewport.width / 2 - (numCols * tileSize) / 2
  const startTop = viewport.height / 2 - (numRows * tileSize) / 2

  const tiles = []
  for (let i = 0; i < numRows; i++) {
    for (let j = 0; j < numCols; j++) {
      const flip = (i + j) % 2 !== 0
      tiles.push(
        <div
          key={`${i}-${j}`}
          style={{
            position: 'absolute',
            width: tileSize,
            height: tileSize,
            backgroundImage: `url(${portImg})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            opacity: 0.5,
            filter:
              'saturate(700%) hue-rotate(202deg) contrast(70%) brightness(3.0)',
            transform: flip ? 'scaleX(-1)' : 'none',
            left: startLeft + j * tileSize,
            top: startTop + i * tileSize,
            zIndex: 1
          }}
        />
      )
    }
  }

  const containerStyle = {
    fontFamily: 'sans-serif',
    width: '100vw',
    height: '100vh',
    position: 'relative',
    background: 'linear-gradient(to top, #08A4F2FF, #0454F5FF)',
    backgroundSize: '100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'bottom'
  }

  const bgStyle1 = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${bg1})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'saturate(200%) contrast(130%)',
    opacity: 0.8,
    zIndex: 0,
    animation: 'spin 60s linear infinite',
    transformOrigin: 'center center',
    willChange: 'transform'
  }

  const bgStyle2 = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '115%',
    backgroundImage: `url(${bg2})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    opacity: 0.5,
    filter: 'saturate(300%) contrast(630%)',
    zIndex: 1
  }

  const clockStyle = {
    position: 'absolute',
    width: '70vh',
    height: '70vh',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2
  }

  const spin = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(-360deg); }
    }
  `

  return (
    <div style={containerStyle}>
      <style>{spin}</style>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, white, skyblue)',
          zIndex: -2
        }}
      />
      <div style={bgStyle1}></div>
      <div style={bgStyle2}></div>
      {tiles}

      <div style={clockStyle}>
        {/* ← NEW: all hands wrapped in one container → moved up together */}
        <div style={handsContainerStyle}>
          <img
            src={hourHandImg}
            alt='Hour Hand'
            style={goldHandStyle(hourDeg, '16vh')}
          />
          <img
            src={minuteHandImg}
            alt='Minute Hand'
            style={goldHandStyle(minuteDeg, '14vh')}
          />
          <img
            src={secondHandImg}
            alt='Second Hand'
            style={goldHandStyle(secondDeg, '12vh')}
          />
        </div>
      </div>
    </div>
  )
}
