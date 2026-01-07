import { useState, useEffect } from 'react';
import backgroundImage from '../../assets/clocks/26-01-08/tang.jpeg';

// Number images (12 → 11 in clockwise order)
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

// Clock configuration
const clockConfig = {
  colors: {
    centerDot: '#F2850037'
  },
  sizes: {
    // Relative to clockSize
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

  // Time calculations (smooth seconds + ms)
  const ms      = time.getMilliseconds();
  const secDeg  = ((time.getSeconds()  + ms / 1000) / 60) * 360;
  const minDeg  = ((time.getMinutes()  + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  const clockSize = Math.min(window.innerWidth, window.innerHeight) * 0.5;
  const radius    = clockSize * 0.8;

  const { colors, sizes } = clockConfig;

  // Shared hand container style (pivot at bottom center)
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
    alignItems: 'flex-end'
  });

  // Drop-shadow style used for all hands & numbers (strong black outline)
  const shadowFilter = 'drop-shadow(0 0 6px rgba(45, 18, 3, 0.9)) drop-shadow(0 0 12px rgba(236, 10, 10, 0.7))';

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Tiled background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: '25% auto',
          backgroundRepeat: 'repeat',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          transform: 'scale(1.1)'
        }}
      />

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div style={{ position: 'relative', width: clockSize, height: clockSize }}>
          {/* Number labels (12 at top, clockwise) */}
          {clockLabels.map((label, i) => {
            const angle = (i + 1) * 30;           // 12 → 0°, 1 → 30°, ..., 11 → 330°
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

           {/* Minute Hand */}
          <div style={handStyle(minDeg, sizes.minuteHand, 20)}>
            <img
              src={minuteHandImg}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: shadowFilter
              }}
              alt="minute hand"
            />
          </div>
          {/* Hour Hand */}
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

         

          {/* Second Hand */}
          <div style={handStyle(secDeg, sizes.secondHand, 30)}>
            <img
              src={secondHandImg}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                filter: shadowFilter
              }}
              alt="second hand"
            />
          </div>

          {/* Center dot */}
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