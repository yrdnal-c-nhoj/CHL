import { useState, useEffect } from 'react';

export default function FullViewportClock() {
  const [time, setTime] = useState(new Date());
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return hours + minutes; // concatenate as a single string
  };

  const digits = formatTime(time); // e.g., "1359"
  const totalDigits = digits.length;
  const isMobile = dimensions.width < dimensions.height; // true if vertical layout

  // Calculate font size to fill the main axis exactly
  const fontSize = isMobile
    ? dimensions.height / totalDigits
    : dimensions.width / totalDigits;

  // Scale to fill the cross-axis completely
  const scaleX = isMobile ? dimensions.width / fontSize : 1;
  const scaleY = isMobile ? 1 : dimensions.height / fontSize;

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    backgroundColor: '#111827',
    display: 'flex',
    alignItems: 'stretch',
    justifyContent: 'stretch',
    overflow: 'hidden',
    margin: 0,
    padding: 0,
    border: 'none',
  };

  const digitsContainerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    border: 'none',
  };

  const digitStyle = {
    flex: 1, // Equal distribution of space
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#10B981',
    fontSize: `${fontSize}px`,
    lineHeight: 1,
    transform: `scale(${scaleX}, ${scaleY})`, // Stretch to fill
    whiteSpace: 'nowrap',
    margin: 0,
    padding: 0,
    border: 'none',
    boxSizing: 'border-box',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <div style={digitsContainerStyle}>
        {digits.split('').map((d, idx) => (
          <div key={idx} style={digitStyle}>{d}</div>
        ))}
      </div>
    </div>
  );
}