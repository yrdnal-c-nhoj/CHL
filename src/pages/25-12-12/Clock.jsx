import React, { useEffect, useState } from 'react'
import bgImage from './wheel.svg'

export default function AnalogBackgroundClock () {
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100)
    return () => clearInterval(id)
  }, [])

  const seconds = now.getSeconds() + now.getMilliseconds() / 1000
  const minutes = now.getMinutes() + seconds / 60
  const hours = (now.getHours() % 12) + minutes / 60

  const cycleProgress = (Date.now() % 15000) / 15000 // 0 to 1 over 15 seconds

  // Same speed for all, but different starting points (phase offset)
  const getBrightness = offset => {
    const t = (cycleProgress + offset) % 1
    return (Math.sin(t * Math.PI * 2) + 1) / 2 // Smooth 0 → 1 → 0
  }

  // Hour hand: starts at black (offset 0)
  const hourBrightness = getBrightness(0)
  const hourR = Math.round(hourBrightness * 255)
  const hourColor = `rgb(${hourR}, ${hourR}, ${hourR})`
  const hourShadowColor = `rgb(${255 - hourR}, ${255 - hourR}, ${255 - hourR})`

  // Minute hand: starts at medium gray (offset 0.25)
  const minuteBrightness = getBrightness(0.25)
  const minuteR = Math.round(minuteBrightness * 255)
  const minuteColor = `rgb(${minuteR}, ${minuteR}, ${minuteR})`
  const minuteShadowColor = `rgb(${255 - minuteR}, ${255 - minuteR}, ${
    255 - minuteR
  })`

  // Second hand: starts at white (offset 0.5)
  const secondBrightness = getBrightness(0.5)
  const secondR = Math.round(secondBrightness * 255)
  const secondColor = `rgb(${secondR}, ${secondR}, ${secondR})`
  const secondShadowColor = `rgb(${255 - secondR}, ${255 - secondR}, ${
    255 - secondR
  })`

  const clockSize = 80

  const hue = ((Date.now() / 30000) * 360) % 360
  const gradient = `hsl(${hue}, 100%, 50%)`

  const containerStyle = {
    position: 'fixed',
    inset: 0,
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
    width: '2vh',
    height: '14vh',
    background: hourColor,
    boxShadow: `0 4px 10px ${hourShadowColor}`,
    opacity: 0.8,
    transform: `translate(-50%, -100%) rotate(${hours * 30}deg)`
  }

  const minuteHand = {
    ...handBase,
    width: '1.5vh',
    height: '20vh',
    background: minuteColor,
    boxShadow: `0 4px 10px ${minuteShadowColor}`,
    opacity: 0.8,
    transform: `translate(-50%, -100%) rotate(${minutes * 6}deg)`
  }

  const secondHand = {
    ...handBase,
    width: '0.5vh',
    height: '30vh',
    background: secondColor,
    boxShadow: `0 4px 10px ${secondShadowColor}`,
    opacity: 0.8,
    transform: `translate(-50%, -100%) rotate(${seconds * 6}deg)`
  }

  return (
    <>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1,
          background: gradient
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      <div
        style={{
          ...containerStyle,
          zIndex: 3
        }}
      >
        <div style={clockStyle}>
          <div style={hourHand} />
          <div style={minuteHand} />
          <div style={secondHand} />
        </div>
      </div>
    </>
  )
}
