// DigitalBlobClock.jsx. chatgpt version
import React, { useEffect, useState, useRef } from 'react';
import bg from './app.webp'; // <-- background image in same folder
import font_2025_11_23 from './day.ttf'; // <-- font file in same folder; variable includes today's date

/**
 * DigitalBlobClock
 *
 * Props:
 *  - fontFamily (string) : font-family name to register (default: 'BlobDigital')
 *  - fontWeight (string|number)
 *  - fontStyle (string)
 *  - sizeVh (number) : base font size in vh for digits (default 10)
 *  - boxVh (number) : height of each digit box in vh (default 14)
 *  - spacingVw (number) : gap between boxes in vw (default 1.2)
 *  - skewX (number) : degrees to skew X (default -8)
 *  - skewY (number) : degrees to skew Y (default 6)
 *  - rotateDeg (number) : degrees to rotate (default -3)
 *  - scale (number) : scale multiplier (default 1)
 *  - borderRadiusVh (number) : box border radius in vh (default 3)
 *  - separator (string) : time separator, default ':'
 *  - distortPerIndex (boolean) : whether to vary distortion per box (default: true)
 *  - showSeconds (boolean) : show seconds box (default true)
 */
export default function DigitalBlobClock({
  fontFamily = 'BlobDigital',
  fontWeight = '600',
  fontStyle = 'normal',
  sizeVh = 10,
  boxVh = 14,
  spacingVw = 1.2,
  skewX = -8,
  skewY = 6,
  rotateDeg = -3,
  scale = 1,
  borderRadiusVh = 3,
  separator = ':',
  distortPerIndex = true,
  showSeconds = true,
}) {
  const [time, setTime] = useState(getTimeParts());
  const styleTagRef = useRef(null);

  // Insert @font-face programmatically (scoped cleanup on unmount)
  useEffect(() => {
    const rule = `
      @font-face {
        font-family: '${fontFamily}';
        src: url('${font_2025_11_23}') format('woff2');
        font-weight: ${fontWeight};
        font-style: ${fontStyle};
        font-display: swap;
      }
    `;
    const styleTag = document.createElement('style');
    styleTag.setAttribute('data-digital-blob-clock', 'true');
    styleTag.textContent = rule;
    document.head.appendChild(styleTag);
    styleTagRef.current = styleTag;

    return () => {
      if (styleTagRef.current && styleTagRef.current.parentNode) {
        styleTagRef.current.parentNode.removeChild(styleTagRef.current);
      }
    };
  }, [fontFamily, fontWeight, fontStyle]);

  // Clock updater
  useEffect(() => {
    const t = setInterval(() => setTime(getTimeParts()), 250); // update 4x/s for crisp second transitions
    return () => clearInterval(t);
  }, []);

  // Build display array: each char gets its own box
  const displayStr = buildDisplayString(time, showSeconds, separator);
  const chars = displayStr.split('');

  // Container inline styles
  const containerStyle = {
    boxSizing: 'border-box',
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundImage: `url(${bg})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    padding: '4vh',
    fontFamily: fontFamily + ', system-ui, -apple-system, "Segoe UI", Roboto',
  };

  // Row wrapper
  const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: `${spacingVw}vw`,
    backdropFilter: 'none',
  };

  // Digit box base style
  const baseBoxStyle = {
    height: `${boxVh}vh`,
    minWidth: `${boxVh * 0.8}vh`,
    padding: `${boxVh * 0.12}vh ${boxVh * 0.8 * 0.16}vh`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: `${borderRadiusVh}vh`,
    // subtle translucent box to show shape
    background: 'rgba(255,255,255,0.08)',
    boxShadow: '0 0.4vh 1.2vh rgba(0,0,0,0.35) inset, 0 0.8vh 2vh rgba(0,0,0,0.25)',
    backdropFilter: 'blur(0.6vh)',
    WebkitBackdropFilter: 'blur(0.6vh)',
    overflow: 'hidden',
  };

  const charStyleBase = {
    fontSize: `${sizeVh}vh`,
    lineHeight: '1',
    transformOrigin: '50% 50%',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '0.04em',
  };

  // Make small helper to compute per-index distortion
  const computeTransform = (idx) => {
    if (!distortPerIndex) {
      return `skew(${skewX}deg, ${skewY}deg) rotate(${rotateDeg}deg) scale(${scale})`;
    }
    // vary slightly by index so boxes "curve and swoop" visually (not animated)
    const wave = Math.sin(idx * 0.7);
    const kSkewX = skewX + wave * 6; // +/- variation
    const kSkewY = skewY - wave * 4;
    const kRot = rotateDeg + wave * 3;
    const kScale = scale + wave * 0.02;
    const translateY = wave * -1.2; // vh-ish, use translate in vh via calc
    return `translateY(${translateY}vh) skew(${kSkewX}deg, ${kSkewY}deg) rotate(${kRot}deg) scale(${kScale})`;
  };

  // Special style for separator (smaller, centered)
  const separatorCharStyle = {
    ...charStyleBase,
    fontSize: `${Math.max(0.6, sizeVh * 0.55)}vh`,
    opacity: 0.95,
  };

  // AM/PM style
  const ampmStyle = {
    ...charStyleBase,
    fontSize: `${Math.max(0.6, sizeVh * 0.5)}vh`,
    transform: 'none',
    opacity: 0.95,
    textTransform: 'uppercase',
  };

  return (
    <div style={containerStyle} aria-label="Digital blob clock">
      <div style={rowStyle}>
        {chars.map((ch, idx) => {
          // treat letters (A M P) specially
          const isSeparator = ch === separator;
          const isAlpha = /[APMapm]/.test(ch);
          // small individual box style variation
          const boxStyle = {
            ...baseBoxStyle,
            // slightly different background for separators/AMPM
            background: isSeparator ? 'rgba(0,0,0,0.12)' : isAlpha ? 'rgba(255,255,255,0.06)' : baseBoxStyle.background,
            transform: computeTransform(idx),
            transition: 'transform 300ms ease-out',
            // prevent inherited fonts/line heights escaping:
            fontFamily: fontFamily,
            boxSizing: 'border-box',
          };

          const charStyle = isSeparator ? separatorCharStyle : isAlpha ? ampmStyle : charStyleBase;

          return (
            <div
              key={idx}
              style={boxStyle}
              aria-hidden={false}
              title={isAlpha ? ch.toUpperCase() : undefined}
            >
              <span style={charStyle}>{ch}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Helper functions ---------- */

function getTimeParts() {
  const now = new Date();
  let hours = now.getHours();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  let hour12 = hours % 12;
  if (hour12 === 0) hour12 = 12; // no leading zeros rule, so we keep plain number
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();
  return { hour12, minutes, seconds, ampm };
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n);
}

function buildDisplayString(timeParts, showSeconds = true, separator = ':') {
  // Example desired format: "1:23:45 PM" or "1:23 PM" (no leading zero in hour)
  const h = String(timeParts.hour12); // no leading zero for hours
  const m = pad2(timeParts.minutes);
  const s = pad2(timeParts.seconds);
  const ampm = timeParts.ampm;
  if (showSeconds) {
    return `${h}${separator}${m}${separator}${s} ${ampm}`;
  }
  return `${h}${separator}${m} ${ampm}`;
}
