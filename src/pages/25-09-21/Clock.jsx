import React, { useState, useEffect } from 'react';
import backgroundImage from './ccr.gif';

const fontUrl = './crush.ttf';

function Clock() {
  const [loaded, setLoaded] = useState(false);
  const [time, setTime] = useState(new Date());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fontStyle = document.createElement('style');
    fontStyle.textContent = `
      @font-face {
        font-family: 'StreamlineModerne';
        src: url('${fontUrl}') format('woff');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(fontStyle);
    return () => document.head.removeChild(fontStyle);
  }, []);

  useEffect(() => {
    const loadResources = async () => {
      await document.fonts.load('4rem "StreamlineModerne"');
      const image = new Image();
      image.src = backgroundImage;
      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
      });
      setLoaded(true);
    };
    loadResources();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!loaded) {
    return <div style={{ backgroundColor: 'black', width: '100vw', height: '100dvh', position: 'fixed', top: 0, left: 0, zIndex: 9999 }} />;
  }

  const hours = ((time.getHours() % 12) || 12).toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');

  const digitStyle = {
    display: 'inline-block',
    width: '3rem',
    textAlign: 'center',
    fontFamily: '"StreamlineModerne"',
    fontSize: '6rem',
    background: 'linear-gradient(180deg, #e0e0e0, #a0a0a0, #e0e0e0)',
    borderRadius: '1rem 1rem 0.5rem 0.5rem',
    boxShadow: '0 0.3rem 0.6rem rgba(0,0,0,0.4), inset 0 0.1rem 0.2rem rgba(255,255,255,0.5)',
    color: '#333',
    margin: '0.2rem',
    padding: '0.5rem 0',
    textShadow: '0 0.1rem 0.2rem rgba(255,255,255,0.3)',
  };

  const colonStyle = {
    fontSize: '6rem',
    margin: '0 0.5rem',
    color: '#333',
    textShadow: '0 0.1rem 0.2rem rgba(255,255,255,0.3)',
  };

  const containerStyle = {
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100dvh',
    width: '100vw',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'fixed',
    top: 0,
    left: 0,
    overflow: 'hidden',
  };

  const sectionStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: isMobile ? '1rem 0' : '0 1rem',
  };

  const renderDigits = (str) => str.split('').map((d, i) => <span key={i} style={digitStyle}>{d}</span>);

  const clockContent = isMobile ? (
    <>
      <div style={sectionStyle}>{renderDigits(hours)}</div>
      <div style={sectionStyle}>{renderDigits(minutes)}</div>
      <div style={sectionStyle}>{renderDigits(seconds)}</div>
    </>
  ) : (
    <div style={sectionStyle}>
      {renderDigits(hours)}
      <span style={colonStyle}>:</span>
      {renderDigits(minutes)}
      <span style={colonStyle}>:</span>
      {renderDigits(seconds)}
    </div>
  );

  return (
    <div style={containerStyle}>
      {clockContent}
    </div>
  );
}

export default Clock;