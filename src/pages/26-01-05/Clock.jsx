import { useState, useEffect } from 'react';
import backgroundImage from '../../assets/clocks/26-01-06/aa.jpg';
import gizaFont from '../../assets/fonts/26-01-06-aa.ttf';
import aaaImage from '../../assets/clocks/26-01-06/aaa.webp';

export default function AardvarkClock() {
  const [time, setTime] = useState(new Date());
  const [totalSeconds, setTotalSeconds] = useState(0);

  const uniqueFontFamily = `Giza_20260107`;
  const clockLabels = ['A','A','A','A','A','A','A','A','A','Aa','Aa','Aa'];

  /* Inject font */
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: '${uniqueFontFamily}';
        src: url(${gizaFont}) format('opentype');
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  /* Clock tick */
  useEffect(() => {
    const now = new Date();
    setTime(now);
    setTotalSeconds(
      now.getHours() * 3600 +
      now.getMinutes() * 60 +
      now.getSeconds()
    );

    const timer = setInterval(() => {
      setTime(new Date());
      setTotalSeconds(s => s + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const secDeg  = (totalSeconds / 60) * 360;
  const minDeg  = ((time.getMinutes() + time.getSeconds() / 60) / 60) * 360;
  const hourDeg = ((time.getHours() % 12 + time.getMinutes() / 60) / 12) * 360;

  const textOutline = `
    -0.3vh 0 0 #08C43A,
     0.3vh 0 0 #f222ff,
     0 -0.3vh 0 #EFEAE8,
     0  0.3vh 0 #151415
  `;

  return (
    <div style={{
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: '50vh 40vh',
      backgroundRepeat: 'repeat',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      width: '100vw',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>

      {/* Corner image */}
      <img
        src={aaaImage}
        alt=""
        style={{
          position: 'absolute',
          bottom: '0',
          right: '0',
          width: '45vh',
          maxHeight: '90vh',
          objectFit: 'contain'
        }}
      />

      {/* CLOCK */}
      <div style={{
        position: 'relative',
        width: 'min(90vh, 90vw)',
        height: 'min(90vh, 90vw)',
        fontFamily: `'${uniqueFontFamily}', serif`,
        color: '#C65408'
      }}>

        {/* Labels */}
        {clockLabels.map((label, i) => {
          const angle = (i + 1) * 30;
          const radius = 38; // vh-based via container scaling
          const x = Math.sin(angle * Math.PI / 180) * radius;
          const y = -Math.cos(angle * Math.PI / 180) * radius;

          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: `translate(calc(-50% + ${x}vh), calc(-50% + ${y}vh))`,
                fontSize: '9vh',
                textShadow: textOutline,
                userSelect: 'none',
                lineHeight: 1
              }}
            >
              {label}
            </div>
          );
        })}

        {/* Hour */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '1.4vh',
          height: '14vh',
          background: '#C65408',
          border: '0.15vh solid #fff',
          transformOrigin: 'bottom',
          transform: `translateX(-50%) rotate(${hourDeg}deg)`,
          borderRadius: '1vh',
          transition: 'transform 0.5s ease-in-out'
        }} />

        {/* Minute */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '0.9vh',
          height: '24vh',
          background: '#C65408',
          border: '0.15vh solid #fff',
          transformOrigin: 'bottom',
          transform: `translateX(-50%) rotate(${minDeg}deg)`,
          borderRadius: '1vh',
          transition: 'transform 0.5s ease-in-out'
        }} />

        {/* Second */}
        <div style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '0.5vh',
          height: '28vh',
          background: '#C65408',
          border: '0.12vh solid #fff',
          transformOrigin: 'bottom',
          transform: `translateX(-50%) rotate(${secDeg}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.68,-0.6,0.32,1.6)'
        }} />

        {/* Center */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '2.2vh',
          height: '2.2vh',
          background: '#C65408',
          border: '0.15vh solid #fff',
          borderRadius: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5
        }} />

      </div>
    </div>
  );
}
