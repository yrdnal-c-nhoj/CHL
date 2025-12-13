import React, { useState, useEffect } from 'react'
import sloanFont_2025_1204 from './ichart.otf'

const fontFamilyName = 'SloanOptotype_2025_1204'

// Define the font face
const fontFace = new FontFace(
  fontFamilyName,
  `url(${sloanFont_2025_1204})`
)

export default function EyeChart () {
  const [fontLoaded, setFontLoaded] = useState(false)
  
  useEffect(() => {
    // Load the font
    fontFace.load().then(() => {
      document.fonts.add(fontFace)
      setFontLoaded(true)
    }).catch(error => {
      console.error('Failed to load font:', error)
      setFontLoaded(true) // Continue rendering even if font fails to load
    })
  }, [])

  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const hours = ('0' + (time.getHours() % 12 || 12)).slice(-2)
  const minutes = ('0' + time.getMinutes()).slice(-2)
  const ampm = time.getHours() >= 12 ? 'PM' : 'AM'
  const seconds = ('0' + time.getSeconds()).slice(-2)

  // Removed unused colors
  const lines = [
    ['O', '20/200', '6/60'],
    [ampm, '20/100', '6/30'],
    ['CHL', '20/70', '6/21'],
    [`${hours}HR`, '20/50', '6/15'],
    ['KOVRS', '20/40', '6/12'],
    [`${minutes}MINS`, '20/30', '6/9'],
    ['HOSRDN', '20/25', '6/7.5'],
    [`${seconds}SCNDS`, '20/20', '6/6']
  ]

  const fontSizeForIndex = i => {
    // Use viewport units but cap the size for better mobile display
    const sizes = [15, 12, 10, 8, 6.5, 5.5, 4.5, 3.5]
    const viewportHeight = window.innerHeight
    const viewportWidth = window.innerWidth
    const minDimension = Math.min(viewportHeight, viewportWidth)
    // Scale down the font size for very small screens
    const scale = Math.min(1, minDimension / 500)
    return `calc(${sizes[i] * scale} * 1vmin)`
  }

  const outer = {
    minHeight: '100dvh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    background: '#FDF5DDFF',
    fontFamily:
      fontFamilyName +
      ", system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'",
    WebkitFontSmoothing: 'antialiased',
    WebkitTextSizeAdjust: '100%',
    textSizeAdjust: '100%',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }

  const card = {
    width: '100%',
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.5rem',
    padding: '1rem 0',
    overflow: 'hidden',
    boxSizing: 'border-box'
  }

  const lineBase = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    position: 'relative',
    margin: '0.5rem 0',
    flexShrink: 1,
    minHeight: 0,
    overflow: 'hidden'
  }

  const letterStyle = {
    fontFamily: fontFamilyName,
    textTransform: 'uppercase',
    lineHeight: 1,
    letterSpacing: '0.1vh',
    margin: 0,
    padding: 0
  }

  const leftLabel = {
    position: 'absolute',
    left: '0.5rem',
    fontSize: '0.9rem',
    opacity: 0.55,
    letterSpacing: '0.05rem',
    whiteSpace: 'nowrap',
    transform: 'translateX(-100%)',
    paddingRight: '0.5rem'
  }

  const rightLabel = {
    position: 'absolute',
    right: '0.5rem',
    fontSize: '0.9rem',
    opacity: 0.55,
    letterSpacing: '0.05rem',
    whiteSpace: 'nowrap',
    transform: 'translateX(100%)',
    paddingLeft: '0.5rem'
  }

  // Show loading state until font is loaded
  if (!fontLoaded) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#FDF5DDFF',
        fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue'"
      }}>
        <div style={{ fontSize: '1.5rem' }}>Loading...</div>
      </div>
    )
  }

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .eyechart-root * { box-sizing: border-box; }
          `
        }}
      />

      <div style={outer} className='eyechart-root'>
        <div style={card} role='img' aria-label='Snellen Sloan eye chart'>
          {lines.map(([letters, twenty, six], i) => (
            <div key={i} style={{ ...lineBase, fontSize: fontSizeForIndex(i) }}>
              <div style={leftLabel}>{twenty}</div>
              <p style={{ ...letterStyle, fontSize: 'inherit' }}>{letters}</p>
              <div style={rightLabel}>{six}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
