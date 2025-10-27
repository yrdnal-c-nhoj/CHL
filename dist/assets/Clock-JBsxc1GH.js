import{r as v,j as t}from"./index-DuxRGnoV.js";const C="/assets/co-DFvAU88b.png",m="/assets/cos-WcWDnXeW.png",j="/assets/whe-C31kqsXv.ttf",E=()=>{v.useEffect(()=>{const e=document.createElement("style");e.innerHTML=`
      @font-face {
        font-family: 'whe';
        src: url(${j}) format('truetype');
      }
    `,document.head.appendChild(e);const n=()=>{const o=new Date;let s=o.getHours();const y=o.getMinutes(),b=o.getSeconds();s=s%12||12;const r=(i,c)=>String(i).padStart(c,"0"),a=(i,c)=>{const d=document.getElementById(i);d&&[...d.getElementsByClassName("digit-box")].forEach((k,w)=>k.textContent=c[w])};a("hours",r(s,2)),a("minutes",r(y,2)),a("seconds",r(b,2))};n();const x=setInterval(n,1e3);return()=>clearInterval(x)},[]);const g={margin:0,padding:0,height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",background:"#dbd7ca",overflow:"hidden",position:"relative"},f={zIndex:4,display:"flex",flexDirection:window.innerWidth>=768?"row":"column",alignItems:"center"},u={display:"flex"},p=e=>({fontFamily:"whe",display:"flex",justifyContent:"center",alignItems:"center",aspectRatio:"1 / 1",fontSize:"10rem",width:"8rem",height:"8rem",color:"red",background:"transparent",WebkitTextFillColor:"transparent",backgroundImage:`url(${m})`,backgroundSize:"cover",backgroundPosition:"center",WebkitBackgroundClip:"text",backgroundClip:"text",animation:`${e%2===0?"spinClockwise":"spinCounter"} 30s linear infinite`}),l={position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:"cover",filter:"contrast(0.9) invert()",zIndex:1,opacity:.9,animation:"slow-rotate 120s linear infinite",transformOrigin:"center center"},h={...l,zIndex:2,opacity:.5,animation:"slowrotate 120s linear infinite"};return t.jsxs("div",{style:g,children:[t.jsx("style",{children:`
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        @keyframes slow-rotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(-360deg) scale(1.5); }
        }
        @keyframes slowrotate {
          0% { transform: rotate(0deg) scale(1.5); }
          100% { transform: rotate(360deg) scale(1.5); }
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        a:hover {
          color: #e8ecec;
          background-color: rgb(21, 0, 255);
        }
      `}),t.jsx("img",{src:C,alt:"Background 1",style:l}),t.jsx("img",{src:m,alt:"Background 2",style:h}),t.jsx("div",{style:f,children:["hours","minutes","seconds"].map(e=>t.jsx("div",{style:u,id:e,children:[0,1].map(n=>t.jsx("div",{className:"digit-box",style:p(n)},n))},e))})]})};export{E as default};
