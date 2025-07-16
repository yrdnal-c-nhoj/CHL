import{r as n,j as e}from"./index-DqtFXLZd.js";const g="/assets/air-CQLIqzpV.ttf",d="/assets/stamp-BU-9zcl1.png",f="/assets/stamp2-6Hh-CKpx.png",x="/assets/stamp3-ne2uIJ1X.png",h="/assets/frame-DwIHAelH.jpg",a=new CSSStyleSheet;a.replaceSync(`
  @font-face {
    font-family: 'air';
    src: url(${g}) format('truetype');
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
`);document.adoptedStyleSheets=[...document.adoptedStyleSheets,a];const t={body:{color:"rgb(84, 82, 176)",display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",width:"100vw",margin:0,overflow:"hidden",position:"relative",fontFamily:"air"},clock:{display:"flex",zIndex:3},digitBox:{width:"2rem",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"8rem",boxSizing:"border-box"},colon:{width:"1rem",height:"7rem",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"7rem"},jostle:{animation:"bounceJostle 10s infinite ease-in-out"},bgimage:{position:"absolute",top:0,left:0,height:"85%",width:"95%",zIndex:1},stamp:{position:"absolute",top:"2rem",right:"9.6rem",width:"6rem",height:"4rem",transformOrigin:"center center",zIndex:2,animationDelay:"0.4s"},stamp2:{position:"absolute",top:"4.9rem",right:"3rem",width:"5rem",height:"4rem",transformOrigin:"center center",zIndex:2,animationDelay:"0.8s"},stamp3:{position:"absolute",top:"2.5rem",right:"3.3rem",width:"7rem",height:"3rem",transformOrigin:"center center",zIndex:2}};function u(){const[o,i]=n.useState(()=>new Date);n.useEffect(()=>{const s=setInterval(()=>i(new Date),1e3);return()=>clearInterval(s)},[]);const l=o.toLocaleTimeString("en-US",{hour12:!1}).replace(/:/g,""),m=["digit","digit","colon","digit","digit","colon","digit","digit"],c=[...l];let p=0;return e.jsxs("div",{style:t.body,children:[e.jsx("img",{src:h,style:{...t.bgimage,...t.jostle,animationDelay:"0.2s"}}),e.jsx("img",{src:x,style:{...t.stamp3,...t.jostle}}),e.jsx("img",{src:f,style:{...t.stamp2,...t.jostle}}),e.jsx("img",{src:d,style:{...t.stamp,...t.jostle}}),e.jsx("div",{style:t.clock,children:m.map((s,r)=>s==="colon"?e.jsx("div",{style:{...t.colon,...t.jostle},children:":"},r):e.jsx("div",{style:{...t.digitBox,...t.jostle},children:c[p++]},r))})]})}export{u as default};
