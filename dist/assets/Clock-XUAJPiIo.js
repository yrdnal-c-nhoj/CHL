import{r as a,j as t}from"./index-f_Ern5kM.js";const l="/assets/cun-DcfcAE39.ttf",u="/assets/cuf-DHdg9qhZ.jpg",f="/assets/cun1-BRJGfrvl.webp",g=()=>{const[r,s]=a.useState("");return a.useEffect(()=>{const e=()=>{const n=new Date;let o=n.getHours()%12||12;const c=String(n.getMinutes()).padStart(2,"0");s(`${o}:${c}`)};e();const i=setInterval(e,1e3);return()=>clearInterval(i)},[]),t.jsxs("div",{className:"cunei-wrapper",style:{height:"100vh",width:"100vw",backgroundColor:"#062bb4",margin:0,overflow:"hidden",fontFamily:"cunei-cun, sans-serif",position:"relative"},children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'cunei-cun';
          src: url(${l}) format('truetype');
        }

        .cunei-wrapper {
          font-size: 2vh;
        }

        .cunei-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
        }

        .cunei-clock {
          font-size: 8rem;
          background: linear-gradient(to bottom,
            #0b0b0a 1%,
            #f2b02c 4%,
            #0b0b0a 9%,
            #cfc09f 27%,
            #ffecb3 40%,
            #7c560a 81%,
            #e3d9c5 93%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          letter-spacing: 1vw;
        }

        .cunei-bg-main {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: translate(-50%, -50%) scale(1.3);
          transform-origin: center;
          z-index: 1;
          filter: sepia(0.7) contrast(0.2) saturate(2.5);
        }

        .cunei-bg-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          width: auto;
          height: auto;
          max-width: 70vw;
          max-height: 70vw;
          object-fit: cover;
          transform: translate(-50%, -50%) scale(1.5);
          transform-origin: center;
          z-index: 2;
          animation: cunei-slow-rotate 800s linear infinite;
          pointer-events: none;
        }

        @keyframes cunei-slow-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.5); }
        }
      `}),t.jsx("img",{src:f,className:"cunei-bg-overlay",alt:"Overlay Background"}),t.jsx("img",{src:u,className:"cunei-bg-main",alt:"Main Background"}),t.jsx("div",{className:"cunei-container",children:t.jsx("div",{className:"cunei-clock",children:r})})]})};export{g as default};
