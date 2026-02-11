import React, { useState, useEffect, useMemo } from 'react';
import font20250119_primary from '../../../assets/fonts/26-01-16-leap.otf';
import font20250119_secondary from '../../../assets/fonts/25-04-25-Oswald-Bold.ttf';
import font20250119_mono from '../../../assets/fonts/25-05-10-Questrial.ttf';
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
  const [fontsReady, setFontsReady] = useState(false);
  const [gateReady, setGateReady] = useState(false);

  useEffect(() => {
    let frameId;
    const update = () => {
      setNow(new Date());
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const fontPromises = [
      document.fonts.load("1em 'LeapFont'"),
      document.fonts.load("1em 'Oswald'"),
      document.fonts.load("1em 'Questrial'")
    ];
    Promise.all(fontPromises)
      .then(() => setFontsReady(true))
      .catch(() => setFontsReady(true));
    const t = setTimeout(() => setGateReady(true), 150);
    return () => clearTimeout(t);
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
  }, [now.getTime()]); // Updated dependency for precision

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

    .tile-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: clamp(8px, 1.5vw, 16px);
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }

    @media (max-width: 768px) {
      .tile-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  `;

  const ready = fontsReady && gateReady;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#E1E2E8',
      color: '#233603',
      display: 'flex',
      flexDirection: 'column',
      opacity: ready ? 1 : 0,
      visibility: ready ? 'visible' : 'hidden',
      transition: 'opacity 0.4s ease'
    }}>
      <style>{fontStyles}</style>

      <main style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'clamp(1rem, 5vh, 3rem) 0',
        boxSizing: 'border-box'
      }}>
        {/* HEADER */}
        <header style={{ textAlign: 'center', padding: '0 1rem' }}>
          <div style={{
            maxWidth: '600px',
            fontFamily: 'Questrial, sans-serif',
            fontSize: 'clamp(14px, 2vh, 18px)',
            margin: '0 auto 1.5rem',
            lineHeight: 1.4
          }}>
            A <strong>leap second</strong> is a one-second adjustment keeping UTC synchronized with Earth's rotation.
          </div>
          <div style={{ fontSize: 'clamp(32px, 6vh, 54px)', letterSpacing: '0.5rem' }}>
            🌍⏳🐌⚙️🕒
          </div>
        </header>

        {/* CLOCK SECTION */}
        <section style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontFamily: 'LeapFont, monospace',
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          letterSpacing: '-0.05em',
          color: '#262424'
        }}>
          <div style={{ display: 'flex', opacity: 0.2 }}>
            <DigitBox>{now.getHours().toString().padStart(2, '0')[0]}</DigitBox>
            <DigitBox>{now.getHours().toString().padStart(2, '0')[1]}</DigitBox>
          </div>
          <div style={{ display: 'flex', opacity: 0.4 }}>
            <DigitBox>{now.getMinutes().toString().padStart(2, '0')[0]}</DigitBox>
            <DigitBox>{now.getMinutes().toString().padStart(2, '0')[1]}</DigitBox>
          </div>
         <div style={{ display: 'flex', opacity: 0.6 }}>
            <DigitBox>{now.getSeconds().toString().padStart(2, '0')[0]}</DigitBox>
            <DigitBox>{now.getSeconds().toString().padStart(2, '0')[1]}</DigitBox>
          </div>
          <div style={{ display: 'flex' }}>
            <DigitBox>{Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')[0]}</DigitBox>
            <DigitBox>{Math.floor(now.getMilliseconds() / 10).toString().padStart(2, '0')[1]}</DigitBox>
          </div>
          
        </section>

        {/* FOOTER TILES */}
        <footer style={{ width: '100%' }}>
          <div className="tile-grid">
            <InfoTile label="Last Sync" value={formatUTC(leapData.last)} />
            <InfoTile label="Next Date" value={formatUTC(leapData.next)} />
            <InfoTile label="Cumulative" value={`${leapData.count}s`} />
            <InfoTile
              label="System Status"
              value={leapData.isLeapActive ? "ADJUSTING" : "STABLE"}
              color={leapData.isLeapActive ? "#fbbf24" : "#086143"}
              isStatus
            />
          </div>
       
         <div style={{  marginTop: '1rem', fontSize: 'clamp(18px, 3vh, 34px)', letterSpacing: '0.5rem', textAlign: 'center' }}>
            🧊🫀🔭
          </div>
          <div style={{
            marginTop: '1rem',
            maxWidth: '600px',
            fontFamily: 'Questrial, sans-serif',
            fontSize: 'clamp(14px, 2vh, 18px)',
            margin: '0 auto 1.5rem',
            lineHeight: 1.4,
            textAlign: 'center'
          }}>
            Cubist Heart Laboratories salutes the tireless work of the International Earth Rotation and Reference Systems Service, the International Bureau of Weights and Measures, and the International Telecommunication Union.
       </div>
       
       </footer>  
      </main>
    </div>
  );
};

const DigitBox = ({ children }) => (
  <div style={{
    width: '0.65em',
    textAlign: 'center',
    fontVariantNumeric: 'tabular-nums'
  }}>
    {children}
  </div>
);

const InfoTile = ({ label, value, color = "#086143", isStatus = false }) => (
  <div style={{
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: '1.25rem',
    padding: '1.25rem 0.5rem',
    textAlign: 'center',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    border: '1px solid rgba(255,255,255,0.4)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  }}>
    <div style={{
      fontFamily: 'Oswald, sans-serif',
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      marginBottom: '0.5rem',
      opacity: 0.6
    }}>
      {label}
    </div>
    <div style={{
      fontFamily: 'Questrial, sans-serif',
      fontWeight: 'bold',
      fontSize: 'clamp(13px, 1.2vw, 18px)',
      color: color
    }}>
      {value}
    </div>
  </div>
);

export default LeapClock;