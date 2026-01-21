import React, { useState, useEffect, useMemo } from 'react';

// Font imports
import font20250119_primary from '../../assets/fonts/26-01-16-leap.otf';
import font20250119_secondary from '../../assets/fonts/25-04-25-Oswald-Bold.ttf';
import font20250119_mono from '../../assets/fonts/25-05-10-Questrial.ttf';
import '@fontsource/roboto-mono';

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

const FONT_STYLES = `
  @font-face {
    font-family: 'LeapFont';
    src: url(${font20250119_primary}) format('opentype');
    font-display: swap;
  }
  @font-face {
    font-family: 'Oswald';
    src: url(${font20250119_secondary}) format('truetype');
    font-weight: bold;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: 'Questrial';
    src: url(${font20250119_mono}) format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap;
  }
`;

const LeapClock = () => {
  const [now, setNow] = useState(new Date());
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    let frameId;
    const update = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);

    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const leapData = useMemo(() => {
    const currentMs = now.getTime();
    let last = null, next = null, count = 0;
    for (const ts of LEAP_SECOND_DATES) {
      if (ts <= currentMs) { last = ts; count++; }
      else if (!next) { next = ts; }
    }
    // Leap adjustments happen at the very last second of UTC day
    const isLeapActive = now.getUTCHours() === 23 && now.getUTCMinutes() === 59 && now.getUTCSeconds() === 59;
    return { count, last, next, isLeapActive };
  }, [now.getUTCSeconds()]);

  const formatUTC = (ts) => ts 
    ? new Date(ts).toUTCString().replace('GMT', 'UTC').split(' ').slice(1, 4).join(' ') 
    : 'N/A';

  const vh = windowSize.height * 0.01;
  const vw = windowSize.width * 0.01;
  const safeAreaInsetBottom = 'env(safe-area-inset-bottom, 0px)';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#E1E2E8', overflow: 'hidden', color: '#233603',
      boxSizing: 'border-box', WebkitOverflowScrolling: 'touch',
      touchAction: 'manipulation', overscrollBehavior: 'contain',
      paddingBottom: `max(${safeAreaInsetBottom}, 0px)`
    }}>
      <style>{FONT_STYLES}</style>

      <main style={{
        display: 'flex', flexDirection: 'column', height: '100%', width: '100%',
        padding: `${Math.min(2 * vh, 16)}px ${Math.min(4 * vw, 16)}px`,
        boxSizing: 'border-box', position: 'relative'
      }}>
        
        <header style={{
          flexShrink: 0, textAlign: 'center', paddingTop: 'env(safe-area-inset-top, 0px)'
        }}>
          <div style={{
            fontFamily: 'Questrial, sans-serif',
            fontSize: `${Math.min(2.5 * vh, 18)}px`,
            lineHeight: '1.3', margin: '0 auto 1.5vh', maxWidth: '500px'
          }}>
            A <strong>leap second</strong> is a one-second adjustment 
            applied to UTC to keep it synchronized with the Earth's rotation.
          </div>
          <div style={{ fontSize: `${Math.min(7 * vh, 42)}px`, gap: '0.25rem' }}>
            🌍⏳🐌⚙️🕒
          </div>
        </header>

        <section style={{
          flex: '1 1 auto', display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}>
          <div style={{
            fontFamily: 'LeapFont, monospace', color: '#262424',
            fontSize: `${Math.min(22 * vw, 12 * vh, 48)}px`,
            display: 'flex', alignItems: 'baseline', letterSpacing: '-0.1em'
          }}>
            <div style={{ opacity: 0.3 }}>{now.getUTCHours().toString().padStart(2, '0')}</div>
            <div style={{ opacity: 0.5, margin: '0 0.1em' }}>{now.getUTCMinutes().toString().padStart(2, '0')}</div>
            <div style={{ display: 'flex' }}>
              <span>{now.getUTCSeconds().toString().padStart(2, '0')}</span>
              <span style={{ fontSize: '0.4em', opacity: 0.8, marginLeft: '0.1em' }}>
                {Math.floor(now.getUTCMilliseconds() / 10).toString().padStart(2, '0')}
              </span>
            </div>
          </div>
        </section>

        <footer style={{
          flexShrink: 0, width: '100%', paddingBottom: `calc(1vh + ${safeAreaInsetBottom})`
        }}>
          <div style={{
            display: 'grid', gap: '8px', 
            gridTemplateColumns: 'repeat(2, 1fr)',
            maxWidth: '500px', margin: '0 auto',
            transform: 'scale(0.95)', transformOrigin: 'center bottom'
          }}>
            <InfoTile label="Last Adjustment" value={`${formatUTC(leapData.last)} 23:59:59 UTC`} />
            <InfoTile label="Next Date" value={`${formatUTC(leapData.next)} 23:59:59 UTC`} />
            <InfoTile label="Total Since 1972" value={`${leapData.count}s`} />
            <InfoTile
              label="Sync Status"
              value={leapData.isLeapActive ? "ADJUSTING" : "STABLE"}
              color={leapData.isLeapActive ? "#fbbf24" : "#086143"}
              isStatus
            />
          </div>
        </footer>
      </main>
    </div>
  );
};

const InfoTile = ({ label, value, color = "#086143", isStatus = false }) => (
  <div style={{
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)', borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '0.8rem', textAlign: 'center', boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
  }}>
    <div style={{
      opacity: 0.8, marginBottom: '0.3rem', fontFamily: 'Oswald, sans-serif',
      fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.05em'
    }}>{label}</div>
    <div style={{
      color, fontFamily: 'Questrial, sans-serif', fontWeight: 'bold',
      fontSize: '0.85rem', wordBreak: 'break-word'
    }}>{value}</div>
  </div>
);

export default LeapClock;