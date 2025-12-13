import React, { useEffect, useState } from 'react'
import bgImageUrl from './eye.gif'
import dig2511088 from './eye3.ttf'
import ti251108 from './eye.ttf'

export default function Clock ({ imageWidth = '24vw', imageHeight = '16vw' }) {
  const [now, setNow] = useState(() => new Date())
  const [elapsedMs, setElapsedMs] = useState(0)

  useEffect(() => {
    const start = Date.now()
    const interval = setInterval(() => {
      setNow(new Date())
      setElapsedMs(Date.now() - start)
    }, 100) // 100ms for smooth updates with lower performance overhead
    return () => clearInterval(interval)
  }, [])

  const pad2 = n => n.toString().padStart(2, '0')

  // Convert to 12-hour format and get AM/PM
  let hours = now.getHours()
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12 // Convert 0 to 12 for 12 AM
  const clock = `${hours}:${pad2(now.getMinutes())} ${ampm}`

  const digitsFontFamilyName = 'DigitsFont-2025-11-10'
  const ti251108FamilyName = 'Ti251108-2025-11-10'

  const clockStyle = {
    position: 'absolute',
    top: '1vh',
    right: '2vw',
    color: '#F7F0F0',
    fontSize: 'min(4vw, 2.5vh)',
    fontFamily: `'${digitsFontFamilyName}', monospace`,
    fontWeight: 'normal',
    whiteSpace: 'nowrap',
    zIndex: 1,
    padding: '0.5vh 1vw',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '5px',
    opacity: 0.9,
    textAlign: 'center',
    transition: 'all 0.3s ease'
  }

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden'
  }

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
    overflow: 'hidden',
    opacity: 1.0
  }

  const bgGridStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    gridTemplateColumns: `repeat(30, ${imageWidth})`,
    gridAutoRows: `${imageHeight}`,
    marginLeft: `calc(-1 * ${imageWidth} / 2)`,
    marginTop: `calc(-1 * ${imageHeight} / 2)`
  }

  const tileStyleBase = {
    width: `${imageWidth}`,
    height: `${imageHeight}`,
    backgroundImage: `url(${bgImageUrl})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    willChange: 'transform'
  }

  const renderCheckerboardBG = () => {
    const tiles = []
    const rows = 30
    const cols = 30
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const flip = (r + c) % 2 === 1
        tiles.push(
          <div
            key={`${r}-${c}`}
            style={{
              ...tileStyleBase,
              transform: flip ? 'scaleX(-1)' : 'none'
            }}
          />
        )
      }
    }
    return <div style={bgGridStyle}>{tiles}</div>
  }

  const timerDigitBoxStyle = {
    fontFamily: `'${timerFontFamilyName}', monospace`,
    fontSize: '14vh',
    lineHeight: '1',
    width: 'auto',
    minWidth: '8vh',
    padding: '0 0.1vh',
    color: '#ff0000',
    textShadow: '0 0 1vh rgba(255, 0, 0, 0.7)',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: '1vh',
    boxShadow: '0 0 1.5vh rgba(0, 0, 0, 0.5)',
    margin: '0 0.6vh',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s ease-out'
  }

  const timerDotBoxStyle = {
    ...timerDigitBoxStyle,
    width: '0.08vh',
    minWidth: '0.08vh',
    padding: 0,
    backgroundColor: 'transparent',
    boxShadow: 'none'
  }

  const renderTimerBoxed = ms => {
    const totalSeconds = Math.floor(ms / 1000)
    const s = Math.floor(totalSeconds % 60)
    const hundredths = Math.floor((ms % 1000) / 10)

    // Format as seconds.hundredths
    const timeStr = `${s}.${pad2(hundredths)}`

    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 'auto',
          maxWidth: '95vw',
          padding: '0.1vh 0.1vw',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          borderRadius: '15px',
          border: '2px solid rgba(255, 0, 0, 0.7)',
          boxShadow: '0 0 20px rgba(255, 0, 0, 0.7)'
        }}
        className='timer-container'
      >
        {timeStr.split('').map((ch, i) => (
          <span
            key={i}
            style={{
              ...(ch === '.' ? timerDotBoxStyle : timerDigitBoxStyle),
              opacity: 1
            }}
          >
            {ch}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div style={wrapperStyle}>
      <style>
        {`
          @font-face {
            font-family: '${digitsFontFamilyName}';
            src: url(${dig2511088}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: '${timerFontFamilyName}';
            src: url(${timerFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          .clock:hover {
            opacity: 1;
            background-color: rgba(0, 0, 0, 0.3);
          }
          @media (max-width: 600px) {
            .timer-container {
              padding: 2vh 3vw;
              border-radius: 22px;
            }
          }
        `}
      </style>
      <div style={bgStyle}>{renderCheckerboardBG()}</div>
      <div style={clockStyle} className='clock'>
        {clock}
      </div>
      {renderTimerBoxed(elapsedMs)}
    </div>
  )
}
