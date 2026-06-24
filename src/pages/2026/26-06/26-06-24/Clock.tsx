import React, { useEffect, useState } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());
  const [isColonVisible, setIsColonVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    const blinker = setInterval(() => setIsColonVisible((prev) => !prev), 500);

    return () => {
      clearInterval(timer);
      clearInterval(blinker);
    };
  }, []);

  let hours = time.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const formattedHours = hours.toString().padStart(2, '0');

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
        
        <div style={{ ...styles.colon, opacity: isColonVisible ? 1 : 0.2 }}>:</div>
        
        <ClockUnit value={minutes} label="MINUTES" />
        
        <div style={{ ...styles.colon, opacity: isColonVisible ? 1 : 0.2 }}>:</div>
        
        <ClockUnit value={ampm} label="PERIOD" />
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#0f172a',
    fontFamily: '"Courier New", Courier, monospace',
  },
  clockContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4vmin',
    padding: '6vmin',
    borderRadius: '4vmin',
    backgroundColor: '#1e293b',
    boxShadow: '0 4vmin 8vmin -2vmin rgba(0, 0, 0, 0.5)',
  },
  unitContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2vmin',
  },
  circle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '22vmin',
    height: '22vmin',
    borderRadius: '50%',
    border: '0.8vmin solid #38bdf8',
    boxShadow: '0 0 3vmin #38bdf8, inset 0 0 3vmin #38bdf8',
    backgroundColor: 'rgba(56, 189, 248, 0.03)',
  },
  value: {
    fontSize: '6vmin',
    fontWeight: 'bold',
    color: '#f8fafc',
    textShadow: '0 0 2vmin rgba(248, 250, 252, 0.4)',
  },
  colon: {
    fontSize: '70vmin',
    fontWeight: 'bold',
    color: '#38bdf8',
    paddingBottom: '6vmin', 
    transition: 'opacity 0.2s ease-in-out',
  },
  label: {
    fontSize: '1.8vmin',
    color: '#94a3b8',
    letterSpacing: '0.2em',
    fontWeight: '600',
  },
};