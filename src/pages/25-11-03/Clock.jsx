import React, { useEffect, useState } from "react";
import digitalFontUrl from "./bin3.ttf"; 
import labelFontUrl from "./bin2.ttf";   
import techFontUrl from "./bin1.otf";    
import bgImage from "./bg.gif"; 

const digitalFont = "digitalFont";
const labelFont = "labelFont";
const techFont = "techFont";

export default function BinaryClockWithColumns() {
  const [time, setTime] = useState(new Date());
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // --- Update time every 500ms ---
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 500);
    return () => clearInterval(interval);
  }, []);

  // --- Load fonts and prevent FOUT ---
  useEffect(() => {
    Promise.all([
      document.fonts.load(`10pt ${digitalFont}`),
      document.fonts.load(`10pt ${labelFont}`),
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
      font-family: '${labelFont}'; 
      src: url(${labelFontUrl}) format('truetype'); 
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
    height: "100dvh",
    width: "100vw",
    overflow: "hidden",
  };

  const backgroundStyle = {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
    backgroundImage: `url(${bgImage})`,
    backgroundRepeat: "repeat",
    backgroundSize: "auto",
    backgroundPosition: "top left",
    filter: "hue-rotate(1deg) contrast(0.03) brightness(1.9) saturate(9.5)",
    zIndex: 0,
  };

  const columnsWrapperStyle = {
    display: "flex",
    gap: "0vw",
    padding: "0vh",
    position: "relative",
    zIndex: 1,
  };

  const columnContainerStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.1vh",
  };

  const labelStyle = {
    fontFamily: labelFont,
    fontSize: "1vh",
    width: "100%",
    color: "#D8F0EAFF",
    backgroundColor: "#555552FF",
    // marginBottom: "1vh",
    textAlign: "center",
    paddingTop: "1vh",
    paddingBottom: "1vh",
  };

  const binaryContainerStyle = {
    display: "flex",
    flexDirection: "column-reverse",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  };

  const digitBoxStyle = {
    width: "100%",
    flexShrink: 0,
    height: "5vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "6vh",
    fontFamily: digitalFont,
    color: "#09D509FF",
    backgroundColor: "#545451FF",
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
    color: bit === "1" ? "#ffffff" : "#000000",
    backgroundColor: bit === "1" ? "#1100CCFF" : "#EFFA26FF",
    margin: "0.1vh 0",
    transition: "all 0.3s ease",
  });

  const renderColumn = (label, bits, digit) => (
    <div style={columnContainerStyle}>
      <div style={labelStyle}>{label}</div>
      <div style={binaryContainerStyle}>
        {bits.map((bit, idx) => (
          <div key={idx} style={bitBoxStyle(bit)}>{bit}</div>
        ))}
      </div>
      <div style={digitBoxStyle}>{digit.toString().padStart(2, "0")}</div>
    </div>
  );

  const hours = formatBinary(time.getHours());
  const minutes = formatBinary(time.getMinutes());
  const seconds = formatBinary(time.getSeconds());

  // --- Don't render until fonts are ready ---
  if (!fontsLoaded) return null;

  return (
    <>
      <style>{globalFontFaces}</style>
      <div style={containerStyle}>
        <div style={backgroundStyle}></div>
        <div style={columnsWrapperStyle}>
          {renderColumn("H", hours, time.getHours())}
          {renderColumn("M", minutes, time.getMinutes())}
          {renderColumn("S", seconds, time.getSeconds())}
        </div>
      </div>
    </>
  );
}
