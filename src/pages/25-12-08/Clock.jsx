import React, { useEffect, useState } from 'react'

// Import assets
import bgImage from './giraffe.webp'
import hourHandImg from './hand3.gif'
import minuteHandImg from './hand.gif'
import secondHandImg from './hand2.gif'
import centerImg from './walk.webp'

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

  const handStyle = (deg, width, height, transitionDuration) => ({
    position: 'absolute',
    width: `${width}vmin`,
    height: `${height}vmin`,
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: '50% 100%',
    top: '50%',
    left: '50%',
    transition: transitionDuration
      ? `transform ${transitionDuration}s linear`
      : 'none',
    opacity: 0.85,
    zIndex: 10
  })

  const centerDeg = -(totalSeconds * 12)

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

  return (
    <div style={outerContainerStyle}>
      <div style={clockContainerStyle}>
        {/* Hour hand */}
        <img
          src={hourHandImg}
          alt='hour'
          style={handStyle(hourDeg, 28, 44, 12 * 3600)}
        />

        {/* Minute hand (restored) */}
        <img
          src={minuteHandImg}
          alt='minute'
          style={handStyle(minuteDeg, 26, 52, 3600)}
        />

        {/* Second hand */}
        <img
          src={secondHandImg}
          alt='second'
          style={handStyle(secondDeg, 26, 58, null)}
        />

        {/* Center rotating image */}
        <img src={centerImg} alt='center' style={centerImageStyle} />
      </div>
    </div>
  )
}
