import { useState, useEffect } from 'react';

// Background imports
import backgroundImage from '../../assets/clocks/26-01-08/tang.jpeg';
import bgLayerTile from '../../assets/clocks/26-01-08/tan.webp'; 

// Number images
import num12 from '../../assets/clocks/26-01-08/12.webp';
import num1 from '../../assets/clocks/26-01-08/1.webp';
import num2 from '../../assets/clocks/26-01-08/2.webp';
import num3 from '../../assets/clocks/26-01-08/3.webp';
import num4 from '../../assets/clocks/26-01-08/4.webp';
import num5 from '../../assets/clocks/26-01-08/5.webp';
import num6 from '../../assets/clocks/26-01-08/6.webp';
import num7 from '../../assets/clocks/26-01-08/7.webp';
import num8 from '../../assets/clocks/26-01-08/8.webp';
import num9 from '../../assets/clocks/26-01-08/9.webp';
import num10 from '../../assets/clocks/26-01-08/10.webp';
import num11 from '../../assets/clocks/26-01-08/11.webp';

// Hand images
import hourHandImg from '../../assets/clocks/26-01-08/hour.webp';
import minuteHandImg from '../../assets/clocks/26-01-08/min.webp';
import secondHandImg from '../../assets/clocks/26-01-08/sec.webp';

const clockConfig = {
  colors: {
    centerDot: '#F2850037',
    border: 'rgba(0,0,0,0.1)'
  },
  sizes: {
    hourHand:   { width: 0.42,  height: 0.70 },
    minuteHand: { width: 1.80,  height: 1.20 },
    secondHand: { width: 0.68,  height: 1.00 },
    centerDot:  { width: 0.005, height: 0.005 }
  }
};

export default function TangerineClock() {
  const [time, setTime] = useState(new Date());

  const clockLabels = [num12, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11];

  useEffect(() => {
    let rafId;
    const update = () => {
      setTime(new Date());
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const ms      = time.getMilliseconds();
  const secDeg  = ((time.getSeconds() + ms / 1000) / 60) * 360;
  const minDeg  = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  const clockSize = Math.min(window.innerWidth, window.innerHeight) * 0.5;
  const radius    = clockSize * 0.8;
  const { colors, sizes } = clockConfig;

  const handStyle = (deg, sizeObj, z) => ({
    position: 'absolute',
    bottom: '50%',
    left: '50%',
    width:  clockSize * sizeObj.width,
    height: clockSize * sizeObj.height,
    transformOrigin: 'bottom center',
    transform: `translateX(-50%) rotate(${deg}deg)`,
    zIndex: z,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    pointerEvents: 'none'
  });

  const shadowFilter = 'drop-shadow(0 0 6px rgba(45, 18, 3, 0.9)) drop-shadow(0 0 12px rgba(236, 10, 10, 0.7))';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden', backgroundColor: '#1a0a02' }}>
      
      {/* --- TILED BACKGROUND LAYERS --- */}
      
      {/* Layer 1: Base Tiled Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '25% auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          transform: 'scale(1.1)',
          zIndex: 1
        }}
      />

      {/* Layer 2: Middle Tiled Image (with Offset or different size for depth) */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgLayerTile})`,
          // backgroundSize: '35% auto', // Slightly larger tile
          backgroundRepeat: 'repeat',
          backgroundPosition: '90px 90px', // Offset to prevent overlap with layer 1
          opacity: 0.9,
          zIndex: 2,
          pointerEvents: 'none'
        }}
      />

      {/* Layer 3: Top Tiled Image */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgLayerTile})`,
          backgroundSize: '15% auto', // Smaller tile for variety
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          // opacity: 0.3,
          zIndex: 3,
          pointerEvents: 'none'
        }}
      />

      {/* --- CLOCK FACE --- */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div style={{ position: 'relative', width: clockSize, height: clockSize }}>
          {clockLabels.map((label, i) => {
            const angle = (i + 1) * 30;
            const x = Math.sin(angle * Math.PI / 180) * radius;
            const y = -Math.cos(angle * Math.PI / 180) * radius;

            return (
              <img
                key={i}
                src={label}
                alt={`${(i + 1) % 12 || 12}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  width: clockSize * 0.425,
                  height: clockSize * 0.425,
                  objectFit: 'contain',
                  userSelect: 'none',
                  filter: shadowFilter
                }}
              />
            );
          })}

          <div style={handStyle(minDeg, sizes.minuteHand, 20)}>
            <img src={minuteHandImg} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: shadowFilter }} alt="minute hand" />
          </div>

          <div style={handStyle(hourDeg, sizes.hourHand, 10)}>
            <img
              src={hourHandImg}
              style={{
                width: '120%',
                height: '120%',
                objectFit: 'contain',
                filter: 'brightness(0.9) contrast(1.2) hue-rotate(20deg) saturate(0.8) ' + shadowFilter
              }}
              alt="hour hand"
            />
          </div>

          <div style={handStyle(secDeg, sizes.secondHand, 30)}>
            <img src={secondHandImg} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: shadowFilter }} alt="second hand" />
          </div>

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: clockSize * sizes.centerDot.width,
              height: clockSize * sizes.centerDot.height,
              backgroundColor: colors.centerDot,
              border: `1px solid ${colors.border}`,
              borderRadius: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 40
            }}
          />
        </div>
      </div>
    </div>
  );
}