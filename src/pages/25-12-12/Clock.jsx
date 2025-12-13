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

  /* ---------------- COLOR CYCLING ---------------- */

  const cycleProgress = (Date.now() % 15000) / 15000
  const getBrightness = offset =>
    (Math.sin((cycleProgress + offset) * Math.PI * 2) + 1) / 2

  const makeHand = (brightness, width, height, rotation) => {
    const v = Math.round(brightness * 255)
    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width,
      height,
      background: `rgb(${v},${v},${v})`,
      transformOrigin: '50% 100%',
      transform: `translate(-50%, -100%) rotate(${rotation}deg)`,
      borderRadius: '1vh',
      boxShadow: `0 4px 10px rgb(${255 - v},${255 - v},${255 - v})`,
      opacity: 0.85
    }
  }

  const hourHand = makeHand(getBrightness(0), '2vh', '14vh', hours * 30)
  const minuteHand = makeHand(getBrightness(0.25), '1.5vh', '20vh', minutes * 6)
  const secondHand = makeHand(getBrightness(0.5), '0.5vh', '30vh', seconds * 6)

  /* ---------------- BACKGROUND ---------------- */

  const hue = ((Date.now() / 60000) * 360) % 360
  const gradient = `hsl(${hue}, 100%, 50%)`

  return (
    <>
      {/* Gradient */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: gradient,
          zIndex: 1
        }}
      />
      Wheel image
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${bgImage})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'contain',
          zIndex: 2
        }}
      />
      {/* Clock hands */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '80vh',
            height: '80vh',
            borderRadius: '50%'
          }}
        >
          <div style={hourHand} />
          <div style={minuteHand} />
          <div style={secondHand} />
        </div>
      </div>
    </>
  )
}
