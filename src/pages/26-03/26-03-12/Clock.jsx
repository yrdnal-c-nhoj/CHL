import React, { useState, useEffect, useRef } from 'react';
import cocteauVideo from '../../../assets/images/26-03/26-03-12/vr.mp4';


const VirtualClock = () => {
  const [time, setTime] = useState(new Date());
  const videoRef = useRef(null);

  useEffect(() => {
    // 1. Precise Clock Timer
    const timer = setInterval(() => setTime(new Date()), 1000);
    
    // 2. Mobile Autoplay Force
    // React's 'muted' prop can fail on mount; setting it via ref 
    // guarantees the browser sees it as muted before play() is called.
    if (videoRef.current) {
      videoRef.current.muted = true; 
      videoRef.current.play().catch((err) => {
        console.warn("Autoplay blocked by browser/battery saver:", err);
      });
    }

    return () => clearInterval(timer);
  }, []);

  const seconds = time.getSeconds();
  const minutes = time.getMinutes();
  const hours = time.getHours() % 12;

  const secondAngle = seconds * 6;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const hourAngle = hours * 30 + minutes * 0.5;


  return (
    <div style={{
      width: '100vw', height: '100dvh', position: 'relative',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
      backgroundColor: '#000' // Prevents white flash while video loads
    }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          objectFit: 'cover', opacity: 0.9, zIndex: 1
        }}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
      >
        <source src={cocteauVideo} type="video/mp4" />
      </video>

   
    </div>
  );
};

export default VirtualClock;