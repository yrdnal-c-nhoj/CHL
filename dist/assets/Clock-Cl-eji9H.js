import{r as c,j as e}from"./index-DL87iDAH.js";const h="/assets/3ce69531311986a8a78f1e093f53df3d-ezgif.com-optiwebp-CmcgD_uY.webp",p=()=>(c.useEffect(()=>{const t=()=>{const a=new Date,r=a.getSeconds(),n=a.getMinutes(),s=a.getHours(),i=r/60*360,d=n/60*360+r/60*6,l=s%12/12*360+n/60*30;document.querySelector(".second-hand").style.transform=`translateX(-50%) rotate(${i}deg)`,document.querySelector(".minute-hand").style.transform=`translateX(-50%) rotate(${d}deg)`,document.querySelector(".hour-hand").style.transform=`translateX(-50%) rotate(${l}deg)`};t();const o=setInterval(t,1e3);return()=>clearInterval(o)},[]),e.jsxs("div",{style:{position:"relative",width:"100vw",height:"100vh",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("img",{src:h,alt:"background",className:"full-page-image"}),e.jsx("div",{className:"clock",children:e.jsx("div",{id:"radar",children:e.jsxs("div",{className:"clock-face",children:[e.jsx("div",{className:"hand hour-hand"}),e.jsx("div",{className:"hand minute-hand"}),e.jsx("div",{className:"hand second-hand"}),e.jsx("div",{className:"center"})]})})}),e.jsx("style",{children:`
        :root {
          --g: rgb(14, 238, 14);
          --bg-lines: rgb(2, 67, 2);
          --bg-screen: #000100;
          --line-opacity: 1.0;
          --radial-opacity: 1.0;
          --trail-length: 90deg;
          --blend: color-dodge;
          --speed: 60s;
        }

        .full-page-image {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: contrast(200%) brightness(40%);
          z-index: 1;
        }

        .clock {
          position: relative;
          z-index: 4;
        }

        #radar {
          position: relative;
          width: 99vmin;
          aspect-ratio: 1;
          opacity: 90%;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #72706a;
          border-radius: 50%;
          z-index: 3;
        }

        #radar::before,
        #radar::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 95%;
          aspect-ratio: 1;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        #radar::before {
          z-index: -1;
          background-color: var(--bg-screen);
          background-image:
            linear-gradient(to bottom, transparent 50%, hsl(from var(--bg-lines) h s l / var(--line-opacity)), transparent calc(50% + 1px)),
            linear-gradient(to right, transparent 50%, hsl(from var(--bg-lines) h s l / var(--line-opacity)), transparent calc(50% + 1px)),
            linear-gradient(45deg, transparent 50%, hsl(from var(--bg-lines) h s l / var(--line-opacity)), transparent calc(50% + 1px)),
            linear-gradient(-45deg, transparent 50%, hsl(from var(--bg-lines) h s l / var(--line-opacity)), transparent calc(50% + 1px)),
            repeating-radial-gradient(hsl(from var(--bg-lines) h s l / var(--radial-opacity)) 0, transparent 1px 2.5vmin, hsl(from var(--bg-lines) h s l / var(--radial-opacity)) calc(2.5vmin + 1px));
        }

        #radar::after {
          background-image: conic-gradient(#000 var(--trail-length), var(--g) 360deg);
          mix-blend-mode: var(--blend);
          animation: rotate var(--speed) linear infinite;
        }

        @keyframes rotate {
          to {
            transform: translate(-50%, -50%) rotate(1turn);
          }
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background-color: #0bf226;
        }

        .hour-hand {
          width: 2vh;
          height: 15vh;
          border-radius: 3px;
        }

        .minute-hand {
          width: 1vh;
          height: 25vh;
          border-radius: 2px;
        }

        .second-hand {
          width: 0.5vh;
          height: 30vh;
          border-radius: 1px;
          background-color: transparent;
        }

        .center {
          position: absolute;
          width: 1.5vh;
          height: 1.5vh;
          background-color: transparent;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
        }
      `})]}));export{p as default};
