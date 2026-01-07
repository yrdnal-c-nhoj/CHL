import React, { useEffect, useState, useRef, useMemo, memo } from "react";

// Font imports
const font1Path = '../../assets/fonts/25-12-22-candle.ttf';
const font2Path = '../../assets/fonts/25-12-29-shrine.ttf';

const IndecisiveClock = () => {
  const [time, setTime] = useState({ h: "", m: "", s: "" });
  const [showFirst, setShowFirst] = useState(true);

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

    // Toggle font every 2 seconds for better visibility
    const fontInterval = setInterval(() => {
      setShowFirst(prev => !prev);
    }, 2000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(fontInterval);
    };
  }, []);

  // Styles as objects
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
    transition: "opacity 0.8s ease, filter 0.8s ease",
    userSelect: "none",
  };

  const visibleStyle = {
    opacity: 1,
    filter: "blur(0rem)",
    pointerEvents: "auto",
  };

  const hiddenStyle = {
    opacity: 0,
    filter: "blur(0.5rem)",
    pointerEvents: "none",
  };

  const digitStyle1 = useMemo(() => ({
    fontFamily: `'${showFirst ? 'ClockFont1' : 'ClockFont2'}', sans-serif`,
    color: "rgb(250, 212, 212)",
    fontSize: "8rem",
    opacity: 0,
    animation: 'fadeIn 0.125s ease-in forwards',
    transition: 'font-family 0.8s ease',
  }), [showFirst]);

  const digitStyle2 = useMemo(() => ({
    fontFamily: `'${showFirst ? 'ClockFont2' : 'ClockFont1'}', sans-serif`,
    color: "rgb(251, 223, 224)",
    fontSize: "8rem",
    lineHeight: "7rem",
    opacity: 0,
    animation: 'fadeIn 0.125s ease-in forwards',
    transition: 'font-family 0.8s ease',
  }), [showFirst]);

  const bodyStyle = {
    margin: 0,
    backgroundColor: "#111e0f",
    backgroundImage:
      `linear-gradient(30deg, #21351a 12%, transparent 12.5%, transparent 87%, #21351a 87.5%, #21351a),
       linear-gradient(150deg, #21351a 12%, transparent 12.5%, transparent 87%, #21351a 87.5%, #21351a),
       linear-gradient(30deg, #21351a 12%, transparent 12.5%, transparent 87%, #21351a 87.5%, #21351a),
       linear-gradient(150deg, #21351a 12%, transparent 12.5%, transparent 87%, #21351a 87.5%, #21351a),
       linear-gradient(60deg, #21351a77 25%, transparent 25.5%, transparent 75%, #21351a77 75%, #21351a77),
       linear-gradient(60deg, #21351a77 25%, transparent 25.5%, transparent 75%, #21351a77 75%, #21351a77)`,
    backgroundSize: "24vw 42vh",
    backgroundPosition: "0 0, 0 0, 12vw 21vh, 12vw 21vh, 0 0, 12vw 21vh",
    overflow: "hidden",
    height: "100dvh",
    width: "100vw",
  };

  // Responsive style fallback for mobile (column layout)
  // Can be handled via CSS media queries or with JS resize listeners,
  // but for brevity, here just keep flexDirection: row.
  
  // Font loading state
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Load fonts on component mount
  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Using FontFace API for better control
        const font1 = new FontFace('ClockFont1', `url(${font1Path})`);
        const font2 = new FontFace('ClockFont2', `url(${font2Path})`);
        
        await Promise.all([font1.load(), font2.load()]);
        document.fonts.add(font1);
        document.fonts.add(font2);
        
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if font loading fails
      }
    };
    
    loadFonts();
  }, []);
  
  // Don't render until fonts are loaded
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
          }
          
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}
      </style>

      <div style={bodyStyle}>
        <div id="container" style={containerStyle}>
          <div
            id="time1"
            className="time-block"
            style={{
              ...timeBlockBase,
              ...(showFirst ? visibleStyle : hiddenStyle),
            }}
          >
            <span className="digit" style={digitStyle1}>
              {time.h}
            </span>
            <span className="digit" style={digitStyle1}>
              {time.m}
            </span>
            <span className="digit" style={digitStyle1}>
              {time.s}
            </span>
          </div>

          <div
            id="time2"
            className="time-block"
            style={{
              ...timeBlockBase,
              ...(showFirst ? hiddenStyle : visibleStyle),
            }}
          >
            <span className="digit" style={digitStyle2}>
              {time.h}
            </span>
            <span className="digit" style={digitStyle2}>
              {time.m}
            </span>
            <span className="digit" style={digitStyle2}>
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
