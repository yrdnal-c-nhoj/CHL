import{r as u,j as h}from"./index-WFum8C4s.js";const M="/assets/Stick-0Anm3UOf.ttf",C=()=>{const d=u.useRef(null),w=()=>`hsl(${Math.floor(Math.random()*360)}, 100%, 50%)`;return u.useEffect(()=>{const e=d.current,t=e.getContext("2d"),c=()=>{e.width=window.innerWidth,e.height=window.innerHeight},f=()=>{const n=new Date;let r=n.getHours()%12;r===0&&(r=12);const l=String(n.getMinutes()).padStart(2,"0");let s=`${r}${l}`.split("");s.length<4&&s.unshift(" ");const i=s.map(()=>w());k(s,i)},k=(n,r)=>{t.save();const l=e.height*.2;t.font=`${l}px 'skew-stick', sans-serif`,t.textBaseline="middle",t.textAlign="left";const s=e.width*.015,i=n.map(o=>t.measureText(o).width),v=i.reduce((o,a)=>o+a,0)+s*(n.length-1);let m=(e.width-v)/2;const x=e.height/2;n.forEach((o,a)=>{const y=(Math.random()-.5)*30,j=(Math.random()-.5)*30,S=m+y,E=x+j,p=(Math.random()-.5)*1.4;t.setTransform(1,p,p,1,S,E),t.lineWidth=.5*e.height*.01,t.strokeStyle=w(),t.strokeText(o,0,0),t.fillStyle=r[a],t.fillText(o,0,0),t.setTransform(1,0,0,1,0,0),m+=i[a]+s}),t.restore()};c(),window.addEventListener("resize",c),document.fonts.load("1rem 'skew-stick'").then(()=>{f()});const g=setInterval(f,1e3);return()=>{clearInterval(g),window.removeEventListener("resize",c)}},[]),h.jsxs("div",{className:"skew-wrapper",style:{fontFamily:"skew-stick, sans-serif"},children:[h.jsx("style",{children:`
        @font-face {
          font-family: 'skew-stick';
          src: url(${M}) format('truetype');
        }

        .skew-wrapper, .skew-wrapper * {
          margin: 0;
          padding: 0;
          overflow: hidden;
        }

        .skew-wrapper {
          background: black;
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }

        canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        }
      `}),h.jsx("canvas",{ref:d})]})};export{C as default};
