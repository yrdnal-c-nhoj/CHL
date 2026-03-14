import React, { useState, useEffect } from 'react';
import veniceFont from '../../../assets/fonts/26-03-13-venice.ttf';

const Clock = () => {
  const [time, setTime] = useState(new Date());
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'VeniceFont';
        src: url('${veniceFont}') format('truetype');
        font-display: swap;
      }

      @keyframes venice-glow {
        0%,100%{
          filter: drop-shadow(0 0 20px rgba(255,215,0,.7));
          transform: scale(1);
        }
        50%{
          filter: drop-shadow(0 0 40px rgba(0,255,255,.8));
          transform: scale(1.03);
        }
      }

      .venice-clock{
        opacity:0;
        transition:opacity 1.2s ease;
      }

      .venice-clock.loaded{
        opacity:1;
      }

      .video-background iframe{
        pointer-events:none;
      }
    `;
    document.head.appendChild(style);

    document.fonts.ready.then(() => setFontLoaded(true));

    return () => {
      if (document.head.contains(style)) document.head.removeChild(style);
    };
  }, []);

  const { digits, period } = (() => {
    let h = time.getHours();
    const m = time.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'P.M.' : 'A.M.';
    h = h % 12 || 12;
    return { digits: `${h}:${m}`, period: ampm };
  })();

  const videoId = "EO_1LWqsCNE";

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        background: '#000'
      }}
    >

      {/* VIDEO */}
      <div
        className="video-background"
        style={{
          position:'absolute',
          inset:0,
          zIndex:0,
          overflow:'hidden'
        }}
      >
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&modestbranding=1&rel=0`}
          title="Venice Beach"
          frameBorder="0"
          allow="autoplay; fullscreen"
          style={{
            position:'absolute',
            top:'50%',
            left:'50%',
            minWidth:'100%',
            minHeight:'100%',
            transform:'translate(-50%,-50%)'
          }}
        />
      </div>

      {/* DARK OVERLAY */}
      <div
        style={{
          position:'absolute',
          inset:0,
          // background:'rgba(0,0,0,.35)',
          zIndex:1
        }}
      />

      {/* CLOCK */}
      <div
        className={`venice-clock ${fontLoaded ? 'loaded' : ''}`}
        style={{
          position:'absolute',
          inset:0,
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'center',
          textAlign:'center',
          fontFamily:'VeniceFont, sans-serif',
          zIndex:10,
          pointerEvents:'none'
        }}
      >

        {/* DIGITS */}
        <div
          style={{
            fontSize:'clamp(4rem,16vw,14rem)',
            lineHeight:1,
            // fontWeight:'bold',
            whiteSpace:'nowrap',
   background:'linear-gradient(90deg,#F321FA,#EFF70D,#ff1493)',
                  WebkitBackgroundClip:'text',
            backgroundClip:'text',
            WebkitTextFillColor:'transparent',
            animation:'venice-glow 4s ease-in-out infinite'
          }}
        >
          {digits}
        </div>

        {/* AM PM */}
        <div
          style={{
            fontSize:'clamp(3rem,9vw,8rem)',
            marginTop:'1rem',
            letterSpacing:'.25em',
            // fontWeight:900,
            background:'linear-gradient(90deg,#ff1493,#00ffff,#DCFF14)',
            backgroundSize:'200%',
            WebkitBackgroundClip:'text',
            backgroundClip:'text',
            WebkitTextFillColor:'transparent',
            animation:'venice-glow 3s ease-in-out infinite'
          }}
        >
          {period}
        </div>

      </div>
    </div>
  );
};

export default Clock;