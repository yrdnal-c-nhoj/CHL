import React, { useState, useEffect } from 'react';

// Explicit asset imports at the top
// Vite will fingerprint these files (e.g., logo.hash.png)
import logo from  '../../assets/clocks/25-11-24/center.webp';
import customFont from '../../assets/fonts/25-11-24-snake.ttf?url';

// List of known leap seconds (as of 2025) with proper handling
const LEAP_SECONDS = [
  // Convert leap second times to valid JavaScript dates by using 59.999 seconds
  // These will be displayed with the 23:59:60 format in the UI
  '1972-06-30T23:59:59.999Z',
  '1972-12-31T23:59:59.999Z',
  '1973-12-31T23:59:59.999Z',
  '1974-12-31T23:59:59.999Z',
  '1975-12-31T23:59:59.999Z',
  '1976-12-31T23:59:59.999Z',
  '1977-12-31T23:59:59.999Z',
  '1978-12-31T23:59:59.999Z',
  '1979-12-31T23:59:59.999Z',
  '1981-06-30T23:59:59.999Z',
  '1982-06-30T23:59:59.999Z',
  '1983-06-30T23:59:59.999Z',
  '1985-06-30T23:59:59.999Z',
  '1987-12-31T23:59:59.999Z',
  '1989-12-31T23:59:59.999Z',
  '1990-12-31T23:59:59.999Z',
  '1992-06-30T23:59:59.999Z',
  '1993-06-30T23:59:59.999Z',
  '1994-06-30T23:59:59.999Z',
  '1995-12-31T23:59:59.999Z',
  '1997-06-30T23:59:59.999Z',
  '1998-12-31T23:59:59.999Z',
  '2005-12-31T23:59:59.999Z',
  '2008-12-31T23:59:59.999Z',
  '2012-06-30T23:59:59.999Z',
  '2015-06-30T23:59:59.999Z',
  '2016-12-31T23:59:59.999Z',
  '2024-12-31T23:59:59.999Z' // Future leap second (scheduled)
];

// For display purposes, we'll show the leap second time as 23:59:60
const formatLeapSecondTime = (date) => {
  if (!date || isNaN(date)) return 'N/A';
  const d = new Date(date);
  // For the leap second, we show 23:59:60
  if (d.getUTCHours() === 23 && d.getUTCMinutes() === 59 && d.getUTCSeconds() === 59) {
    return d.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    }) + ' 23:59:60 UTC';
  }
  // Fallback for any other time
  return d.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
};

const LeapClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Performance: Proper cleanup to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  // Calculate current leap second status
  const getLeapSecondInfo = (currentDate) => {
    // Current UTC time in ISO format
    const currentUTC = currentDate.toISOString();
    
    // Find the most recent leap second
    const pastLeapSeconds = LEAP_SECONDS.filter(ls => ls <= currentUTC);
    const nextLeapSeconds = LEAP_SECONDS.filter(ls => ls > currentUTC);
    
    const lastLeapSecond = pastLeapSeconds.length > 0 
      ? new Date(pastLeapSeconds[pastLeapSeconds.length - 1])
      : null;
      
    const nextLeapSecond = nextLeapSeconds.length > 0
      ? new Date(nextLeapSeconds[0])
      : null;
    
    // Calculate total leap seconds applied so far
    const totalLeapSeconds = pastLeapSeconds.length;
    
    return {
      totalLeapSeconds,
      lastLeapSecond,
      nextLeapSecond,
      isLeapSecond: currentDate.getUTCSeconds() === 60 // 60th second indicates leap second
    };
  };

  // Get leap second info
  const leapSecondInfo = getLeapSecondInfo(time);
  
  // Format the leap second dates for display
  const formattedLastLeapSecond = leapSecondInfo.lastLeapSecond ? 
    formatLeapSecondTime(leapSecondInfo.lastLeapSecond) : 'N/A';
    
  const formattedNextLeapSecond = leapSecondInfo.nextLeapSecond ? 
    formatLeapSecondTime(leapSecondInfo.nextLeapSecond) : 'N/A';

  // Format date for display
  const formatDate = (date) => {
    if (!date || isNaN(date)) return 'N/A';
    
    // For the next leap second, we need to handle the 60th second specially
    if (date.getUTCHours() === 23 && date.getUTCMinutes() === 59 && date.getUTCSeconds() === 60) {
      // Format the date part only
      const dateStr = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });
      return `${dateStr} 23:59:60 UTC`;
    }
    
    // For past leap seconds, show the actual date
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC',
      hour12: false,
      timeZoneName: 'short'
    }).replace(/,/g, ''); // Remove commas from the date string
  };

  // Inline Styles Object
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100vw',
      height: '100dvh',
      backgroundColor: '#0f172a',
      color: '#f8fafc',
      margin: 0,
      padding: '20px',
      boxSizing: 'border-box',
      overflow: 'auto', // Allow scrolling if content is too long
      fontFamily: 'system-ui, -apple-system, sans-serif',
      textAlign: 'center',
    },
    clockFace: {
      fontSize: 'clamp(3rem, 15vw, 8rem)', // Responsive font sizing
      fontWeight: '700',
      letterSpacing: '-0.05em',
      margin: '0.5rem 0',
      fontVariantNumeric: 'tabular-nums', // Prevents jittering digits
    },
    logo: {
      width: '60px',
      marginBottom: '1rem',
    },
    infoCard: {
      maxWidth: '500px',
      padding: '1.5rem',
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      fontSize: '0.9rem',
      lineHeight: '1.6',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
    highlight: {
      color: '#38bdf8',
      fontWeight: 'bold',
    },
    label: {
      fontSize: '0.8rem',
      color: '#94a3b8',
      marginBottom: '0.25rem',
    },
    value: {
      fontSize: '0.95rem',
      fontWeight: '500',
      wordBreak: 'break-word',
    }
  };

  // Format time string
  const timeString = time.toLocaleTimeString([], { 
    hour12: true, 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit' 
  });

  return (
    <div style={styles.container}>
      <img src={logo} style={styles.logo} alt="Clock Logo" />
      
      <div style={styles.clockFace}>
        {timeString}
        {leapSecondInfo.isLeapSecond && (
          <div style={{ 
            fontSize: '1.5rem',
            color: '#10b981',
            marginTop: '0.5rem',
            animation: 'pulse 1s infinite'
          }}>
            LEAP SECOND ACTIVE
          </div>
        )}
      </div>

      <div style={styles.infoCard}>
        <h2 style={{ marginTop: 0, fontSize: '1.2rem' }}>Leap Second Information</h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '1rem',
          textAlign: 'left',
          marginBottom: '1rem'
        }}>
          <div>
            <div style={styles.label}>Total Leap Seconds:</div>
            <div style={styles.value}>{leapSecondInfo.totalLeapSeconds}</div>
          </div>
          <div>
            <div style={styles.label}>Last Leap Second:</div>
            <div style={styles.value}>{formattedLastLeapSecond}</div>
          </div>
          <div>
            <div style={styles.label}>Next Leap Second:</div>
            <div style={styles.value}>{formattedNextLeapSecond}</div>
          </div>
          <div>
            <div style={styles.label}>Current Status:</div>
            <div style={{
              ...styles.value,
              color: leapSecondInfo.isLeapSecond ? '#10b981' : '#f8fafc'
            }}>
              {leapSecondInfo.isLeapSecond ? 'Leap Second Active' : 'Standard Time'}
            </div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          padding: '1rem',
          borderRadius: '8px',
          borderLeft: '4px solid #10b981',
          marginTop: '1rem',
          textAlign: 'left'
        }}>
          <h3 style={{ marginTop: 0, color: '#10b981' }}>About Leap Seconds</h3>
          <p style={{ marginBottom: '0.5rem' }}>
            A <span style={styles.highlight}>leap second</span> is a one-second adjustment 
            occasionally applied to Coordinated Universal Time (UTC) to keep it synchronized 
            with the Earth's gradually slowing rotation.  International Earth Rotation and Reference Systems Service (IERS)
          </p>
          <p style={{ margin: '0.5rem 0' }}>
            The next leap second is scheduled for {formattedNextLeapSecond}.
          </p>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </div>
  );
};

export default LeapClock;