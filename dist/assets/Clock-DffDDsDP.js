import{r,j as e}from"./index-Dvyih0c3.js";const l="/assets/cun-DcfcAE39.ttf",u="/assets/cun1-BRJGfrvl.webp",f=()=>{const[a,i]=r.useState("");return r.useEffect(()=>{const t=()=>{const n=new Date;let s=n.getHours()%12||12;const o=String(n.getMinutes()).padStart(2,"0");i(`${s}:${o}`)};t();const c=setInterval(t,1e3);return()=>clearInterval(c)},[]),e.jsxs("div",{className:"cunei-wrapper",style:{height:"100vh",width:"100vw",backgroundColor:"#062bb4",margin:0,overflow:"hidden",fontFamily:"cunei-cun, sans-serif",position:"relative"},children:[e.jsx("style",{children:`
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
          padding: 1rem;
        }

        .cunei-clock {
          font-size: clamp(3rem, 10vw, 12rem);
          background: linear-gradient(to bottom,
            #0b0b0a 1%,
            #f2b02c 4%,
            #0b0b0a 9%,
            #cfc09f 27%,
            #ffecb3 40%,
            #7c560a 81%,
            #e3d9c5 93%);
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          letter-spacing: 0.5vw;
          text-shadow: 0 0 1rem rgba(255, 215, 0, 0.3);
        }

        .cunei-bg-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 150vw;
          height: 150vh;
          object-fit: cover;
          transform: translate(-50%, -50%) rotate(0deg);
          transform-origin: center;
          z-index: 1;
          animation: cunei-spin 240s linear infinite;
          pointer-events: none;
        }

        @keyframes cunei-spin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @media (max-width: 768px) {
          .cunei-clock {
            letter-spacing: 1vw;
          }
        }

        @media (max-width: 480px) {
          .cunei-clock {
            font-size: clamp(2rem, 14vw, 6rem);
            letter-spacing: 2vw;
          }
        }
      `}),e.jsx("img",{src:u,className:"cunei-bg-overlay",alt:"Spinning Overlay"}),e.jsx("div",{className:"cunei-container",children:e.jsx("div",{className:"cunei-clock",children:a})})]})};export{f as default};
