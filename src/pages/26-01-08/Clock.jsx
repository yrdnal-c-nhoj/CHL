import { useState, useEffect } from 'react';
import backgroundImage from '../../assets/clocks/26-01-08/tang.jpeg';

// Number images
import num11 from '../../assets/clocks/26-01-08/12.webp';
import num12 from '../../assets/clocks/26-01-08/1.webp';
import num1 from '../../assets/clocks/26-01-08/2.webp';
import num2 from '../../assets/clocks/26-01-08/3.webp';
import num3 from '../../assets/clocks/26-01-08/4.webp';
import num4 from '../../assets/clocks/26-01-08/5.webp';
import num5 from '../../assets/clocks/26-01-08/6.webp';
import num6 from '../../assets/clocks/26-01-08/7.webp';
import num7 from '../../assets/clocks/26-01-08/8.webp';
import num8 from '../../assets/clocks/26-01-08/9.webp';
import num9 from '../../assets/clocks/26-01-08/10.webp';
import num10 from '../../assets/clocks/26-01-08/11.webp';

// Clock configuration
const clockConfig = {
  colors: {
    hourHand: '#F28500',
    minuteHand: '#F28500',
    secondHand: '#F28500',
    centerDot: '#F28500',
    border: '#fff'
  },
  sizes: {
    hourHand: { width: 0.04, height: 0.22 }, // bigger hands
    minuteHand: { width: 0.03, height: 0.38 },
    secondHand: { width: 0.015, height: 0.45 },
    centerDot: { width: 0.05, height: 0.05 }
  }
};

export default function TangerineClock() {
  const [time, setTime] = useState(new Date());
  const clockLabels = [num12, num1, num2, num3, num4, num5, num6, num7, num8, num9, num10, num11];

  // Smooth animation loop
  useEffect(() => {
    let rafId;
    const update = () => {
      setTime(new Date());
      rafId = requestAnimationFrame(update);
    };
    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const ms = time.getMilliseconds();
  const secDeg = ((time.getSeconds() + ms / 1000) / 60) * 360;
  const minDeg = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  // Responsive clock size
  const clockSize = Math.min(window.innerWidth, window.innerHeight) * 0.5;
  const radius = clockSize * 0.8; // radius for numbers

  const { colors, sizes } = clockConfig;

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Tiled background */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: '25% auto',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        transform: 'scale(1.1)'
      }} />

      {/* Clock container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{ position: 'relative', width: clockSize, height: clockSize }}>
          {/* Number labels */}
          {clockLabels.map((label, i) => {
            const angle = (i + 1) * 30;
            const x = Math.sin(angle * Math.PI / 180) * radius;
            const y = -Math.cos(angle * Math.PI / 180) * radius;

            return (
              <img
                key={i}
                src={label}
                alt={`${i + 1}`}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                  width: clockSize * 0.425,  // responsive size
                  height: clockSize * 0.425,
                  objectFit: 'contain',
                  userSelect: 'none'
                }}
              />
            );
          })}

          {/* Hour Hand */}
          <div style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * sizes.hourHand.width,
            height: clockSize * sizes.hourHand.height,
            backgroundColor: colors.hourHand,
            border: `1px solid ${colors.border}`,
            boxSizing: 'border-box',
            transformOrigin: 'bottom',
            transform: `translateX(-50%) rotate(${hourDeg}deg)`,
            borderRadius: '10px'
          }} />

          {/* Minute Hand */}
          <div style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * sizes.minuteHand.width,
            height: clockSize * sizes.minuteHand.height,
            backgroundColor: colors.minuteHand,
            border: `1px solid ${colors.border}`,
            boxSizing: 'border-box',
            transformOrigin: 'bottom',
            transform: `translateX(-50%) rotate(${minDeg}deg)`,
            borderRadius: '10px'
          }} />

          {/* Second Hand */}
          <div style={{
            position: 'absolute',
            bottom: '50%',
            left: '50%',
            width: clockSize * sizes.secondHand.width,
            height: clockSize * sizes.secondHand.height,
            backgroundColor: colors.secondHand,
            border: `1px solid ${colors.border}`,
            boxSizing: 'border-box',
            transformOrigin: 'bottom',
            transform: `translateX(-50%) rotate(${secDeg}deg)`
          }} />

          {/* Center Dot */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: clockSize * sizes.centerDot.width,
            height: clockSize * sizes.centerDot.height,
            backgroundColor: colors.centerDot,
            border: `1px solid ${colors.border}`,
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)'
          }} />
        </div>
      </div>
    </div>
  );
}
