import{r,j as l}from"./index-9yDBTM3Q.js";const y="/assets/d1-2MawacXN.ttf",S="/assets/d2-HcI7PgNu.ttf",E="/assets/d3-5yatceUt.otf";function M(){const[o,u]=r.useState({h:0,m:0,s:0}),[c,m]=r.useState(!1);r.useEffect(()=>{const e=()=>{document.documentElement.style.setProperty("--vh",`${window.innerHeight*.01}px`)};return e(),window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]),r.useEffect(()=>{const e=document.createElement("style");e.textContent=`
      @font-face {
        font-family: 'HoursFont';
        src: url(${y}) format('truetype');
      }
      @font-face {
        font-family: 'MinutesFont';
        src: url(${S}) format('opentype');
      }
      @font-face {
        font-family: 'SecondsFont';
        src: url(${E}) format('opentype');
      }
    `,document.head.appendChild(e),document.fonts.ready.then(()=>m(!0))},[]),r.useEffect(()=>{if(!c)return;const e=()=>{const t=new Date;u({h:t.getHours()%12||12,m:t.getMinutes(),s:t.getSeconds()})};e();const a=setInterval(e,1e3);return()=>clearInterval(a)},[c]);const F=(e,a,t,d={x:0,y:0})=>{const h=[],v=o[t],x=t==="h"?"HoursFont":t==="m"?"MinutesFont":"SecondsFont",p=360/e*v;for(let n=0;n<e;n++){const f=(360/e*n-p)*Math.PI/180,g=a*Math.cos(f)+d.x,w=a*Math.sin(f)+d.y;let i;t==="h"?i=n===0?12:n:i=n.toString().padStart(2,"0");const s=t==="h"&&i===(o.h===0?12:o.h)||t==="m"&&n===o.m||t==="s"&&n===o.s;h.push(l.jsx("div",{style:{position:"absolute",left:"50%",top:"50%",transform:`translate(${g}vh, ${w}vh)`,fontFamily:x,fontSize:t==="h"?"20vh":t==="m"?"17vh":"8vh",fontWeight:s?700:300,color:s?"#F41C1CFF":"rgba(255, 150, 200)",textShadow:s?`
    -1px -1px 0 #FFFFFF,
    1px -1px 0 #FFFFFF,
    -1px 1px 0 #FFFFFF,
    1px 1px 0 #FFFFFF,
    0 0 0.5vh #FFFFFF,
    0 0 2vh #00FF73FF,
    0 0 4vh #00FFE5FF,
    0 0 6vh #84FF00FF
  `:"0 0 0.8vh rgba(25, 10, 80)",opacity:s?1:.4,transition:"all 0.4s ease",pointerEvents:"none",whiteSpace:"nowrap",zIndex:s?10:1},children:i},`${t}-${n}`))}return h};return c?(`${o.h.toString().padStart(2,"0")}${o.m.toString().padStart(2,"0")}${o.s.toString().padStart(2,"0")}`,l.jsx("div",{style:{position:"fixed",inset:0,width:"100vw",height:"calc(var(--vh, 1vh) * 100)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-start",background:"radial-gradient(circle at center, #530B7CFF 30%, #6B11BAFF 100%)",overflow:"hidden"},children:l.jsxs("div",{style:{position:"relative",width:"100vh",height:"100vh"},children:[F(12,62,"h",{x:-79,y:-42}),F(60,139,"m",{x:-149,y:-14}),F(60,72,"s",{x:-75,y:11})]})})):null}export{M as default};
