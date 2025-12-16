import{r as o,j as n}from"./index-37WBs3jL.js";const y="/assets/shark-CufcRZ_t.webp",p="/assets/shark-BZdmYRWm.ttf";function v(){const[c,d]=o.useState(!0),[s,f]=o.useState(()=>new Date);o.useEffect(()=>{const t=setInterval(()=>f(new Date),1e3);return()=>clearInterval(t)},[]);const i=t=>t.toString().padStart(2,"0"),m=i(s.getHours()),u=i(s.getMinutes()),g=i(s.getSeconds());o.useEffect(()=>{let t=!0;return(async()=>{if(!document.getElementById("ClockFont_2025_12_01")){const e=document.createElement("style");e.id="ClockFont_2025_12_01",e.textContent=`
          @font-face {
            font-family: 'ClockFont_2025_12_01';
            src: url(${p}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
        `,document.head.appendChild(e)}await document.fonts.ready,await new Promise(e=>setTimeout(e,100)),t&&d(!1)})(),()=>{t=!1}},[]);const r={width:"100vw",height:"100dvh",minHeight:"100dvh",display:"flex",justifyContent:"center",alignItems:"center",backgroundImage:`url(${y})`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"ClockFont_2025_12_01, sans-serif",margin:0,padding:0,boxSizing:"border-box"},a={display:"inline-flex",justifyContent:"center",alignItems:"center",width:"0.6em",fontSize:"10vh",color:"#EE4747",textShadow:"0 0 1vh rgba(0,0,0,0.9)"},h=`${m}${u}${g}`;return c?n.jsx("div",{style:{...r,position:"fixed",top:0,left:0,right:0,bottom:0,backgroundColor:"#000",zIndex:9999},children:n.jsx("div",{style:{...a,color:"#333",fontSize:"10vh",width:"auto",visibility:"hidden"},children:"00:00:00"})}):n.jsx("div",{style:r,children:n.jsx("div",{style:{display:"flex",gap:"0.4rem"},children:h.split("").map((t,l)=>n.jsx("div",{style:a,children:t},l))})})}export{v as default};
