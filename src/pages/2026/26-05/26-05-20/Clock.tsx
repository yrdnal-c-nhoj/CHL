import React from "react";

import "./dist/style.css";

export default function Clock() {
  return (
    <>
      <svg width="0" height="0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="brushedMetalEffect" x="0" y="0">
            <feComponentTransfer in="SourceGraphic" result="metal">
              <feFuncR type="gamma" amplitude="1.21" exponent="0.53" />
              <feFuncG type="gamma" amplitude="1.21" exponent="0.53" />
              <feFuncB type="gamma" amplitude="1.21" exponent="0.5" />
            </feComponentTransfer>
            <feBlend in="SourceGraphic" in2="metal" mode="overlay" />
          </filter>
        </defs>
      </svg>

      <section className="frame">
        <div className="doors">
          <div className="door left-door" />
          <div className="door right-door" />
        </div>
        <div className="inside">inside</div>
      </section>
    </>
  );
}

