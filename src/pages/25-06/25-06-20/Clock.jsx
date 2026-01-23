import React, { useEffect, useState } from "react";

const font1Path = '/src/assets/fonts/25-06-20-inde2.ttf';
const font2Path = '/src/assets/fonts/25-06-20-inde1.ttf';

const IndecisiveClock = () => {
  const [time, setTime] = useState({ h: "", m: "", s: "" });
  const [showFirst, setShowFirst] = useState(true);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Update time every second
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime({ h, m, s });
    };

    updateClock();
    const timeInterval = setInterval(updateClock, 1000);

    // Toggle font every 2 seconds for equal visibility
    const fontInterval = setInterval(() => {
      setShowFirst(prev => !prev);
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(fontInterval);
    };
  }, []);

  // Load fonts on component mount
  useEffect(() => {
    const loadFonts = async () => {
      try {
        const font1 = new FontFace('ClockFont1', `url(${font1Path})`);
        const font2 = new FontFace('ClockFont2', `url(${font2Path})`);
        
        await Promise.all([font1.load(), font2.load()]);
        document.fonts.add(font1);
        document.fonts.add(font2);
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true);
      }
    };
    
    loadFonts();
  }, []);

  const bodyStyle = {
    margin: 0,
    backgroundColor: "#8A8E8A",
    backgroundImage:
      `linear-gradient(30deg, #888888 12%, transparent 12.5%, transparent 87%, #888888 87.5%, #888888),
       linear-gradient(150deg, #888888 12%, transparent 12.5%, transparent 87%, #888888 87.5%, #888888),
       linear-gradient(30deg, #888888 12%, transparent 12.5%, transparent 87%, #888888 87.5%, #888888),
       linear-gradient(150deg, #888888 12%, transparent 12.5%, transparent 87%, #888888 87.5%, #888888),
       linear-gradient(60deg, #7B7E7A77 25%, transparent 25.5%, transparent 75%, #75787477 75%, #21351a77),
       linear-gradient(60deg, #71737077 25%, transparent 25.5%, transparent 75%, #6C6E6B77 75%, #21351a77)`,
    backgroundSize: "24vw 42vh",
    backgroundPosition: "0 0, 0 0, 12vw 21vh, 12vw 21vh, 0 0, 12vw 21vh",
    overflow: "hidden",
    height: "100dvh",
    width: "100vw",
  };

  const containerStyle = {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: "auto",
    width: "100vw",
    height: "40vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    filter: "url(#threshold) blur(0.05rem)",
  };

  const timeBlockBase = {
    position: "absolute",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    userSelect: "none",
    transition: "opacity 1s ease-in-out",
  };

  const digitStyle = {
    fontSize: "8rem",
    lineHeight: "7rem",
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <>
      <style>
        {`
          @font-face {
            font-family: 'ClockFont1';
            src: url('${font1Path}') format('truetype');
            font-display: swap;
          }
          @font-face {
            font-family: 'ClockFont2';
            src: url('${font2Path}') format('truetype');
            font-display: swap;
          }
          
          @media (max-width: 768px) {
            .time-block {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
            .digit {
              font-size: 6rem !important;
            }
          }
        `}
      </style>

      <div style={bodyStyle}>
        <div id="container" style={containerStyle}>
          <div
            className="time-block"
            style={{
              ...timeBlockBase,
              opacity: showFirst ? 1 : 0,
            }}
          >
            <span className="digit" style={{...digitStyle, fontFamily: "'ClockFont1', sans-serif", color: "white"}}>
              {time.h}
            </span>
            <span className="digit" style={{...digitStyle, fontFamily: "'ClockFont1', sans-serif", color: "white"}}>
              {time.m}
            </span>
            <span className="digit" style={{...digitStyle, fontFamily: "'ClockFont1', sans-serif", color: "white"}}>
              {time.s}
            </span>
          </div>

          <div
            className="time-block"
            style={{
              ...timeBlockBase,
              opacity: showFirst ? 0 : 1,
            }}
          >
            <span className="digit" style={{...digitStyle, fontFamily: "'ClockFont2', sans-serif", color: "black"}}>
              {time.h}
            </span>
            <span className="digit" style={{...digitStyle, fontFamily: "'ClockFont2', sans-serif", color: "black"}}>
              {time.m}
            </span>
            <span className="digit" style={{...digitStyle, fontFamily: "'ClockFont2', sans-serif", color: "black"}}>
              {time.s}
            </span>
          </div>
        </div>

        <svg id="filters" style={{ position: "absolute", width: 0, height: 0 }}>
          <defs>
            <filter id="threshold">
              <feColorMatrix
                in="SourceGraphic"
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 255 -140"
              />
            </filter>
          </defs>
        </svg>
      </div>
    </>
  );
};

export default IndecisiveClock;