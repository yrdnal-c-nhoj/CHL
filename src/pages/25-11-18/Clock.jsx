import React, { useState, useEffect, useMemo } from "react";
import customFont2025_11_20 from "./cat.ttf";
import bgImg2025_11_20 from "./eyes.webp";

const ROWS = 60;
const COLS = 52;
const DIGITS = 6;
const TOTAL_CELLS = ROWS * COLS * DIGITS;

const rotationArray = new Float32Array(TOTAL_CELLS);

export default function DigitalClockGrid() {
  const [time, setTime] = useState(new Date());
  const [bucket, setBucket] = useState(0);
  const [fontLoaded, setFontLoaded] = useState(false);

  // -----------------------------
  // FONT LOAD
  // -----------------------------
  useEffect(() => {
    const f = new FontFace(
      "ClockFont2025_11_20",
      `url(${customFont2025_11_20})`
    );
    f.load().then((ff) => {
      document.fonts.add(ff);
      setFontLoaded(true);
    });
  }, []);

  // -----------------------------
  // UPDATE TIME ONCE PER SECOND
  // -----------------------------
  useEffect(() => {
    const id = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const seconds = time.getSeconds();
  const fiveSecBucket = Math.floor(seconds / 5);

  // -----------------------------
  // ROTATIONS UPDATE EVERY 5 SEC
  // -----------------------------
  useEffect(() => {
    let i = 0;
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        for (let d = 0; d < DIGITS; d++) {
          rotationArray[i++] = Math.random() * 90 - 45;
        }
      }
    }
    setBucket(fiveSecBucket);
  }, [fiveSecBucket]);

  if (!fontLoaded) return null;

  // -----------------------------
  // DIGIT PATTERNS (memo)
  // -----------------------------
  const digitPatterns = useMemo(() => {
    const hh = String(time.getHours()).padStart(2, "0");
    const mm = String(time.getMinutes()).padStart(2, "0");
    const ss = String(time.getSeconds()).padStart(2, "0");

    const base = [hh[0], hh[1], mm[0], mm[1], ss[0], ss[1]];

    return {
      p0: base,
      p3: [...base.slice(3), ...base.slice(0, 3)],
    };
  }, [time]);

  // -----------------------------
  // MEMO ROW LIST
  // -----------------------------
  const rowsArray = useMemo(() => {
    return Array.from({ length: ROWS }, (_, r) => r);
  }, []);

  // -----------------------------
  // ROW COMPONENT (memo)
  // -----------------------------
  const Row = useMemo(
    () =>
      React.memo(function Row({ r }) {
        const cols = new Array(COLS);

        for (let c = 0; c < COLS; c++) {
          const pattern = (c + r) % 2 === 0 ? digitPatterns.p0 : digitPatterns.p3;

          cols[c] = (
            <div key={c} className="digit-col">
              {pattern.map((digit, d) => {
                const rot = rotationArray[r * COLS * DIGITS + c * DIGITS + d];
                return (
                  <span
                    key={d}
                    className="digit-cell"
                    style={{ "--rot": `${rot}deg` }}
                  >
                    {digit}
                  </span>
                );
              })}
            </div>
          );
        }

        return <div className="digit-row">{cols}</div>;
      }),
    [digitPatterns, bucket]
  );

  // -----------------------------
  // RENDER
  // -----------------------------
  return (
    <>
      <div
        className="clock-bg"
        style={{ backgroundImage: `url(${bgImg2025_11_20})` }}
      />

      <div className="grid-wrapper">
        {rowsArray.map((r) => (
          <Row key={r} r={r} />
        ))}
      </div>

      {/* CSS */}
      <style>{`
        .clock-bg {
          position: fixed;
          inset: 0;
          background-size: cover;
          background-position: center;
          filter: saturate(0.2) brightness(1.4) contrast(0.5);
          z-index: -1;
        }

        .grid-wrapper {
          position: fixed;
          inset: 0;
          overflow: hidden;
          transform: rotate(17deg) scale(1.8);
          pointer-events: none;
        }

        .digit-row {
          display: flex;
          justify-content: center;
          margin: -4vh 0;
          white-space: nowrap;
        }

        .digit-col {
          display: inline-flex;
        }

        .digit-cell {
          font-family: ClockFont2025_11_20, monospace;
          font-size: 13vh;
          width: 11vh;
          height: 14vh;
          line-height: 14vh;
          text-align: center;
          display: inline-block;
          color: #851BE7FF;
          text-shadow: 0.5vh 0.2vh 0.8vh #000000,
                       -0.5px -0.5px 0 #F6F4DDFF;
          margin: -0.2vh -1.8vw;
          letter-spacing: -1vw;
          transform-origin: center;
          transform: rotate(var(--rot));
          transition: transform 0.6s cubic-bezier(0.2,0.8,0.4,1);
          will-change: transform;
          user-select: none;
        }
      `}</style>
    </>
  );
}
