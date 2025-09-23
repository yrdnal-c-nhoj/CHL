import{r as t,j as e}from"./index-D5DjY_nl.js";const u="/assets/hour-CN2ekx3W.gif",g="/assets/minute-5zqTsXwV.gif",f="/assets/second-Bm66G1Px.gif",h="/assets/pp-C7uvRSZq.gif",p="/assets/p-CTRiXFhu.jpg",v="/assets/Pea-Mi_Ppt0N.gif",x="/assets/Pea2-BTuQWjI0.gif";function k(){const s=t.useRef(null),a=t.useRef(null),o=t.useRef(null),r=t.useRef(0);return t.useEffect(()=>{const i=()=>{const n=new Date,d=n.getMilliseconds(),c=n.getSeconds()+d/1e3,l=n.getMinutes()+c/60,m=n.getHours()%12+l/60;s.current&&(s.current.style.transform=`translate(-50%, -85%) rotate(${m*30}deg)`),a.current&&(a.current.style.transform=`translate(-50%, -85%) rotate(${l*6}deg)`),o.current&&(o.current.style.transform=`translate(-50%, -85%) rotate(${c*6}deg)`),r.current=requestAnimationFrame(i)};return r.current=requestAnimationFrame(i),()=>cancelAnimationFrame(r.current)},[]),e.jsxs("div",{className:"analog-clock",children:[e.jsx("style",{children:`
        .analog-clock {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: url(${p}) center/cover no-repeat;
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
          width: 80vmin;
          height: 80vmin;
          overflow: hidden;
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
        }
        .hour-hand { height: 11rem; z-index: 2; }
        .minute-hand { height: 13rem; z-index: 3; }
        .second-hand { height: 15rem; z-index: 4; }

        /* Overlay images */
        .overlay {
          position: absolute;
          z-index: 10; /* highest layer */
          width: 70vw; /* adjust size */
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
      `}),e.jsx("div",{className:"background clockwise"}),e.jsx("div",{className:"background counter"}),e.jsxs("div",{className:"clock-face","aria-label":"Analog clock",children:[e.jsx("img",{ref:s,src:u,alt:"hour hand",className:"hand hour-hand"}),e.jsx("img",{ref:a,src:g,alt:"minute hand",className:"hand minute-hand"}),e.jsx("img",{ref:o,src:f,alt:"second hand",className:"hand second-hand"})]}),e.jsx("img",{src:v,alt:"top left overlay",className:"overlay top-left"}),e.jsx("img",{src:x,alt:"bottom right overlay",className:"overlay bottom-right"})]})}export{k as default};
