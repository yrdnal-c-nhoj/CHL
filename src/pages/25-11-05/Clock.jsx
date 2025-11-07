import { useEffect, useState, useMemo } from "react";
import WebFonnov25ufuf from "./webs1.ttf";
import Webnovv725 from "./webs2.ttf";
import webnov725 from "./webs3.ttf";

// Helper function remains the same
function makeColumnsBackground(columns, gutterVw, marginVw) {
  if (columns <= 0) {
    console.error("Columns Must Be Greater Than 0"); // Changed error message to Title Case
    return "none";
  }
  const colColor = "rgba(255,255,255)";
  const gutColor = "rgba(255,255,255)";
  return [
    `linear-gradient(90deg, ${colColor} 0, ${colColor} ${marginVw}vw, transparent ${marginVw}vw)`,
    `repeating-linear-gradient(90deg,
      transparent 0,
      transparent calc((100% - ${2 * marginVw}vw) / ${columns} - ${gutterVw}vw),
      ${gutColor} calc((100% - ${2 * marginVw}vw) / ${columns} - ${gutterVw}vw),
      ${gutColor} calc((100% - ${2 * marginVw}vw) / ${columns})
    )`,
    `linear-gradient(90deg, transparent calc(100% - ${marginVw}vw), ${colColor} calc(100% - ${marginVw}vw), ${colColor} 100%)`,
  ].join(",");
}

// Rulers component remains the same
function Rulers({ viewportWidth, viewportHeight }) {
  const TICK_MAJOR = 9.26; // 100px / 1080px * 100
  const TICK_MINOR = 1.85; // 20px / 1080px * 100
  const COUNT = 200;
  const labelStyle = {
    fontSize: "3.4vh",
    color: "#BBBBC7FF",
    textShadow: "0 0.2vh 0.4vh rgba(233,0,0)",
    fontWeight: 700,
    fontFamily: "'Teko', sans-serif",
  };

  return (
    <>
      {/* Top ruler */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: "3.2vh",
          background: "rgba(250,20,0,0.4)",
          borderBottom: "0.2vh solid rgba(2,255,2)",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: COUNT }, (_, i) => i * TICK_MINOR).map((x) => {
          const major = x % TICK_MAJOR < 0.01;
          return (
            <div
              key={x}
              style={{
                position: "absolute",
                left: `${x}vw`,
                bottom: 0,
                width: major ? "0.3vw" : "0.3vw",
                height: major ? "2.4vh" : "1.6vh",
                background: major ? "#8b5cf6" : "#A9EF06FF",
              }}
            />
          );
        })}
        {Array.from({ length: COUNT }, (_, i) => i * TICK_MAJOR).map((x) => (
          <div
            key={`label-x-${x}`}
            style={{ position: "absolute", left: `${x + 0.6}vw`, top: "4vh", ...labelStyle }}
          >
            {Math.round(x * (viewportWidth / 100))}
          </div>
        ))}
      </div>

      {/* Left ruler */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: "2.4vw",
          background: "#D20B0BFF",
          borderRight: "0.3vh solid rgba(255,255,2)",
          pointerEvents: "none",
        }}
      >
        {Array.from({ length: COUNT }, (_, i) => i * TICK_MINOR).map((y) => {
          const major = y % TICK_MAJOR < 0.01;
          return (
            <div
              key={y}
              style={{
                position: "absolute",
                top: `${y}vh`,
                right: 0,
                width: major ? "3.8vw" : "3.6vw",
                height: major ? "0.3vh" : "0.2vh",
                background: major ? "#8b5cf6" : "#3f3f46",
              }}
            />
          );
        })}
        {Array.from({ length: COUNT }, (_, i) => i * TICK_MAJOR).map((y) => (
          <div
            key={`label-y-${y}`}
            style={{
              position: "absolute",
              right: "0.4vh",
              top: `${y + 0.4}vh`,
              transform: "rotate(-90deg)",
              transformOrigin: "top right",
              ...labelStyle,
            }}
          >
            {Math.round(y * (viewportHeight / 100))}
          </div>
        ))}
      </div>
    </>
  );
}

