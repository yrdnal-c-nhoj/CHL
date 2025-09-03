import { useEffect, useRef } from 'react';
import fontUrl from './merc.ttf';
import bg1 from './MercuryResonancePrecession001.gif';
import bg2 from './mmmmm.gif';
import bg3 from './merg.gif';
import bgImage from './mmm.gif';
import hourImg from './mercc.gif';
import minuteImg from './memm.gif';
import secondImg from './mmmm.png';

const MercuryClock = () => {
  const hourRef = useRef();
  const minuteRef = useRef();
  const secondRef = useRef();
  const clockRef = useRef();

  useEffect(() => {
    const font = new FontFace('merc', `url(${fontUrl})`);
    font.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const romanNumerals = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    const clock = clockRef.current;

    romanNumerals.forEach((num, i) => {
      const angleDeg = i * 30;
      const angleRad = angleDeg * (Math.PI / 180);
      const radius = 43;
      const x = 50 + radius * Math.sin(angleRad);
      const y = 50 - radius * Math.cos(angleRad);
      const el = document.createElement('div');
      el.textContent = num;
      Object.assign(el.style, {
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
        color: 'rgb(215, 228, 240)',
        textShadow: '#0e0e0e 1px 1px 0px, #0e0e0e -1px -1px 0px',
        // fontSize: '4rem',
        // fontWeight: 'bold',
        fontFamily: 'merc'
      });
      clock.appendChild(el);
    });

    const updateClockSmooth = () => {
      const now = new Date();
      const ms = now.getMilliseconds();
      const sec = now.getSeconds() + ms / 1000;
      const min = now.getMinutes() + sec / 60;
      const hr = now.getHours() % 12 + min / 60;

      hourRef.current.style.transform = `translateX(-50%) rotate(${hr * 30}deg)`;
      minuteRef.current.style.transform = `translateX(-50%) rotate(${min * 6}deg)`;
      secondRef.current.style.transform = `translateX(-50%) rotate(${sec * 6}deg)`;

      requestAnimationFrame(updateClockSmooth);
    };
    updateClockSmooth();
  }, []);

  return (
    <div style={{
      margin: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100dvh',
     width: '100vw',
      backgroundColor: '#838b8f',
      backgroundImage: `url(${bg1}), url(${bg2}), url(${bg3})`,
      backgroundRepeat: 'repeat, repeat, repeat',
      backgroundSize: '2.5vh auto, 5vh auto, 2.5vh auto',
      backgroundPosition: 'bottom right',
      backgroundAttachment: 'scroll',
      fontFamily: 'merc, serif'
    }}>
      <style>{`@font-face { font-family: 'merc'; src: url(${fontUrl}) format('truetype'); }`}</style>

      <img src={bgImage} style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '99vw',
        height: '91vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        zIndex: 8,
        opacity: 0.8,
        pointerEvents: 'none'
      }} />

      <div ref={clockRef} style={{
        width: '90vmin',
        height: '90vmin',
        borderRadius: '50%',
        position: 'relative'
      }}>
        <div ref={hourRef} style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '21%',
          height: '25%',
          transformOrigin: 'bottom',
          zIndex: 6,
          filter: 'hue-rotate(-10deg) brightness(100%) saturate(10%) contrast(200%)'
        }}>
          <img src={hourImg} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>

        <div ref={minuteRef} style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '17%',
          height: '49%',
          transformOrigin: 'bottom',
          zIndex: 6,
          filter: 'sepia(10%) hue-rotate(-10deg) brightness(120%) saturate(10%)'
        }}>
          <img src={minuteImg} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>

        <div ref={secondRef} style={{
          position: 'absolute',
          bottom: '50%',
          left: '50%',
          width: '43%',
          height: '58%',
          transformOrigin: 'bottom',
          zIndex: 6,
          filter: 'sepia(100%) hue-rotate(-10deg) brightness(180%) saturate(10%)'
        }}>
          <img src={secondImg} style={{ width: '100%', height: '100%', display: 'block' }} />
        </div>

        <div style={{
          position: 'absolute',
          width: '1%',
          height: '1%',
          backgroundColor: '#99999b',
          borderRadius: '50%',
          top: '49%',
          left: '49%',
          zIndex: 10
        }} />
      </div>
    </div>
  );
};

export default MercuryClock;
