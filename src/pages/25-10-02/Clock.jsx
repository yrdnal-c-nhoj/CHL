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
  width: '10vw',
  fontSize: '16vw',
  fontFamily: "'KaiTi', 'STKaiti', serif",
  color: '#D1EEC9FF',
  background: 'rgba(178,34,34,0.5)',
  textShadow: '2px 2px 0 #000000, -2px -2px 0 #000000', // razor-thin black shadows
  boxShadow: '0 0 7vw #CB4F3FFF', // smaller, softer glow instead of 66vw
  margin: '-0.4vw',
};


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
          radial-gradient(circle at 30% 20%, rgba(155,15,0,0.5) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(178,34,34,0.8) 0%, transparent 50%),
          linear-gradient(135deg, #8B0000 0%, #9C320CFF 50%, #A31B1BFF 100%)
        `,
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'KaiTi', 'STKaiti', serif",
      }}
    >
      {/* Single background image, flipped horizontally */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%) scaleX(-1)', // Added scaleX(-1) for horizontal flip
          width: '100vw',
          height: '100dvh',
          backgroundImage: `url(${gridImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2,
          zIndex: 1,
        }}
      />

      {/* Clock display */}
      <div
        style={{
          display: 'flex',
          gap: '1vw',
          padding: '2vw',
          background: 'rgba(0,0,0,0.3)',
          zIndex: 10,
          boxShadow: '0 0 5rem  rgba(255,215,0,0.3) ',
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