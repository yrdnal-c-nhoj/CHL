import{r as v,j as e}from"./index-CCm3oexO.js";const j="/assets/co-DFvAU88b.png",S="/assets/cos-WcWDnXeW.png",C="/assets/whe-C31kqsXv.ttf",W=()=>{v.useEffect(()=>{const n=document.createElement("style");n.innerHTML=`
      @font-face {
        font-family: 'whe';
        src: url(${C}) format('truetype');
      }
    `,document.head.appendChild(n);const s=()=>{const o=new Date;let r=o.getHours();const i=o.getMinutes(),a=o.getSeconds();r=r%12||12;const t=(b,w)=>String(b).padStart(w,"0"),p=t(r,2),x=t(i,2),k=t(a,2);c("hours",p),c("minutes",x),c("seconds",k)},c=(o,r)=>{const i=document.getElementById(o);if(!i)return;const a=i.getElementsByClassName("digit-box");for(let t=0;t<a.length;t++)a[t].textContent=r[t]};s();const y=setInterval(s,1e3);return()=>clearInterval(y)},[]);const d={margin:0,padding:0,height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",background:"#dbd7ca",fontFamily:"monospace",overflow:"hidden",position:"relative"},l={position:"absolute",top:0,left:0,width:"100vw",height:"100vh",objectFit:"cover",filter:"contrast(0.9) invert()",zIndex:1,opacity:.9,animation:"slow-rotate 120s linear infinite",transformOrigin:"center center"},m={...l,zIndex:2,opacity:.5,animation:"slowrotate 120s linear infinite"},f={zIndex:4,display:"flex",flexDirection:"column",alignItems:"center"},g={display:"flex"},h={fontFamily:"whe",display:"flex",justifyContent:"center",alignItems:"center",aspectRatio:"1 / 1",fontSize:"10rem",width:"8rem",height:"8rem",background:"transparent",WebkitTextFillColor:"transparent",backgroundImage:`url(${require("./cosm.webp")})`,backgroundSize:"cover",backgroundPosition:"center",WebkitBackgroundClip:"text",backgroundClip:"text"},u=n=>({...h,animation:`${n%2===0?"spin-clockwise":"spin-counterclockwise"} 30s linear infinite`});return e.jsxs("div",{style:d,children:[e.jsx("style",{children:`
        @keyframes spin-clockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-counterclockwise {
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
      `}),e.jsxs("div",{style:dateContainer,children:[e.jsx("a",{href:"../bone/",style:{color:"inherit",textDecoration:"none"},children:"06/25/25"}),e.jsx("a",{href:"../index.html",style:clockName,children:"Cosmic Wheels"}),e.jsx("a",{href:"../morse/",style:{color:"inherit",textDecoration:"none"},children:"06/27/25"})]}),e.jsx("img",{src:j,alt:"bg1",style:l}),e.jsx("img",{src:S,alt:"bg2",style:m}),e.jsx("div",{style:f,children:["hours","minutes","seconds"].map(n=>e.jsx("div",{style:g,id:n,children:[0,1].map(s=>e.jsx("div",{className:"digit-box",style:u(s)},s))},n))})]})};export{W as default};
