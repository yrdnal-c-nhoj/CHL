import React, { useEffect, useState } from 'react'
import plateImage from '../../../assets/images/25-12-08/plate.webp'
import hourHand from '../../../assets/images/25-12-08/hand.gif'
import minuteHand from '../../../assets/images/25-12-08/hand2.gif'
import secondHand from '../../../assets/images/25-12-08/ha.gif'

// Styles moved outside the component to avoid recreation on every render (60fps)
const outerContainerStyle = {
  height: '100dvh',
  width: '100vw',
  position: 'relative',
  backgroundImage: `url(${plateImage})`,
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
    'brightness(0.8) drop-shadow(-1px -1px 0px rgba(0,0,0,0.5)) drop-shadow(-2px -2px 2px rgba(0,0,0,0.5)) drop-shadow(-3px -3px 4px rgba(0,0,0,0.3)) drop-shadow(0px 0px 10px rgba(50,50,50,0.2))'
})

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())

  // Smooth update
  useEffect(() => {
    let intervalId
    const animate = () => {
      setTime(new Date())
    }
    intervalId = setInterval(animate, 50)
    return () => clearInterval(intervalId)
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

  return (
    <div style={outerContainerStyle}>
      <div style={clockContainerStyle}>
        {/* Hour hand */}
        <img src={hourHand} alt='hour' style={handStyle(hourDeg, 18, 24)} />

        {/* Minute hand (restored) */}
        <img
          src={minuteHand}
          alt='minute'
          style={handStyle(minuteDeg, 20, 32)}
        />

        {/* Second hand */}
        <img
          src={secondHand}
          alt='second'
          style={handStyle(secondDeg, 16, 33)}
        />
      </div>
    </div>
  )
}
