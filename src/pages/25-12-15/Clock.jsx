import React, { useEffect, useState } from 'react'
import bgImage from './forest.jpeg'
import clockFont_251215 from './ice.ttf'

export default function VerticalDigitalClock () {
  const [now, setNow] = useState(new Date())
  const [fontLoaded, setFontLoaded] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    const font = new FontFace('ClockFont251215', `url(${clockFont_251215})`)
    font.load().then(() => {
      document.fonts.add(font)
      setFontLoaded(true)
    }).catch(err => {
      console.error('Font loading failed:', err)
      setFontLoaded(true) // Show clock anyway
    })
  }, [])

  const pad = num => String(num).padStart(2, '0')
  const hours = pad(now.getHours())
  const minutes = pad(now.getMinutes())
  const seconds = pad(now.getSeconds())
  const allDigits = [...hours, ...minutes, ...seconds]

  return (
    <div style={styles.root}>
      <style>{`
        @font-face {
          font-family: 'ClockFont251215';
          src: url(${clockFont_251215});
        }
      `}</style>
      <div style={styles.clockContainer}>
        {allDigits.map((digit, i) => (
          <div key={i} style={{
            ...styles.digitBox,
            opacity: fontLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in'
          }}>
            {digit}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  root: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)'
  },
  clockContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5vh',
    maxHeight: '100%',
    padding: '20px',
    boxSizing: 'border-box'
  },
  digitBox: {
    fontFamily: 'ClockFont251215, serif',
    fontSize: 'min(15vh, 26vw)',
    fontVariantNumeric: 'tabular-nums',
    fontFeatureSettings: '"tnum"',
    color: '#C2D2F5FF',
    textShadow: '0px 3px 0px #095477FF, 0px -3px 0px #F8F9FAFF, -1px -1px 3px #050009FF',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    lineHeight: 1,
    flexShrink: 0
  }
}