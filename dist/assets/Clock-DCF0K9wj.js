import{r as n,j as e}from"./index-CRYDvM5t.js";const u="/assets/hour-CN2ekx3W.gif",f="/assets/minute-5zqTsXwV.gif",g="/assets/second-Bm66G1Px.gif",h="/assets/pp-C7uvRSZq.gif",p="/assets/peacock-Bai4rUSP.webp";function x(){const a=n.useRef(null),r=n.useRef(null),s=n.useRef(null),o=n.useRef(0);return n.useEffect(()=>{const c=()=>{const t=new Date,l=t.getMilliseconds(),i=t.getSeconds()+l/1e3,d=t.getMinutes()+i/60,m=t.getHours()%12+d/60;a.current&&(a.current.style.transform=`translate(-50%, -85%) rotate(${m*30}deg)`),r.current&&(r.current.style.transform=`translate(-50%, -85%) rotate(${d*6}deg)`),s.current&&(s.current.style.transform=`translate(-50%, -85%) rotate(${i*6}deg)`),o.current=requestAnimationFrame(c)};return o.current=requestAnimationFrame(c),()=>cancelAnimationFrame(o.current)},[]),e.jsxs("div",{className:"analog-clock",children:[e.jsx("style",{children:`
        .analog-clock {
          position: fixed;
          inset: 0;
          display: grid;
          place-items: center;
          overflow: hidden;
          background: url(${p}) center/cover no-repeat; /* static background */
        }
        .background {
          position: absolute;
          inset: -5%;
          background: url(${h}) center/cover no-repeat;
          z-index: 0;
        }
        .background.clockwise {
          animation: spin-cw 220s linear infinite;
          opacity: 0.6; /* opacity for clockwise layer */
        }
        .background.counter {
          animation: spin-ccw 220s linear infinite;
          opacity: 0.3; /* opacity for counter layer */
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
          filter: drop-shadow(0 0.3rem 0.5rem rgba(0,0,0,0.4));
          pointer-events: none;
        }
        .hour-hand { height: 11rem; z-index: 2; }
        .minute-hand { height: 13rem; z-index: 3; }
        .second-hand { height: 15rem; z-index: 4; }
        .center-dot {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 1.5rem;
          height: 1.5rem;
          border-radius: 50%;
          background: radial-gradient(circle, #eee, #555);
          box-shadow: 0 0 1rem rgba(0,0,0,0.5);
          z-index: 5;
        }
      `}),e.jsx("div",{className:"background clockwise"}),e.jsx("div",{className:"background counter"}),e.jsxs("div",{className:"clock-face","aria-label":"Analog clock",children:[e.jsx("img",{ref:a,src:u,alt:"hour hand",className:"hand hour-hand"}),e.jsx("img",{ref:r,src:f,alt:"minute hand",className:"hand minute-hand"}),e.jsx("img",{ref:s,src:g,alt:"second hand",className:"hand second-hand"}),e.jsx("div",{className:"center-dot"})]})]})}export{x as default};
