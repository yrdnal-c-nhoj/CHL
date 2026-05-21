import React, { useEffect } from 'react';
import {
  useClockTime,
  formatTime as formatClockTime,
} from '@/utils/clockUtils';

/**
 * Recycled Internet Clock (25-05-11)
 *
 * Features:
 * - Converted to a robust React/TypeScript component.
 * - Utilizes project-standard hooks for time synchronization.
 * - Employs exclusively in-line styles for a self-contained component.
 */
const Clock: React.FC = () => {
  // Synchronize time with millisecond precision
  const time = useClockTime('ms') || new Date();

  // Explicitly manage body background to prevent "white flash" or bleed
  useEffect(() => {
    document.body.style.backgroundColor = '#0a0a0a';
    document.body.classList.add('clock-mode');
    return () => {
      document.body.style.backgroundColor = '';
      document.body.classList.remove('clock-mode');
    };
  }, []);

  // Format the current time for display, providing a fallback to prevent null rendering
  const formatted = formatClockTime(time, '24h') || {
    hours: '00',
    minutes: '00',
    seconds: '00',
  };

  const { hours, minutes, seconds } = formatted;
  const title = 'Borrowed Time';
  const content = '';

  // Component-specific in-line styles
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    overflow: 'hidden',
    userSelect: 'none',
  };

  const displayBoxStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '3rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background:
      'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 80%)',
  };

  const titleStyle: React.CSSProperties = {
    fontSize: '0.8rem',
    letterSpacing: '0.4em',
    textTransform: 'uppercase',
    marginBottom: '2rem',
    opacity: 0.5,
  };

  const timeStyle: React.CSSProperties = {
    fontSize: 'clamp(3rem, 18vw, 12rem)',
    fontWeight: 300,
    fontVariantNumeric: 'tabular-nums', // Prevents digits from jumping
    display: 'flex', // Use flex to align children horizontally
    alignItems: 'baseline', // Align items to their baseline
  };

  const colonStyle: React.CSSProperties = {
    display: 'inline-block', // Required for transform to work
    transform: 'translateY(-0.15em)', // Adjust this value as needed to lift the colons
  };

  return (
    <main style={containerStyle}>
      <div style={displayBoxStyle}>
        <header style={titleStyle}>{title}</header>
        <time dateTime={`${hours}:${minutes}:${seconds}`} style={timeStyle}>
          <span>{hours}</span>
          <span style={colonStyle}>:</span>
          <span>{minutes}</span>
          <span style={colonStyle}>:</span>
          <span>{seconds}</span>
        </time>
        <footer style={{ marginTop: '2rem', opacity: 0.3, fontSize: '0.9rem' }}>
          {content}
        </footer>
      </div>
    </main>
  );
};

export default Clock;
