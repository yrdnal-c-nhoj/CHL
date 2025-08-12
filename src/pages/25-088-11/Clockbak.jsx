import React, { useState, useEffect } from 'react';

export default function DigitalClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return { hours, minutes, seconds };
  };

  const { hours, minutes, seconds } = formatTime(time);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 50%, #1a202c 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  };

  const clockStyle = {
    background: 'rgba(0, 0, 0, 0.4)',
    backdropFilter: 'blur(10px)',
    borderRadius: '24px',
    padding: '40px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.5)'
  };

  const desktopLayoutStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '30px'
  };

  const mobileLayoutStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '30px'
  };

  const timeUnitStyle = {
    textAlign: 'center'
  };

  const numberStyle = {
    fontSize: '4rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    background: 'linear-gradient(to bottom, #ffffff, #e2e8f0)',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: '0.1em',
    margin: '0'
  };

  const labelStyle = {
    fontSize: '0.75rem',
    fontWeight: '500',
    color: '#a0aec0',
    marginTop: '10px',
    letterSpacing: '0.2em'
  };

  const separatorStyle = {
    fontSize: '3.5rem',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.6)',
    animation: 'pulse 2s infinite'
  };

  // Media query logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Adjust font sizes for mobile
  const mobileNumberStyle = {
    ...numberStyle,
    fontSize: isMobile ? '3rem' : '4rem'
  };

  const mobileSeparatorStyle = {
    ...separatorStyle,
    fontSize: isMobile ? '2.5rem' : '3.5rem'
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.4; }
          }
        `}
      </style>
      <div style={clockStyle}>
        {!isMobile ? (
          // Desktop Layout
          <div style={desktopLayoutStyle}>
            <TimeUnit 
              value={hours} 
              label="HOURS" 
              numberStyle={mobileNumberStyle}
              labelStyle={labelStyle}
              timeUnitStyle={timeUnitStyle}
            />
            <div style={mobileSeparatorStyle}>:</div>
            <TimeUnit 
              value={minutes} 
              label="MINUTES" 
              numberStyle={mobileNumberStyle}
              labelStyle={labelStyle}
              timeUnitStyle={timeUnitStyle}
            />
            <div style={mobileSeparatorStyle}>:</div>
            <TimeUnit 
              value={seconds} 
              label="SECONDS" 
              numberStyle={mobileNumberStyle}
              labelStyle={labelStyle}
              timeUnitStyle={timeUnitStyle}
            />
          </div>
        ) : (
          // Mobile Layout - Stacked
          <div style={mobileLayoutStyle}>
            <TimeUnit 
              value={hours} 
              label="HOURS" 
              numberStyle={mobileNumberStyle}
              labelStyle={labelStyle}
              timeUnitStyle={timeUnitStyle}
            />
            <TimeUnit 
              value={minutes} 
              label="MINUTES" 
              numberStyle={mobileNumberStyle}
              labelStyle={labelStyle}
              timeUnitStyle={timeUnitStyle}
            />
            <TimeUnit 
              value={seconds} 
              label="SECONDS" 
              numberStyle={mobileNumberStyle}
              labelStyle={labelStyle}
              timeUnitStyle={timeUnitStyle}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TimeUnit({ value, label, numberStyle, labelStyle, timeUnitStyle }) {
  return (
    <div style={timeUnitStyle}>
      <div style={numberStyle}>
        {value}
      </div>
      <div style={labelStyle}>
        {label}
      </div>
    </div>
  );
}