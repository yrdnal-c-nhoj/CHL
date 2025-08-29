import { useState, useEffect } from 'react';
import backgroundImage from './tsi.gif'; // your local background

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

  // Digit box style with dual shadows
  const digitBoxStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '2rem',
    fontSize: '5rem',
    padding: '0 0.2rem',
    textShadow: `
      -0.15rem 0 0.15rem rgba(255, 255, 255, 0.8),  /* left light shadow */
      0.15rem 0 0.15rem rgba(0, 0, 0, 1)            /* right black shadow */
    `,
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'sans-serif',
        color: '#F50823FF',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          padding: '1rem',
        }}
      >
        {hours.map((d, i) => (
          <span key={`h${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        <span style={{ alignSelf: 'center', fontSize: '5rem', textShadow: digitBoxStyle.textShadow }}>
          :
        </span>
        {minutes.map((d, i) => (
          <span key={`m${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        <span style={{ alignSelf: 'center', fontSize: '5rem', textShadow: digitBoxStyle.textShadow }}>
          .
        </span>
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
