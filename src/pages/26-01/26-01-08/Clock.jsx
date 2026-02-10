import { useState, useEffect, useMemo, useCallback } from 'react';

// Preload images
const preloadImages = (urls) => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise((resolve, reject) => {
          const img = new Image();
          img.onload = resolve;
          img.onerror = reject;
          img.src = url;
        })
    )
  );
};

// Background & Assets
import backgroundImage from '../../../assets/images/26-01-08/tang.jpeg';
import bgLayerTile from '../../../assets/images/26-01-08/tan.webp'; 
import num12 from '../../../assets/images/26-01-08/12.webp';
import num1 from '../../../assets/images/26-01-08/1.webp';
import num2 from '../../../assets/images/26-01-08/2.webp';
import num3 from '../../../assets/images/26-01-08/3.webp';
import num4 from '../../../assets/images/26-01-08/4.webp';
import num5 from '../../../assets/images/26-01-08/5.webp';
import num6 from '../../../assets/images/26-01-08/6.webp';
import num7 from '../../../assets/images/26-01-08/7.webp';
import num8 from '../../../assets/images/26-01-08/8.webp';
import num9 from '../../../assets/images/26-01-08/9.webp';
import num10 from '../../../assets/images/26-01-08/10.webp';
import num11 from '../../../assets/images/26-01-08/11.webp';
import hourHandImg from '../../../assets/images/26-01-08/hour.webp';
import minuteHandImg from '../../../assets/images/26-01-08/min.webp';
import secondHandImg from '../../../assets/images/26-01-08/seco.webp';

// --- CONSTANTS ---
const CLOCK_LABELS = [num12, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11];
const SHADOW_FILTER = 'drop-shadow(0 0 6px rgba(45, 18, 3, 0.9)) drop-shadow(0 0 12px rgba(236, 10, 10, 0.7))';

const CONFIG = {
  colors: {
    centerDot: '#F2850037',
    border: 'rgba(0,0,0,0.1)'
  },
  sizes: {
    hourHand:   { width: 0.42,  height: 0.70, z: 10 },
    minuteHand: { width: 1.80,  height: 1.20, z: 20 },
    secondHand: { width: 0.68,  height: 1.00, z: 30 },
    centerDot:  { width: 0.005, height: 0.005 }
  }
};

