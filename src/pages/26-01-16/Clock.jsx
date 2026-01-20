import React, { useState, useEffect, useMemo } from 'react';

// Font imports (assuming these paths are correct in your build env)
import font20250119_primary from '../../assets/fonts/26-01-16-leap.ttf';
import font20250119_secondary from '../../assets/fonts/25-04-25-Oswald-Bold.ttf';
import font20250119_mono from '../../assets/fonts/25-05-10-Questrial.ttf';

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
  '2026-12-31T23:59:59Z'
].map(d => new Date(d).getTime());

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

  const leapData = useMemo(() => {
    const currentMs = now.getTime();
    let last = null, next = null, count = 0;
    for (const ts of LEAP_SECOND_DATES) {
      if (ts <= currentMs) { last = ts; count++; } 
      else if (!next) { next = ts; }
    }
    const isLeapActive = now.getUTCHours() === 23 && now.getUTCMinutes() === 59 && now.getUTCSeconds() === 59;
    return { count, last, next, isLeapActive };
  }, [now.getSeconds()]);

  const formatUTC = (ts) => ts ? new Date(ts).toUTCString().replace('GMT', 'UTC') : 'N/A';

  const fontStyles = `
    @font-face { font-family: 'LeapFont'; src: url(${font20250119_primary}) format('truetype'); font-display: swap; }
    @font-face { font-family: 'Oswald'; src: url(${font20250119_secondary}) format('truetype'); font-display: swap; }
    @font-face { font-family: 'Questrial'; src: url(${font20250119_mono}) format('truetype'); font-display: swap; }
  `;

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100dvh', overflow: 'hidden' }}>
      <style>{fontStyles}</style>
      
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        // justifyContent: 'space-between', // Elements are pushed to Top, Center, and Bottom
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#E1E2E8',
        color: '#233603',
        padding: '5vh 2rem' // Consistent padding for top/bottom
      }}>
        
        {/* SECTION 1: HEADER */}
        <header style={{
          textAlign: 'center',
          maxWidth: '600px',
          zIndex: 2
        }}>
          <div style={{ fontFamily: '"Questrial", sans-serif', fontSize: '1rem', marginBottom: '1rem', opacity: 0.8 }}>
                      A <span style={styles.highlight}>leap second</span> is a one-second adjustment 
            occasionally applied to Coordinated Universal Time (UTC) to keep it synchronized 
            with the Earth's gradually slowing rotation.  International Earth Rotation and Reference Systems Service (IERS)
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '1.5rem' }}>
            <span>🌍</span><span>⏳</span><span>🐌</span><span>⚙️</span><span>🕒</span>
          </div>
        </header>

        {/* SECTION 2: CLOCK (The "Flex: 1" forces this to take all remaining space) */}
        <section style={{ 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          // flex: 1, // This makes the clock "expand" to fill the middle
          width: '100%'
        }}>
          <div style={{
            fontSize: 'min(15vw, 12vh)', // Fluid sizing based on screen dimensions
            color: '#0D0101',
            fontFamily: '"LeapFont", monospace',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          }}>
            <span style={{ opacity: 0.4, fontSize: '4vh' }}>  
            {now.getHours().toString().padStart(2, '0')}
            {now.getMinutes().toString().padStart(2, '0')}
            </span>
            {now.getSeconds().toString().padStart(2, '0')}
            {Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}
 
          </div>
        </section>

        {/* SECTION 3: FOOTER GRID */}
        <footer style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          width: '100%',
          maxWidth: '1200px',
          zIndex: 2
        }}>
          <InfoTile label="Total Since 1972" value={`${leapData.count}s`} />
          <InfoTile label="Next Date" value={formatUTC(leapData.next)} />
          <InfoTile label="Last Date" value={formatUTC(leapData.last)} />
          <InfoTile 
            label="Sync Status" 
            value={leapData.isLeapActive ? "ADJUSTING" : "STABLE"} 
            color={leapData.isLeapActive ? "#fbbf24" : "#2D0506"}
          />
        </footer>

      </main>
    </div>
  );
};

const InfoTile = ({ label, value, color = "#2F5F9E" }) => (
  <div style={{
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    backdropFilter: 'blur(12px)',
    borderRadius: '12px',
    padding: '1.25rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.5)',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
  }}>
    <div style={{ 
      fontSize: '0.7rem', 
      color: '#113B65', 
      textTransform: 'uppercase', 
      letterSpacing: '0.12em', 
      fontFamily: "'Oswald', sans-serif",
      marginBottom: '0.5rem'
    }}>
      {label}
    </div>
    <div style={{ 
      fontSize: '1rem', 
      color: color, 
      fontFamily: "'Questrial', sans-serif", 
      fontWeight: 'bold' 
    }}>
      {value}
    </div>
  </div>
);

export default LeapClock;