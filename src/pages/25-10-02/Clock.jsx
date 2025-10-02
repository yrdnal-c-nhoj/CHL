import { useState, useEffect } from 'react';
import gridImage from './lan.gif'; // Replace with your image file in the same folder

// Map standard digits to counting rod Unicode characters
const digitMap = {
  '0': '□', // Placeholder for zero
  '1': '\u{1D360}',
  '2': '\u{1D361}',
  '3': '\u{1D362}',
  '4': '\u{1D363}',
  '5': '\u{1D364}',
  '6': '\u{1D365}',
  '7': '\u{1D366}',
  '8': '\u{1D367}',
  '9': '\u{1D369}',
};

// Convert a number to its counting rod representation (array of symbols)
const toCountingRod = (number) =>
  String(number)
    .padStart(2, '0')
    .split('')
    .map((digit) => digitMap[digit]);

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = toCountingRod(time.getHours());
  const minutes = toCountingRod(time.getMinutes());
  const seconds = toCountingRod(time.getSeconds());

  // Inline styles for digit boxes
  const digitBoxStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '8vw',
    // height: '4.5vw',
    fontSize: '12vw',
    fontFamily: "'KaiTi', 'STKaiti', serif",
    color: '#807746FF',
    background: 'rgba(178,34,34,0.8)',
    borderRadius: '1rem',
    boxShadow: '0 0 1rem #FFD700',
    margin: '-0.2rem',
  };

  // Generate grid cells (20x20 grid to extend beyond viewport)
  const gridCells = [];
  const columns = 12; // Enough to cover ~100vw (12.5rem * 20 = 250rem)
  const rows = 16;    // Enough to cover ~100dvh (6.25rem * 20 = 125rem)
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const isFlipped = (row + col) % 2 === 1; // Checkerboard pattern: flip if row + col is odd
      gridCells.push(
        <div
          key={`grid-${row}-${col}`}
          style={{
            width: '74vw',
            height: '26vh',
            backgroundImage: `url(${gridImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            transform: isFlipped ? 'scaleX(-1)' : 'none', // Flip horizontally for checkerboard effect
          }}
        />
      );
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100dvh',
        width: '100vw',
        background: `
          radial-gradient(circle at 30% 20%, rgba(255,215,0,0.3) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(178,34,34,0.6) 0%, transparent 50%),
          linear-gradient(135deg, #8B0000 0%, #2F1B14 50%, #000000 100%)
        `,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'KaiTi', 'STKaiti', serif",
      }}
    >
      {/* Background grid */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'grid',
          opacity: 0.3,
          gridTemplateColumns: `repeat(${columns}, 16rem)`,
          gridTemplateRows: `repeat(${rows}, 6.25rem)`,
          zIndex: 1,
        }}
      >
        {gridCells}
      </div>

      {/* Clock display */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '2rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: '3rem',
          zIndex: 10,
          boxShadow: '0 0 2rem #FFD700',
        }}
      >
        {hours.map((d, i) => (
          <span key={`h${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        {minutes.map((d, i) => (
          <span key={`m${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        {seconds.map((d, i) => (
          <span key={`s${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DigitalClock;