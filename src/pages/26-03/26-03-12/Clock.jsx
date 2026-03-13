import React, { useEffect, useState, useRef } from 'react';
import vrVideo from '../../../assets/images/26-03/26-03-12/vr.mp4';

const Clock = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  useEffect(() => {
    // Detect mobile devices
    const checkMobile = () => {
      setIsMobile(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
    };
    checkMobile();

    // Update time for analog clock
    const timeInterval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // Force auto-play on all platforms
    const attemptPlay = async () => {
      if (videoRef.current) {
        try {
          // Try multiple play attempts
          await videoRef.current.play();
        } catch (error) {
          console.log('Auto-play failed, trying again:', error);
          // Retry after a short delay
          setTimeout(() => {
            if (videoRef.current) {
              videoRef.current.play().catch(e => console.log('Retry failed:', e));
            }
          }, 100);
        }
      }
    };

    // Immediate play attempt
    attemptPlay();

    // Additional play attempts for mobile Chrome
    const playInterval = setInterval(() => {
      if (videoRef.current && videoRef.current.paused) {
        attemptPlay();
      } else {
        clearInterval(playInterval);
      }
    }, 500);

    // Clear interval after 5 seconds
    setTimeout(() => clearInterval(playInterval), 5000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(playInterval);
    };
  }, []);

  const handleVideoError = () => {
    setVideoError(true);
  };

  // Calculate analog clock hands
  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  
  const hourAngle = (hours * 30) + (minutes * 0.5) - 90;
  const minuteAngle = (minutes * 6) - 90;
  const secondAngle = (seconds * 6) - 90;

  if (videoError) {
    return (
      <div style={{
        width: '100vw',
        height: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '2rem'
      }}>
        <div>
          <div style={{
            fontSize: 'clamp(1.5rem, 5vw, 3rem)',
            marginBottom: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            VR Video Not Found
          </div>
          <div style={{
            fontSize: 'clamp(1rem, 3vw, 1.5rem)',
            opacity: 0.8,
            marginBottom: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            Please add vr.mp4 to the assets/images/26-03/26-03-12 folder
          </div>
          <div style={{
            fontSize: 'clamp(0.8rem, 2vw, 1rem)',
            opacity: 0.6,
            fontFamily: 'monospace',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '1rem',
            borderRadius: '8px',
            textAlign: 'left'
          }}>
            Place vr.mp4 in: /assets/images/26-03/26-03-12/vr.mp4
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      width: '100vw',
      height: '100dvh',
      position: 'relative',
      backgroundColor: '#000',
      overflow: 'hidden'
    }}>
      {/* VR Video */}
      <video
        ref={videoRef}
        src={vrVideo}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'fill',
          border: 'none'
        }}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={handleVideoError}
        onLoadStart={() => {
          // Force play when video starts loading
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Load start play failed:', e));
          }
        }}
        onLoadedData={() => {
          // Force play when data is loaded
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Loaded data play failed:', e));
          }
        }}
        onCanPlay={() => {
          // Force play when video can play
          if (videoRef.current) {
            videoRef.current.play().catch(e => console.log('Can play failed:', e));
          }
        }}
        title="VR Video"
      />
      
      {/* 70s Style Analog Clock - Left Side */}
      <div style={{
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        width: 'min(150px, 20vw)',
        height: 'min(150px, 20vw)',
        zIndex: 10,
        pointerEvents: 'none'
      }}>
        {/* Clock face with toned down 70s colors including green */}
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,200,0.2) 0%, rgba(150,200,255,0.15) 30%, rgba(255,200,150,0.1) 60%, rgba(200,150,255,0.08) 100%)',
          border: '2px solid rgba(150,255,150,0.4)',
          filter: 'blur(2px) brightness(1.1) saturate(1.2)',
          boxShadow: '0 0 20px rgba(150,255,150,0.5), inset 0 0 15px rgba(200,200,255,0.3), 0 0 10px rgba(255,200,150,0.3)'
        }} />
        
        {/* Hour hand with toned down colors */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '4px',
          height: '35%',
          background: 'linear-gradient(45deg, rgba(150,255,150,0.7), rgba(200,200,255,0.6))',
          transform: `translate(-50%, -100%) rotate(${hourAngle}deg)`,
          transformOrigin: 'center bottom',
          filter: 'blur(1.5px) brightness(1.1)',
          boxShadow: '0 0 6px rgba(150,255,150,0.7), 0 0 3px rgba(200,200,255,0.6)'
        }} />
        
        {/* Minute hand with toned down colors */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '3px',
          height: '45%',
          background: 'linear-gradient(45deg, rgba(255,220,150,0.7), rgba(200,150,255,0.6))',
          transform: `translate(-50%, -100%) rotate(${minuteAngle}deg)`,
          transformOrigin: 'center bottom',
          filter: 'blur(1.5px) brightness(1.1)',
          boxShadow: '0 0 6px rgba(255,220,150,0.7), 0 0 3px rgba(200,150,255,0.6)'
        }} />
        
        {/* Second hand with toned down colors */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '1.5px',
          height: '50%',
          background: 'linear-gradient(45deg, rgba(200,255,200,0.8), rgba(150,200,255,0.7), rgba(255,255,150,0.6))',
          transform: `translate(-50%, -100%) rotate(${secondAngle}deg)`,
          transformOrigin: 'center bottom',
          filter: 'blur(1px) brightness(1.2) saturate(1.5)',
          boxShadow: '0 0 4px rgba(200,255,200,0.8), 0 0 3px rgba(150,200,255,0.7)',
          animation: 'wobble 2s infinite ease-in-out'
        }} />
        
        {/* Center dot with toned down glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '10px',
          height: '10px',
          background: 'radial-gradient(circle, rgba(255,255,255,0.7) 0%, rgba(200,255,200,0.5) 50%, rgba(150,200,255,0.3) 100%)',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(1.5px) brightness(1.1)',
          boxShadow: '0 0 8px rgba(200,255,200,0.7), 0 0 5px rgba(150,200,255,0.5), 0 0 3px rgba(255,220,150,0.4)'
        }} />
        
        {/* Toned down 70s animation */}
        <style>{`
          @keyframes wobble {
            0%, 100% { transform: translate(-50%, -100%) rotate(${secondAngle}deg) scale(1) hue-rotate(0deg); }
            25% { transform: translate(-50%, -100%) rotate(${secondAngle + 1}deg) scale(1.02) hue-rotate(5deg); }
            50% { transform: translate(-50%, -100%) rotate(${secondAngle - 1}deg) scale(0.98) hue-rotate(-5deg); }
            75% { transform: translate(-50%, -100%) rotate(${secondAngle + 0.5}deg) scale(1.01) hue-rotate(2deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default Clock;
