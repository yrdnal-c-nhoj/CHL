import React, { useEffect, useRef } from "react";
import backgroundImage from "./1937.696_print-scaled.jpg";
import flakesGif from "./Z3ut.gif";
import sgSnow from "./sg-snow.gif";
import snow659 from "./659.gif";
import snow01 from "./snow01.gif";
import snow02 from "./snow02.gif";
import sno from "./sno.gif";
import snow7 from "./snow-gif-7.gif";
import flakes from "./flakes.gif";
import eref from "./eref.gif";
import amaticRegular from "./amati.ttf";

export default function BlizzardClock() {
  const clockRef = useRef(null);

  // Inject font-face rule
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @font-face {
        font-family: 'amati';
        src: url(${amaticRegular}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // Update clock in real-time
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      if (clockRef.current) {
        clockRef.current.textContent = `${hours}:${minutes}`;
      }
      requestAnimationFrame(updateClock);
    };
    updateClock();
  }, []);

  const cellStyle = {
    border: "0.4rem solid #483206",
    boxShadow: "inset 0 0 1.5rem 1rem rgba(236, 205, 252, 0.7)",
  };

  return (
    <div
      style={{
        margin: 0,
        padding: 0,
        height: "100vh",
        width: "100vw",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "100%",
        backgroundPosition: "center",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Clock Table */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          position: "relative",
          zIndex: 2,
        }}
      >
        <table
          style={{
            width: "80vw",
            height: "80vh",
            backgroundColor: "rgb(19, 83, 162)",
            borderCollapse: "collapse",
            border: "2vh solid #483206",
          }}
        >
          <tbody>
            <tr>
              <td
                style={{
                  ...cellStyle,
                  height: "17vh",
                  width: "17vw",
                  backgroundImage: `url(${sgSnow}), url(${snow659})`,
                  backgroundRepeat: "repeat, no-repeat",
                }}
              />
              <td
                style={{
                  ...cellStyle,
                  backgroundImage: `url(${snow659}), url(${flakes})`,
                  backgroundRepeat: "no-repeat, repeat",
                }}
              />
              <td
                style={{
                  ...cellStyle,
                  height: "17vh",
                  width: "17vw",
                  backgroundImage: `url(${sgSnow}), url(${snow659})`,
                  backgroundRepeat: "repeat, no-repeat",
                }}
              />
            </tr>
            <tr>
              <td
                style={{
                  ...cellStyle,
                  backgroundImage: `url(${snow01})`,
                  backgroundRepeat: "repeat",
                }}
              />
              <td
                style={{
                  ...cellStyle,
                  backgroundImage: `url(${eref}), url(${snow02}), url(${sno}), url(${snow7}), url(${sgSnow}), url(${flakes})`,
                  backgroundRepeat: "repeat",
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                <div
                  ref={clockRef}
                  style={{
                    fontSize: "20vw",
                    color: "rgb(237, 237, 249)",
                    fontFamily: "'amati', serif",
                    transform: "scale(1, 2)",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                />
              </td>
              <td
                style={{
                  ...cellStyle,
                  backgroundImage: `url(${snow01})`,
                  backgroundRepeat: "repeat",
                }}
              />
            </tr>
            <tr>
              <td
                style={{
                  ...cellStyle,
                  backgroundImage: `url(${eref})`,
                  backgroundRepeat: "repeat",
                }}
              />
              <td
                style={{
                  ...cellStyle,
                  backgroundImage: `url(${eref})`,
                  backgroundRepeat: "repeat",
                }}
              />
              <td
                style={{
                  ...cellStyle,
                  height: "17vh",
                  width: "17vw",
                  backgroundImage: `url(${eref})`,
                  backgroundRepeat: "repeat",
                }}
              />
            </tr>
          </tbody>
        </table>
      </div>

      {/* Snow Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "200vw",
          height: "200vh",
          backgroundImage: `url(${flakesGif})`,
          backgroundSize: "100% 100%",
          opacity: 0.6,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
