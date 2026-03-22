import React, { useState, useEffect, useMemo } from 'react';
import { useSecondClock } from '../../../utils/useSmoothClock';

const styles = {
  container: {
    width: '100vw',
    height: '100dvh',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0F0F0F',
    color: '#E0E0E0',
    fontFamily: 'Inter, system-ui, sans-serif',
    overflow: 'hidden',
  },
  time: {
    fontSize: 'clamp(3rem, 15vw, 12rem)',
    fontWeight: 700,
    lineHeight: 1,
    letterSpacing: '-0.04em',
    fontVariantNumeric: 'tabular-nums',
  },
  date: {
    fontSize: 'clamp(1rem, 3vw, 2rem)',
    marginTop: '2vh',
    opacity: 0.6,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
  },
};

export default function MinimalClock() {
  const time = useSecondClock();


  const { timeStr, dateStr } = useMemo(() => {
    const h = String(time.getHours()).padStart(2, '0');
    const m = String(time.getMinutes()).padStart(2, '0');
    const s = String(time.getSeconds()).padStart(2, '0');
    
    return {
      timeStr: `${h}:${m}:${s}`,
      dateStr: time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    };
  }, [time]);

  return (
    <div style={styles.container}>
      <div style={styles.time}>{timeStr}</div>
      <div style={styles.date}>{dateStr}</div>
    </div>
  );
}
