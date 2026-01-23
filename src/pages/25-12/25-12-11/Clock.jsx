// GeologicTimeClock.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react'

export default function GeologicTimeClock() {
  const [now, setNow] = useState(() => new Date())
  const rafRef = useRef(null)
  const secondHandRef = useRef(null)
  const minuteHandRef = useRef(null)
  const hourHandRef = useRef(null)

  // Smooth real-time clock with CSS transitions
  useEffect(() => {
    const updateClock = () => {
      const now = new Date()
      setNow(now)
      
      const seconds = now.getSeconds()
      const minutes = now.getMinutes()
      const hours = now.getHours() % 12
      
      // Calculate rotation degrees
      const secondDegrees = (seconds / 60) * 360 + 90
      const minuteDegrees = ((minutes + seconds / 60) / 60) * 360 + 90
      const hourDegrees = ((hours + minutes / 60) / 12) * 360 + 90
      
      // Apply smooth transitions
      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${secondDegrees}deg)`
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${minuteDegrees}deg)`
      }
      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${hourDegrees}deg)`
      }
      
      rafRef.current = requestAnimationFrame(updateClock)
    }
    
    rafRef.current = requestAnimationFrame(updateClock)
    
    return () => {
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const time = useMemo(
    () => ({
      year: now.getFullYear(),
      month: now.toLocaleString('en', { month: 'long' }),
      day: String(now.getDate()).padStart(2, '0'),
      hour: String(now.getHours()).padStart(2, '0'),
      minute: String(now.getMinutes()).padStart(2, '0'),
      second: String(now.getSeconds()).padStart(2, '0'),
      ms: String(now.getMilliseconds()).padStart(3, '0')
    }),
    [now]
  )

  const timeline = [
    { label: 'Formation of Earth', value: '4.540 Billion Years' },
    { label: 'Phanerozoic Eon Begins', value: '541 Million Years' },
    { label: 'Cenozoic Era Begins', value: '66 Million Years' },
    { label: 'Quaternary Period', value: '2.58 Million Years' },
    { label: 'Holocene Epoch', value: '11,700 Years' },
    { label: 'Proposed Anthropocene', value: '~75 Years' },
    { label: 'Current Year', value: `${time.year} C.E.` },
    { label: 'Current Month', value: time.month },
    { label: 'Current Day', value: time.day },
    { label: 'Current Hour', value: time.hour },
    { label: 'Current Minute', value: time.minute },
    { label: 'Current Second', value: time.second },
    { label: 'Current Millisecond', value: time.ms }
  ]

  // Estimated height taken up by non-item elements (main padding, gap, safe areas)
  const staticHeightVh = 6
  const totalItems = timeline.length

  // Calculate the maximum available vh for each item's content area
  // This value ensures the total height fits within 100vh.
  const maxItemHeightVh = (100 - staticHeightVh) / totalItems

  // Calculate the maximum font size based on the available horizontal space (vw)
  // We allocate ~85vw of space for the Label (40%) and Value (60%) combined.
  const maxTextFontSizeVh = maxItemHeightVh * 0.4
  const maxTextFontSizeVw = 0.85 * 0.4 // Maximize horizontal shrinking based on available viewport width (85vw)

  return (
    <>
      {/* 1. Global styles to ensure NO SCROLLING and smooth rendering */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body, #root {
          margin: 0;
          padding: 0;
          height: 100dvh;
          width: 100vw;
          overflow: hidden;
          box-sizing: border-box;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
        }
        
        /* Smooth transitions for clock hands */
        .clock-hand {
          transition: transform 0.3s cubic-bezier(0.4, 2.1, 0.4, 2.1);
          transform-origin: 100%;
          position: absolute;
          background: #113A66;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        }
        
        /* Prevent text selection for better mobile experience */
        * {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -khtml-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `
        }}
      />

      <link
        href='https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Roboto+Mono:wght@400;700&display=swap'
        rel='stylesheet'
      />

      <main
        style={{
          height: '100dvh',
          width: '100vw',
          margin: 0,
          padding:
            'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
          background: 'linear-gradient(90deg, #F5C280 0%, #F0E983FF 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          overflow: 'hidden', // Prevents main content from scrolling
          fontFamily: 'system-ui, -apple-system, sans-serif'
          // gap: '0.5vh' // Tighter vertical gap for maximum vertical space
        }}
      >
        {timeline.map((item, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              maxWidth: '800px',
              display: 'flex',
              alignItems: 'center', // Changed to 'center' for better single-line alignment
              justifyContent: 'space-between',
              // Padding based on vertical budget
              padding: `clamp(0.2vh, ${maxItemHeightVh * 0.15}vh, 1vh) 0`,
              // Set a flex-basis to ensure all items share the remaining height equally
              flex: `1 1 ${maxItemHeightVh}vh`,
              minHeight: '0',
              borderBottom:
                i < timeline.length - 1
                  ? '1px solid rgba(17,58,102,0.2)'
                  : 'none',
              overflow: 'hidden',
              flexWrap: 'nowrap'
            }}
          >
            {/* Label */}
            <div
              style={{
                flex: '1 1 40%',
                textAlign: 'right',
                paddingRight: '1rem',
                fontFamily: '"Playfair Display", Georgia, serif',
                // CRITICAL: Font size clamps based on VW (horizontal space) and VH (vertical budget)
                // The minimum is still constrained by the overall VH budget for safety.
                fontSize: `clamp(0.6rem, ${Math.min(
                  maxTextFontSizeVw * 4,
                  maxTextFontSizeVh
                )}vh, 1.4rem)`,
                fontWeight: 500,
                color: '#113A66',
                // CRITICAL: Prevent Line Breaks and rely on font shrinking
                whiteSpace: 'nowrap',
                // CRITICAL: Allow text to be cut off if it still exceeds container
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                minWidth: '30%'
              }}
            >
              {item.label}
            </div>

            {/* Vertical divider bar */}
            <div
              style={{
                width: '0.4vmin',
                // Height based on the allocated item height
                height: `clamp(1.5em, ${maxItemHeightVh * 0.7}vh, 4rem)`,
                minHeight: '1.5em',
                background: 'linear-gradient(to bottom, #113A66, #3D1759)',
                borderRadius: '3px',
                flexShrink: 0
                // margin: '0 0.5rem'
              }}
            />

            {/* Value */}
            <div
              style={{
                flex: '1 1 60%',
                paddingLeft: '1rem',
                fontFamily: '"Roboto Mono", monospace',
                // CRITICAL: Font size clamps based on VW (horizontal space) and VH (vertical budget)
                fontSize: `clamp(0.6rem, ${Math.min(
                  maxTextFontSizeVw * 6,
                  maxTextFontSizeVh
                )}vh, 1.4rem)`,
                color: '#3D1759',
                textAlign: 'left',
                // CRITICAL: Prevent Line Breaks and rely on font shrinking
                whiteSpace: 'nowrap',
                // CRITICAL: Allow text to be cut off if it still exceeds container
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                minWidth: '50%'
              }}
            >
              {item.value}
            </div>
          </div>
        ))}
      </main>
    </>
  )
}
