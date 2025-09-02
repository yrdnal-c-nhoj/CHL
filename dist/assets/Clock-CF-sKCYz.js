import{r as p,j as e}from"./index-CtpJRlFd.js";const d="/assets/cam-BBSpB4DN.otf",m="/assets/cam-Bz0QzPgV.webp",b="/assets/camr-DeCU43Bf.webp",g="/assets/ca-T9tuVB6L.webp",u="/assets/camer-DJIombdV.webp",x=()=>(p.useEffect(()=>{const f=document.getElementById("fstop-hourHand"),c=document.getElementById("fstop-minuteHand"),s=document.getElementById("fstop-secondHand"),t=()=>{const a=new Date,i=a.getSeconds(),o=a.getMinutes(),r=a.getHours()%12;f.style.transform=`rotate(${(r+o/60)*30}deg)`,c.style.transform=`rotate(${(o+i/60)*6}deg)`,s.style.transform=`rotate(${i*6}deg)`};t();const n=setInterval(t,1e3);return()=>clearInterval(n)},[]),p.useEffect(()=>{const f=document.querySelector(".fstop-clock"),c=["f/1.0","f/1.4","f/2.0","f/2.8","f/4.0","f/5.6","f/8.0","f/11","f/16","f/22","f/32","f/45"],s=[];for(;s.length<6;){const t=Math.floor(Math.random()*12);s.includes(t)||s.push(t)}for(let t=1;t<=12;t++){const n=t/12*2*Math.PI,a=50+42*Math.sin(n),i=50-42*Math.cos(n),o=document.createElement("div"),r=s.includes(t-1);o.className=`fstop-number ${r?"fstop-sharp":""}`,o.style.left=`${a}%`,o.style.top=`${i}%`,o.textContent=c[t-1];const l=Math.random()*10;o.style.animation=`fstop-blurFocus${r?"Sharp":""} 5s infinite ${l}s`,f.appendChild(o)}},[]),e.jsxs("div",{className:"fstop-wrapper",style:{margin:0,background:"#111",height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'fstop-cam';
          src: url(${d}) format('opentype');
        }

        .fstop-wrapper {
          font-size: 2vh;
        }

        .fstop-clock {
          width: 80vw;
          height: 80vw;
          max-width: 80vh;
          max-height: 80vh;
          border-radius: 50%;
          position: relative;
          opacity: 0.6;
          z-index: 9;
        }

        .fstop-number {
          position: absolute;
          font-family: 'fstop-cam';
          font-size: 2rem;
          color: white;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #e0e0e0 0%, #f8f8f8 20%, #b0b0b0 50%, #f0f0f0 80%, #d0d0d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow:
            0 0 0.3rem #ffffffaa,
            0 0 0.6rem #ccccccaa,
            0 0 0.9rem #bbbbbb88;
        }

        .fstop-sharp {
          font-weight: 900;
          text-rendering: optimizeLegibility;
          -webkit-font-smoothing: antialiased;
          background: linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #f0f0f0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow: none;
        }

        @keyframes fstop-blurFocus {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.3;
          }
        }

        @keyframes fstop-blurFocusSharp {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }

        @keyframes fstop-blurFocusHour {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.5;
          }
        }

        @keyframes fstop-blurFocusMinute {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.5;
          }
        }

        @keyframes fstop-blurFocusSecond {
          0%, 100% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(3px);
            opacity: 0.7;
          }
        }

        .fstop-hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          border-radius: 0.3rem;
          background: linear-gradient(
            to top,
            #cccccc 0%,
            #eeeeee 25%,
            #8d8b8b 50%,
            #ffffff 75%,
            #888888 100%
          );
        }

        .fstop-hour {
          width: 1rem;
          height: 20%;
          animation: fstop-blurFocusHour 5s infinite;
        }

        .fstop-minute {
          width: 0.7rem;
          height: 30%;
          background: #ccc;
          animation: fstop-blurFocusMinute 3s infinite;
        }

        .fstop-second {
          width: 0.3rem;
          height: 40%;
          animation: fstop-blurFocusSecond 1s infinite;
        }

        .fstop-bgimage, .fstop-bgimage2, .fstop-bgimage3, .fstop-bgimage4 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          filter: brightness(120%);
        }

        .fstop-bgimage2 { z-index: 1; }
        .fstop-bgimage  { z-index: 2; opacity: 0.5; }
        .fstop-bgimage3 { z-index: 3; opacity: 0.4; }
        .fstop-bgimage4 { z-index: 4; opacity: 0.2; width: 104vw; }
      `}),e.jsx("img",{src:u,className:"fstop-bgimage4",alt:"bg4"}),e.jsx("img",{src:g,className:"fstop-bgimage3",alt:"bg3"}),e.jsx("img",{src:m,className:"fstop-bgimage",alt:"bg1"}),e.jsx("img",{src:b,className:"fstop-bgimage2",alt:"bg2"}),e.jsxs("div",{className:"fstop-clock",children:[e.jsx("div",{className:"fstop-hand fstop-hour",id:"fstop-hourHand"}),e.jsx("div",{className:"fstop-hand fstop-minute",id:"fstop-minuteHand"}),e.jsx("div",{className:"fstop-hand fstop-second",id:"fstop-secondHand"})]})]}));export{x as default};
