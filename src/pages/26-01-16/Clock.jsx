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
      boxSizing: 'border-box'
    }}>
      <style>{fontStyles}</style>

      <main style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        maxWidth: '100%',
        margin: 0,
        padding: '1.5vh 3vw',
        boxSizing: 'border-box',
        overflow: 'hidden',
        minHeight: '100vh'
      }}>
        {/* HEADER */}
        <header style={{
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '1vh',
          textAlign: 'center'
        }}>
          <div style={{
            width: '100%',
            maxWidth: '500px',
            fontFamily: 'Questrial, sans-serif',
            fontSize: '2.5vh',
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
            fontSize: ' 8vh'
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
          padding: '1vh 0',
          minHeight: '25vh',
          maxHeight: '45vh',
          width: '100%',
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            fontFamily: 'LeapFont, monospace',
            color: '#8B5CF6',
            fontSize: 'min(20vw, 12vh)',
            lineHeight: 1,
            letterSpacing: '-0.3em',
            width: '100%',
            padding: '0 4%',
            boxSizing: 'border-box',
            transform: 'scale(0.95)',
            textShadow: `
              0 0 10px #8B5CF6,
              0 0 20px #8B5CF6,
              0 0 30px #8B5CF6,
              0 0 40px #6366F1,
              0 0 70px #6366F1,
              0 0 80px #6366F1,
              0 0 100px #4F46E5,
              0 0 150px #4F46E5
            `,
            filter: 'brightness(1.2) contrast(1.1)'
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
          padding: '0.5vh 0',
          marginTop: 'auto',
          maxHeight: '30vh',
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'grid',
            gap: '0.8vh',
            gridTemplateColumns: 'repeat(2, 1fr)',
            maxWidth: '100%',
            margin: '0 auto',
            padding: '0 2%',
            transform: 'scale(0.85)',
            transformOrigin: 'center bottom'
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
    fontFeatureSettings: '"tnum" 1',
    position: 'relative',
    textShadow: `
      0 0 5px #A855F7,
      0 0 10px #A855F7,
      0 0 15px #8B5CF6,
      0 0 20px #7C3AED
    `,
    filter: 'drop-shadow(0 0 8px #8B5CF6) brightness(1.3)',
    animation: 'uvPulse 2s ease-in-out infinite alternate'
  }}>
    {children}
    <style jsx>{`
      @keyframes uvPulse {
        0% { filter: drop-shadow(0 0 8px #8B5CF6) brightness(1.3); }
        100% { filter: drop-shadow(0 0 15px #A855F7) brightness(1.5); }
      }
    `}</style>
  </div>
);

const InfoTile = ({ label, value, color = "#086143", isStatus = false }) => (
  <div style={{
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '0.8rem',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    padding: '0.6rem',
    margin: '0.1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{
        opacity: 0.8,
        marginBottom: '0.2rem',
        fontFamily: 'Oswald, sans-serif',
        fontSize: '0.6rem',
        textTransform: 'uppercase',
        letterSpacing: '0.05em'
      }}>
        {label}
      </div>
      <div style={{
        color,
        fontFamily: 'Questrial, sans-serif',
        fontWeight: 'bold',
        fontSize: '0.8rem',
        ...(isStatus && { letterSpacing: '0.05em' })
      }}>
        {value}
      </div>
    </div>
  </div>
);

export default LeapClock;