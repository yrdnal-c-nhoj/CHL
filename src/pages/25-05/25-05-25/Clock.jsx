import { useEffect, useState } from "react";
import { useFontLoader } from '../../../utils/fontLoader';
import arm from '../../../assets/images/25-05-25/arm.gif';
import arm2 from '../../../assets/images/25-05-25/arm2.gif';
import arm3 from '../../../assets/images/25-05-25/arm3.gif';
// Use the ttf font instead of corrupted woff2
import botFontUrl from '../../../assets/fonts/25-05-25-bot.ttf';

const Clock = () => {
  const fontReady = useFontLoader('bot', botFontUrl, { timeout: 3000 });
  
  // Debug font loading
  console.log('Bot font ready:', fontReady);
  console.log('Bot font URL:', botFontUrl);
  console.log('Font file exists:', !!botFontUrl);
  
  // Force font loading with direct CSS injection
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/ttf';
    link.crossOrigin = 'anonymous';
    link.href = botFontUrl;
    document.head.appendChild(link);
    
    console.log('Font preload added:', botFontUrl);
    
    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, [botFontUrl]);
  
  // Test font loading directly
  useEffect(() => {
    const testFont = new FontFace('bot', `url(${botFontUrl})`);
    testFont.load().then(() => {
      console.log('Direct font load SUCCESS');
      document.fonts.add(testFont);
    }).catch(err => {
      console.error('Direct font load FAILED:', err);
    });
  }, [botFontUrl]);
  
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const second = now.getSeconds();
      const minute = now.getMinutes();
      const hour = now.getHours() % 12;

      const secondDeg = second * 6;
      const minuteDeg = minute * 6 + second * 0.1;
      const hourDeg = hour * 30 + minute * 0.5;

      document.getElementById("second-hand").style.transform = `translate(-50%, -100%) rotate(${secondDeg}deg)`;
      document.getElementById("minute-hand").style.transform = `translate(-50%, -100%) rotate(${minuteDeg}deg)`;
      document.getElementById("hour-hand").style.transform = `translate(-50%, -100%) rotate(${hourDeg}deg)`;
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Inject font-face dynamically
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'bot';
        src: url('${botFontUrl}') format('truetype');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, [botFontUrl]);

  const containerStyle = {
    margin: 0,
    padding: 0,
    height: "100dvh",
    width: "100vw",
    background: "radial-gradient(circle at center, #dfeb6f, #ff6a06)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };

  const clockContainerStyle = {
    position: "relative",
    width: "80vmin",
    height: "80vmin",
  };

  const clockStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    zIndex: 1,
  };

  const numberStyle = {
    position: "absolute",
    color: "rgb(1, 80, 94)",
    fontSize: "7vh",
    transform: "translate(-50%, -50%)",
    textShadow: "#f4d6f4 6px 6px",
    fontFamily: "'bot', sans-serif",
    // Debug styles
    // border: fontReady ? '2px solid green' : '2px solid red',
  };

  const handBaseStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transformOrigin: "bottom center",
    transform: "translate(-50%, -100%) rotate(0deg)",
    pointerEvents: "none",
  };

  return (
    <div style={{...containerStyle, opacity: fontReady ? 1 : 0.5, transition: 'opacity 0.3s ease'}}>
      <div style={clockContainerStyle}>
        <div style={clockStyle} id="clock">
          {/* Numbers */}
          {Array.from({ length: 12 }, (_, i) => {
            const num = i + 1;
            const angle = num * 30 * (Math.PI / 180);
            const x = 50 + 42 * Math.sin(angle);
            const y = 50 - 42 * Math.cos(angle);
            return (
              <div
                key={num}
                style={{
                  ...numberStyle,
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {num}
              </div>
            );
          })}

          {/* Hands */}
          <div className="hand second" id="second-hand" style={handBaseStyle}>
            <img decoding="async" loading="lazy"
              src={arm2}
              alt="Second Hand"
              style={{
                height: "45vmin",
                filter: "saturate(100%)  hue-rotate(73deg) contrast(280%) brightness(150%)",
              }}
            />
          </div>

          <div className="hand minute" id="minute-hand" style={handBaseStyle}>
            <img decoding="async" loading="lazy"
              src={arm3}
              alt="Minute Hand"
              style={{
                height: "35vmin",
                filter: "saturate(600%) contrast(180%) hue-rotate(170deg)",
              }}
            />
          </div>

          <div className="hand hour" id="hour-hand" style={handBaseStyle}>
            <img decoding="async" loading="lazy"
              src={arm}
              alt="Hour Hand"
              style={{
                height: "27vmin",
                transform: "scaleX(-1)",
                filter: "saturate(70%)  hue-rotate(73deg) contrast(180%)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
