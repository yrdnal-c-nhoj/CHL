import{r as a,j as e}from"./index-9yDBTM3Q.js";const u="/assets/hour-CN2ekx3W.gif",g="/assets/minute-5zqTsXwV.gif",f="/assets/second-Bm66G1Px.gif",h="/assets/pp-C7uvRSZq.gif",p="/assets/p-CTRiXFhu.jpg",v="/assets/Pea-Mi_Ppt0N.gif",x="/assets/Pea2-BTuQWjI0.gif";function b(){const i=a.useRef(null),c=a.useRef(null),l=a.useRef(null),d=a.useRef(0),[y,k]=a.useState(!1);return a.useEffect(()=>{const n=[u,g,f,h,p,v,x];let t=0;const m=n.length,o=()=>{t+=1,t===m&&k(!0)};n.forEach(r=>{const s=new Image;s.src=r,s.onload=o,s.onerror=o})},[]),a.useEffect(()=>{const n=()=>{const t=new Date,m=t.getMilliseconds(),o=t.getSeconds()+m/1e3,r=t.getMinutes()+o/60,s=t.getHours()%12+r/60;i.current&&(i.current.style.transform=`translate(-50%, -85%) rotate(${s*30}deg)`),c.current&&(c.current.style.transform=`translate(-50%, -85%) rotate(${r*6}deg)`),l.current&&(l.current.style.transform=`translate(-50%, -85%) rotate(${o*6}deg)`),d.current=requestAnimationFrame(n)};return d.current=requestAnimationFrame(n),()=>cancelAnimationFrame(d.current)},[]),e.jsxs("div",{className:`analog-clock ${y?"loaded":""}`,children:[e.jsx("style",{children:`
        .analog-clock {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          background: url(${p}) center/cover no-repeat;
          opacity: 0;
          transition: opacity 1s ease-in;
        }
        .analog-clock.loaded {
          opacity: 1;
        }
        .background {
          position: absolute;
          inset: -5%;
          background: url(${h}) center/cover no-repeat;
          z-index: 0;
        }
        .background.clockwise {
          animation: spin-cw 290s linear infinite;
          opacity: 0.5;
        }
        .background.counter {
          animation: spin-ccw 290s linear infinite;
          opacity: 0.3;
        }
        @keyframes spin-cw {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(360deg) scale(1.5); }
        }
        @keyframes spin-ccw {
          from { transform: rotate(0deg) scale(1.5); }
          to { transform: rotate(-360deg) scale(1.5); }
        }
        .clock-face {
          position: relative;
          width: 90vmin; /* Increased to prevent clipping */
          height: 90vmin; /* Increased to prevent clipping */
          z-index: 1;
        }
        .hand {
          position: absolute;
          left: 50%;
          top: 50%;
          transform-origin: 50% 85%;
          will-change: transform;
          opacity: 0.8;
          filter: drop-shadow(0 0.3rem 0.5rem rgba(0,0,0,0.4));
          pointer-events: none;
          width: auto;
          max-height: 100%; /* Ensure hands scale within clock face */
        }
        .hour-hand { height: 11rem; z-index: 2; }
        .minute-hand { height: 13rem; z-index: 3; }
        .second-hand { height: 15rem; z-index: 4; }
        .overlay {
          position: absolute;
          z-index: 10;
          width: 70vw;
          height: auto;
          opacity: 0.3;
          pointer-events: none;
        }
        .overlay.top-left {
          top: 0vh;
          left: 0vw;
        }
        .overlay.bottom-right {
          bottom: 0vh;
          right: 0vw;
        }
      `}),e.jsx("div",{className:"background clockwise"}),e.jsx("div",{className:"background counter"}),e.jsxs("div",{className:"clock-face","aria-label":"Analog clock",children:[e.jsx("img",{ref:i,src:u,alt:"hour hand",className:"hand hour-hand"}),e.jsx("img",{ref:c,src:g,alt:"minute hand",className:"hand minute-hand"}),e.jsx("img",{ref:l,src:f,alt:"second hand",className:"hand second-hand"})]}),e.jsx("img",{src:v,alt:"top left overlay",className:"overlay top-left"}),e.jsx("img",{src:x,alt:"bottom right overlay",className:"overlay bottom-right"})]})}export{b as default};
