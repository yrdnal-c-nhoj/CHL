import React, { useEffect, useMemo, useState } from 'react';
import bgImageUrl_2025_11_10 from './eye.gif';
import digitFont_2025_11_10 from './eye.ttf';

export default function Clock({ imageWidth = '14vw', imageHeight = '11vw' }) {
  const [now, setNow] = useState(() => new Date());
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setNow(new Date());
      setElapsedMs(Date.now() - start);
    }, 16);
    return () => clearInterval(interval);
  }, []);

  const formatHMS = useMemo(() => {
    return (ms) => {
      const totalSeconds = Math.floor(ms / 1000);
      const h = Math.floor(totalSeconds / 3600);
      const m = Math.floor((totalSeconds % 3600) / 60);
      const s = Math.floor(totalSeconds % 60);
      const msPart = Math.floor(ms % 1000);
      return `${h}:${m}:${s}.${msPart}`;
    };
  }, []);

  const pad2 = (n) => n.toString().padStart(2, '0');
  const clock = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(now.getSeconds())}`;

  const digitsFontFamilyName = 'DigitsFont-2025-11-10';

  const wrapperStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    width: '100vw',
    position: 'relative',
    overflow: 'hidden',
  };

  const bgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
    pointerEvents: 'none',
    backgroundColor: '#0b0b0d',
    overflow: 'hidden',
  };

  const bgGridStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'grid',
    gridTemplateColumns: `repeat(30, ${imageWidth})`,
    gridAutoRows: `${imageHeight}`,
    marginLeft: `calc(-1 * ${imageWidth} / 2)`,
    marginTop: `calc(-1 * ${imageHeight} / 2)`,
  };

  const tileStyleBase = {
    width: `${imageWidth}`,
    height: `${imageHeight}`,
    backgroundImage: `url(${bgImageUrl_2025_11_10})`,
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100% 100%',
    willChange: 'transform',
  };

  const renderCheckerboardBG = () => {
    const tiles = [];
    const rows = 30;
    const cols = 30;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const flip = (r + c) % 2 === 1;
        tiles.push(
          <div
            key={`${r}-${c}`}
            style={{
              ...tileStyleBase,
              transform: flip ? 'scaleX(-1)' : 'none',
            }}
          />
        );
      }
    }
    return <div style={bgGridStyle}>{tiles}</div>;
  };

  const panelStyle = {
    position: 'relative',
    zIndex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: '1.2vh',
    padding: '3vh 4vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2vh',
  };


  const digitsRowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '1vh',
  };

  const digitBoxStyle = {
    fontFamily: `'${digitsFontFamilyName}', sans-serif`,
    color: '#ffffff',
    fontWeight: 700,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.1vh',
    fontSize: '6.5vh',
    lineHeight: '7vh',
    width: '6vh',
    height: '8vh',
    borderRadius: '0.8vh',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const colonBoxStyle = {
    ...digitBoxStyle,
    width: '2.6vh',
    fontSize: '6vh',
  };

  const dotBoxStyle = {
    ...digitBoxStyle,
    width: '2.6vh',
    fontSize: '6vh',
  };

  const renderBoxed = (text) => (
    <span style={digitsRowStyle}>
      {text.split('').map((ch, i) => (
        <span key={i} style={ch === ':' ? colonBoxStyle : digitBoxStyle}>
          {ch}
        </span>
      ))}
    </span>
  );

  const renderTimerBoxed = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);
    const msPart = Math.floor(ms % 1000);
    const mStr = m.toString().padStart(2, '0');
    const sStr = s.toString().padStart(2, '0');
    const msStr = msPart.toString().padStart(3, '0');
    const parts = [];
    if (h > 0) {
      h.toString().split('').forEach((d) => {
        parts.push({ ch: d, type: 'digit', visible: true });
      });
      parts.push({ ch: ':', type: 'colon', visible: true });
    }
    mStr.split('').forEach((d, i) => {
      const leading = (i === 0 && d === '0') || (i === 1 && m === 0 && h === 0);
      parts.push({ ch: d, type: 'digit', visible: !leading });
    });
    parts.push({ ch: ':', type: 'colon', visible: h > 0 || m > 0 });
    sStr.split('').forEach((d, i) => {
      const leading = i === 0 && d === '0' && s < 10 && h === 0 && m === 0;
      parts.push({ ch: d, type: 'digit', visible: !leading });
    });
    parts.push({ ch: '.', type: 'dot', visible: true });
    msStr.split('').forEach((d, i) => {
      const leading = (i === 0 && d === '0' && msPart < 100) || (i === 1 && d === '0' && msPart < 10);
      parts.push({ ch: d, type: 'digit', visible: !leading });
    });
    return (
      <span style={digitsRowStyle}>
        {parts.map((p, i) => (
          <span
            key={i}
            style={{
              ...(p.type === 'colon' ? colonBoxStyle : p.type === 'dot' ? dotBoxStyle : digitBoxStyle),
              opacity: p.visible ? 1 : 0,
            }}
          >
            {p.ch}
          </span>
        ))}
      </span>
    );
  };


  return (
    <div style={wrapperStyle}>
      <div style={bgStyle}>{renderCheckerboardBG()}</div>
      <style>{`
        @font-face {
          font-family: '${digitsFontFamilyName}';
          src: url(${digitFont_2025_11_10}) format('truetype');
          font-weight: 100 900;
          font-style: normal;
          font-display: swap;
        }
      `}</style>
      <div style={panelStyle}>
        {renderBoxed(clock)}
        {renderTimerBoxed(elapsedMs)}
      </div>
    </div>
  );
}