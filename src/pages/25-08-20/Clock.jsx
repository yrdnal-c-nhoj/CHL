import { useState, useEffect } from 'react';
import fontUrl from './sq.ttf'; // replace with your font file name

export default function FullViewportClock() {
  const [time, setTime] = useState(new Date());
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Inject scoped @font-face only once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: "ClockFontScoped";
        src: url(${fontUrl}) format("opentype");
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () =>
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format as HHMM (no seconds)
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + minutes;
  };

  const digits = formatTime(time);
  const isMobile = dimensions.width < dimensions.height;

  // Size per digit to fill viewport
  const cellMainSize = isMobile
    ? dimensions.height / digits.length
    : dimensions.width / digits.length;

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#E6E8EDFF',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    position: 'relative', // Enable absolute positioning of children
  };

  const colors = [
    'rgba(16, 185, 129, 0.5)',
    'rgba(239, 68, 68, 0.5)',
    'rgba(59, 130, 246, 0.5)',
    'rgba(245, 158, 11, 0.5)',
    'rgba(168, 85, 247, 0.5)',
    'rgba(34, 197, 94, 0.5)',
  ];

  const getDigitStyle = (index) => ({
    fontFamily: 'ClockFontScoped, monospace',
    fontWeight: 'bold',
    color: colors[index % colors.length],
    fontSize: isMobile
      ? `${dimensions.height}px`
      : `${dimensions.width / digits.length}px`,
    lineHeight: 1,
    position: 'absolute',
    top: isMobile ? `${index * (dimensions.height / digits.length)}px` : 0,
    left: isMobile ? 0 : `${index * (dimensions.width / digits.length)}px`,
    width: isMobile ? '100vw' : `${dimensions.width / digits.length}px`,
    height: isMobile ? `${dimensions.height / digits.length}px` : '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isMobile
      ? `scale(1, ${dimensions.height / (digits.length * cellMainSize)})`
      : `scale(${dimensions.width / (digits.length * cellMainSize)}, 1)`,
    transformOrigin: 'center',
  });

  return (
    <div style={containerStyle}>
      {digits.split('').map((d, idx) => (
        <div key={idx} style={getDigitStyle(idx)}>
          {d}
        </div>
      ))}
    </div>
  );
}