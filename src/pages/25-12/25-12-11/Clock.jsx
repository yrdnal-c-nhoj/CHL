// GeologicTimeClock.jsx
import React, { useEffect, useState, useMemo } from 'react'

// Static configuration moves outside the component lifecycle
const GEOLOGIC_EVENTS = [
  { label: 'Formation of Earth', value: '4.540 Billion Years' },
  { label: 'Phanerozoic Eon Begins', value: '541 Million Years' },
  { label: 'Cenozoic Era Begins', value: '66 Million Years' },
  { label: 'Quaternary Period', value: '2.58 Million Years' },
  { label: 'Holocene Epoch', value: '11,700 Years' },
  { label: 'Proposed Anthropocene', value: '~75 Years' },
]

export default function GeologicTimeClock() {
  const [now, setNow] = useState(new Date())

  // Efficient time loop
  useEffect(() => {
    let frameId
    const updateClock = () => {
      setNow(new Date())
      frameId = requestAnimationFrame(updateClock)
    }
    updateClock()
    return () => cancelAnimationFrame(frameId)
  }, [])

  // Memoize the time formatting to separate data prep from rendering
  const timeData = useMemo(() => {
    // Using padding is faster and sufficient for clock digits vs Intl
    const pad = (n, w = 2) => String(n).padStart(w, '0')
    
    return [
      { label: 'Current Year', value: `${now.getFullYear()} C.E.` },
      { label: 'Current Month', value: now.toLocaleString('en', { month: 'long' }) },
      { label: 'Current Day', value: pad(now.getDate()) },
      { label: 'Current Hour', value: pad(now.getHours()) },
      { label: 'Current Minute', value: pad(now.getMinutes()) },
      { label: 'Current Second', value: pad(now.getSeconds()) },
      { label: 'Current Millisecond', value: pad(now.getMilliseconds(), 3) }
    ]
  }, [now])

  // Merge static and dynamic events
  const timeline = useMemo(() => [...GEOLOGIC_EVENTS, ...timeData], [timeData])

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw',
        position: 'relative',
        background: 'linear-gradient(90deg, #F5C280 0%, #F0E983FF 100%)',
        overflow: 'hidden',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        userSelect: 'none',
        WebkitUserSelect: 'none',
      }}
    >
      {/* Semantic list container using flexbox for even distribution */}
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding:
            'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
          boxSizing: 'border-box',
        }}
      >
        {timeline.map((item, i) => (
          <TimelineRow 
            key={item.label}
            label={item.label}
            value={item.value}
            isLast={i === timeline.length - 1}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * TimelineRow Component
 * Extracted to isolate presentation logic and prevent layout trashing
 */
const TimelineRow = React.memo(({ label, value, isLast }) => {
  return (
    <div
      style={{
        // Flex: 1 automatically handles the vertical distribution 
        // without complex JS viewport math
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '0.2vh 0',
        minHeight: 0, // Critical for nested flex scrolling behavior
        borderBottom: isLast ? 'none' : '1px solid rgba(17,58,102,0.2)',
      }}
    >
            {/* Label */}
            <div
            style={{
                flex: '0 0 40%',
                textAlign: 'right',
                paddingRight: '1rem',
                fontFamily: '"Playfair Display", Georgia, serif',
                // Using container queries (cqw/cqh) would be ideal future-proof,
                // but vmin is a robust fallback for fullscreen apps.
                fontSize: 'clamp(0.8rem, 2.5vmin, 2rem)',
                fontWeight: 500,
                color: '#113A66',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
              overflow: 'hidden',
              }}
            >
              {label}
            </div>

            {/* Vertical divider bar */}
            <div
              style={{
                width: '0.4vmin',
                height: '60%',
                minHeight: '1rem',
                background: 'linear-gradient(to bottom, #113A66, #3D1759)',
                borderRadius: '3px',
                flexShrink: 0,
                opacity: 0.8
              }}
            />

            {/* Value */}
            <div
              style={{
                flex: '0 0 60%',
                paddingLeft: '1rem',
                fontFamily: '"Roboto Mono", monospace',
                fontSize: 'clamp(0.8rem, 2.5vmin, 2rem)',
                color: '#3D1759',
                textAlign: 'left',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              {value}
            </div>
    </div>
  )
})
