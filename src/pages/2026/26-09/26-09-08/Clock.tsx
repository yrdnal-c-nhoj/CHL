import React, { useState, useEffect } from 'react';
import backgroundVideo from '@/assets/images/26_images/26-09/26-09-08/beachnite.webm?url';

export const assets = [backgroundVideo];

// Pure CSS digital/analog clock styled to match a night beach atmosphere
const Clock_26_09_02 = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <main style={styles.container}>
      {/* Dynamic Night Beach Video Background */}
      <video
        style={styles.backgroundVideo}
        src={backgroundVideo}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Moon overlay */}
      <div style={styles.moon} />
      <div style={styles.horizonGlow} />

      {/* Clock Display Card */}
      <div style={styles.clockCard}>
        <div style={styles.timeDisplay}>{formatTime(time)}</div>
        <div style={styles.dateDisplay}>{formatDate(time)}</div>
      </div>
    </main>
  );
};

const styles = {
  container: {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#050B14',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    zIndex: 1,
    opacity: 0.8,
  },
  moon: {
    position: 'absolute',
    top: '15%',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    backgroundColor: '#E8F1F5',
    boxShadow: '0 0 50px 10px rgba(232, 241, 245, 0.4), 0 0 100px 20px rgba(100, 180, 220, 0.2)',
    zIndex: 2,
  },
  horizonGlow: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '40%',
    background: 'linear-gradient(180deg, rgba(5,11,20,0) 0%, rgba(10,35,60,0.5) 100%)',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 2,
  },
  clockCard: {
    position: 'relative',
    zIndex: 3,
    padding: '2.5rem 4rem',
    borderRadius: '24px',
    background: 'rgba(5, 11, 20, 0.45)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
  },
  timeDisplay: {
    fontSize: 'clamp(2.5rem, 8vw, 5rem)',
    fontWeight: '300',
    color: '#E8F1F5',
    letterSpacing: '2px',
    textShadow: '0 0 20px rgba(232, 241, 245, 0.5)',
  },
  dateDisplay: {
    marginTop: '0.5rem',
    fontSize: 'clamp(1rem, 2vw, 1.25rem)',
    fontWeight: '400',
    color: '#8CA0BA',
    textTransform: 'uppercase',
    letterSpacing: '3px',
  },
} as const;

Clock_26_09_02.displayName = 'Clock_26_09_02';

export default Clock_26_09_02;