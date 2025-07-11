import React from "react";
import { useEffect } from 'react';
import antFontUrl from './Ant.ttf';
import bg1 from "./ants.gif"; // This one will tile (repeat)
import bg2 from "./ants1.gif"; // This one will cover (fit)

const Clock = () => {
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      {/* Tiling background (bottom) */}
      <div
        style={{
          backgroundImage: `url(${bg1})`,
          backgroundRepeat: "repeat", // tiles the image
          backgroundSize: "35vh 45vh",     // keep original size for tiling
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2,
        }}
      />

       <div
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",   // image fits and covers container
          backgroundPosition: "center",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 3, color: "red", padding: 20 }}>
        <h1>Double Backgrounds: Tiling + Cover</h1>
        <p>One background tiles while the other covers.</p>
      </div>
    </div>
  );
};

export default Clock;
