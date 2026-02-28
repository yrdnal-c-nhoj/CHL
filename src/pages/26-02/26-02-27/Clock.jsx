import React, { useState, useEffect } from 'react';
import { materialOpacity } from 'three/src/nodes/accessors/MaterialNode.js';

const Clock = () => {
  const [videoSrc, setVideoSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        const videoModules = import.meta.glob('/src/assets/images/26-02/26-02-27/*.{mp4,MP4}', { eager: true });
        const videoUrls = Object.values(videoModules).map(module => module.default);
        if (videoUrls.length > 0) setVideoSrc(videoUrls[0]);
        setLoading(false);
      } catch (error) {
        console.error('Error loading video:', error);
        setLoading(false);
      }
    };
    loadVideo();
  }, []);

  const getClockAngles = () => {
    const hours = currentTime.getHours() % 12;
    const minutes = currentTime.getMinutes();
    const seconds = currentTime.getSeconds();
    return {
      hourAngle: (hours * 30) + (minutes * 0.5),
      minuteAngle: (minutes * 6),
      secondAngle: (seconds * 6)
    };
  };

  const { hourAngle, minuteAngle, secondAngle } = getClockAngles();

  // --- Styles ---
  const containerStyle = {
    width: '100vw',
    height: '100dvh',
    background: '#000',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  };

  const clockFaceStyle = {
    position: 'absolute',
    width: '320px',
    height: '320px',
    borderRadius: '50%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    opacity: '0.2'
  };

  // Radially aligned digits
  const digitStyle = (num) => {
    const rotation = num * 30; // 30 degrees per hour
    return {
      position: 'absolute',
      height: '100%', // Full height of the clock face to rotate from center
      paddingTop: '10px', // Distance from the outer edge
      display: 'flex',
      justifyContent: 'center',
      transform: `rotate(${rotation}deg)`,
      color: '#fff',
      fontFamily: "'Peralta', serif",
      fontSize: '28px',
      textShadow: '0 2px 10px rgba(0,0,0,0.8)'
    };
  };

  const handStyle = (angle, length, width, color) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: `${width}px`,
    height: `${length}px`,
    backgroundColor: color,
    borderRadius: '10px',
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${angle}deg)`,
  });

  if (loading || !videoSrc) {
    return (
      <div style={containerStyle}>
        <div style={{ color: 'white', fontFamily: 'monospace' }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Peralta&display=swap');
      `}</style>

      <video
        src={videoSrc}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        autoPlay loop muted playsInline
      />
      
      <div style={clockFaceStyle}>
        {/* Radial Digits */}
        {[12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((num) => (
          <div key={num} style={digitStyle(num)}>
            {num}
          </div>
        ))}
        
        {/* Hands */}
        <div style={handStyle(hourAngle, 80, 8, '#fff')} />
        <div style={handStyle(minuteAngle, 120, 5, '#fff')} />
        <div style={handStyle(secondAngle, 140, 2, '#ff4444')} />
        
        {/* Center Pin */}
        <div style={{
          width: '14px', height: '14px', borderRadius: '50%', 
          backgroundColor: '#fff', position: 'absolute', zIndex: 6,
          boxShadow: '0 0 10px rgba(0,0,0,0.5)'
        }} />
      </div>
    </div>
  );
};

export default Clock;