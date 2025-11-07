import React, { useEffect, useState } from "react";
import digitalFontUrl from "./bin3.ttf"; 
import techFontUrl from "./bin1.otf";    

const digitalFont = "digitalFont";
const techFont = "techFont";

export default function BinaryClockWithColumns() {
  const [time, setTime] = useState(new Date());
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // --- Update time every 50ms for smooth milliseconds ---
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 50);
    return () => clearInterval(interval);
  }, []);

  // --- Load fonts and prevent FOUT ---
  useEffect(() => {
    Promise.all([
      document.fonts.load(`10pt ${digitalFont}`),
      document.fonts.load(`10pt ${techFont}`)
    ]).then(() => setFontsLoaded(true));
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

  // Background removed per request

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
    height: "5vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "5vh",
    fontFamily: digitalFont,
    color: "#27F027FF",
    backgroundColor: "#400C28FF",
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

  // --- Don't render until fonts are ready ---
  if (!fontsLoaded) return null;

  return (
    <>
      <style>{globalFontFaces}</style>
      <div style={containerStyle}>
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
