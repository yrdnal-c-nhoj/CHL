import{r as n,j as e}from"./index-CPtGTb2j.js";const h="/assets/bb-B1c-vHOt.webp",x="/assets/bam-DeGXSFIA.webp",k="/assets/bambu-BjxNVK8S.gif",v="/assets/bamboo-CTxci4Ew.ttf",w=()=>{const[i,r]=n.useState(()=>new Date);n.useEffect(()=>{const t=setInterval(()=>r(new Date),1e3);return()=>clearInterval(t)},[]),n.useEffect(()=>{const t=document.createElement("style");return t.innerHTML=`
      @font-face {
        font-family: 'CustomFont';
        src: url(${v}) format('woff2');
        font-weight: normal;
        font-style: normal;
      }

      @keyframes parallaxBack {
        0% { background-position: 0 0; }
        100% { background-position: -100vw 0; }
      }

      @keyframes parallaxFrontReverse {
        0% { background-position: 0 0; }
        100% { background-position: 200vw 0; }
      }
    `,document.head.appendChild(t),()=>document.head.removeChild(t)},[]);const c=t=>{const o=t.getHours().toString().padStart(2,"0"),f=t.getMinutes().toString().padStart(2,"0");return{hours:o,minutes:f}},{hours:l,minutes:d}=c(i),u={position:"relative",width:"100vw",height:"100vh",overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center"},p={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${x})`,backgroundRepeat:"repeat-x",backgroundSize:"cover",backgroundPosition:"0 0",animation:"parallaxBack 160s linear infinite",opacity:.8,zIndex:0},m={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${h})`,backgroundRepeat:"repeat-x",backgroundSize:"cover",backgroundPosition:"0 0",animation:"parallaxFrontReverse 120s linear infinite",opacity:.2,zIndex:1},g={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${k})`,backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundPosition:"center center",opacity:.2,zIndex:2},y={position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundColor:"rgba(0, 0, 0, 0.4)",zIndex:3},b={position:"relative",display:"flex",flexDirection:"column",alignItems:"center",zIndex:4},s={display:"flex",margin:"0.5rem 0"},a={width:"4.5rem",height:"5rem",fontSize:"6rem",color:"#98AF86FF",fontFamily:"CustomFont, monospace",display:"flex",alignItems:"center",justifyContent:"center"};return e.jsxs("div",{style:u,children:[e.jsx("div",{style:p}),e.jsx("div",{style:m}),e.jsx("div",{style:g}),e.jsx("div",{style:y}),e.jsxs("div",{style:b,children:[e.jsx("div",{style:s,children:l.split("").map((t,o)=>e.jsx("div",{style:a,children:t},`h-${o}`))}),e.jsx("div",{style:s,children:d.split("").map((t,o)=>e.jsx("div",{style:a,children:t},`m-${o}`))})]})]})};export{w as default};
