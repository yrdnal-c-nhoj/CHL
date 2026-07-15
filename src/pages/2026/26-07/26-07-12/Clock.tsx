import { useClockTime } from '@/utils/clockUtils';
import React from 'react';

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100dvh',
    // Rich, twilight gradient of the Argentine Pampas meeting a dusty library
    background: 'radial-gradient(circle at center, #2d1a18 0%, #110912 100%)',
    color: '#f4ede2', // Aged parchment white
    fontFamily: '"Cinzel", "Playfair Display", "Georgia", serif',
    padding: '8vmin',
    boxSizing: 'border-box',
    textAlign: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'radial-gradient(circle, transparent 40%, rgba(0, 0, 0, 0.7) 100%)',
    pointerEvents: 'none',
    zIndex: 1,
  },
  quoteContainer: {
    maxWidth: '800px',
    zIndex: 2,
    transform: 'translateY(-5vh)', // Centers the quote beautifully as the dreamlike focal point
  },
  title: {
    fontSize: 'clamp(1.1rem, 2.5vmin, 2.2rem)',
    fontWeight: '300',
    fontStyle: 'italic',
    lineHeight: '1.6',
    color: '#e2b36e', // Dusty gold leaf
    textShadow: '0 2px 10px rgba(226, 179, 110, 0.15)',
    maxWidth: '90%',
    margin: '0 auto',
    letterSpacing: '0.05em',
  },
  // Positioned strictly in the lower-right corner
  clockPositioner: {
    position: 'absolute',
    bottom: '5vmin',
    right: '5vmin',
    zIndex: 2,
    transform: 'rotate(-1.5deg)', // Subtle surreal tilt
  },
  digitalClock: {
    fontSize: 'clamp(2.5rem, 8vmin, 5rem)',
    letterSpacing: '0.05em',
    color: '#e86a43', // Terracotta fire
    textShadow: `
      0 0 8px rgba(232, 106, 67, 0.4), 
      0 0 20px rgba(226, 179, 110, 0.3),
      -4px 4px 0px rgba(17, 9, 18, 0.8)
    `,
    whiteSpace: 'nowrap',
  }
};

export default function CurrentTimeClock() {
  const time = useClockTime();
  
  // 24-hour format with hours and minutes stripped of leading zeros
  const hours = time.getHours().toString();
  const minutes = time.getMinutes().toString();
  const timeString = `*${hours}:${minutes}`;

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />
      
      {/* Centered quote */}
      <div style={styles.quoteContainer}>
        <h6 style={styles.title}>
          "Time is the substance I am made of. Time is a river which sweeps me along, but I am the river; 
          it is a tiger which destroys me, but I am the tiger; it is a fire which consumes me, but I am the fire."
          <span style={{ display: 'block', marginTop: '1.5rem', fontSize: '0.8em', fontStyle: 'normal', opacity: 0.8 }}>
            — Jorge Luis Borges, <i>A New Refutation of Time</i>
          </span>
        </h6>
      </div>
      
      {/* Single clock anchored to the bottom-right corner */}
      <div style={styles.clockPositioner}>
        <time dateTime={time.toISOString()} style={styles.digitalClock}>
          {timeString}
        </time>
      </div>
    </div>
  );
}