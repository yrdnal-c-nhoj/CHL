import { useEffect, useState } from 'react';

export default function HexClock() {
  const [time, setTime] = useState(new Date());
  const [isScaledMode, setIsScaledMode] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  // Helper to pad single digits with a leading zero
  const pad = (num: number): string => num.toString().padStart(2, '0');

  // Formatted strings for the standard time display
  const displayHours = pad(hours);
  const displayMinutes = pad(minutes);
  const displaySeconds = pad(seconds);

  let hexCode = '';

  if (isScaledMode) {
    // Scale hours (0-23) and mins/secs (0-59) to a full 0-255 (00-FF) hex range
    const r = Math.round((hours / 23) * 255).toString(16).padStart(2, '0');
    const g = Math.round((minutes / 59) * 255).toString(16).padStart(2, '0');
    const b = Math.round((seconds / 59) * 255).toString(16).padStart(2, '0');
    hexCode = `#${r}${g}${b}`.toUpperCase();
  } else {
    // True Time-to-Hex Mode: Literal mapping
    hexCode = `#${displayHours}${displayMinutes}${displaySeconds}`;
  }

  // Determine text color (white or black) based on background luminance for readability
  const getContrastColor = (hex: string) => {
    // Default to white text for the dark "True Mode"
    if (!isScaledMode) return '#ffffff';
    
    // Simple luminance calculation for Scaled Mode
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? '#111111' : '#ffffff';
  };

  const textColor = getContrastColor(hexCode);

  return (
    <div
      style={{
        backgroundColor: hexCode,
        color: textColor,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'monospace',
        transition: 'background-color 1s ease, color 0.5s ease',
      }}
    >
      <div style={{ fontSize: '4rem', fontWeight: 'bold', letterSpacing: '2px' }}>
        {displayHours}:{displayMinutes}:{displaySeconds}
      </div>
      
      <div style={{ fontSize: '2rem', marginTop: '10px', opacity: 0.8 }}>
        {hexCode}
      </div>

      <div style={{ marginTop: '30px', display: 'flex', gap: '15px' }}>
        <button
          onClick={() => setIsScaledMode(false)}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: !isScaledMode ? textColor : 'transparent',
            color: !isScaledMode ? hexCode : textColor,
            border: `2px solid ${textColor}`,
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          True Hex Mode
        </button>
        <button
          onClick={() => setIsScaledMode(true)}
          style={{
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: isScaledMode ? textColor : 'transparent',
            color: isScaledMode ? hexCode : textColor,
            border: `2px solid ${textColor}`,
            borderRadius: '4px',
            fontWeight: 'bold',
            transition: 'all 0.3s ease',
          }}
        >
          Full Spectrum Mode
        </button>
      </div>
    </div>
  );
}