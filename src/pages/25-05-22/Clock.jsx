import { useEffect } from 'react';
import sunGif from './sun.gif';
import dirFontUrl from './Dir.ttf'; // ✅ import the font

const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];

const Clock = () => {
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const sec = now.getSeconds();
      const min = now.getMinutes();
      const hr = now.getHours();

      const secondDeg = sec * 6;
      const minuteDeg = min * 6 + sec * 0.1;
      const hourDeg = ((hr % 12) * 30) + (min * 0.5);

      document.getElementById("second").style.transform = `translateX(-50%) rotate(${secondDeg}deg)`;
      document.getElementById("minute").style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`;
      document.getElementById("hour").style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
    };

    const interval = setInterval(updateClock, 1000);
    updateClock();
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      height: '100dvh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      background: '#000000',
      fontFamily: 'Dir, serif',
      overflow: 'hidden'
    }}>
      <style>
        {`
          @font-face {
            font-family: 'Dir';
            src: url(${dirFontUrl}) format('truetype');
          }
        `}
      </style>

      <img
        src={sunGif}
        alt="Sun"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxWidth: 600,
          maxHeight: 600,
          zIndex: 0,
          filter: 'hue-rotate(322deg) contrast(180%) saturate(160%)',
          pointerEvents: 'none'
        }}
      />

      <div id="clock" style={{
        width: '90vmin',
        height: '90vmin',
        borderRadius: '50%',
        position: 'relative',
        color: '#abe5f3',
        fontWeight: 'bold',
        zIndex: 1
      }}>
        {romanNumerals.map((num, i) => {
          const angleDeg = i * 30;
          const angleRad = angleDeg * (Math.PI / 180);
          const radius = 43;
          const x = 50 + radius * Math.sin(angleRad);
          const y = 50 - radius * Math.cos(angleRad);
          return (
            <div key={i}
              style={{
                position: 'absolute',
                fontSize: '7vh',
                left: `${x}%`,
                top: `${y}%`,
                transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`
              }}>
              {num}
            </div>
          );
        })}
        <div id="hour" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          transformOrigin: 'bottom',
          background: '#abe5f3',
          width: '2%',
          height: '25%'
        }}></div>
        <div id="minute" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          transformOrigin: 'bottom',
          background: '#abe5f3',
          width: '1%',
          height: '35%'
        }}></div>
        <div id="second" style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          transformOrigin: 'bottom',
          background: '#abe5f3',
          width: '0.4%',
          height: '45%'
        }}></div>
      </div>
    </div>
  );
};

export default Clock;
