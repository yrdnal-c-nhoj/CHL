import{r,j as t}from"./index-Ch2k27Fp.js";const f="/assets/lightning-D7wzqxKp.webp",h="/assets/Inner-C-YRFc_x.ttf";function m(){const[i,u]=r.useState({hours:"--",minutes:"--"}),a=r.useRef(null),l=r.useRef(null),c=r.useRef(null);r.useEffect(()=>{function s(){const o=new Date;u({hours:String(o.getHours()).padStart(2,"0"),minutes:String(o.getMinutes()).padStart(2,"0")})}s();const e=setInterval(s,1e3);return()=>clearInterval(e)},[]);function d(){a.current&&(a.current.classList.add("animate-clock"),setTimeout(()=>{a.current&&a.current.classList.remove("animate-clock")},330))}function g(s){const e=s==="white"?l.current:c.current;e&&(e.style.opacity="1",setTimeout(()=>{e&&(e.style.opacity="0")},100))}r.useEffect(()=>{let s=!0;function e(){if(!s)return;const o=Math.random();o<.02&&d(),o>.9&&g(Math.random()>.5?"white":"black"),setTimeout(e,500)}return e(),()=>{s=!1}},[]);const n={bgimage:{backgroundSize:"cover",backgroundPosition:"center",position:"absolute",height:"100vh",width:"100vw",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:1,opacity:.9,userSelect:"none",pointerEvents:"none"},clockContainer:{position:"relative",zIndex:7,height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"},clock:{color:"rgb(244, 243, 230)",fontFamily:"'Inner', sans-serif",display:"flex",fontSize:"80vh",userSelect:"none"},clockSpan:{display:"block"},flashWhite:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:999,pointerEvents:"none",backgroundColor:"rgb(236, 241, 218)",opacity:0,transition:"opacity 0.1s ease-out"},flashBlack:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:999,pointerEvents:"none",backgroundColor:"rgb(7, 5, 19)",opacity:0,transition:"opacity 0.1s ease-out"}};return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'Inner';
          src: url('${h}') format('truetype');
        }
        @keyframes shakeJump {
          0%, 100% {
            transform: translate(-50%, 190%) translate(0, 0) rotate(0deg);
          }
          20% {
            transform: translate(-50%, -50%) translate(-10px, -20px) rotate(-2deg);
          }
          40% {
            transform: translate(-50%, 50%) translate(10px, 10px) rotate(3deg);
          }
          60% {
            transform: translate(80%, -50%) translate(-15px, 5px) rotate(-1deg);
          }
          80% {
            transform: translate(-50%, -80%) translate(5px, -15px) rotate(2deg);
          }
        }
        .animate-clock {
          animation: shakeJump 0.33s ease-in-out;
        }
        @media (max-width: 600px) {
          #clock {
            flex-direction: column;
            align-items: center;
            gap: 2vh;
            font-size: 50vw !important;
          }
        }
      `}),t.jsx("img",{src:f,alt:"lightning",style:n.bgimage,draggable:!1}),t.jsx("img",{src:f,alt:"lightning mirrored",style:{...n.bgimage,transform:"translate(-50%, -50%) scaleX(-1)",zIndex:2},draggable:!1}),t.jsx("div",{style:n.clockContainer,children:t.jsxs("div",{id:"clock",ref:a,style:n.clock,children:[t.jsx("span",{style:n.clockSpan,id:"hours",children:i.hours}),t.jsx("span",{style:n.clockSpan,id:"minutes",children:i.minutes})]})}),t.jsx("div",{ref:l,style:n.flashWhite}),t.jsx("div",{ref:c,style:n.flashBlack})]})}export{m as default};
