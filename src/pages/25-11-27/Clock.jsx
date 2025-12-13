import React, { useState, useEffect, useRef } from 'react'
import revolution251127font from './dec.ttf'
import line251127font from './french.ttf'
import hourHandImg from './fre.webp'
import minuteHandImg from './fren.webp'
import secondHandImg from './fren.png'
import backgroundImg from './fr.jpg' // your background image

// --- 251127font Setup ---
const inject251127font = (id, fontFace) => {
  if (!document.getElementById(id)) {
    const style = document.createElement('style')
    style.id = id
    style.innerHTML = fontFace
    document.head.appendChild(style)
  }
}

const fontFaceRevolution = `
  @font-face {
    font-family: 'RevolutionaryClock251127font';
    src: url(${revolution251127font}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`

const fontFaceLine = `
  @font-face {
    font-family: 'Line251127font';
    src: url(${line251127font}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`

// --- Styles ---
const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    maxHeight: '100dvh',
    position: 'relative',
    overflow: 'hidden',
    backgroundImage: `url(${backgroundImg})`,
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundColor: '#000000',
    transform: 'rotate(-2.5deg)',
    transformOrigin: 'center center',
    '@media (max-width: 768px)': {
      transform: 'rotate(-2.5deg) scale(0.9)'
    },
    '@media (max-width: 480px)': {
      transform: 'rotate(-2.5deg) scale(0.8)'
    }
  },
  topDigits: {
    position: 'absolute',
    top: '58%',
    left: '50%',
    transform: 'translateX(-50%)',
    fontFamily: 'Line251127font, sans-serif',
    zIndex: 20,
    display: 'flex',
    gap: '1vh',
    color: '#694006FF',
    textShadow:
      '0 0 0.5vh rgba(255,255,255,1), -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white, 1px 1px 0 white',
    fontSize: '8vw',
    '@media (min-width: 1024px)': {
      fontSize: '5vw'
    },
    '@media (min-width: 1600px)': {
      fontSize: '4vw'
    }
  },
  dial: {
    position: 'relative',
    width: '90vmin',
    height: '90vmin',
    maxWidth: '600px',
    maxHeight: '600px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255,255,245,0.8)',
    border: '0.6vh solid #880000',
    boxShadow: '0 0 3vh rgba(0,0,0,0.7)',
    fontFamily: 'RevolutionaryClock251127font, sans-serif',
    zIndex: 10,
    '@media (max-width: 768px)': {
      width: '80vmin',
      height: '80vmin'
    },
    '@media (max-width: 480px)': {
      width: '90vmin',
      height: '90vmin'
    }
  },
  handBase: {
    position: 'absolute',
    left: '50%',
    bottom: '50%',
    transformOrigin: 'bottom center',
    borderRadius: '0.2vh',
    filter: 'drop-shadow(1px 0 0 rgba(0,0,0,0.9))'
  }
}

const handConfig = [
  // Hour hand configuration
  {
    img: hourHandImg,
    size: isMobile => (isMobile ? ['17vw', '30vw'] : ['4.5vw', '11vw']),
    maxSize: ['80px', '200px'],
    zIndex: 5,
    getDeg: (h, m) => (h / 10) * 360 + m / 10
  },
  // Minute hand configuration
  {
    img: minuteHandImg,
    size: isMobile => (isMobile ? ['20vw', '45vw'] : ['36vw', '60vw']),
    maxSize: ['100px', '250px'],
    zIndex: 7,
    getDeg: (h, m, s) => (m / 100) * 360 + s / 100
  },
  // Second hand configuration
  {
    img: secondHandImg,
    size: isMobile => (isMobile ? ['20vw', '43vw'] : ['26vw', '45vw']),
    maxSize: ['80px', '250px'],
    zIndex: 9,
    opacity: 0.7,
    getDeg: (h, m, s) => (s / 100) * 360
  }
]

const useMediaQuery = query => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

export default function Clock () {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [time, setTime] = useState(new Date())
  const requestRef = useRef()

  useEffect(() => {
    inject251127font('revolution-font-style', fontFaceRevolution)
    inject251127font('line-font-style', fontFaceLine)
  }, [])

  useEffect(() => {
    const animate = () => {
      setTime(new Date())
      requestRef.current = requestAnimationFrame(animate)
    }
    requestRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(requestRef.current)
  }, [])

  // Decimal time calculation: Convert standard time to French decimal time
  // French decimal time divides the day into 10 hours, each hour into 100 minutes, each minute into 100 seconds
  const totalStandardSeconds =
    time.getHours() * 3600 +
    time.getMinutes() * 60 +
    time.getSeconds() +
    time.getMilliseconds() / 1000 // Total seconds elapsed in standard time (86400 per day)
  const totalDecimalSeconds = (totalStandardSeconds / 86400) * 100000 // Convert to decimal seconds (100000 per day in decimal time)
  const decimalHours = Math.floor(totalDecimalSeconds / 10000) // Extract decimal hours (0-9)
  const decimalMinutes = Math.floor((totalDecimalSeconds % 10000) / 100) // Extract decimal minutes (0-99)
  const decimalSeconds = totalDecimalSeconds % 100 // Extract decimal seconds (0-99)

  const decimalHoursArray = Array.from({ length: 10 }, (_, i) => i + 1)

  return (
    <div style={styles.container}>
      {/* 1793 */}
      <div style={styles.topDigits}>
        {['1', '7', '9', '3'].map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>

      {/* Clock face */}
      <div style={styles.dial}>
        {/* Hour markers 1–10 */}
        {decimalHoursArray.map(hour => (
          <div
            key={hour}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              transform: `rotate(${(hour / 10) * 360}deg)`
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '0vh',
                left: '50%',
                transform: `translateX(-50%) rotate(-${(hour / 10) * 360}deg)`,
                fontSize: '6vmin',
                '@media (min-width: 768px)': {
                  fontSize: '4vmin'
                },
                '@media (min-width: 1200px)': {
                  fontSize: '3vmin'
                },
                color: '#000080'
              }}
            >
              {hour}
            </div>
          </div>
        ))}

        {/* Hands */}
        {handConfig.map(
          ({ img, size: getSize, zIndex, opacity = 1, getDeg, maxSize }, i) => {
            const size = getSize(isMobile)
            return (
              <div
                key={i}
                style={{
                  ...styles.handBase,
                  width: `min(${size[0]}, ${maxSize[0]})`,
                  height: `min(${size[1]}, ${maxSize[1]})`,
                  zIndex,
                  opacity,
                  backgroundImage: `url(${img})`,
                  backgroundSize: '100% 100%',
                  backgroundRepeat: 'no-repeat',
                  transform: `translateX(-50%) rotate(${getDeg(
                    decimalHours,
                    decimalMinutes,
                    decimalSeconds
                  )}deg)`
                }}
              />
            )
          }
        )}

        <div style={styles.centerDot} />
      </div>
    </div>
  )
}
