import React, { useState, useEffect, useMemo } from 'react';

// Font imports
import font20250119_primary from '../../assets/fonts/26-01-16-leap.ttf';
import font20250119_secondary from '../../assets/fonts/25-04-25-Oswald-Bold.ttf';
import font20250119_mono from '../../assets/fonts/25-05-10-Questrial.ttf';

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
  '2026-12-31T23:59:59Z'
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

  const leapData = useMemo(() => {
    const currentMs = now.getTime();
    let last = null, next = null, count = 0;
    for (const ts of LEAP_SECOND_DATES) {
      if (ts <= currentMs) { last = ts; count++; } 
      else if (!next) { next = ts; }
    }
    const isLeapSecondActive = now.getUTCHours() === 23 && now.getUTCMinutes() === 59 && now.getUTCSeconds() === 59;
    return { count, last, next, isLeapSecondActive };
  }, [now.getSeconds()]);

  const formatUTC = (ts) => ts ? new Date(ts).toUTCString().replace('GMT', 'UTC') : 'N/A';

  const fontStyles = `
    @font-face { font-family: 'LeapFont'; src: url(${font20250119_primary}) format('truetype'); font-display: swap; }
    @font-face { font-family: 'Oswald'; src: url(${font20250119_secondary}) format('truetype'); font-display: swap; }
    @font-face { font-family: 'Questrial'; src: url(${font20250119_mono}) format('truetype'); font-display: swap; }
  `;

  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <style>{fontStyles}</style>
      
      <main style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center', // Exact vertical center
        height: '100vh',
        width: '100vw',
        backgroundColor: '#E1E2E8',
        color: '#113B65',
        margin: 0,
        padding: 0,
        position: 'relative'
      }}>
        
        {/* Top Header Section - Positioned Absolutely to not affect clock center */}
        <div style={{
          position: 'absolute',
          top: '5vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '90%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <div style={{ fontFamily: '"Questrial", sans-serif', fontSize: '1rem', marginBottom: '1.5rem', opacity: 0.8 }}>
            A <strong>leap second</strong> adjustment keeps UTC synchronized with Earth's slowing rotation.
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '1.5rem' }}>
            <span>🌍</span><span>⏳</span><span>🐌</span><span>⚙️</span><span>🕒</span>
          </div>
        </div>

        {/* CLOCK CENTERPIECE - All digits same size & font */}
        <div style={{ 
          textAlign: 'center',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
                position: 'relative'
        }}>
          <span style={{
            fontSize: '10vh',
            color: '#0D0101',
            fontFamily: '"LeapFont", monospace',
            fontVariantNumeric: 'tabular-nums', // Keeps digit widths identical
            lineHeight: 1,
            whiteSpace: 'nowrap'
          }}>
            {now.getHours().toString().padStart(2, '0')}
       
            {now.getMinutes().toString().padStart(2, '0')}
    
            {now.getSeconds().toString().padStart(2, '0')}
       
            {Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')}
          </span>
        </div>

        {/* Footer Data Grid - Positioned Absolutely to not affect clock center */}
        <div style={{
          position: 'absolute',
          bottom: '5vh',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          width: '95%',
          maxWidth: '1200px'
        }}>
          <InfoTile label="Total Since 1972" value={`${leapData.count}s`} />
          <InfoTile label="Next Date" value={formatUTC(leapData.next)} />
          <InfoTile label="Last Date" value={formatUTC(leapData.last)} />
          <InfoTile 
            label="Sync Status" 
            value={leapData.isLeapSecondActive ? "ADJUSTING" : "STABLE"} 
            color={leapData.isLeapSecondActive ? "#fbbf24" : "#2D0506"}
          />
        </div>
      </main>
    </div>
  );
};

const InfoTile = ({ label, value, color = "#2F5F9E" }) => (
  <div style={{
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    backdropFilter: 'blur(10px)',
    borderRadius: '8px',
    padding: '1rem',
    textAlign: 'center',
    border: '1px solid rgba(255, 255, 255, 0.4)'
  }}>
    <div style={{ fontSize: '0.7rem', color: '#113B65', textTransform: 'uppercase', letterSpacing: '0.1em', fontFamily: "'Oswald', sans-serif" }}>{label}</div>
    <div style={{ fontSize: '1.1rem', color: color, fontFamily: "'Questrial', sans-serif", fontWeight: 'bold', marginTop: '0.4rem' }}>{value}</div>
  </div>
);

export default LeapClock;