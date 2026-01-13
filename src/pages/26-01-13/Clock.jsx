import { useState, useEffect } from 'react';

export default function TicTacToeClock() {
  const [time, setTime] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTime(new Date());
    }, 10); // Updated to 10ms for smoother millisecond updates

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ms = date.getMilliseconds();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12 || 12;
    
    return {
      h1: Math.floor(hours / 10),
      h2: hours % 10,
      m1: Math.floor(minutes / 10),
      m2: minutes % 10,
      s1: Math.floor(seconds / 10),
      s2: seconds % 10,
      ms1: Math.floor((ms % 100) / 10), // This gets the "tens" place of milliseconds
      ampm: ampm
    };
  };

  const t = formatTime(time);

  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    margin: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    opacity: mounted ? 1 : 0,
    transition: 'opacity 0.3s ease-in-out',
    fontFamily: 'sans-serif'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    gap: '15px',
    width: 'min(85vw, 85vh)',
    height: 'min(85vw, 85vh)',
    maxWidth: '500px',
    maxHeight: '500px',
  };

  const cellStyle = {
    display: 'flex',
    justifyContent: 'center',
    borderRadius: '12px',
    fontSize: 'clamp(32px, 10vmin, 64px)',
    color: '#00ff88',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    fontVariantNumeric: 'tabular-nums'
  };

  return (
    <div style={containerStyle}>
      <div style={gridStyle}>
        {/* Row 1: Hours & Tens of Minutes */}
        <div style={cellStyle}>{t.h1}</div>
        <div style={cellStyle}>{t.h2}</div>
        <div style={cellStyle}>{t.m1}</div>

        {/* Row 2: Ones of Minutes & Seconds */}
        <div style={cellStyle}>{t.m2}</div>
        <div style={cellStyle}>{t.s1}</div>
        <div style={cellStyle}>{t.s2}</div>

        {/* Row 3: Bottom Left (MS) | Bottom Center (A/P) | Bottom Right (M) */}
        <div style={cellStyle}>{t.ms1}</div>
        <div style={cellStyle}>{t.ampm.charAt(0)}</div>
        <div style={cellStyle}>{t.ampm.charAt(1)}</div>
      </div>
    </div>
  );
}