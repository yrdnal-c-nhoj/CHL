import React, { useEffect, useState } from 'react'

// Import your background image from the same folder
import bgImage from './wheel.svg'

export default function AnalogBackgroundClock () {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const seconds = now.getSeconds()
  const minutes = now.getMinutes() + seconds / 60
  const hours = (now.getHours() % 12) + minutes / 60

  const clockSize = 80 // vh

  const containerStyle = {
    position: 'fixed',
    inset: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }

  const clockStyle = {
    position: 'relative',
    width: `${clockSize}vh`,
    height: `${clockSize}vh`,
    borderRadius: '50%'
  }

  const handBase = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '1vh'
  }

  const hourHand = {
    ...handBase,
    width: '1.4vh',
    height: '20vh',
    background: 'black',
    transform: `translate(-50%, -100%) rotate(${hours * 30}deg)`
  }

  const minuteHand = {
    ...handBase,
    width: '1vh',
    height: '28vh',
    background: 'black',
    transform: `translate(-50%, -100%) rotate(${minutes * 6}deg)`
  }

  const secondHand = {
    ...handBase,
    width: '0.5vh',
    height: '34vh',
    background: 'black',
    transform: `translate(-50%, -100%) rotate(${seconds * 6}deg)`
  }

  return (
    <div style={containerStyle}>
      <div style={clockStyle}>
        <div style={hourHand} />
        <div style={minuteHand} />
        <div style={secondHand} />
      </div>
    </div>
  )
}
