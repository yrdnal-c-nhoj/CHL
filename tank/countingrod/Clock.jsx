import { useState, useEffect } from 'react';

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

  // Enhanced Chinese-style digit box
  const digitBoxStyle = {
    display: 'inline-flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '3rem',
    height: '4rem',
    fontSize: '4rem',
    padding: '0.5rem',
    margin: '0.2rem',
    background: 'linear-gradient(145deg, rgba(139, 69, 19, 0.9), rgba(101, 47, 8, 0.9))',
    border: '3px solid #DAA520',
    borderRadius: '12px',
    boxShadow: `
      inset 2px 2px 4px rgba(218, 165, 32, 0.3),
      inset -2px -2px 4px rgba(0, 0, 0, 0.5),
      4px 4px 12px rgba(0, 0, 0, 0.7)
    `,
    textShadow: `
      0 0 10px #FFD700,
      2px 2px 4px rgba(0, 0, 0, 0.8),
      -1px -1px 2px rgba(255, 215, 0, 0.6)
    `,
    position: 'relative',
  };

  // Separator style
  const separatorStyle = {
    alignSelf: 'center',
    fontSize: '4rem',
    color: '#FFD700',
    textShadow: `
      0 0 15px #FFD700,
      2px 2px 4px rgba(0, 0, 0, 0.8)
    `,
    margin: '0 0.5rem',
    fontWeight: 'bold',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        background: `
          radial-gradient(circle at 30% 20%, rgba(139, 0, 0, 0.8) 0%, transparent 50%),
          radial-gradient(circle at 70% 80%, rgba(255, 215, 0, 0.3) 0%, transparent 50%),
          linear-gradient(135deg, #8B0000 0%, #2F1B14 50%, #000000 100%)
        `,
        fontFamily: "'Noto Sans CJK SC', 'Microsoft YaHei', sans-serif",
        color: '#FFD700',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative Chinese elements */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '2rem',
          color: '#DAA520',
          textShadow: '0 0 10px #FFD700',
          letterSpacing: '0.5rem',
          opacity: 0.8,
        }}
      >
        時間 • 时间 • TIME
      </div>

      {/* Decorative corner elements */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '3rem',
          color: '#DAA520',
          opacity: 0.6,
          transform: 'rotate(-15deg)',
        }}
      >
        龍
      </div>
      <div
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          fontSize: '3rem',
          color: '#DAA520',
          opacity: 0.6,
          transform: 'rotate(15deg)',
        }}
      >
        鳳
      </div>

      {/* Main clock display */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          padding: '2rem',
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '20px',
          border: '2px solid #DAA520',
          boxShadow: '0 0 30px rgba(218, 165, 32, 0.5)',
          backdropFilter: 'blur(5px)',
        }}
      >
        {hours.map((d, i) => (
          <span key={`h${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        <span style={separatorStyle}>時</span>
        {minutes.map((d, i) => (
          <span key={`m${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        <span style={separatorStyle}>分</span>
        {seconds.map((d, i) => (
          <span key={`s${i}`} style={digitBoxStyle}>
            {d}
          </span>
        ))}
        <span style={separatorStyle}>秒</span>
      </div>

      {/* Bottom decorative text */}
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '1.2rem',
          color: '#DAA520',
          textShadow: '0 0 8px #FFD700',
          opacity: 0.7,
          textAlign: 'center',
        }}
      >
        算籌計時器<br />
        <span style={{ fontSize: '0.9rem', opacity: 0.8 }}>Counting Rod Timer</span>
      </div>

      {/* Animated particles */}
      <div
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          background: `
            radial-gradient(2px 2px at 20px 30px, #FFD700, transparent),
            radial-gradient(2px 2px at 40px 70px, #DAA520, transparent),
            radial-gradient(1px 1px at 90px 40px, #FFD700, transparent),
            radial-gradient(1px 1px at 130px 80px, #DAA520, transparent),
            radial-gradient(2px 2px at 160px 30px, #FFD700, transparent)
          `,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 100px',
          animation: 'sparkle 20s linear infinite',
          opacity: 0.3,
          pointerEvents: 'none',
        }}
      />

      <style jsx>{`
        @keyframes sparkle {
          from { transform: translateY(0px); }
          to { transform: translateY(-100px); }
        }
        
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;700&display=swap');
      `}</style>
    </div>
  );
};

export default DigitalClock;