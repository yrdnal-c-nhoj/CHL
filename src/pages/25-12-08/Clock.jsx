import React, { useEffect, useState } from 'react'

// Import assets
import bgImage from './plate.webp'
import hourHandImg from './hand.gif'
import minuteHandImg from './han.gif'
import secondHandImg from './ha.gif'

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())

  // Smooth update
  useEffect(() => {
    let frameId
    const animate = () => {
      setTime(new Date())
      frameId = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(frameId)
  }, [])

  const now = time

  // Degrees
  const totalHours =
    now.getHours() +
    now.getMinutes() / 60 +
    now.getSeconds() / 3600 +
    now.getMilliseconds() / 3600000

  const totalMinutes =
    now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000

  const totalSeconds = now.getSeconds() + now.getMilliseconds() / 1000

  const hourDeg = totalHours * 30
  const minuteDeg = totalMinutes * 6
  const secondDeg = totalSeconds * 6

  // Container
  const outerContainerStyle = {
    height: '100dvh',
    width: '100vw',
    position: 'relative',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }

  const clockContainerStyle = {
    width: '85vmin',
    height: '85vmin',
    borderRadius: '50%',
    position: 'relative',
    zIndex: 5
  }

  const handStyle = (deg, width, height) => ({
    position: 'absolute',
    width: `${width}vmin`,
    height: `${height}vmin`,
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: '50% 100%',
    top: '50%',
    left: '50%',
    transition: 'none',
    zIndex: 10,
    filter:
      'brightness(0.8) blur(1px) drop-shadow(-1px -1px 0px rgba(0,0,0,0.4)) drop-shadow(-2px -2px 2px rgba(0,0,0,0.4)) drop-shadow(-3px -3px 4px rgba(0,0,0,0.2)) drop-shadow(0px 0px 10px rgba(50,50,50,0.1))'
  })

  const centerDeg = -(totalSeconds * 12)

  return (
    <div style={outerContainerStyle}>
      <div style={clockContainerStyle}>
        {/* Hour hand */}
        <img src={hourHandImg} alt='hour' style={handStyle(hourDeg, 18, 24)} />

        {/* Minute hand (restored) */}
        <img
          src={minuteHandImg}
          alt='minute'
          style={handStyle(minuteDeg, 20, 32)}
        />

        {/* Second hand */}
        <img
          src={secondHandImg}
          alt='second'
          style={handStyle(secondDeg, 16, 33)}
        />
      </div>
    </div>
  )
}
