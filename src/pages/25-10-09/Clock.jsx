import React, { useEffect, useState } from 'react'
import cinzel20251010 from './d1.ttf'
import roboto20251010 from './d2.ttf'
import orbitron20251010 from './d3.otf'

export default function ConcentricClock () {
  const [currentTime, setCurrentTime] = useState({ h: 0, m: 0, s: 0 })
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      )
    }
    setVh()
    window.addEventListener('resize', setVh)
    return () => window.removeEventListener('resize', setVh)
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'HoursFont';
        src: url(${cinzel20251010}) format('truetype');
      }
      @font-face {
        font-family: 'MinutesFont';
        src: url(${roboto20251010}) format('opentype');
      }
      @font-face {
        font-family: 'SecondsFont';
        src: url(${orbitron20251010}) format('opentype');
      }
    `
    document.head.appendChild(style)
    document.fonts.ready.then(() => setFontsLoaded(true))
  }, [])

  useEffect(() => {
    if (!fontsLoaded) return
    const getTime = () => {
      const now = new Date()
      setCurrentTime({
        h: now.getHours() % 12 || 12,
        m: now.getMinutes(),
        s: now.getSeconds()
      })
    }
    getTime()
    const interval = setInterval(getTime, 1000)
    return () => clearInterval(interval)
  }, [fontsLoaded])

  const renderRing = (count, radiusVh, type, offset = { x: 0, y: 0 }) => {
    const items = []
    const current = currentTime[type]
    const fontFamily =
      type === 'h' ? 'HoursFont' : type === 'm' ? 'MinutesFont' : 'SecondsFont'
    const currentOffset = (360 / count) * current

    for (let i = 0; i < count; i++) {
      const angle = (360 / count) * i - currentOffset
      const rad = (angle * Math.PI) / 180
      const x = radiusVh * Math.cos(rad) + offset.x
      const y = radiusVh * Math.sin(rad) + offset.y

      let value
      if (type === 'h') value = i === 0 ? 12 : i
      else value = i.toString().padStart(2, '0')

      const isCurrent =
        (type === 'h' &&
          value === (currentTime.h === 0 ? 12 : currentTime.h)) ||
        (type === 'm' && i === currentTime.m) ||
        (type === 's' && i === currentTime.s)

      items.push(
        <div
          key={`${type}-${i}`}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: `translate(${x}vh, ${y}vh)`,
            fontFamily,
            fontSize: type === 'h' ? '20vh' : type === 'm' ? '17vh' : '8vh',
            fontWeight: isCurrent ? 700 : 300,
            color: isCurrent ? '#F4800BFF' : 'rgba(255, 150, 200)',
            textShadow: isCurrent
              ? `
    -1px -1px 0 #FFFFFF,
    1px -1px 0 #FFFFFF,
    -1px 1px 0 #FFFFFF,
    1px 1px 0 #FFFFFF,
    0 0 0.5vh #FFFFFF,
    0 0 2vh #00FF73FF,
    0 0 4vh #00FFE5FF,
    0 0 6vh #84FF00FF
  `
              : '0 0 0.8vh rgba(25, 10, 80)',

            opacity: isCurrent ? 1 : 0.4,
            transition: 'all 0.4s ease',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',

            // 🆕 Add this line:
            zIndex: isCurrent ? 10 : 1
          }}
        >
          {value}
        </div>
      )
    }
    return items
  }

  if (!fontsLoaded) return null

  // Format time in HH:MM:SS (12-hour)
  const formattedTime = `${currentTime.h
    .toString()
    .padStart(2, '0')}:${currentTime.m
    .toString()
    .padStart(2, '0')}:${currentTime.s.toString().padStart(2, '0')}`

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: 'calc(var(--vh, 1vh) * 100)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        background:
          'radial-gradient(circle at center, #530B7CFF 30%, #6B11BAFF 100%)',
        overflow: 'hidden'
      }}
    >
      {/* Concentric rings */}
      <div
        style={{
          position: 'relative',
          width: '100vh',
          height: '100vh'
        }}
      >
        {renderRing(12, 62, 'h', { x: -79, y: -42 })}
        {renderRing(60, 139, 'm', { x: -149, y: -14 })}
        {renderRing(60, 72, 's', { x: -75, y: 11 })}
      </div>
    </div>
  )
}
