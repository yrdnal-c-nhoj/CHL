import{r as d,j as t}from"./index-Ch2k27Fp.js";const h="/assets/wood-BTMaF3vl.jpg",m="/assets/tiles-BghEn22A.jpg",g="/assets/hyd-BAYy05IC.ttf",p=()=>(d.useEffect(()=>{const a=()=>{const e=new Date,n=e.getSeconds(),s=e.getMinutes(),r=e.getHours()%12,i=n*6,c=s*6+n*.1,l=r*30+s*.5;document.getElementById("second-hand").style.transform=`rotate(${i}deg)`,document.getElementById("minute-hand").style.transform=`rotate(${c}deg)`,document.getElementById("hour-hand").style.transform=`rotate(${l}deg)`,document.getElementById("clock-time").textContent=`Current time: ${e.toLocaleTimeString()}`},o=()=>{a(),requestAnimationFrame(o)};o()},[]),d.useEffect(()=>{const a=document.getElementById("clock-numbers");for(let o=1;o<=12;o++){const e=document.createElement("div");e.className="number",e.textContent=o;const n=o*Math.PI*2/12-Math.PI/2,s=42,r=50+s*Math.cos(n),i=50+s*Math.sin(n);e.style.left=`${r}%`,e.style.top=`${i}%`,a.appendChild(e)}},[]),t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'hyd';
          src: url(${g}) format('truetype');
        }
        body {
          margin: 0;
          height: 100vh;
          background: linear-gradient(to top, #000000 0%, #122346 100%);
          overflow: hidden;
          perspective: 1000px;
        }
        .scene {
          width: 100%;
          height: 90%;
          transform-style: preserve-3d;
        }
        .grid-plane {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100vw;
          height: 100vh;
          transform: translate(-50%, -50%) rotateX(75deg);
          background-image: url(${h});
          background-size: 100% 100%;
          opacity: 0.7;
          filter: saturate(40%) contrast(190%);
          background-color: #d5caaf;
          z-index: 2;
        }
        .clock {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 95vw;
          height: 95vw;
          max-height: 95vh;
          max-width: 95vh;
          background-image: url(${m});
          background-size: 100% 100%;
          border: 1vw solid #d3ab0d;
          border-radius: 50%;
          transform: translate(-50%, -50%) rotateX(75deg) translateZ(1px);
          box-shadow: 0 3vh 5vh rgba(5, 6, 6, 0.3), 1px 1vh 1vh rgba(65, 33, 33);
          overflow: visible;
          z-index: 9;
          filter: contrast(110%) brightness(90%);
        }
        .hand {
          position: absolute;
          width: 50%;
          height: 0.7vh;
          top: 50%;
          left: 50%;
          transform-origin: left center;
          z-index: 5;
          transition: transform 0.1s linear;
        }
        .hour {
          width: 30%;
          height: 3vh;
          background: #067d79;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.7);
        }
        .minute {
          height: 1.8vh;
          background: #6c42ea;
          box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
        }
        .second {
          height: 0.8vh;
          background: red;
          box-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
          transition: transform 0s;
        }
        .numbers {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          transform: translateZ(5px);
          z-index: 10;
        }
        .number {
          position: absolute;
          font-family: 'hyd', 'Roboto Slab', sans-serif;
          font-size: 12vh;
          color: #393705;
          text-shadow: rgb(135, 55, 46) 1px 1px 1px;
          text-align: center;
          transform: translate(-50%, -50%);
          line-height: 1;
        }
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
      `}),t.jsxs("div",{className:"scene",children:[t.jsx("div",{className:"grid-plane"}),t.jsxs("div",{className:"clock",children:[t.jsx("div",{className:"numbers",id:"clock-numbers"}),t.jsx("div",{className:"hand hour",id:"hour-hand"}),t.jsx("div",{className:"hand minute",id:"minute-hand"}),t.jsx("div",{className:"hand second",id:"second-hand"})]})]}),t.jsx("div",{className:"sr-only",id:"clock-time","aria-live":"polite"})]}));export{p as default};
