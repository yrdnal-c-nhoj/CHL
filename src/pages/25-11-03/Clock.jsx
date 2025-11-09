import React, { useEffect, useState } from "react";
import digitalFontUrl from "./bin3.ttf"; 
import techFontUrl from "./bin1.otf";    

const digitalFont = "digitalFont";
const techFont = "techFont";

export default function BinaryClockWithColumns() {
  const [time, setTime] = useState(new Date());
  const [overlayVisible, setOverlayVisible] = useState(true);

  // --- Update time every 50ms for smooth milliseconds ---
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  // --- Load fonts and prevent FOUT ---
  useEffect(() => {
    let cancelled = false;
    const finish = () => { if (!cancelled) setOverlayVisible(false); };

    if (document && document.fonts && document.fonts.load) {
      const ready = document.fonts.ready.catch(() => {});
      const l1 = document.fonts.load(`400 16px "${digitalFont}"`).catch(() => {});
      const l3 = document.fonts.load(`400 16px "${techFont}"`).catch(() => {});
      Promise.race([
        Promise.all([ready, l1, l3]),
        new Promise((res) => setTimeout(res, 2000)),
      ]).then(finish);
      return () => { cancelled = true; };
    } else {
      const t = setTimeout(finish, 300);
      return () => clearTimeout(t);
    }
  }, []);

  const formatBinary = (num) => num.toString(2).padStart(8, "0").split("");

  const globalFontFaces = `
    @font-face { 
      font-family: '${digitalFont}'; 
      src: url(${digitalFontUrl}) format('truetype'); 
      font-display: block;
    }
    @font-face { 
      font-family: '${techFont}'; 
      src: url(${techFontUrl}) format('opentype'); 
      font-display: block;
    }
  `;

  // --- STYLES ---
  const containerStyle = {
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100svh",
    width: "100vw",
    overflow: "hidden",
    paddingTop: "env(safe-area-inset-top)",
    paddingBottom: "env(safe-area-inset-bottom)",
    paddingLeft: "env(safe-area-inset-left)",
    paddingRight: "env(safe-area-inset-right)",
    WebkitTextSizeAdjust: "100%",
    textSizeAdjust: "100%",
  };

  const columnsWrapperStyle = {
    display: "flex",
    flexDirection: "row",
    gap: 0,
    padding: 0,
    position: "relative",
    zIndex: 1,
    width: "100%",
    height: "100%",
  };

  const columnContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "stretch",
    justifyContent: "stretch",
    padding: 0,
    flex: 1,
    height: "100%",
  };

  const binaryContainerStyle = {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "stretch",
    alignItems: "stretch",
    flex: 1,
    width: "100%",
  };

  const digitBoxStyle = {
    width: "100%",
    flexShrink: 0,
    height: "9vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "8vh",
    fontFamily: digitalFont,
    color: "#F713DCFF",
    backgroundColor: "#024236FF",
    paddingTop: "1vh",
    paddingBottom: "1vh",
    textShadow: `
      1px 1px 0 #000,
      -1px -1px 0 #000,
      1px -1px 0 #FFF,
      -1px 1px 0 #FFF
    `
  };

  const bitBoxStyle = (bit) => ({
    width: "100%",
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "7vh",
    fontFamily: techFont,
    color: bit === "1" ? "#F6F2F2FF" : "#020202FF",
    backgroundColor: bit === "1" ? "#1100CCFF" : "#EFFA26FF",
    margin: 0,
    transition: "all 0.3s ease",
  });

  const renderColumn = (_label, bits, digit) => (
    <div style={columnContainerStyle}>
      <div style={binaryContainerStyle}>
        {bits.map((bit, idx) => (
          <div key={idx} style={bitBoxStyle(bit)}>{bit}</div>
        ))}
      </div>
      <div style={digitBoxStyle}>{digit.toString().padStart(2, "0")}</div>
    </div>
  );

  // --- Time values ---
  const hours = formatBinary(time.getHours());
  const minutes = formatBinary(time.getMinutes());
  const seconds = formatBinary(time.getSeconds());
  const milliseconds = Math.floor(time.getMilliseconds() / 10); // 0-99
  const msBits = formatBinary(milliseconds);

  return (
    <>
      <style>{globalFontFaces}</style>
      <div style={containerStyle}>
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100svh",
            backgroundColor: "#000",
            opacity: overlayVisible ? 1 : 0,
            transition: "opacity 400ms ease-out",
            pointerEvents: "none",
            zIndex: 9999,
            willChange: "opacity",
            transform: "translateZ(0)",
          }}
        />
        <div style={columnsWrapperStyle}>
          {renderColumn("H", hours, time.getHours())}
          {renderColumn("M", minutes, time.getMinutes())}
          {renderColumn("S", seconds, time.getSeconds())}
          {renderColumn("MS", msBits, milliseconds)} {/* Milliseconds column */}
        </div>
      </div>
    </>
  );
}
