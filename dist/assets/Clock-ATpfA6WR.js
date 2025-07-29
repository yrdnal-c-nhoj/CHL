import{r as i,j as o}from"./index-D70hTCHv.js";const g="/assets/bay-DZvvtGNe.jpeg",m="/assets/bay-DToEA2Gf.ttf",f=()=>{const[n,r]=i.useState(new Date);i.useEffect(()=>{const t=setInterval(()=>r(new Date),1e3);return()=>clearInterval(t)},[]);const s=t=>t.toString().padStart(2,"0"),a=s(n.getHours()),c=s(n.getMinutes()),l=[...a,":",...c],e={container:{width:"100vw",height:"100vh",margin:0,padding:0,backgroundImage:`url(${g})`,backgroundSize:"cover",backgroundPosition:"center",position:"relative"},clock:{position:"absolute",top:"1rem",right:"1rem",display:"flex"},digitBox:{fontFamily:"digital, monospace",fontSize:"1.5rem",color:"#867959FF",textAlign:"center"},colonBox:{fontSize:"1.5rem",background:"transparent"}};return o.jsxs("div",{style:e.container,children:[o.jsx("style",{children:`
          @font-face {
            font-family: 'digital';
            src: url(${m}) format('truetype');
          }
        `}),o.jsx("div",{style:e.clock,children:l.map((t,d)=>o.jsx("div",{style:t===":"?{...e.digitBox,...e.colonBox}:e.digitBox,children:t},d))})]})};export{f as default};
