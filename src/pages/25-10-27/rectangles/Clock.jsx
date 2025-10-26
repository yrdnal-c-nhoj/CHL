import React, { useState, useEffect } from "react";
import font20250926 from "./four.ttf"; // Local font
import bgImage from "./wall.jpg"; // Local image
export default function PreloadDigitalClock() {
const [fontLoaded, setFontLoaded] = useState(false);
const [imageLoaded, setImageLoaded] = useState(false);
const [time, setTime] = useState(new Date());
// Preload the font
useEffect(() => {
const font = new FontFace("DigitalFont", `url(${font20250926})`);
font.load().then((loadedFont) => {
document.fonts.add(loadedFont);
setFontLoaded(true);
 });
 }, []);
// Preload the image
useEffect(() => {
if (!fontLoaded) return;
const img = new Image();
img.src = bgImage;
img.onload = () => setImageLoaded(true);
 }, [fontLoaded]);
// Update the clock every second
useEffect(() => {
if (!fontLoaded || !imageLoaded) return;
const interval = setInterval(() => setTime(new Date()), 1000);
return () => clearInterval(interval);
 }, [fontLoaded, imageLoaded]);
// 24-hour format with leading zeros
const hours = time.getHours().toString().padStart(2, "0");
const minutes = time.getMinutes().toString().padStart(2, "0");
const seconds = time.getSeconds().toString().padStart(2, "0");
// Inline styles
const containerStyle = {
 width: "100vw",
 height: "100dvh",
 display: "flex",
 justifyContent: "center",
 alignItems: "center",
 backgroundImage: imageLoaded ? `url(${bgImage})` : "none",
 backgroundSize: "cover",
 backgroundPosition: "center",
 color: "#280808FF",
 fontFamily: fontLoaded ? "DigitalFont, monospace" : "monospace",
 fontSize: "8rem",
 flexDirection: "row",
 };
const digitBoxStyle = {
 width: "5rem",
 height: "8rem",
 display: "flex",
 justifyContent: "center",
 alignItems: "center",
 margin: "0 0.3rem",

 };
const colonBoxStyle = {
 width: "2rem",
 height: "8rem",
 display: "flex",
 justifyContent: "center",
 alignItems: "center",
 flexDirection: "column",
 margin: "0 0.3rem",
 color: "#ffffff",
 fontFamily: fontLoaded ? "DigitalFont, monospace" : "monospace",
 };

const squareStyle = {
 width: "0.8rem",
 height: "0.8rem",
 backgroundColor: "#ffffff",
 margin: "0.5rem 0",
 };

if (!fontLoaded || !imageLoaded) {
return <div style={{ width: "100vw", height: "100dvh", backgroundColor: "#000" }} />;
 }
return (
<div style={containerStyle}>
{/* Hours */}
<div style={digitBoxStyle}>{hours[0]}</div>
<div style={digitBoxStyle}>{hours[1]}</div>
{/* Colon */}
<div style={colonBoxStyle}>
  <div style={squareStyle}></div>
  <div style={squareStyle}></div>
</div>
{/* Minutes */}
<div style={digitBoxStyle}>{minutes[0]}</div>
<div style={digitBoxStyle}>{minutes[1]}</div>
{/* Colon */}
<div style={colonBoxStyle}>
  <div style={squareStyle}></div>
  <div style={squareStyle}></div>
</div>
{/* Seconds */}
<div style={digitBoxStyle}>{seconds[0]}</div>
<div style={digitBoxStyle}>{seconds[1]}</div>
</div>
 );
}