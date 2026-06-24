import React, { useEffect, useState } from 'react';

export const DigitalClock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Format hours (12-hour clock), minutes, and AM/PM
  let hours = time.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'
  
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');

  // Helper component for a time unit encased in a stylized circle
  const ClockUnit = ({ value, label }: { value: string; label: string }) => (
    <div style={styles.unitContainer}>
      <div style={styles.circle}>
        <span style={styles.value}>{value}</span>
      </div>
      <span style={styles.label}>{label}</span>
    </div>
  );

  return (
    <div style={styles.wrapper}>
      <div style={styles.clockContainer}>
        <ClockUnit value={formattedHours} label="HOURS" />
        <div style={styles.colon}>:</div>
        <ClockUnit value={minutes} label="MINUTES" />
        <div style={styles.colon}>:</div>
        <ClockUnit value={ampm} label="PERIOD" />
      </div>
    </div>
  );
};

// Inline styles for easy copy-pasting in a Vite environment
const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#0f172a', // Dark slate background
    fontFamily: '"Courier New", Courier, monospace',
  },
  clockContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
    padding: '40px',
    borderRadius: '24px',
    backgroundColor: '#1e293b',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  unitContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
  },
  circle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '4px solid #38bdf8', // Neon blue circle ring
    boxShadow: '0 0 15px #38bdf8, inset 0 0 15px #38bdf8', // Glowing effect
    backgroundColor: 'rgba(56, 189, 248, 0.05)',
  },
  value: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#f8fafc',
    textShadow: '0 0 10px rgba(248, 250, 252, 0.5)',
  },
  colon: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#38bdf8',
    paddingBottom: '35px', // Aligns the colon with the center of the circles
    animation: 'blink 1s infinite',
  },
  label: {
    fontSize: '0.75rem',
    color: '#94a3b8',
    letterSpacing: '0.1em',
  },
};

// Injecting a simple keyframe animation for a blinking colon effect
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  styleSheet.insertRule(`
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
  `, styleSheet.cssRules.length);
}