export default function Clock251106() {
  const [now, setNow] = useState(new Date());
  const [viewportWidth, setViewportWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1440);
  const [viewportHeight, setViewportHeight] = useState(typeof window !== "undefined" ? window.innerHeight : 900);
  const [fontsReady, setFontsReady] = useState(false);

  // Time update interval
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(id);
  }, []);

  // Avoid FOUT: wait for fonts then reveal component
  useEffect(() => {
    let raf = requestAnimationFrame(() => {
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => setFontsReady(true));
      } else {
        setFontsReady(true);
      }
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const pad = (n) => String(n).padStart(2, "0");

  // Scaffolding config (Constants remain the same)
  const BASELINE = 0.8; // vh
  const BASELINE_BOLD_EVERY = 2;
  const COLUMNS = 4;
  const GUTTER = 1; // vw
  const MARGIN_H = 5; // vw
  const SAFE_INSET_V = 8; // vh
  const SAFE_INSET_H = 6; // vw

  // Device breakpoints (Constants remain the same)
  const breakpoints = [
    { name: "Mobile S", width: 12.5, color: "#ff006e" }, // Changed 'Mobile S' to 'Mobile S' (already Title Case)
    { name: "Mobile M", width: 14.65, color: "#fb5607" }, // Changed 'Mobile M' to 'Mobile M' (already Title Case)
    { name: "Mobile L", width: 16.6, color: "#ffbe0b" }, // Changed 'Mobile L' to 'Mobile L' (already Title Case)
    { name: "Tablet", width: 30, color: "#8ac926" }, // Changed 'Tablet' to 'Tablet' (already Title Case)
    { name: "Laptop", width: 40, color: "#1982c4" }, // Changed 'Laptop' to 'Laptop' (already Title Case)
    { name: "Laptop L", width: 56.25, color: "#8C6EB7FF" }, // Changed 'Laptop L' to 'Laptop L' (already Title Case)
    { name: "4K", width: 100, color: "#d62828" }, // Changed '4K' to '4K' (Title Case appropriate)
  ];

  const baselineLines = useMemo(() => Array.from({ length: 200 }, (_, i) => i), []);
  const activeBreakpoint = breakpoints.reduce(
    (prev, curr) => (viewportWidth >= curr.width * (viewportWidth / 100) ? curr : prev),
    breakpoints[0]
  );

  // Define typefaces
  const CLOCK_TYPEFACE = "'Bungee', monospace";
  const LABEL_TYPEFACE = "'Poppins', sans-serif";
  const DIGIT_TYPEFACE = "'Teko', sans-serif";

  return (
    <div
      style={{
        width: "100vw",
        height: "100dvh",
        background: "#0a0a0b",
        color: "#1D1DCEFF",
        position: "relative",
        overflow: "hidden",
        fontFamily: LABEL_TYPEFACE,
        opacity: fontsReady ? 1 : 0,
        transition: "opacity 300ms ease-out",
        border: "3px solid #fff",
       
        outlineOffset: 0,
        boxSizing: "border-box",
      }}
    >
      {/* 2. Simplified Inline @font-face declarations using imported URLs */}
      <style>
        {`
          @font-face {
            font-family: 'Bungee';
            src: url(${WebFonnov25ufuf}) format('truetype');
            font-weight: 400;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Poppins';
            src: url(${Webnovv725}) format('truetype');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: 'Teko';
            src: url(${webnov725}) format('truetype');
            font-weight: 700;
            font-style: normal;
            font-display: swap;
          }
        `}
      </style>

      {/* Column grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: makeColumnsBackground(COLUMNS, GUTTER, MARGIN_H),
          backgroundSize: "100% 100%",
          opacity: 0.35, // Increased opacity for more prominence
        }}
      />

      {/* Baseline grid (Rest of the component remains the same) */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {baselineLines.map((i) => {
          const thick = i % BASELINE_BOLD_EVERY === 0;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${i * BASELINE}vh`,
                left: 0,
                width: "100%",
                height: "0.1vh",
                // Brighter baseline colors and added box-shadow
                background: thick ? "rgba(180, 80, 255, 0.8)" : "rgba(180, 80, 255, 0.55)",
                boxShadow: thick ? "0 0 0.4vh rgba(180, 80, 255, 0.5)" : "none",
              }}
            />
          );
        })}
      </div>

      {/* Centerlines */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            width: "0.5vw",
            height: "100%",
            background: "rgba(6, 182, 212, 0.7)", // Brighter background
            boxShadow: "0 0 1.2vh rgba(6, 182, 212, 0.7)", // Increased and brighter shadow
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: 0,
            height: "0.5vh",
            width: "100%",
            background: "rgba(6, 182, 212, 0.9)", // Brighter background
            boxShadow: "0 0 1.2vh rgba(6, 182, 212, 0.7)", // Increased and brighter shadow
          }}
        />
        {/* Centerline labels */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "25.2vh",
            transform: "translateX(-50%)",
            fontSize: "3.6vh",
            color: "#06b6d4",
            letterSpacing: "0.12vh",
            fontWeight: 700,
            fontFamily: LABEL_TYPEFACE,
            textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
          }}
        >
          <span>Centerline X • </span>
          <span style={{ fontFamily: DIGIT_TYPEFACE }}>50VW</span>
        </div>
        <div
          style={{
            position: "absolute",
            top: "50%",
            right: `${SAFE_INSET_H}vw`,
            transform: "translateY(-50%)",
            fontSize: "3.6vh",
            color: "#06b6d4",
            letterSpacing: "0.12vh",
            fontWeight: 700,
            fontFamily: LABEL_TYPEFACE,
            textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
            maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span>Centerline Y • </span>
          <span style={{ fontFamily: DIGIT_TYPEFACE }}>50VH</span>
        </div>
      </div>

      {/* Safe area */}
      <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: `${SAFE_INSET_H}vw`,
            right: `${SAFE_INSET_H}vw`,
            top: `${SAFE_INSET_V}vh`,
            bottom: `${SAFE_INSET_V}vh`,
            border: "0.2vh dashed rgba(16, 185, 129)",
            // background: "rgba(16, 185, 129, 0.03)",
            boxShadow: "inset 0 0 2vh rgba(16, 185, 129, 0.55)",
          }}
        />
        {/* Safe area corner labels */}
        <div
          style={{
            position: "absolute",
            left: `${SAFE_INSET_H}vw`,
            top: `${SAFE_INSET_V}vh`,
            fontSize: "clamp(1.4vh, 2vw, 3vh)",
            color: "#10b981",
            letterSpacing: "0.1vh",
            fontWeight: 700,
            transform: "translate(0.8vh, 0.8vh)",
            fontFamily: LABEL_TYPEFACE,
            textShadow: "0 0.2vh 0.4vh rgba(220,0,0)",
            maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <span>Safe Area • </span>
          <span style={{ fontFamily: DIGIT_TYPEFACE }}>{SAFE_INSET_H}VW × {SAFE_INSET_V}VH Inset</span>
        </div>
      </div>

      {/* Danger zones */}
      <div aria-hidden style={{ position: 0, inset: 0, pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 0,
            height: `${SAFE_INSET_V}vh`,
            // background: "rgba(239, 68, 68, 0.05)",
            borderBottom: "0.1vh solid rgba(239, 68, 68)",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: `${SAFE_INSET_H}vw`,
              top: "0.6vh",
              fontSize: "clamp(1.4vh, 2vw, 3vh)",
              color: "#ef4444",
              letterSpacing: "0.12vh",
              fontWeight: 700,
              fontFamily: LABEL_TYPEFACE,
              textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
              maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Danger Zone • No Critical Content
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: `${SAFE_INSET_V}vh`,
            background: "rgba(239, 68, 68, 0.08)",
            borderTop: "0.1vh solid rgba(239, 68, 68, 0.3)",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${SAFE_INSET_H}vw`,
              bottom: "0.6vh",
              fontSize: "clamp(1.4vh, 2vw, 3vh)",
              color: "#ef4444",
              letterSpacing: "0.12vh",
              fontWeight: 700,
              fontFamily: LABEL_TYPEFACE,
              textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
              maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            Danger Zone • No Critical Content
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            width: `${SAFE_INSET_H}vw`,
            background: "rgba(239, 68, 68, 0.08)",
            borderRight: "0.1vh solid rgba(239, 68, 68, 0.3)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            right: 0,
            width: `${SAFE_INSET_H}vw`,
            background: "rgba(239, 68, 68, 0.08)",
            borderLeft: "0.1vh solid rgba(239, 68, 68, 0.3)",
          }}
        />
      </div>

      {/* Device breakpoint lines */}
      {breakpoints.map((bp) => (
        <div
          key={bp.width}
          aria-hidden
          style={{
            position: "absolute",
            left: `${bp.width}vw`,
            top: 0,
            width: "0.2vw",
            height: "100%",
            background: bp.color,
            opacity: viewportWidth >= bp.width * (viewportWidth / 100) ? 0.8 : 0.3,
            boxShadow: viewportWidth >= bp.width * (viewportWidth / 100) ? `0 0 1.2vh ${bp.color}` : "none",
            pointerEvents: "none",
            transition: "opacity 0.3s ease",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "12vh",
              left: "0.8vh",
              background: bp.color,
              color: viewportWidth >= bp.width * (viewportWidth / 100) ? "#fff" : "#999",
              padding: "0.4vh 0.8vh",
              fontSize: "3.2vh",
              fontWeight: 700,


              letterSpacing: "0.1vh",
              opacity: viewportWidth >= bp.width * (viewportWidth / 100) ? 1 : 0.5,
              fontFamily: LABEL_TYPEFACE,
              textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
            }}
          >
            <span>{bp.name} </span>
            <span style={{ fontFamily: DIGIT_TYPEFACE }}>{Math.round(bp.width * (viewportWidth / 100))}PX</span>
          </div>
        </div>
      ))}

      {/* Horizontal height guides */}
      {[
        44.44, // 480px / 1080px * 100
        55.56, // 600px
        71.11, // 768px
        83.33, // 900px
        100, // 1080px
      ].map((height) => (
        <div
          key={`h-${height}`}
          aria-hidden
          style={{
            position: "absolute",
            top: `${height}vh`,
            left: 0,
            width: "100%",
            height: "0.1vh",
            background: "rgba(251, 191, 36, 0.9)",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              right: `${SAFE_INSET_H}vw`,
              top: "-1.1vh",
              color: "#F50DEDFF",
              fontSize: "clamp(2.2vh, 3vw, 2.9vh)",
              fontWeight: 700,


              letterSpacing: "0.1vh",
              fontFamily: LABEL_TYPEFACE,
              textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
              maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            <span>Height Guide </span>
            <span style={{ fontFamily: DIGIT_TYPEFACE }}>{Math.round(height * (viewportHeight / 100))}PX</span>
          </div>
        </div>
      ))}

      {/* Grid system labels */}
      <div
        style={{
          position: "absolute",
          left: `${MARGIN_H}vw`,
          bottom: "3.6vh",
          fontSize: "clamp(1.4vh, 4vw, 3vh)",
          color: "#1EFEE4FF",
          letterSpacing: "0.12vh",
          fontWeight: 700,
          opacity: 0.7,
          fontFamily: LABEL_TYPEFACE,
          textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
          maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span>{COLUMNS} Column Grid • {GUTTER}VW Gutter • </span>
        <span style={{ fontFamily: DIGIT_TYPEFACE }}>{MARGIN_H}VW Margin</span>
      </div>

      {/* Baseline grid label */}
      <div
        style={{
          position: "absolute",
          right: `${SAFE_INSET_H}vw`,
          bottom: "3.6vh",
          fontSize: "clamp(1.4vh, 5vw, 3vh)",
          color: "#A957F5FF",
          letterSpacing: "0.12vh",
          fontWeight: 700,
          opacity: 0.8,
          fontFamily: LABEL_TYPEFACE,
          textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
          maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span>Baseline {BASELINE}VH • Bold Every </span>
        <span style={{ fontFamily: DIGIT_TYPEFACE }}>{BASELINE_BOLD_EVERY}</span>
      </div>

      <Rulers viewportWidth={viewportWidth} viewportHeight={viewportHeight} />

      {/* Digital time */}
      <div
        style={{
          position: "absolute",
          left: `${SAFE_INSET_H}vw`,
          right: `${SAFE_INSET_H}vw`,
          top: `${SAFE_INSET_V}vh`,
          bottom: `${SAFE_INSET_V}vh`,
          display: "grid",
          placeItems: "center",
          pointerEvents: "none",
          zIndex: 10,
        }}
      >
        <div
          style={{
            // fontSize: `clamp(6vh, min(22vmin, 20vw, 20vh), 18vh)`,
            fontSize: "10vw",
            lineHeight: 1.1,
            // letterSpacing: "0.05vh",
            textShadow: "3px 1px  rgba(220,0,0)",
            // fontWeight: 400,
            color: "#D9D9EEFF",
            textAlign: "center",
            display: "flex",
            alignItems: "baseline",
            justifyContent: "center",
            // gap: "-0.6vh",
            // letterSpacing: "-0.2vh",
            whiteSpace: "nowrap",
            fontVariantNumeric: "tabular-nums",
            // padding: "1.2vh",
            maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
            maxHeight: `calc(100vh - ${2 * SAFE_INSET_V}vh)`,
            overflow: "hidden",
            fontFamily: CLOCK_TYPEFACE,
            background: "rgba(0,0,0,0.2)",
            borderRadius: "0.8vh",
          }}
        >
          <>
            <span>{pad(now.getHours())}</span>
            <span>{pad(now.getMinutes())}</span>
            <span>{pad(now.getSeconds())}</span>
          </>
        </div>
      </div>

      {/* Top status bar */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 0,
          right: 0,
          height: "3.2vh",
          background: "linear-gradient(180deg, rgba(220,0,220) 0%, transparent 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "2vh",
          fontSize: "3.2vh",
          fontWeight: 700,
          letterSpacing: "0.1vh",


          fontFamily: LABEL_TYPEFACE,
        }}
      >
        <span style={{ color: activeBreakpoint.color }}>{activeBreakpoint.name}</span>
        <span style={{ opacity: 0.9 }}>•</span>
        <span style={{ opacity: 0.9, fontFamily: DIGIT_TYPEFACE }}>
          {Math.round(viewportWidth)} × {Math.round(viewportHeight)}PX
        </span>
        <span style={{ opacity: 0.9 }}>•</span>
        <span style={{ opacity: 0.9 }}>Scaffolding System Active</span>
      </div>

      {/* Corner system indicators */}
      <div
        style={{
          position: "absolute",
          right: `${SAFE_INSET_H}vw`,
          top: `${SAFE_INSET_V + 2}vh`,
          fontSize: "3vh",
          color: "#F0EBEBFF",
          textAlign: "right",
          lineHeight: 1.6,
          letterSpacing: "0.08vh",

          fontFamily: LABEL_TYPEFACE,
          textShadow: "0 0.2vh 0.4vh rgba(0,0,0,0.5)",
          maxWidth: `calc(100vw - ${2 * SAFE_INSET_H}vw)`,
          overflow: "hidden",
        }}
      >
        <div style={{ color: "#06b6d4" }}>█ Centerlines</div>
        <div style={{ color: "#10b981" }}>█ Safe Area</div>
        <div style={{ color: "#ef4444" }}>█ Danger Zones</div>
        <div style={{ color: "#9333ea" }}>█ Baseline Grid</div>
        <div style={{ color: "#f2f2f3" }}>█ Column Grid</div>
        <div style={{ color: "#fbbf24" }}>█ Height Guides</div>
        <div style={{ color: "#ff006e" }}>█ Breakpoints</div>
      </div>
    </div>
  );
}