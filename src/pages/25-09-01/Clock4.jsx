// File: NonWesternFonts.jsx
import React from "react";

// Import local fonts (place these .ttf/.otf in the same folder)
import ChineseFont from "./NotoSansSC-Regular.otf";
import ArabicFont from "./Scheherazade-Regular.ttf";
import DevanagariFont from "./NotoSansDevanagari-Regular.ttf";

const NonWesternFonts = () => {
  const textStyles = {
    chinese: {
      fontFamily: "NotoSansSC, sans-serif",
      fontSize: "3rem",
      margin: "2rem 0",
    },
    arabic: {
      fontFamily: "Scheherazade, serif",
      fontSize: "3rem",
      margin: "2rem 0",
      direction: "rtl",
      unicodeBidi: "embed",
    },
    devanagari: {
      fontFamily: "NotoSansDevanagari, sans-serif",
      fontSize: "3rem",
      margin: "2rem 0",
    },
  };

  return (
    <div style={{ padding: "2rem" }}>
      {/* Define font-faces locally */}
      <style>
        {`
          @font-face {
            font-family: 'NotoSansSC';
            src: url(${ChineseFont}) format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'Scheherazade';
            src: url(${ArabicFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
          @font-face {
            font-family: 'NotoSansDevanagari';
            src: url(${DevanagariFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <p style={textStyles.chinese}>你好，世界</p>
      <p style={textStyles.arabic}>مرحبا بالعالم</p>
      <p style={textStyles.devanagari}>नमस्ते दुनिया</p>
    </div>
  );
};

export default NonWesternFonts;
