import { useState, useEffect } from 'react';
import backgroundImage from '../../assets/clocks/26-01-07/tang.jpeg';
import gizaFont from '../../assets/fonts/26-01-06-aa.ttf';


export default function AardvarkClock() {
  const [time, setTime] = useState(new Date());
  const uniqueFontFamily = `Giza_20260107`;

  const clockLabels = ['A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'A', 'AA', 'AA', 'AA'];

  // Inject font
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${uniqueFontFamily}';
        src: url(${gizaFont}) format('opentype');
      }
    `;
    document.head.appendChild(style);
    return () => style.parentNode?.removeChild(style);
  }, [uniqueFontFamily]);

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

  const textOutline = `
    -2px 0 0 #fff,
     2px 0 0 #fff,
     0 -2px 0 #24D671,
     0  2px 0 #151415
  `;

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: 'cover', // Adjust this value to change the size of each tile
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      position: 'relative',
    }}>
      
      <div style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        fontFamily: `'${uniqueFontFamily}', serif`,
        color: '#C65408',
      }}>

        {/* Clock Face Labels */}
        {clockLabels.map((label, i) => {
          const angle = (i + 1) * 30;
          const radius = 160;
          const x = Math.sin(angle * Math.PI / 180) * radius;
          const y = -Math.cos(angle * Math.PI / 180) * radius;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                fontSize: '9vh',
                textShadow: textOutline,
                userSelect: 'none'
              }}
            >
              {label}
            </div>
          );
        })}

        {/* Hour Hand */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '11px',
          height: '70px',
         backgroundColor:  '#C65408',
          border: '1px solid #fff',
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
          width: '8px',
          height: '120px',
          backgroundColor:  '#C65408',
          border: '1px solid #fff',
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
          width: '4px',
          height: '140px',
      backgroundColor:  '#C65408',
          border: '1px solid #fff',
          boxSizing: 'border-box',
          transformOrigin: 'bottom',
          transform: `translateX(-50%) rotate(${secDeg}deg)`
        }} />

        {/* Center Nut */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '14px',
          height: '14px',
                  backgroundColor: '#C65408',
            border: '1px solid #fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)'
        }} />

      </div>
    </div>
  );
}
