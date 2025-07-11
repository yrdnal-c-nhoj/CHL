import React, { useEffect, useState } from "react";
import clouds from "./clouds.gif";
import cloFont from "./clo.ttf";

const CloudClock = () => {
  const [hoursHTML, setHoursHTML] = useState("");
  const [minutesHTML, setMinutesHTML] = useState("");
  const [secondsHTML, setSecondsHTML] = useState("");
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
      .map((char) => {
        const randomSize = (Math.random() * 9 + 1.5).toFixed(2); // 1.5rem to 3.5rem
        return `<span class="digit" style="font-size: ${randomSize}rem;">${char}</span>`;
      })
      .join("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds();

      const ampm = h >= 12 ? "PM" : "AM";
      h = h % 12;
      if (h === 0) h = 12;

      setHoursHTML(getStyledText(String(h)));
      setMinutesHTML(getStyledText(String(m).padStart(2, "0")));
      setSecondsHTML(getStyledText(String(s).padStart(2, "0")));
      setAmPmHTML(getStyledText(ampm));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{fontFace}</style>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .digit {
          display: inline-block;
          line-height: 1;
          color: #bed3ef;
          font-family: 'CloFont', serif;
          text-align: center;
          user-select: none;
          transition: font-size 0.3s ease;
        }
        .digit-group {
          display: flex;
          gap: 0rem;
          justify-content: center;
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
        <div
          className="timeStack"
          style={{
            display: "flex",
            flexDirection: "row",
            zIndex: 6,
            fontFamily: "'CloFont', serif",
            color: "#bed3ef",
            fontSize: "2.5rem",
            textAlign: "center",
            gap: "0rem",
          }}
        >
          <div
            id="hours"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            dangerouslySetInnerHTML={{ __html: hoursHTML }}
          />
          <div
            id="minutes"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            dangerouslySetInnerHTML={{ __html: minutesHTML }}
          />
          <div
            id="seconds"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            dangerouslySetInnerHTML={{ __html: secondsHTML }}
          />
          <div
            id="ampm"
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            dangerouslySetInnerHTML={{ __html: ampmHTML }}
          />
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
