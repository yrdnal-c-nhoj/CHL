import React, { useEffect, useState } from 'react'
import bgImage from '../../assets/clocks/25-12-31/shadow.jpg'
import d250916font from '../../assets/fonts/25-12-31-shadow.otf';

const Clock = () => {
  const [time, setTime] = useState(new Date())
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 768)

  // 1. LETTER MAPPING: Change these letters to your preference
  const digitToLetter = {
    '0': 'Y', '1': 'I', '2': 'K', '3': 'F', '4': 'E',
    '5': 'F', '6': 'H', '7': 'E', '8': 'D', '9': 'C'
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
    fontSize: '22vh',
    color: 'rgba(0, 0, 0, 0.4)',
    // Fixed width ensures 'I' takes as much space as 'W'
    width: '20vh', 
    height: '20vh',
    textAlign: 'center',
    textShadow: `
      2px 2px 8px rgba(0, 0, 0, 0.1),
      4px 4px 16px rgba(0, 0, 0, 0.1),
      8px 8px 32px rgba(0, 0, 0, 0.1),
      16px 16px 64px rgba(0, 0, 0, 0.1)
    `,
    // filter: 'blur(0.5px)',
    // opacity: 0.8
  }

  const containerStyle = {
    height: '100dvh',
    width: '100vw',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    backgroundImage: `url(${bgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    overflow: 'hidden',
    filter: 'contrast(0.8) brightness(1.5)'
  }

  const layoutStyle = {
    display: 'flex',
    flexDirection: isLargeScreen ? 'row' : 'column',
    alignItems: 'center',
    gap: isLargeScreen ? '2vw' : '1vh'
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
    <div style={containerStyle}>
      <div style={layoutStyle}>
        {renderUnit(hours)}
        {renderUnit(minutes)}
        {renderUnit(seconds)}
      </div>
    </div>
  )
}

export default Clock