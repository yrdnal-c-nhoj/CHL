import React, { useEffect, useState } from 'react';

// Template uses existing project assets so it feels native to the current clocks.
// Swap these imports for different fonts / images when making a new clock.
import analogFontUrl from '../assets/fonts/25-09-10-lava.otf?url';
import analogBgImage from '../assets/clocks/25-09-10/bg.webp';

/**
 * AnalogClockTemplate
 *
 * A clean, React-driven analog clock that:
 * - Uses React state for time (no manual DOM querying or mutation)
 * - Uses existing clock assets for background and font
 * - Scales responsively using vmin units
 * - Keeps all styling scoped to this component
 *
 * Usage:
 * - Copy this file when creating a new analog clock or import the component into a page-level Clock.jsx.
 * - Replace font/background imports above with your own assets.
 * - Tweak sizes/colors in the STYLE_CONFIG object below.
 */

const STYLE_CONFIG = {
  tickColor: '#EA81E0FF',
  faceOverlayColor: 'rgba(0, 0, 0, 0.25)',
  centerDotColor: '#ffffff',
};

const AnalogClockTemplate = () => {
  const [time, setTime] = useState(new Date());
  const [fontReady, setFontReady] = useState(false);

  // Load custom font once on mount
  useEffect(() => {
    const font = new FontFace('BorrowedAnalog', `url(${analogFontUrl})`);
    font
      .load()
      .then((loadedFont) => {
        document.fonts.add(loadedFont);
        setFontReady(true);
      })
      .catch(() => setFontReady(true));
  }, []);

  // Time ticker
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes() + seconds / 60;
  const hours = time.getHours() % 12 + minutes / 60;

  const secondDeg = (seconds / 60) * 360;
  const minuteDeg = (minutes / 60) * 360;
  const hourDeg = (hours / 12) * 360;

  const containerStyle = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    backgroundImage: `url(${analogBgImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    fontFamily: fontReady ? "'BorrowedAnalog', system-ui, sans-serif" : 'system-ui, sans-serif',
  };

  const faceOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: STYLE_CONFIG.faceOverlayColor,
    backdropFilter: 'blur(6px) saturate(130%)',
    WebkitBackdropFilter: 'blur(6px) saturate(130%)',
  };

  const faceContainerStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80vmin',
    height: '80vmin',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.95), rgba(0,0,0,0.6))',
    boxShadow:
      '0 1.5rem 3rem rgba(0,0,0,0.7), inset 0 0 0.3rem rgba(255,255,255,0.7), inset 0 0 3rem rgba(0,0,0,0.6)',
    overflow: 'hidden',
  };

  const ticksLayerStyle = {
    position: 'absolute',
    inset: 0,
  };

  const handBaseStyle = {
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    transformOrigin: '50% 100%',
    borderRadius: '999px',
  };

  const hourHandStyle = {
    ...handBaseStyle,
    width: '0.9vmin',
    height: '22vmin',
    background:
      'linear-gradient(to top, #eaeaea, #ffffff, #c0c0c0, #ffffff, #888888)',
    transform: `translate(-50%, 0) rotate(${hourDeg}deg)`,
    boxShadow: '0 0.2rem 0.5rem rgba(0,0,0,0.7)',
  };

  const minuteHandStyle = {
    ...handBaseStyle,
    width: '0.7vmin',
    height: '30vmin',
    background:
      'linear-gradient(to top, #f0f0f0, #ffffff, #d0d0d0)',
    transform: `translate(-50%, 0) rotate(${minuteDeg}deg)`,
    boxShadow: '0 0.2rem 0.4rem rgba(0,0,0,0.6)',
  };

  const secondHandStyle = {
    ...handBaseStyle,
    width: '0.3vmin',
    height: '34vmin',
    background: 'linear-gradient(to top, #ff4b5c, #ffb199)',
    transform: `translate(-50%, 0) rotate(${secondDeg}deg)`,
    boxShadow: '0 0.3rem 0.6rem rgba(0,0,0,0.7)',
  };

  const centerDotStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: '2.8vmin',
    height: '2.8vmin',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    background: STYLE_CONFIG.centerDotColor,
    boxShadow:
      '0 0.3rem 0.9rem rgba(0,0,0,0.7), inset 0 0.1rem 0.3rem rgba(0,0,0,0.5)',
  };

  const numeralStyleBase = {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    color: STYLE_CONFIG.tickColor,
    fontSize: '4vmin',
    textShadow: '0.4rem 0 0.5rem rgba(0,0,0,0.7)',
  };

  const numerals = Array.from({ length: 12 }, (_, i) => i + 1);

  const renderNumerals = () => {
    const radiusPercent = 40;
    return numerals.map((num) => {
      const angle = (num / 12) * 2 * Math.PI;
      const x = 50 + radiusPercent * Math.sin(angle);
      const y = 50 - radiusPercent * Math.cos(angle);
      return (
        <div
          key={num}
          style={{
            ...numeralStyleBase,
            left: `${x}%`,
            top: `${y}%`,
          }}
        >
          {num}
        </div>
      );
    });
  };

  const renderMinuteTicks = () => {
    const ticks = Array.from({ length: 60 }, (_, i) => i);
    return ticks.map((t) => {
      const angle = (t / 60) * 360;
      const isHourMarker = t % 5 === 0;
      const length = isHourMarker ? 6 : 3;
      const thickness = isHourMarker ? 0.4 : 0.2;

      return (
        <div
          key={t}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: `${thickness}vmin`,
            height: `${length}vmin`,
            backgroundColor: isHourMarker
              ? STYLE_CONFIG.tickColor
              : 'rgba(234, 129, 224, 0.5)',
            transformOrigin: '50% 100%',
            transform: `translate(-50%, -100%) rotate(${angle}deg)`,
            borderRadius: '999px',
            boxShadow: isHourMarker
              ? '0 0.15rem 0.35rem rgba(0,0,0,0.5)'
              : 'none',
          }}
        />
      );
    });
  };

  return (
    <div style={containerStyle}>
      <div style={faceOverlayStyle} />
      <div style={faceContainerStyle}>
        <div style={ticksLayerStyle}>{renderMinuteTicks()}</div>
        {renderNumerals()}
        <div style={hourHandStyle} />
        <div style={minuteHandStyle} />
        <div style={secondHandStyle} />
        <div style={centerDotStyle} />
      </div>
    </div>
  );
};

export default AnalogClockTemplate;
