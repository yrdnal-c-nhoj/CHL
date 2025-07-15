import{r as l,j as t}from"./index-Dd_Xc2Em.js";const m="/assets/bang-BmdmcawR.ttf",u="/assets/fw-CNyjvw5X.gif",g="/assets/giphy%20(11)-CCX5yupA.gif",p="/assets/84298-BngiFNaw.gif",h=`
  @font-face {
    font-family: 'bang';
    src: url(${m}) format('truetype');
  }

  html, body {
    font-family: 'bang', sans-serif;
    margin: 0;
    padding: 0;
    background: rgb(9, 9, 9);
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: flex-end;
  }

  .bgimage {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.7;
    filter: saturate(1.3);
    animation: pulse 3s infinite alternate ease-in-out;
  }

  @keyframes pulse {
    from {
      transform: scale(1);
      opacity: 0.6;
    }
    to {
      transform: scale(1.03);
      opacity: 0.75;
    }
  }

  .clock {
    display: flex;
    position: relative;
    z-index: 50;
    opacity: 0;
    animation: fadeIn 2s ease-out forwards;
  }

  .digit {
    font-weight: bold;
    will-change: transform, opacity;
  }

  @keyframes riseUp {
    0% {
      transform: translateY(100vh);
    }
    100% {
      transform: translateY(-70vh);
    }
  }

  @keyframes explodeWild {
    0% {
      opacity: 1;
      transform: scale(1) translate(0, 0) rotate(0deg);
    }
    100% {
      opacity: 0;
      transform: scale(5) translate(var(--dx), var(--dy)) rotate(var(--rot));
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
`,f=document.createElement("style");f.innerText=h;document.head.appendChild(f);function y(){return`hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`}function w(){return`${Math.floor(Math.random()*2.5)+3.75}rem`}function x(){const a=`${(Math.random()-.5)*25}vw`,s=`${(Math.random()-.5)*25}vh`,e=`${Math.random()*1440-720}deg`;return{dx:a,dy:s,rot:e}}function b(){const[a,s]=l.useState(""),e=l.useRef(null);return l.useEffect(()=>{const r=()=>{const i=new Date().toLocaleTimeString("en-US",{hour12:!1});s(i),e.current&&(e.current.style.animation="none",e.current.offsetWidth,e.current.style.animation="riseUp 1.5s ease-out forwards",setTimeout(()=>{const c=e.current.children;for(const d of c)d.style.animation="explodeWild 1.5s ease-out forwards"},1500))};r();const n=setInterval(r,5e3);return audioRef.current.muted=!1,audioRef.current.play().catch(o=>console.error("Audio play failed:",o)),()=>{clearInterval(n),audioRef.current.pause()}},[]),t.jsxs("div",{className:"relative h-screen w-screen",children:[t.jsx("img",{src:u,className:"bgimage",alt:"Fireworks background 1"}),t.jsx("img",{src:g,className:"bgimage",alt:"Fireworks background 2"}),t.jsx("img",{src:p,className:"bgimage",alt:"Fireworks background 3"}),t.jsx("div",{ref:e,className:"clock",children:a.split("").map((r,n)=>{const{dx:o,dy:i,rot:c}=x();return t.jsx("span",{className:"digit",style:{color:y(),fontSize:w(),"--dx":o,"--dy":i,"--rot":c},children:r},n)})}),t.jsx("audio",{ref:audioRef,autoPlay:!0,playsInline:!0})]})}export{b as default};
