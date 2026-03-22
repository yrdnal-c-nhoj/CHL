import React, { useEffect, useState, useMemo } from 'react';
import { useSuspenseFontLoader } from '../utils/fontLoader';

// Template uses existing project assets so it looks consistent with other clocks.
// Swap these imports for different fonts / images when making a new clock.
import digitalBgImage from '../assets/images/25-11/25-11-18/eyes.webp';
import fontUrl from '../assets/fonts/25-11-18-cat.ttf?url';

// Define the font family name to be used in styles
const FONT_FAMILY = 'ClockFont_Sample_Cat';

/**
 * DigitalClockTemplate
 *
 * A future-proof, React-first digital clock template that:
 * - Uses standardized font loading hooks
 * - Updates time with React state (no manual DOM manipulation)
 * - Scales to full viewport and stays responsive
 * - Is easy to customize (colors, layout, 12/24 hr mode, etc.)
 *
 * Usage:
 * - Copy this file when creating a new clock or import the component into a page-level Clock.jsx.
 * - Replace the background image import above with your own asset.
 * - Tweak the CONFIG object for quick style changes.
 * - Orbitron font is loaded via Google Fonts in index.html
 */

const CONFIG = {
  use24Hour: false, // flip to true for 24h mode
  showSeconds: true,
};

const DigitalClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  
  // Load the sample custom font
  const fontConfigs = useMemo(() => [
    { fontFamily: FONT_FAMILY, fontUrl }
  }], []);
  useSuspenseFontLoader(fontConfigs);

  // Time ticker using requestAnimationFrame for smooth updates (if showing seconds)
  useEffect(() => {
    let frameId;
    const tick = () => {
      setTime(new Date());
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const formatTimeParts = (date) => {
    const hours24 = date.getHours();
    const hours = CONFIG.use24Hour ? hours24 : hours24 % 12 || 12;
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const pad = (n) => String(n).padStart(2, '0');

    return {
      hh: pad(hours),
      mm: pad(minutes),
      ss: pad(seconds),
    };
  };

  const { hh, mm, ss } = formatTimeParts(time);

  const containerStyle = {
    boxSizing: 'border-box',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundImage: `url(${digitalBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: FONT_FAMILY,
  };

  const clockWrapperStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1.5rem 2rem',
    borderRadius: '1.25rem',
    background: 'rgba(0, 0, 0, 0.60)',
    backdropFilter: 'blur(16px) saturate(140%)',
    WebkitBackdropFilter: 'blur(16px) saturate(140%)',
    boxShadow: '0 1.5rem 3rem rgba(0, 0, 0, 0.6)',
  };

  const timeRowStyle = {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: '0.75rem',
    fontVariantNumeric: 'tabular-nums',
  };

  const segmentStyle = {
    display: 'flex',
    gap: '0.15em',
  };

  const digitBoxStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '0.8em',
    padding: '0.15em 0.18em',
    borderRadius: '0.25em',
    background: 'linear-gradient(145deg, #F5EFDFFF, #D8D1C1FF)',
    color: '#2C2A2A',
    fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
    lineHeight: 1,
    boxShadow: '0.18rem 0.18rem 0.6rem rgba(0, 0, 0, 0.4)',
  };

  const separatorStyle = {
    alignSelf: 'center',
    fontSize: 'clamp(2.8rem, 7vw, 4.2rem)',
    color: 'rgba(245, 239, 223, 0.8)',
    padding: '0 0.1em',
  };

  return (
    <div style={containerStyle}>
      <div style={clockWrapperStyle}>
        <div style={timeRowStyle}>
          {/* Hours */}
          <div style={segmentStyle}>
            <span style={digitBoxStyle}>{hh[0]}</span>
            <span style={digitBoxStyle}>{hh[1]}</span>
          </div>

          <span style={separatorStyle}>:</span>

          {/* Minutes */}
          <div style={segmentStyle}>
            <span style={digitBoxStyle}>{mm[0]}</span>
            <span style={digitBoxStyle}>{mm[1]}</span>
          </div>

          {CONFIG.showSeconds && (
            <>
              <span style={separatorStyle}>:</span>
              <div style={segmentStyle}>
                <span style={digitBoxStyle}>{ss[0]}</span>
                <span style={digitBoxStyle}>{ss[1]}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DigitalClockTemplate;
