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

  const formatUTC = (ts) => ts 
    ? new Date(ts).toUTCString().replace('GMT', 'UTC').split(' ').slice(1, 4).join(' ') 
    : 'N/A';

  const fontStyles = `
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

  // Calculate dynamic viewport units for mobile
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Use dynamic viewport units that account for mobile browser UI
  const vh = windowSize.height * 0.01;
  const vw = windowSize.width * 0.01;
  const safeAreaInsetBottom = 'env(safe-area-inset-bottom, 0px)';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#E1E2E8',
      overflow: 'hidden',
      color: '#233603',
      boxSizing: 'border-box',
      WebkitOverflowScrolling: 'touch',
      touchAction: 'manipulation',
      overscrollBehavior: 'contain',
      paddingBottom: `max(${safeAreaInsetBottom}, env(safe-area-inset-bottom, 0px))`
    }}>
      <style>{fontStyles}</style>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: `${Math.min(2 * vh, 16)}px ${Math.min(4 * vw, 16)}px`,
        boxSizing: 'border-box',
        overflow: 'hidden',
        position: 'relative',
        WebkitOverflowScrolling: 'touch'
      }}>
        {/* HEADER */}
        <header style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: `${Math.min(1 * vh, 8)}px`,
          textAlign: 'center',
          paddingTop: 'env(safe-area-inset-top, 0px)'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            fontFamily: 'Questrial, sans-serif',
            fontSize: `${Math.min(2.5 * vh, 18)}px`,
            lineHeight: '1.3',
            margin: '0 auto 1.9vh',
            padding: '0 20px',
            boxSizing: 'border-box'
          }}>
            A <strong>leap second</strong> is a one-second adjustment
            occasionally applied to Coordinated Universal Time (UTC) to keep it synchronized
            with the Earth's gradually slowing rotation.
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.25rem',
            fontSize: `${Math.min(8 * vh, 48)}px`
          }}>
            <span>🌍</span><span>⏳</span><span>🐌</span><span>⚙️</span><span>🕒</span>
          </div>
        </header>

        {/* CLOCK */}
        <section style={{
          flex: '1 1 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: `${Math.min(1 * vh, 8)}px 0`,
          minHeight: '0', // Allow content to shrink below 30vh if needed
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box',
          flexShrink: 1
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'LeapFont, monospace',
            color: '#262424',
            fontSize: `${Math.min(25 * vw, 14 * vh, 48)}px`,
            lineHeight: 1,
            letterSpacing: '-0.3em',
            width: '100%',
            padding: '0 4%',
            boxSizing: 'border-box',
            transform: 'scale(0.95)'
          }}>
            <div style={{ display: 'flex', opacity: 0.3 }}>
              <DigitBox>{now.getHours().toString().padStart(2, '0')[0]}</DigitBox>
              <DigitBox>{now.getHours().toString().padStart(2, '0')[1]}</DigitBox>
            </div>
            <div style={{ display: 'flex', opacity: 0.5 }}>
              <DigitBox>{now.getMinutes().toString().padStart(2, '0')[0]}</DigitBox>
              <DigitBox>{now.getMinutes().toString().padStart(2, '0')[1]}</DigitBox>
            </div>
            <div style={{ display: 'flex' }}>
              <DigitBox>{now.getSeconds().toString().padStart(2, '0')[0]}</DigitBox>
              <DigitBox>{now.getSeconds().toString().padStart(2, '0')[1]}</DigitBox>
              <div style={{ display: 'flex' }}>
                <DigitBox>{Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')[0]}</DigitBox>
                <DigitBox>{Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')[1]}</DigitBox>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{
          flexShrink: 0,
          width: '100%',
          padding: `${Math.min(1 * vh, 8)}px 0`,
          marginTop: 'auto',
          paddingBottom: `calc(${Math.min(1 * vh, 8)}px + ${safeAreaInsetBottom})`
        }}>
          <div style={{
            display: 'grid',
            gap: '8px',
            gridTemplateColumns: 'repeat(2, minmax(120px, 1fr))',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0',
            transform: 'scale(0.95)',
            transformOrigin: 'center bottom',
            maxWidth: '500px',
            margin: '0 auto'
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

const DigitBox = ({ children }) => (
  <div style={{
    display: 'inline-block',
    width: '0.5em',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0',
    fontFeatureSettings: '"tnum" 1'
  }}>
    {children}
  </div>
);

const InfoTile = ({ label, value, color = "#086143", isStatus = false }) => (
  <div style={{
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '1rem',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '0.8rem',
    margin: '0.2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        opacity: 0.8,
        marginBottom: '0.3rem',
        fontFamily: 'Oswald, sans-serif',
        fontSize: '0.7rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
      <div style={{
        color,
        fontFamily: 'Questrial, sans-serif',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        ...(isStatus && { letterSpacing: '0.05em' })
      }}>
        {value}
      </div>
    </div>
  </div>
);

export default LeapClock;