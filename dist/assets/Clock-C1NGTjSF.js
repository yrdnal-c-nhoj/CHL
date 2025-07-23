import{r as f,j as e}from"./index-B3uyj-Zi.js";const m="/assets/cam-BBSpB4DN.otf",b="/assets/cam-Bz0QzPgV.webp",u="/assets/camr-DeCU43Bf.webp",g="/assets/ca-T9tuVB6L.webp",p="/assets/camer-DJIombdV.webp",x=()=>(f.useEffect(()=>{const c=document.getElementById("hourHand"),l=document.getElementById("minuteHand"),i=document.getElementById("secondHand"),t=()=>{const o=new Date,s=o.getSeconds(),a=o.getMinutes(),r=o.getHours()%12;c.style.transform=`rotate(${(r+a/60)*30}deg)`,l.style.transform=`rotate(${(a+s/60)*6}deg)`,i.style.transform=`rotate(${s*6}deg)`};t();const n=setInterval(t,1e3);return()=>clearInterval(n)},[]),f.useEffect(()=>{const c=document.querySelector(".clock"),l=["f/1.0","f/1.4","f/2.0","f/2.8","f/4.0","f/5.6","f/8.0","f/11","f/16","f/22","f/32","f/45"],i=[];for(;i.length<6;){const t=Math.floor(Math.random()*12);i.includes(t)||i.push(t)}for(let t=1;t<=12;t++){const n=t/12*2*Math.PI,o=50+42*Math.sin(n),s=50-42*Math.cos(n),a=document.createElement("div"),r=i.includes(t-1);a.className=`number ${r?"sharp":""}`,a.style.left=`${o}%`,a.style.top=`${s}%`,a.textContent=l[t-1];const d=Math.random()*10;a.style.animation=`blurFocus${r?"Sharp":""} 5s infinite ${d}s`,c.appendChild(a)}},[]),e.jsxs("div",{style:{margin:0,background:"#111",height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'cam';
          src: url(${m}) format('opentype');
        }

        :root {
          font-size: 2vh;
        }

        .clock {
          width: 80vw;
          height: 80vw;
          max-width: 80vh;
          max-height: 80vh;
          border-radius: 50%;
          position: relative;
          opacity: 0.6;
          z-index: 9;
        }

        .number {
          position: absolute;
          font-family: 'cam';
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

        .sharp {
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

        @keyframes blurFocus {
          0% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.3;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes blurFocusSharp {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
          100% {
            opacity: 1;
          }
        }

        @keyframes blurFocusHour {
          0% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.5;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes blurFocusMinute {
          0% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(5px);
            opacity: 0.5;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        @keyframes blurFocusSecond {
          0% {
            filter: blur(0px);
            opacity: 1;
          }
          50% {
            filter: blur(3px);
            opacity: 0.7;
          }
          100% {
            filter: blur(0px);
            opacity: 1;
          }
        }

        .hand {
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

        .hour {
          width: 1rem;
          height: 20%;
          animation: blurFocusHour 5s infinite;
        }

        .minute {
          width: 0.7rem;
          height: 30%;
          background: #ccc;
          animation: blurFocusMinute 3s infinite;
        }

        .second {
          width: 0.3rem;
          height: 40%;
          animation: blurFocusSecond 1s infinite;
        }

        .bgimage, .bgimage2, .bgimage3, .bgimage4 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          filter: brightness(120%);
        }

        .bgimage2 { z-index: 1; }
        .bgimage  { z-index: 2; opacity: 0.5; }
        .bgimage3 { z-index: 3; opacity: 0.4; }
        .bgimage4 { z-index: 4; opacity: 0.2; width: 104vw; }
      `}),e.jsx("img",{src:p,className:"bgimage4",alt:"bg4"}),e.jsx("img",{src:g,className:"bgimage3",alt:"bg3"}),e.jsx("img",{src:b,className:"bgimage",alt:"bg1"}),e.jsx("img",{src:u,className:"bgimage2",alt:"bg2"}),e.jsxs("div",{className:"clock",children:[e.jsx("div",{className:"hand hour",id:"hourHand"}),e.jsx("div",{className:"hand minute",id:"minuteHand"}),e.jsx("div",{className:"hand second",id:"secondHand"})]})]}));export{x as default};
