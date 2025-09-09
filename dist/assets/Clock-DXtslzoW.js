import{r as s,j as o}from"./index-DCBP-5yl.js";const g="/assets/bay-DZvvtGNe.jpeg",m="/assets/bay-DToEA2Gf.ttf",f=()=>{const[n,r]=s.useState(new Date);s.useEffect(()=>{const t=setInterval(()=>r(new Date),1e3);return()=>clearInterval(t)},[]);const i=t=>t.toString().padStart(2,"0"),a=i(n.getHours()),c=i(n.getMinutes()),l=[...a,":",...c],e={container:{width:"100vw",height:"100dvh",margin:0,padding:0,backgroundImage:`url(${g})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative"},clock:{position:"absolute",top:"1rem",right:"1rem",display:"flex"},digitBox:{fontFamily:"digital, monospace",fontSize:"2rem",color:"#3B3B38FF",textAlign:"center"},colonBox:{fontSize:"4.5rem",lineHeight:"1rem",background:"transparent"}};return o.jsxs("div",{style:e.container,children:[o.jsx("style",{children:`
          @font-face {
            font-family: 'digital';
            src: url(${m}) format('truetype');
          }
        `}),o.jsx("div",{style:e.clock,children:l.map((t,d)=>o.jsx("div",{style:t===":"?{...e.digitBox,...e.colonBox}:e.digitBox,children:t},d))})]})};export{f as default};
