import{r as o,j as e}from"./index-D1xzcOD-.js";const d="/assets/brai-BProws7r.ttf",f=()=>{const[t,c]=o.useState(new Date);o.useEffect(()=>{const a=setInterval(()=>c(new Date),1e3);return()=>clearInterval(a)},[]);const s=a=>a.toString().padStart(2,"0"),i=s(t.getHours()),n=s(t.getMinutes()),r=s(t.getSeconds()),l=`
    @font-face {
      font-family: 'brai';
      src: url(${d}) format('truetype');
    }

    .clock {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      width: 100vw;
      font-family: 'brai', sans-serif;
      text-align: center;
      gap: 4vw;
      flex-direction: row;
      animation: backgroundFade 22s ease-in-out infinite;
    }

    .time-part {
      font-size: 10vw;
      animation: textFade 22s ease-in-out infinite;
    }

    .label {
      font-size: 3vw;
      margin-top: 1vh;
    }

    .segment {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    @keyframes textFade {
      0%   { color: #FCFEDCFF; }
      50%  { color: #100649FF; }
      100% { color: #FCFEDCFF; }
    }

    @keyframes backgroundFade {
      0%   { background: #100649FF; }
      50%  { background: #FCFEDCFF; }
      100% { background: #100649FF; }
    }

    @media (max-width: 768px) {
      .clock {
        flex-direction: column;
        gap: 2vh;
      }
      .time-part {
        font-size: 12vh;
      }
      .label {
        font-size: 4vh;
      }
    }
  `;return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:l}),e.jsxs("div",{className:"clock",role:"timer","aria-live":"polite","aria-label":`Current time is ${i} hours, ${n} minutes, and ${r} seconds`,children:[e.jsx("div",{className:"segment",children:e.jsx("div",{className:"time-part",children:i})}),e.jsx("div",{className:"segment",children:e.jsx("div",{className:"time-part",children:n})}),e.jsx("div",{className:"segment",children:e.jsx("div",{className:"time-part",children:r})})]})]})};export{f as default};
