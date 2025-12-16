import React, { useState, useEffect } from 'react'
// Assuming the font import path remains the same
import font_2025_12_16 from './four.ttf'

const QuadClock = () => {
  const [time, setTime] = useState(Date.now())

  useEffect(() => {
    let animationId
    const updateTime = () => {
      setTime(Date.now())
      animationId = requestAnimationFrame(updateTime)
    }
    updateTime()
    return () => cancelAnimationFrame(animationId)
  }, [])

  const now = new Date(time)
  const milliseconds = now.getMilliseconds()
  const seconds = now.getSeconds() + milliseconds / 1000
  const minutes = now.getMinutes() + seconds / 60
  const hours = (now.getHours() % 12) + minutes / 60

  const hDeg = hours * 30
  const mDeg = minutes * 6
  const sDeg = seconds * 6

  // Configuration for scaling
  const CLOCK_SIZE = 100 // % of the smallest screen dimension (vmin)
  const NUMBER_RADIUS = 35 // % of the clock size

  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#F1E870FF',
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 0C6.716 0 0 6.716 0 15c8.284 0 15-6.716 15-15zM0 15c0 8.284 6.716 15 15 15 0-8.284-6.716-15-15-15zm30 0c0-8.284-6.716-15-15-15 0 8.284 6.716 15 15 15zm0 0c0 8.284-6.716 15-15 15 0-8.284 6.716-15 15-15z' fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E\")",
    margin: 0,
    overflow: 'hidden',
    fontFamily: 'font_2025_12_16, system-ui, sans-serif'
  }

  const fontFaceStyle = `
    @font-face {
      font-family: 'font_2025_12_16';
      src: url(${font_2025_12_16}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `

  const renderClockLayer = (transform, opacity) => {
    const layerStyle = {
      position: 'absolute',
      width: `${CLOCK_SIZE}vmin`,
      height: `${CLOCK_SIZE}vmin`,
      transform: transform,
      opacity: opacity,
      pointerEvents: 'none' // Ensures layers don't block interaction if needed
    }

    const numbers = Array.from({ length: 12 }, (_, i) => i + 1)

    return (
      <div style={layerStyle}>
        {numbers.map(num => {
          const angle = num * 30 * (Math.PI / 180)
          // Position numbers with slight offset up and to the right
          const x = 52 + NUMBER_RADIUS * Math.sin(angle) // 2% to the right
          const y = 48 - NUMBER_RADIUS * Math.cos(angle) // 2% up

          return (
            <div
              key={num}
              style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                transform: 'translate(-50%, -50%)',
                fontSize: `${CLOCK_SIZE * 0.16}vmin`, // Scaled font size
                color: '#333333',
                lineHeight: 1,
                textShadow: '1px 1px 0px white'
              }}
            >
              {num}
            </div>
          )
        })}

        {/* Hands scaled using vmin relative to the clock size */}
        <div
          style={handStyle(
            hDeg,
            `${CLOCK_SIZE * 0.25}vmin`,
            `${CLOCK_SIZE * 0.03}vmin`,
            '#06BA03FF'
          )}
        />
        <div
          style={handStyle(
            mDeg,
            `${CLOCK_SIZE * 0.38}vmin`,
            `${CLOCK_SIZE * 0.02}vmin`,
            '#5555F4FF'
          )}
        />
        <div
          style={handStyle(
            sDeg,
            `${CLOCK_SIZE * 0.45}vmin`,
            `${CLOCK_SIZE * 0.015}vmin`,
            '#F60404FF'
          )}
        />
      </div>
    )
  }

  const handStyle = (deg, height, width, color) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: 'bottom',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    height: height,
    width: width,
    backgroundColor: color,
    borderRadius: '1vmin',
    boxShadow: `1px 1px 2px rgba(0,0,0,0.8), 0 0 1vmin ${color}`,
    zIndex: 5
  })

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: fontFaceStyle }} />

      <div style={containerStyle}>
        {/* Quadrant dividing lines */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '0',
            bottom: '0',
            width: '1px',
            backgroundColor: 'rgba(25,255,255,0.6)'
            // zIndex: 1
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '1px',
            backgroundColor: 'rgba(25,255,255,0.6)'
            // zIndex: 1
          }}
        />
        {renderClockLayer('scale(-1, 1)', 1)}
        {renderClockLayer('scale(1, -1)', 1)}
        {renderClockLayer('scale(-1, -1)', 1)}
        {renderClockLayer('scale(1, 1)', 1)}

        {/* Center Cap scaled with vmin */}
        <div
          style={{
            position: 'absolute',
            width: '2vmin',
            height: '2vmin',
            backgroundColor: 'white',
            borderRadius: '50%',
            zIndex: 10,
            boxShadow: '0 0 1vmin rgba(0,0,0,0.5)'
          }}
        />
      </div>
    </>
  )
}

export default QuadClock
