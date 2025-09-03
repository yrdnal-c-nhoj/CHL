import React, { useEffect, useState, useRef } from "react";
import LiuJianMaoCaoFontUrl from "./LiuJianMaoCao.ttf";
import BlackHanSansFontUrl from "./BlackHanSans.ttf";

const IndecisiveClock = () => {
  const [time, setTime] = useState({ h: "", m: "", s: "" });
  const [showFirst, setShowFirst] = useState(true);

  // Load fonts on mount
  useEffect(() => {
    const liuFont = new FontFace(
      "Liu Jian Mao Cao",
      `url(${LiuJianMaoCaoFontUrl})`
    );
    const blackHanFont = new FontFace(
      "Black Han Sans",
      `url(${BlackHanSansFontUrl})`
    );

    liuFont.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
    blackHanFont.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });
  }, []);

  // Update time every second and toggle visible block
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      setTime({ h, m, s });
      setShowFirst((prev) => !prev);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
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

  const digitStyle1 = {
    fontFamily: '"Liu Jian Mao Cao", cursive',
    color: "rgb(250, 212, 212)",
    fontSize: "8rem",
  };

  const digitStyle2 = {
    fontFamily: '"Black Han Sans", sans-serif',
    color: "rgb(251, 224, 224)",
    fontSize: "8rem",
    lineHeight: "7rem",
  };

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

  return (
    <>
      <style>
        {`
          @media (max-width: 768px) {
            .time-block {
              flex-direction: column !important;
              gap: 0.5rem !important;
            }
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
