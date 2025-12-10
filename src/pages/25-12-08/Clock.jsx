import React, { useEffect, useState, useMemo } from 'react'

// Import assets
import bgImage from './plate.webp'
import hourHandImg from './hand.gif'
import minuteHandImg from './han.gif'
import secondHandImg from './ha.gif'

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())

  // Smooth update loop
  useEffect(() => {
    let frame
    const tick = () => {
      setTime(new Date())
      frame = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(frame)
  }, [])

  const now = time

  // Precompute rotation degrees
  const hourDeg =
    (now.getHours() +
      now.getMinutes() / 60 +
      now.getSeconds() / 3600 +
      now.getMilliseconds() / 3600000) *
    30

  const minuteDeg =
    (now.getMinutes() + now.getSeconds() / 60 + now.getMilliseconds() / 60000) *
    6

  const secondDeg = (now.getSeconds() + now.getMilliseconds() / 1000) * 6

  // Shared hand visual filter
  const handFilter =
    'brightness(0.8) blur(1px) drop-shadow(-1px -1px 0px rgba(0,0,0,0.4)) drop-shadow(-2px -2px 2px rgba(0,0,0,0.4)) drop-shadow(-3px -3px 4px rgba(0,0,0,0.2)) drop-shadow(0px 0px 10px rgba(50,50,50,0.1))'

  // Memoized static styles
  const outerContainerStyle = useMemo(
    () => ({
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
    }),
    []
  )

  const clockContainerStyle = useMemo(
    () => ({
      width: '85vmin',
      height: '85vmin',
      borderRadius: '50%',
      position: 'relative',
      zIndex: 5
    }),
    []
  )

  // Generate each hand's inline style
  const makeHandStyle = (deg, w, h) => ({
    position: 'absolute',
    width: `${w}vmin`,
    height: `${h}vmin`,
    transform: `translate(-50%, -100%) rotate(${deg}deg)`,
    transformOrigin: '50% 100%',
    top: '50%',
    left: '50%',
    zIndex: 10,
    filter: handFilter
  })

  return (
    <div style={outerContainerStyle}>
      <div style={clockContainerStyle}>
        {/* Hour hand */}
        <img
          src={hourHandImg}
          alt='hour'
          style={makeHandStyle(hourDeg, 18, 24)}
        />

        {/* Minute hand */}
        <img
          src={minuteHandImg}
          alt='minute'
          style={makeHandStyle(minuteDeg, 20, 32)}
        />

        {/* Second hand */}
        <img
          src={secondHandImg}
          alt='second'
          style={makeHandStyle(secondDeg, 16, 33)}
        />
      </div>
    </div>
  )
}
