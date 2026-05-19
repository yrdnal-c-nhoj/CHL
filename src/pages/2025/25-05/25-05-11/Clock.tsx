import React, { useMemo } from 'react';
import { useClockTime, formatTime as formatClockTime } from '@/utils/clockUtils';
import { useSuspenseFontLoader } from '@/utils/fontLoader';
import clockTax from './tax';

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
  const time = useClockTime('ms');

  // Setup font loading configuration (memoized)
  const fontConfigs = useMemo(() => [], []);
  useSuspenseFontLoader(fontConfigs);

  // Format the current time for display
  const { hours, minutes, seconds } = formatClockTime(time, '24h');

  // Component-specific in-line styles
  const containerStyle: React.CSSProperties = {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0a0a',
    color: '#e0e0e0',
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    overflow: 'hidden',
    userSelect: 'none',
  };

  const displayBoxStyle: React.CSSProperties = {
    textAlign: 'center',
    padding: '3rem',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0) 80%)',
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
  };

  return (
    <main style={containerStyle}>
      <div style={displayBoxStyle}>
        <header style={titleStyle}>{clockTax.title}</header>
        <time dateTime={`${hours}:${minutes}:${seconds}`} style={timeStyle}>
          {hours}:{minutes}:{seconds}
        </time>
        <footer style={{ marginTop: '2rem', opacity: 0.3, fontSize: '0.9rem' }}>
          {clockTax.content}
        </footer>
      </div>
    </main>
  );
};

export default Clock;