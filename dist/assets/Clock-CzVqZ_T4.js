import{r as n,j as t}from"./index-DuxRGnoV.js";const d="/assets/wall-DJOdB82P.jpg",m="/assets/wall-DWUXetv9.ttf",r="CustomFont20250908";function f(){const[o,a]=n.useState(new Date);n.useEffect(()=>{const e=setInterval(()=>a(new Date),1e3);return()=>clearInterval(e)},[]),n.useEffect(()=>{const e=document.createElement("style");return e.innerHTML=`
      @font-face {
        font-family: '${r}';
        src: url(${m}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    `,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[]);const s=o.getHours(),i=s%12||12,l=o.getMinutes().toString().padStart(2,"0"),c=s<12?"am":"pm";return t.jsxs("div",{style:{height:"100dvh",width:"100vw",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:r,position:"relative",overflow:"hidden"},children:[t.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${d})`,backgroundSize:"cover",backgroundPosition:"center",filter:"saturate(1.3) hue-rotate(-120deg)",transform:"scaleX(-1)",zIndex:0}}),t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",lineHeight:"0.7",color:"#CDD3D4FF",position:"relative",zIndex:1},children:[t.jsxs("span",{style:{fontSize:"5rem",letterSpacing:"0.1rem",opacity:"0.6"},children:[i,l]}),t.jsx("span",{style:{fontSize:"5rem",opacity:"0.6",marginTop:"0.5rem"},children:c})]})]})}export{f as default};
