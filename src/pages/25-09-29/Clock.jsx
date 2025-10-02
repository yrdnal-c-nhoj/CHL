import React, { useState, useEffect } from "react";
import comicFont from "./actionj.ttf";

export default function ComicClock() {
  const [fontLoaded, setFontLoaded] = useState(false);
  const [time, setTime] = useState(new Date());

  // Load font
  useEffect(() => {
    const font = new FontFace("ComicFont", `url(${comicFont})`);
    font.load().then(() => {
      document.fonts.add(font);
      setFontLoaded(true);
    });
  }, []);

  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!fontLoaded) return null;

  const comicStyle = {
    display: "flex",
    flexWrap: "wrap",
    fontFamily: "ComicFont, cursive",
    padding: "1vmin",
    height: "100vh",
    boxSizing: "border-box",
    background: "#F3E9D6FF",
  };

  const panelBaseStyle = {
    display: "flex",
    flex: "1 1 auto",
    height: "calc((100vh - 7vmin) / 3)",
    margin: "1vmin",
    overflow: "hidden",
    position: "relative",
    border: "0.2rem solid black",
    boxSizing: "border-box",
    justifyContent: "center",
    alignItems: "center",
  };

  const digitStyle = {
    fontFamily: "ComicFont, cursive",
    fontSize: "8vw",
  };

  // NEW: Digit bubble style (round)
  const digitBubbleStyle = {
    position: "relative",
    padding: "0.5rem 1rem",
    background: "#F3E9D6FF",
    border: "0.25rem solid black",
    borderRadius: "50%",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "4rem",
    minHeight: "4rem",
    boxShadow: "2px 2px 0px black",
  };

  // NEW: Text bubble style (rectangular narration)
  const textBubbleStyle = {
    position: "relative",
    padding: "0.1rem 0.15rem",
    background: "#F3E9D6FF",
    border: "0.2rem solid black",
    borderRadius: "0.8rem",
    display: "inline-block",
    textAlign: "center",
    fontSize: "2vw",
    lineHeight: 1.2,
  };

  const cheapComicBackground = (baseColor, dotColor = "rgba(0,0,0,0.15)") => ({
    backgroundColor: baseColor,
    backgroundImage: `radial-gradient(${dotColor} 0.5px, transparent 0.5px)`,
    backgroundSize: "4px 4px",
  });

  const hours = time.getHours() % 12 || 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = time.getHours() >= 12 ? "PM" : "AM";

  const createBubbleContent = (digit) => (
    <div style={digitBubbleStyle}>
      <span style={digitStyle}>{digit}</span>
    </div>
  );

  const panels = [
    {
      content: createBubbleContent(Math.floor(hours / 10)),
      flexBasis: "40vw",
      background: cheapComicBackground("lightblue"),
      text: (
        <p
          style={{
            ...textBubbleStyle,
            position: "absolute",
            top: "-0.5rem",
            left: "-0.2rem",
          }}
        >
          BY THAT TIME...
        </p>
      ),
    },
    {
      content: createBubbleContent(hours % 10),
      flexBasis: "30vw",
      background: cheapComicBackground("#CFF3A8FF"),
    },
    {
      content: null,
      flexBasis: "20vw",
      background: cheapComicBackground("#F0DF6EFF"),
      text: (
        <p
          style={{
            ...textBubbleStyle,
            position: "absolute",
            top: "0.5rem",
            right: "-0.2rem",
          }}
        >
          ...they knew...
        </p>
      ),
    },
    {
      content: createBubbleContent(Math.floor(minutes / 10)),
      flexBasis: "20vw",
      background: cheapComicBackground("#F18F84FF"),
      text: (
        <p
          style={{
            ...textBubbleStyle,
            position: "absolute",
            top: "-0.5rem",
            left: "-0.2rem",
          }}
        >
          ...it would...
        </p>
      ),
    },
    {
      content: createBubbleContent(minutes % 10),
      flexBasis: "20vw",
      background: cheapComicBackground("#F1B24BFF"),
    },
    {
      content: createBubbleContent(Math.floor(seconds / 10)),
      flexBasis: "20vw",
      background: cheapComicBackground("lightblue"),
    },
    {
      content: createBubbleContent(seconds % 10),
      flexBasis: "20vw",
      background: cheapComicBackground("#F18F84FF"),
    },
    {
      content: createBubbleContent(ampm[0]),
      flexBasis: "20vw",
      background: cheapComicBackground("#F0DF6EFF"),
      text: (
        <p
          style={{
            ...textBubbleStyle,
            position: "absolute",
            top: "-0.7rem",
            left: "-0.5rem",
          }}
        >
          ...not...
        </p>
      ),
    },
    {
      content: createBubbleContent(ampm[1]),
      flexBasis: "30vw",
      background: cheapComicBackground("#CFF3A8FF"),
      text: (
        <p
          style={{
            ...textBubbleStyle,
            position: "absolute",
            bottom: "-0.2rem",
            right: "-0.5rem",
          }}
        >
          ...stop...
        </p>
      ),
    },
  ];

  return (
    <article style={comicStyle}>
      {panels.map((panel, idx) => (
        <div
          key={idx}
          style={{
            ...panelBaseStyle,
            flexBasis: panel.flexBasis,
            backgroundColor: panel.background.backgroundColor,
            backgroundImage: panel.background.backgroundImage,
            backgroundSize: panel.background.backgroundSize,
          }}
        >
          {panel.content}
          {panel.text}
        </div>
      ))}
    </article>
  );
}
