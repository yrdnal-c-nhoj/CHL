// GeologicTimeClock.jsx
import React, { useEffect, useState, useMemo } from 'react'

// The component logic remains the same for data calculation
export default function GeologicTimeClock () {
  const [now, setNow] = useState(() => new Date())

  // Update every millisecond
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1)
    return () => clearInterval(id)
  }, [])

  // Helper functions for present-time hierarchy
  const currentYear = now.getFullYear()
  const currentMonthName = now.toLocaleString('en', { month: 'long' })
  const currentDay = now.getDate()
  const currentHour = now.getHours()
  const currentMinute = now.getMinutes()
  const currentSecond = now.getSeconds()
  const currentMillisecond = now.getMilliseconds()

  // Unified dataset
  const timeline = useMemo(
    () => [
      { label: 'Formation of Earth', display: '4.540 Billion' },
      { label: 'Start of Phanerozoic Eon', display: '541 Million' },
      { label: 'Start of Cenozoic Era', display: '66 Million' },
      { label: 'Start of Quaternary Period', display: '2.58 Million' },
      { label: 'Start of Holocene Epoch', display: '11.7 Thousand' },
      { label: 'Proposed Anthropocene', display: '~75' },
      // --- HUMAN SCALE ---
      {
        label: `Year`,
        display: `${currentYear} C.E.`
      },
      { label: `Month `, display: currentMonthName },
      { label: 'Day', display: String(currentDay).padStart(2, '0') },
      {
        label: 'Hour',
        display: `${String(currentHour).padStart(2, '0')}`
      },
      {
        label: 'Minute',
        display: `${String(currentMinute).padStart(2, '0')}`
      },
      {
        label: 'Second',
        display: `${String(currentSecond).padStart(2, '0')} `
      },
      {
        label: 'Millisecond',
        display: `${String(currentMillisecond).padStart(3, '0')} `
      }
    ],
    [now]
  )

  // Updated styles with center dividing line and responsive text
  const styles = {
    container: {
      height: '100vh',
      width: '100vw',
      padding: 0,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      background: 'linear-gradient(90deg, #F5C280FF 0%, #E6E78FFF 100%)',
      color: '#e0e7ff',
      display: 'flex',
      flexDirection: 'column'
    },

    timelineContainer: {
      position: 'relative',
      width: '100%',
      height: '100%'
    },

    list: {
      display: 'flex',
      flexDirection: 'column',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 2
    },

    item: {
      flex: 1,
      // Define columns to prevent content from pushing the center line
      gridTemplateColumns: '1fr 1px 1fr',
      display: 'grid',
      alignItems: 'center',
      overflow: 'hidden',
      borderBottom: '1px solid rgba(0,0,0,0.2)'
    },

    // --- RESPONSIVE FONT SIZE AND NO WRAP ---
    label: {
      color: '#113A66FF',
      // Preferred size is 2.5vw, clamped between 12px and 3vh for bounds
      fontSize: 'clamp(12px, 2.5vw, 3vh)',
      fontFamily: "'Playfair Display', serif",
      textAlign: 'right',
      padding: '0 1vh',
      whiteSpace: 'nowrap', // Crucial: Prevents wrapping
      overflow: 'hidden', // Hides content that exceeds container
      textOverflow: 'ellipsis' // Fallback for visibility
    },
    value: {
      color: '#3D1759FF',
      // Same clamp for proportional scaling
      fontSize: 'clamp(12px, 2.5vw, 3vh)',
      fontFamily: "'Roboto Mono', monospace",
      fontVariantNumeric: 'tabular-nums',
      textAlign: 'left',
      whiteSpace: 'nowrap', // Crucial: Prevents wrapping
      overflow: 'hidden', // Hides content that exceeds container
      textOverflow: 'ellipsis' // Fallback for visibility
      // padding: '0 1vh'
    },

    spacer: {
      // This is now just a 1px separator column
      width: '1px',
      backgroundColor: 'rgba(0,0,0,0.4)',
      height: '80%', // Visual
      margin: '0 auto'
    }
  }

  return (
    <main style={styles.container}>
      <div style={styles.timelineContainer}>
        <div style={styles.list}>
          {timeline.map((item, i) => (
            <div key={i} style={styles.item}>
              <div style={styles.label}>{item.label}</div>
              {/* Spacer is now a visual dividing line */}
              <div style={styles.spacer} />
              <div style={styles.value}>&nbsp;{item.display}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
