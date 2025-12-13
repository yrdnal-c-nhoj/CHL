import React, { useEffect, useState, useRef } from 'react'
import pageBgImgBase from './skin.jpg'
import pageBgImg from './sss.webp'
import clockFaceImg from './sn.gif'
import hourHandImg from './sn5.webp'
import minuteHandImg from './sfsd.webp'
import secondHandImg from './sn1.webp'
import clockCenterImg from './center.webp' // <-- your new center image
import fon251124 from './snake.ttf'

export default function AnalogClock () {
  const [time, setTime] = useState(new Date())
  const requestRef = useRef()

  // Smooth update with requestAnimationFrame
  const updateTime = () => {
    setTime(new Date())
    requestRef.current = requestAnimationFrame(updateTime)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateTime)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  const hours = time.getHours() % 12
  const minutes = time.getMinutes()
  const seconds = time.getSeconds() + time.getMilliseconds() / 1000

  const hourAngle = (hours + minutes / 60) * 30
  const minuteAngle = (minutes + seconds / 60) * 6
  const secondAngle = seconds * 6

  const unit = 'vmin'
  const clockSize = 100 // smaller size now
  const tileSize = 25

  const pageWrapperStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden'
  }

  const pageBackgroundBase = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${pageBgImgBase})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    filter: 'saturate(2.7) contrast(0.4) brightness(0.4)',
    zIndex: -3
  }

  const pageBackgroundLayer1 = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${pageBgImg})`,
    backgroundRepeat: 'repeat',
    filter: 'saturate(2.7)',
    opacity: 0.6,
    backgroundSize: `${tileSize}${unit} ${tileSize}${unit}`,
    backgroundPosition: 'center',
    zIndex: -2
  }

  const containerStyle = {
    position: 'relative',
    width: `${clockSize}${unit}`,
    height: `${clockSize}${unit}`,
    borderRadius: '50%',
    overflow: 'visible',
    textAlign: 'center'
  }

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    backgroundImage: `url(${clockFaceImg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'saturate(0.7) contrast(1.4) brightness(0.7)',
    opacity: 0.6,
    zIndex: 1
  }

  const handStyle = (angle, length) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 'auto',
    height: `${length}${unit}`,
    transform: `translate(-50%, -100%) rotate(${angle}deg)`,
    transformOrigin: '50% 100%'
  })

  const fontBlob = `@font-face {
    font-family: 'customFont';
    src: url(${fon251124}) format('truetype');
    font-weight: normal;
    font-style: normal;
  }`

  const digits = Array.from({ length: 12 }, (_, i) => i + 1)

  const digitStyle = num => {
    const angle = (num * 30 - 90) * (Math.PI / 180)
    const radius = clockSize / 2 - 7
    const x = radius * Math.cos(angle)
    const y = radius * Math.sin(angle)

    return {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: `translate(${x}${unit}, ${y}${unit}) translate(-50%, -50%)`,
      fontFamily: 'customFont',
      fontSize: `10${unit}`,
      color: '#6C5D35D0',
      textShadow: '1px 1px rgba(220,192,192,0.9), -1px -1px rgba(0,0,0,0.9)',
      userSelect: 'none',
      zIndex: 2
    }
  }

  const hourHandLen = 42
  const minuteHandLen = 50
  const secondHandLen = 58

  return (
    <div style={pageWrapperStyle}>
      <div style={pageBackgroundBase}></div>
      <div style={pageBackgroundLayer1}></div>

      <div style={containerStyle}>
        <style>{fontBlob}</style>
        <div style={backgroundStyle}></div>

        {digits.map(d => (
          <div key={d} style={digitStyle(d)}>
            {d}
          </div>
        ))}

        {/* Center image */}
        <img
          src={clockCenterImg}
          alt='center'
          style={{
            position: 'absolute',
            top: '52%',
            left: '50%',
            width: '22vmin',
            height: '16vmin',
            transform: 'translate(-50%, -50%)',
            zIndex: 9,
            filter:
              'saturate(1.2) contrast(1.2) hue-rotate(44deg)  brightness(0.8) drop-shadow(0 1px 0.5vmin rgba(222,211,210))',

            pointerEvents: 'none'
          }}
        />

        <img
          src={hourHandImg}
          alt='hour'
          style={{
            ...handStyle(hourAngle, hourHandLen),
            zIndex: 8,
            filter:
              'saturate(1.2) contrast(1.9) brightness(0.8) drop-shadow(0 1px 0.5vmin rgba(222,211,210))'
          }}
        />

        <img
          src={minuteHandImg}
          alt='minute'
          style={{
            ...handStyle(minuteAngle, minuteHandLen),
            zIndex: 6,
            filter:
              'saturate(1.1) contrast(1.2) brightness(0.9) drop-shadow(0 1px 0.5vmin rgba(222,211,210))'
          }}
        />

        <img
          src={secondHandImg}
          alt='second'
          style={{
            ...handStyle(secondAngle, secondHandLen),
            zIndex: 3,
            filter:
              'grayscale(100%) sepia(100%) hue-rotate(44deg) saturate(50%) contrast(1.7) brightness(0.9) drop-shadow(0 1px 0.5vmin rgba(222,211,210))'
          }}
        />
      </div>
    </div>
  )
}
