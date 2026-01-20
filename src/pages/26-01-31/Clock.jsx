import React, { useState, useEffect, useMemo } from 'react';
import logo from '../../assets/clocks/25-11-24/center.webp';
import leapBg from '../../assets/clocks/26-01-16/leap.webp';

// ----------------------------------------------------------------------
// Constants & Data
// ----------------------------------------------------------------------
const LEAP_SECOND_DATES = [
  '1972-06-30T23:59:59Z', '1972-12-31T23:59:59Z', '1973-12-31T23:59:59Z',
  '1974-12-31T23:59:59Z', '1975-12-31T23:59:59Z', '1976-12-31T23:59:59Z',
  '1977-12-31T23:59:59Z', '1978-12-31T23:59:59Z', '1979-12-31T23:59:59Z',
  '1981-06-30T23:59:59Z', '1982-06-30T23:59:59Z', '1983-06-30T23:59:59Z',
  '1985-06-30T23:59:59Z', '1987-12-31T23:59:59Z', '1989-12-31T23:59:59Z',
  '1990-12-31T23:59:59Z', '1992-06-30T23:59:59Z', '1993-06-30T23:59:59Z',
  '1994-06-30T23:59:59Z', '1995-12-31T23:59:59Z', '1997-06-30T23:59:59Z',
  '1998-12-31T23:59:59Z', '2005-12-31T23:59:59Z', '2008-12-31T23:59:59Z',
  '2012-06-30T23:59:59Z', '2015-06-30T23:59:59Z', '2016-12-31T23:59:59Z',
  '2026-12-31T23:59:59Z' // Placeholder
].map(d => new Date(d).getTime());

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------
const LeapClock = () => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    let frameId;
    const update = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Memoize calculations so they don't re-run 60 times a second unnecessarily
  const leapData = useMemo(() => {
    const currentMs = now.getTime();
    let last = null;
    let next = null;
    let count = 0;

    for (const ts of LEAP_SECOND_DATES) {
      if (ts <= currentMs) {
        last = ts;
        count++;
      } else if (!next) {
        next = ts;
      }
    }

    // Check for the "60th" second logic
    const isLeapSecondActive = 
      now.getUTCHours() === 23 && 
      now.getUTCMinutes() === 59 && 
      now.getUTCSeconds() === 59; 

    return { count, last, next, isLeapSecondActive };
  }, [now.getSeconds()]); // Only re-calc when the second changes

  // Formatting Helpers
  const formatUTC = (ts) => ts ? new Date(ts).toUTCString().replace('GMT', 'UTC') : 'N/A';
  
  const getCountdown = () => {
    if (!leapData.next) return "";
    const diff = leapData.next - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days} days remaining`;
  };

  return (
    <main style={styles.container}>
      <header style={styles.header}>
        <img src={logo} style={styles.logo} alt="Clock Center" />
        <div style={styles.badge}>UTC MONITOR</div>
      </header>

      <section style={styles.clockWrapper}>
        <div style={styles.timeDisplay}>
          {now.toLocaleTimeString('en-GB', { hour12: false })}
          <span style={styles.ms}>.{(now.getMilliseconds() / 10).toFixed(0).padStart(2, '0')}</span>
        </div>
        
        {leapData.isLeapSecondActive && (
          <div style={styles.alertBanner}>
            ⚠️ LEAP SECOND INSERTION IN PROGRESS (23:59:60)
          </div>
        )}
      </section>

      <div style={styles.grid}>
        <InfoTile label="Total Adjustments" value={`${leapData.count} seconds`} />
        <InfoTile label="Next Event" value={formatUTC(leapData.next)} sub={getCountdown()} />
        <InfoTile label="Last Event" value={formatUTC(leapData.last)} />
        <InfoTile 
          label="Sync Status" 
          value={leapData.isLeapSecondActive ? "ADJUSTING" : "SYNCHRONIZED"} 
          color={leapData.isLeapSecondActive ? "#fbbf24" : "#10b981"}
        />
      </div>

      <footer style={styles.footerCard}>
        <p>
          <strong>Leap Seconds</strong> synchronize UTC with <strong>UT1</strong> (Earth's rotation). 
          Due to the gradual slowing of Earth, atomic clocks are occasionally paused for one second to let the planet "catch up."
        </p>
      </footer>
    </main>
  );
};

// Sub-component for UI consistency
const InfoTile = ({ label, value, sub, color = "#f8fafc" }) => (
  <div style={styles.tile}>
    <span style={styles.label}>{label}</span>
    <span style={{ ...styles.value, color }}>{value}</span>
    {sub && <span style={styles.subText}>{sub}</span>}
  </div>
);

// ----------------------------------------------------------------------
// Styles
// ----------------------------------------------------------------------


const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#020617',
    backgroundImage: `
      url('${leapBg}'),
      linear-gradient(45deg, #0f172a 25%, #1e293b 25%, #1e293b 50%, #0f172a 50%, #0f172a 75%, #1e293b 75%, #1e293b 100%)
    `,
    backgroundSize: '200px 200px, 200px 200px',
    backgroundPosition: 'center center, 0 0',
    backgroundRepeat: 'no-repeat, repeat',
    backgroundBlendMode: 'overlay',
    color: '#f8fafc',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '2rem',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(2, 6, 23, 0.85)',
      zIndex: 0,
    },
  },
  header: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    position: 'relative',
    zIndex: 1,
  },
  logo: {
    width: '80px',
    filter: 'drop-shadow(0 0 10px rgba(56, 189, 248, 0.5))',
  },
  badge: {
    fontSize: '0.7rem',
    letterSpacing: '0.2em',
    // padding: '4px 12px',
    border: '1px solid #334155',
    borderRadius: '100px',
    color: '#94a3b8'
  },
  clockWrapper: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    padding: '2rem',
    borderRadius: '16px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    backdropFilter: 'blur(8px)',
  },
  timeDisplay: {
    fontSize: 'clamp(4rem, 12vw, 10rem)',
    fontWeight: '800',
    fontVariantNumeric: 'tabular-nums',
    color: '#f1f5f9',
  },
  ms: {
    fontSize: '0.4em',
    color: '#475569',
  },
  alertBanner: {
    // marginTop: '1rem',
    // padding: '0.5rem 1rem',
    backgroundColor: '#78350f',
    color: '#fbbf24',
    borderRadius: '4px',
    fontWeight: 'bold',
    animation: 'pulse 1s infinite alternate'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
    width: '100%',
    maxWidth: '1000px',
    position: 'relative',
    zIndex: 1,
    margin: '2rem 0',
  },
  tile: {
    backgroundColor: '#0f172a',
    // padding: '1.25rem',
    borderRadius: '12px',
    border: '1px solid #1e293b',
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    color: '#64748b',
    // marginBottom: '0.5rem',
    // letterSpacing: '0.05em'
  },
  value: {
    fontSize: '1.1rem',
    fontWeight: '600',
  },
  subText: {
    fontSize: '0.8rem',
    color: '#475569',
    // marginTop: '0.25rem'
  },
  footerCard: {
    fontSize: '0.9rem',
    color: '#94a3b8',
    lineHeight: '1.6',
    textAlign: 'center',
    padding: '1.5rem',
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: '12px',
    border: '1px solid #1e293b',
    backdropFilter: 'blur(8px)',
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '800px',
    marginTop: '1rem',
  }
};

export default LeapClock;