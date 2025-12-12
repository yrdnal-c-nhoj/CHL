// GeologicTimeClock.jsx
import React, { useEffect, useState, useRef, useMemo } from 'react'

export default function GeologicTimeClock () {
  const [now, setNow] = useState(() => new Date())
  const rafRef = useRef(null)

  // Smooth real-time clock (timing logic is fine)
  useEffect(() => {
    const tick = () => {
      setNow(new Date())
      rafRef.current = requestAnimationFrame(tick)
    }
    const timeoutId = setTimeout(() => {
      rafRef.current = requestAnimationFrame(tick)
    }, 0)

    return () => {
      clearTimeout(timeoutId)
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
    { label: 'Formation of Earth', value: '4.540 Billion Years Ago' },
    { label: 'Phanerozoic Eon Begins', value: '541 Million Years Ago' },
    { label: 'Cenozoic Era Begins', value: '66 Million Years Ago' },
    { label: 'Quaternary Period', value: '2.58 Million Years Ago' },
    { label: 'Holocene Epoch', value: '11,700 Years Ago' },
    { label: 'Proposed Anthropocene', value: '~75 Years Ago' },
    { label: 'Current Year', value: `${time.year} C.E.` },
    { label: 'Current Month', value: time.month },
    { label: 'Current Day', value: time.day },
    { label: 'Current Hour', value: time.hour },
    { label: 'Current Minute', value: time.minute },
    { label: 'Current Second', value: time.second },
    { label: 'Current Millisecond', value: time.ms }
  ]

  // Calculate the total number of items to determine height scaling
  const totalItems = timeline.length
  // Estimated height taken up by non-item elements (header, main padding, gap)
  // We use vh units to ensure these scale proportionally with the viewport height.
  const staticHeightVh = 15 // Estimate 15vh for Header + top/bottom padding + overall gap

  // Calculate the maximum available vh for each item's content area
  // This value will be used to clamp the font-size/padding/height of each item.
  const maxItemHeightVh = (100 - staticHeightVh) / totalItems

  return (
    <>
      {/* 1. Global styles to ensure NO SCROLLING on the document root */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        html, body, #root { 
          margin: 0; 
          padding: 0; 
          height: 100vh;
          width: 100vw;
          /* CRITICAL: Disallow scrolling */
          overflow: hidden; 
          box-sizing: border-box;
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
          // CRITICAL: Ensure main fills the viewport and prevents internal scroll
          height: '100vh',
          width: '100vw',
          margin: 0,
          // REFACTOR: Use vh for top/bottom padding to contribute to the height budget
          padding: '4vh 1rem',
          background: 'linear-gradient(90deg, #F5C280 0%, #F0E983FF 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          boxSizing: 'border-box',
          // CRITICAL: Prevents main content from scrolling
          overflow: 'hidden',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          // REFACTOR: Use vh for vertical gap to budget for height
          gap: '1vh'
        }}
      >
        {timeline.map((item, i) => (
          <div
            key={i}
            style={{
              width: '100%',
              maxWidth: '800px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              // REFACTOR: Use vh for vertical padding to budget for height
              padding: `clamp(0.25vh, ${maxItemHeightVh * 0.1}vh, 1vh) 0`,
              // Set a flex-basis to ensure all items share the remaining height equally
              flex: `1 1 ${maxItemHeightVh}vh`,
              minHeight: '0', // Allows the item to shrink
              borderBottom:
                i < timeline.length - 1
                  ? '1px solid rgba(17,58,102,0.2)'
                  : 'none',
              overflow: 'hidden', // Hide any potential overflow *within* the row
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
                // CRITICAL: Font size must shrink based on viewport height (vh)
                // We use vh units to ensure the text shrinks/grows perfectly with the screen
                fontSize: `clamp(0.6rem, ${maxItemHeightVh * 0.4}vh, 1.4rem)`,
                fontWeight: 500,
                color: '#113A66',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                minWidth: '30%'
              }}
            >
              {item.label}
            </div>

            {/* Vertical divider bar */}
            <div
              style={{
                width: '0.4vmin',
                // CRITICAL: Height based on the allocated item height
                height: `clamp(1.5em, ${maxItemHeightVh * 0.7}vh, 4rem)`,
                minHeight: '1.5em',
                background: 'linear-gradient(to bottom, #113A66, #3D1759)',
                borderRadius: '3px',
                flexShrink: 0,
                margin: '0 0.5rem'
              }}
            />

            {/* Value */}
            <div
              style={{
                flex: '1 1 60%',
                paddingLeft: '1rem',
                fontFamily: '"Roboto Mono", monospace',
                // CRITICAL: Font size must shrink based on viewport height (vh)
                fontSize: `clamp(0.6rem, ${maxItemHeightVh * 0.4}vh, 1.4rem)`,
                color: '#3D1759',
                textAlign: 'left',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
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