function TangerineClock() {
  const [time, setTime] = useState(() => new Date());
  const [isLoaded, setIsLoaded] = useState(false);
  const [clockSize, setClockSize] = useState(300); // Default size, will be updated
  const [isClient, setIsClient] = useState(false);
  const [bgReady, setBgReady] = useState(false);

  // Preload all images and set up resize handler
  useEffect(() => {
    setIsClient(true);
    
    // Preload all images
    const allImages = [
      backgroundImage, 
      bgLayerTile, 
      ...CLOCK_LABELS, 
      hourHandImg, 
      minuteHandImg, 
      secondHandImg
    ];
    
    const loadAssets = async () => {
      try {
        await preloadImages(allImages);
        setIsLoaded(true);
      } catch (err) {
        console.error('Error loading assets:', err);
        setIsLoaded(true); // Continue even if some assets fail to load
      }
    };
    
    loadAssets();
    
    // Set initial size
    updateClockSize();
    
    // Handle window resize with debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(updateClockSize, 100);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(resizeTimer);
    };
  }, []);

  // Separate preload for backgrounds to avoid flash
  useEffect(() => {
    const imgs = [backgroundImage, bgLayerTile];
    let loaded = 0;
    const done = () => {
      loaded += 1;
      if (loaded >= imgs.length) setBgReady(true);
    };
    imgs.forEach(src => {
      const img = new Image();
      img.onload = done;
      img.onerror = done;
      img.src = src;
    });
    const timeout = setTimeout(() => setBgReady(true), 1200);
    return () => clearTimeout(timeout);
  }, []);
  
  const updateClockSize = () => {
    if (typeof window !== 'undefined') {
      const size = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.7, 500);
      setClockSize(size);
    }
  };

  // Smooth animation using RAF
  useEffect(() => {
    if (!isClient) return;
    
    let rafId;
    let lastUpdate = 0;
    
    const update = (timestamp) => {
      if (!lastUpdate || timestamp - lastUpdate >= 16) { // ~60fps
        setTime(new Date());
        lastUpdate = timestamp;
      }
      rafId = requestAnimationFrame(update);
    };
    
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, [isClient]);

  // Calculate rotations
  const { secDeg, minDeg, hourDeg, radius } = useMemo(() => {
    const ms = time.getMilliseconds();
    return {
      secDeg: ((time.getSeconds() + ms / 1000) / 60) * 360,
      minDeg: ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360,
      hourDeg: ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360,
      radius: clockSize * 0.45
    };
  }, [time, clockSize]);

  // Shared Hand Styles
  const getHandStyle = (deg, sizeObj) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width: clockSize * sizeObj.width,
    height: clockSize * sizeObj.height,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: sizeObj.z,
    pointerEvents: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end'
  });

  // Set viewport meta tag
  useEffect(() => {
    if (typeof document !== 'undefined') {
      let viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        viewportMeta = document.createElement('meta');
        viewportMeta.name = 'viewport';
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, viewport-fit=cover, user-scalable=no';
        document.head.appendChild(viewportMeta);
      }
    }
  }, []);

  if (!isClient) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#1a0a02',
        zIndex: 1
      }} />
    );
  }

  const ready = isLoaded && bgReady;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      backgroundColor: '#1a0a02',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      touchAction: 'none',
      WebkitTapHighlightColor: 'transparent',
      WebkitTouchCallout: 'none',
      WebkitUserSelect: 'none',
      userSelect: 'none',
      opacity: ready ? 1 : 0,
      visibility: ready ? 'visible' : 'hidden',
      transition: 'opacity 0.5s ease-in-out'
    }}>

      {/* --- BACKGROUND LAYERS --- */}
      <div style={{ 
        position: 'absolute', 
        inset: 0, 
        zIndex: 1,
        opacity: ready ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        willChange: 'opacity'
      }}>
        <div style={{
          position: 'absolute',
          inset: -20, // Small bleed to prevent edges showing during scale
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '25% auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
        }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgLayerTile})`,
          backgroundRepeat: 'repeat',
          backgroundPosition: '90px 90px',
          opacity: 0.9,
        }} />
      </div>

      {/* --- CLOCK FACE CONTAINER --- */}
      <div style={{
        position: 'relative',
        width: clockSize,
        height: clockSize,
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: ready ? 1 : 0,
        transform: ready ? 'scale(1)' : 'scale(0.95)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
        willChange: 'opacity, transform'
      }}>
        
        {/* Numbers */}
        {CLOCK_LABELS.map((label, i) => {
          const angle = (i + 1) * 30;
          const x = Math.sin(angle * Math.PI / 180) * radius;
          const y = -Math.cos(angle * Math.PI / 180) * radius;

          return (
            <img
              key={i}
              src={label}
              alt=""
              style={{
                position: 'absolute',
                transform: `translate(${x}px, ${y}px)`,
                width: clockSize * 0.22,
                height: clockSize * 0.22,
                objectFit: 'contain',
                filter: SHADOW_FILTER,
                userSelect: 'none'
              }}
            />
          );
        })}

        {/* Hour Hand */}
        <div style={getHandStyle(hourDeg, CONFIG.sizes.hourHand)}>
          <img
            src={hourHandImg}
            style={{
              width: '100%',
              height: '50%',
              objectFit: 'contain',
              filter: `brightness(0.9) contrast(1.2) hue-rotate(-20deg) saturate(0.9) ${SHADOW_FILTER}`
            }}
            alt=""
          />
        </div>

        {/* Minute Hand */}
        <div style={getHandStyle(minDeg, CONFIG.sizes.minuteHand)}>
          <img 
            src={minuteHandImg} 
            style={{ width: '100%', height: '70%', objectFit: 'contain', filter: SHADOW_FILTER }} 
            alt="" 
          />
        </div>

        {/* Second Hand */}
        <div style={getHandStyle(secDeg, CONFIG.sizes.secondHand)}>
          <img 
            src={secondHandImg} 
            style={{ width: '100%', height: '80%', objectFit: 'contain', filter: SHADOW_FILTER }} 
            alt="" 
          />
        </div>

        {/* Center Dot */}
        <div style={{
            position: 'absolute',
            width: clockSize * CONFIG.sizes.centerDot.width,
            height: clockSize * CONFIG.sizes.centerDot.height,
            backgroundColor: CONFIG.colors.centerDot,
            border: `1px solid ${CONFIG.colors.border}`,
            borderRadius: '50%',
            zIndex: 100
        }} />
      </div>
    </div>
  );
}

export default TangerineClock;