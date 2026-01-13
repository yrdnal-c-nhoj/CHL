import React, { useEffect, useState } from 'react'
import bgImage from '../../assets/clocks/26-01-10/moo.gif'
import d250916font from '../../assets/fonts/26-01-10-bit.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date())
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768)

  // 1. LETTER MAPPING: Change these letters to your preference
  const digitToLetter = {
    '0': ' ', '1': 'c', '2': 'a', '3': 'M', '4': 'x',
    '5': 'k', '6': 'm', '7': 'n', '8': 'o', '9': 't'
  };

  useEffect(() => {
    setTime(new Date())
    const timer = setInterval(() => setTime(new Date()), 100)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'MyD250916font';
        src: url(${d250916font}) format('opentype');
        font-display: block;
      }
    `
    document.head.appendChild(style)
    const fontPromise = document.fonts.load('22vh MyD250916font')
    const imagePromise = new Promise((resolve, reject) => {
      const img = new Image()
      img.src = bgImage
      img.onload = resolve
      img.onerror = reject
    })

    Promise.all([fontPromise, imagePromise])
      .then(() => setIsLoaded(true))
      .catch(() => setIsLoaded(true))

    return () => { document.head.removeChild(style) }
  }, [])

  useEffect(() => {
    const handleResize = () => setIsLargeScreen(window.innerWidth > 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const hours = String(((time.getHours() + 11) % 12) + 1).padStart(2, '0')
  const minutes = String(time.getMinutes()).padStart(2, '0')
  const seconds = String(time.getSeconds()).padStart(2, '0')

  // 2. STYLES: Using fixed widths to prevent "jumping"
  const digitBoxStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: "'MyD250916font', sans-serif",
    fontSize: '33vh',
    color: 'rgb(215, 242, 248)',
    // Fixed width ensures 'I' takes as much space as 'W'
    width: '25vh', 
    height: '25vh',
    textAlign: 'center',
  }

  const backgroundStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    // Flip horizontally and apply brightness, hue, and saturation filters
    transform: 'scaleX(-1)',
    filter: 'brightness(1.2) hue-rotate(30deg) saturate(2.5)',
    zIndex: 1,
  };

  const containerStyle = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // Make background transparent to see the filtered background
    overflow: 'hidden',
    position: 'relative',
    zIndex: 10,
  };

  const layoutStyle = {
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column',
    alignItems: 'center',
    gap: isLargeScreen ? '0vw' : '0vh'
  }

  const groupStyle = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  }

  // 3. RENDER HELPERS
  const renderUnit = (value) => (
    <div style={groupStyle}>
      {value.split('').map((digit, i) => (
        <div key={i} style={digitBoxStyle}>
          {digitToLetter[digit] || digit}
        </div>
      ))}
    </div>
  )

  
  
  return (
    <>
      {/* Background layer with filters and flip */}
      <div style={backgroundStyle} />
      
      {/* Clock content layer */}
      <div style={containerStyle}>
        <div style={layoutStyle}>
          {renderUnit(hours)}
          {renderUnit(minutes)}
          {renderUnit(seconds)}
        </div>
      </div>
    </>
  )
}

export default Clock
