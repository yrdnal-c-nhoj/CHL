import { useEffect, useState, useCallback } from 'react';
import squFontUrl from './squ.ttf'; // Adjust path or use ?url for bundlers
import bgImageUrl from './tho.webp'; // Ensure this file exists

const ThoughtBalloonClock = () => {
  const [time, setTime] = useState(new Date());
  const [bgImageError, setBgImageError] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const font = new FontFace('squ', `url(${squFontUrl})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontLoaded(true);
        console.log('Font loaded successfully');
      })
      .catch((error) => {
        console.error('Failed to load font:', error);
        setFontLoaded(false);
      });

    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getFormattedTime = useCallback(() => {
    let hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const hourStr = String(hours);
    const minuteStr = String(minutes).padStart(2, '0');
    return {
      hourTens: hourStr.length === 2 ? hourStr[0] : '',
      hourUnits: hourStr.length === 2 ? hourStr[1] : hourStr[0],
      minuteTens: minuteStr[0],
      minuteUnits: minuteStr[1],
      ampm,
    };
  }, [time]);

  const { hourTens, hourUnits, minuteTens, minuteUnits, ampm } = getFormattedTime();

  return (
    <div
      style={{
        position: 'relative',
        margin: 0,
        padding: 0,
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        fontSize: '3rem',
        fontFamily: fontLoaded ? 'squ, sans-serif' : 'sans-serif',
      }}
    >
      {/* SVG Pattern Layer */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#6d6d74',
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='12' viewBox='0 0 20 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 12c0-.622-.095-1.221-.27-1.785A5.982 5.982 0 0 0 10 12c1.67 0 3.182-.683 4.27-1.785A5.998 5.998 0 0 0 14 12h2a4 4 0 0 1 4-4V6c-1.67 0-3.182.683-4.27 1.785C15.905 7.22 16 6.622 16 6c0-.622-.095-1.221-.27-1.785A5.982 5.982 0 0 0 20 6V4a4 4 0 0 1-4-4h-2c0 .622.095 1.221.27 1.785A5.982 5.982 0 0 0 10 0C8.33 0 6.818.683 5.73 1.785 5.905 1.22 6 .622 6 0H4a4 4 0 0 1-4 4v2c1.67 0 3.182.683 4.27 1.785A5.998 5.998 0 0 1 4 6c0-.622.095-1.221.27-1.785A5.982 5.982 0 0 1 0 6v2a4 4 0 0 1 4 4h2zm-4 0a2 2 0 0 0-2-2v2h2zm16 0a2 2 0 0 1 2-2v2h-2zM0 2a2 2 0 0 0 2-2H0v2zm20 0a2 2 0 0 1-2-2h2v2zm-10 8a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z' fill='%231a0c52' fill-opacity='0.8' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '20px 12px',
          zIndex: 0,
        }}
      />

      {/* Background Image */}
      {bgImageUrl && !bgImageError ? (
        <img
          src={bgImageUrl}
          alt="background"
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100vw',
            height: '100vh',
            // objectFit: 'cover',
          
            zIndex: 1,
            pointerEvents: 'none',
          }}
          onError={() => setBgImageError(true)}
        />
      ) : (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f0f0f0',
            zIndex: 1,
          }}
        />
      )}

      {/* Clock */}
      <div
        style={{
          position: 'absolute',
          top: '45%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          background: 'rgba(255, 255, 255, 0.5)',
        }}
        aria-live="polite"
      >
        <div
          style={{
            color: '#49047DFF',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
            fontFamily: fontLoaded ? 'squ, sans-serif' : 'sans-serif',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div style={{ margin: '0 2px', fontSize: '3rem' }}>{hourTens}</div>
          <div style={{ margin: '0 2px', fontSize: '3rem' }}>{hourUnits}</div>
          <span>:</span>
          <div style={{ margin: '0 2px', fontSize: '3rem' }}>{minuteTens}</div>
          <div style={{ margin: '0 2px', fontSize: '3rem' }}>{minuteUnits}</div>
          <span> </span>
          <span>{ampm}</span>
        </div>
      </div>
    </div>
  );
};

export default ThoughtBalloonClock;