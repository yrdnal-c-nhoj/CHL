import{r as n,j as t}from"./index-B3uyj-Zi.js";const l="/assets/cun-DcfcAE39.ttf",f="/assets/cuf-DHdg9qhZ.jpg",g="/assets/cun1-BRJGfrvl.webp",u=()=>{const[r,s]=n.useState("");return n.useEffect(()=>{const e=()=>{const a=new Date;let i=a.getHours()%12||12;const c=String(a.getMinutes()).padStart(2,"0");s(`${i}:${c}`)};e();const o=setInterval(e,1e3);return()=>clearInterval(o)},[]),t.jsxs("div",{style:{height:"100vh",width:"100vw",backgroundColor:"#062bb4",margin:0,overflow:"hidden",fontFamily:"cun, sans-serif",position:"relative"},children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'cun';
          src: url(${l}) format('truetype');
        }

        :root {
          font-size: 2vh;
        }

        body {
          margin: 0;
        }

        .clock-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          text-align: center;
        }

        .new-clock {
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

        .bgimage {
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

        .bgimage2 {
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
          animation: slow-rotate 800s linear infinite;
          pointer-events: none;
        }

        @keyframes slow-rotate {
          0% { transform: translate(-50%, -50%) rotate(0deg) scale(1.5); }
          100% { transform: translate(-50%, -50%) rotate(360deg) scale(1.5); }
        }
      `}),t.jsx("img",{src:g,className:"bgimage2",alt:"Overlay Background"}),t.jsx("img",{src:f,className:"bgimage",alt:"Main Background"}),t.jsx("div",{className:"clock-container",children:t.jsx("div",{className:"new-clock",children:r})})]})};export{u as default};
