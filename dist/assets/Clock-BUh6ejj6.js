import{r as a,j as e}from"./index-9yDBTM3Q.js";const d="/assets/air-CQLIqzpV.ttf",p="/assets/stamp-BU-9zcl1.png",c="/assets/stamp2-6Hh-CKpx.png",x="/assets/stamp3-ne2uIJ1X.png",f="/assets/frame-DwIHAelH.jpg",s=new CSSStyleSheet;s.replaceSync(`
  @font-face {
    font-family: 'air';
    src: url(${d}) format('truetype');
    font-display: swap;
  }

  @keyframes bounceJostle {
    0%, 10%, 20%, 90%, 100% {
      transform: translate(0, 0) rotate(0);
    }
    5%   { transform: translate(1px, -1.5px) rotate(0.3deg); }
    12%  { transform: translate(-1.2px, 1.2px) rotate(-0.25deg); }
    18%  { transform: translate(1.5px, 0.8px) rotate(0.2deg); }
    25%  { transform: translate(-1px, -1px) rotate(-0.2deg); }
    40%  { transform: translate(0.5px, 0.3px) rotate(0.1deg); }
    55%  { transform: translate(0, 0) rotate(0); }
    70%  { transform: translate(-1.2px, 1.2px) rotate(0.25deg); }
    75%  { transform: translate(1.5px, -1.5px) rotate(-0.3deg); }
    82%  { transform: translate(-0.7px, 1px) rotate(0.15deg); }
  }

  @media (max-width: 600px) {
    .stamp { top: 1vh; right: 5vw; width: 4rem; height: 2.5rem; }
    .stamp2 { top: 3vh; right: 2vw; width: 3rem; height: 2.5rem; }
    .stamp3 { top: 1.5vh; right: 2vw; width: 4rem; height: 2rem; }
    .bgimage { maxHeight: 80dvh; maxWidth: 90vw; }
    .digitBox { fontSize: 4rem; width: 1.5rem; }
    .colon { fontSize: 4rem; width: 0.8rem; height: 4rem; }
    .clock { margin-top: 15vh; } /* Increased margin for smaller screens */
  }

  @media (max-width: 400px) {
    .stamp { top: 0.5vh; right: 3vw; width: 3rem; height: 2rem; }
    .stamp2 { top: 2vh; right: 1vw; width: 2.5rem; height: 2rem; }
    .stamp3 { top: 1vh; right: 1vw; width: 3rem; height: 1.5rem; }
    .bgimage { maxHeight: 75dvh; maxWidth: 85vw; }
    .digitBox { fontSize: 3rem; width: 1.2rem; }
    .colon { fontSize: 3rem; width: 0.6rem; height: 3rem; }
    .clock { margin-top: 20vh; } /* Further increased margin for very small screens */
  }
`);document.adoptedStyleSheets=[...document.adoptedStyleSheets,s];const t={body:{color:"rgb(84, 82, 176)",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",minHeight:"100dvh",width:"100vw",margin:0,overflow:"visible",position:"relative",fontFamily:"air, Arial, sans-serif",boxSizing:"border-box"},clock:{display:"flex",zIndex:10,marginTop:"10vh"},digitBox:{width:"2rem",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"8rem",boxSizing:"border-box"},colon:{width:"1rem",height:"7rem",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"7rem"},jostle:{animation:"bounceJostle 10s infinite ease-in-out",willChange:"transform"},bgimage:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",maxHeight:"90dvh",maxWidth:"90vw",width:"auto",height:"auto",objectFit:"contain",zIndex:1},stamp:{position:"absolute",top:"2rem",right:"9.6rem",width:"6rem",height:"4rem",transformOrigin:"center center",zIndex:5,animationDelay:"0.4s"},stamp2:{position:"absolute",top:"4.9rem",right:"3rem",width:"5rem",height:"4rem",transformOrigin:"center center",zIndex:5,animationDelay:"0.8s"},stamp3:{position:"absolute",top:"2.5rem",right:"3.3rem",width:"7rem",height:"3rem",transformOrigin:"center center",zIndex:5}};function v(){const[o,n]=a.useState(()=>new Date);a.useEffect(()=>{const r=setInterval(()=>n(new Date),1e3);return()=>clearInterval(r)},[]);const m=o.toLocaleTimeString("en-US",{hour12:!1,hour:"2-digit",minute:"2-digit",second:"2-digit"}).replace(/:/g,""),l=["digit","digit","colon","digit","digit","colon","digit","digit"],h=[...m];let g=0;return e.jsxs("div",{style:t.body,role:"timer","aria-live":"polite",children:[e.jsx("img",{src:f,alt:"Background frame",style:t.bgimage}),e.jsx("img",{src:x,alt:"Stamp 3",style:{...t.stamp3,...t.jostle}}),e.jsx("img",{src:c,alt:"Stamp 2",style:{...t.stamp2,...t.jostle}}),e.jsx("img",{src:p,alt:"Stamp 1",style:{...t.stamp,...t.jostle}}),e.jsx("div",{style:t.clock,children:l.map((r,i)=>r==="colon"?e.jsx("div",{style:{...t.colon,...t.jostle},"aria-hidden":"true",children:":"},i):e.jsx("div",{style:{...t.digitBox,...t.jostle},children:h[g++]},i))})]})}export{v as default};
