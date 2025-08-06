import React, { useEffect, useState } from "react";
import clouds from "./clouds.gif";
import cloFont from "./clo.ttf";

const CloudClock = () => {
  const [hoursHTML, setHoursHTML] = useState("");
  const [minutesHTML, setMinutesHTML] = useState("");
  const [ampmHTML, setAmPmHTML] = useState("");

  const fontFace = `
    @font-face {
      font-family: 'CloFont';
      src: url(${cloFont}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `;

  const getStyledText = (str) =>
    str
      .split("")
      .map((char, i) => {
        const randomSize = (Math.random() * 11 + 1.5).toFixed(2); // 1.5rem–3.5rem
        return `<span class="digit" style="font-size: ${randomSize}rem;" data-key="${Date.now() + i}">${char}</span>`;
      })
      .join("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;

      setHoursHTML(getStyledText(String(h)));
      setMinutesHTML(getStyledText(String(m).padStart(2, "0")));
      setAmPmHTML(getStyledText(ampm));
    };

    updateTime();
    const interval = setInterval(updateTime, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{fontFace}</style>
      <style>{`
        * {
          CRT margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .digit {
          display: inline-block;
          line-height: 0.9;
          color: #E5EBF0FF;
          font-family: 'CloFont', serif;
          text-align: center;
          user-select: none;
          transition: 
            font-size 0.8s ease,
            opacity 0.8s ease,
            transform 0.8s ease;
          text-shadow: 
            19px 19px 0 #C9D2DEFF,
            -19px -19px 0 #E1E5EBFF,    
            0 -21px 0 #A8C4CCFF,
            -20px 0px 0 #A9B7D2FF,
            0 21px 0 #B3B8CEFF,
            20px 0px 0 #9FB5C1FF,
            -20px 23px 0 #CFD5DDFF,  
            20px -23px 0 #E3E7ECFF;  
          opacity: 0;
          transform: scale(0.8);
          animation: fadeIn 1s forwards;
        }

        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .timeStack {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'CloFont', serif;
          color: #bed3ef;
          text-align: center;
          gap: 0.2rem;
          z-index: 6;
        }

        @media (min-width: 768px) {
          .timeStack {
            flex-direction: row;
          }
        }
      `}</style>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          position: "relative",
          margin: 0,
          padding: 0,
          backgroundSize: "cover",
        }}
      >
        <div className="timeStack">
          <div id="hours" dangerouslySetInnerHTML={{ __html: hoursHTML }} />
          <div id="minutes" dangerouslySetInnerHTML={{ __html: minutesHTML }} />
          <div id="ampm" dangerouslySetInnerHTML={{ __html: ampmHTML }} />
        </div>

        <img
          src={clouds}
          alt="Clouds Background"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2,
            objectFit: "cover",
          }}
        />
        <img
          src={clouds}
          alt="Clouds Background Mirrored"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 2,
            objectFit: "cover",
            transform: "scaleX(-1)",
            opacity: 0.5,
          }}
        />
      </div>
    </>
  );
};

export default CloudClock;