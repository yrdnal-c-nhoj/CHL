import{r as w,j as e}from"./index-DzqDxOWN.js";const y="/assets/watch-BIS26Q5f.ttf",j="/assets/gears-13950_128-BKyKeb4M.gif",k=()=>{w.useEffect(()=>{const d={0:"zero",1:"one",2:"two",3:"three",4:"four",5:"five",6:"six",7:"seven",8:"eight",9:"nine"},s=i=>i.split("").map(t=>d[t]||t),r=()=>{const i=new Date;let t=i.getHours();const u=i.getMinutes(),g=i.getSeconds();t=t%12||12;const x=s(String(t)),h=s(String(u).padStart(2,"0")),m=s(String(g).padStart(2,"0")),o=(v,p)=>{const a=document.querySelector(`#${v} .value`);a&&(a.innerHTML="",p.forEach(f=>{const c=document.createElement("span");c.className="digit-box",c.textContent=f,a.appendChild(c)}))};o("hours",x),o("minutes",h),o("seconds",m)},l=setInterval(r,1e3);return r(),()=>clearInterval(l)},[]);const n={position:"fixed",width:"100%",height:"100%",top:0,left:0,backgroundImage:`url(${j})`,backgroundRepeat:"repeat",backgroundPosition:"center",pointerEvents:"none"};return e.jsxs("div",{style:{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",position:"relative",overflow:"hidden",backgroundColor:"#c9dbef",margin:0,padding:0},children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'watch';
          src: url(${y}) format('truetype');
        }

        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
          width: 100%;
          overflow: hidden;
        }

        .clock {
          font-family: 'watch', sans-serif;
          color: rgb(29, 2, 84);
          text-shadow: rgb(238, 87, 5) 1px 1px 0px, white -1px 0px 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          text-align: center;
          z-index: 10;
        }

        .unit {
          display: flex;
          flex-direction: column;
        }

        .value {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .digit-box {
          display: inline-flex;
          justify-content: center;
          align-items: center;
          height: 3rem;
          user-select: none;
        }

        .divider {
          height: 1px;
          width: 30vw;
          background-color: rgb(52, 1, 77);
          margin: 0.5rem auto;
        }
      `}),e.jsx("div",{style:{...n,backgroundSize:"22vw 18vw",opacity:.3,zIndex:5}}),e.jsx("div",{style:{...n,backgroundSize:"21vw 17vw",opacity:.35,zIndex:4}}),e.jsx("div",{style:{...n,backgroundSize:"20vw 16vw",opacity:.4,zIndex:3}}),e.jsxs("div",{className:"clock",children:[e.jsx("div",{className:"unit",id:"hours",children:e.jsx("div",{className:"value"})}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"unit",id:"minutes",children:e.jsx("div",{className:"value"})}),e.jsx("div",{className:"divider"}),e.jsx("div",{className:"unit",id:"seconds",children:e.jsx("div",{className:"value"})})]})]})};export{k as default};
