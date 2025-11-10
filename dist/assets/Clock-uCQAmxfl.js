import{r as t,j as n}from"./index-CacFjmHR.js";const C="/assets/anim-D4HPaunJ.ttf",F="/assets/anim-DRY7hANd.jpg",D=()=>{const[o,p]=t.useState(new Date),[f,v]=t.useState(new Date),[w,x]=t.useState(window.innerWidth>=768),[g,y]=t.useState(!1);t.useEffect(()=>{new FontFace("CustomClockFont",`url(${C})`).load().then(i=>{document.fonts.add(i),y(!0)})},[]),t.useEffect(()=>{const e=setInterval(()=>{v(o),p(new Date)},1e3);return()=>clearInterval(e)},[o]),t.useEffect(()=>{const e=()=>x(window.innerWidth>=768);return window.addEventListener("resize",e),()=>window.removeEventListener("resize",e)},[]);const h=e=>{const i=e.getHours(),u=e.getMinutes(),m=e.getSeconds(),s=k=>String(k).padStart(2,"0");return{hours:s(i),minutes:s(u),seconds:s(m)}},r=h(o),a=h(f),b=e=>e.replace(/9/g,"q"),S={width:"100vw",height:"100dvh",display:"flex",flexDirection:w?"row":"column",justifyContent:"center",alignItems:"center",backgroundImage:`url(${F})`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:g?"CustomClockFont":"sans-serif",visibility:g?"visible":"hidden"},c={display:"flex"},l={padding:"1rem 1.2rem",fontSize:"6rem",minWidth:"4rem",minHeight:"4rem",textAlign:"center",position:"relative",overflow:"hidden"},j={position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:`
      linear-gradient(
        to bottom,
        rgba(20,20,20,0.9) 15%,  
        rgba(128,128,128,0.9) 40%,     
        rgba(128,128,128,0.9) 50%, 
        rgba(225,225,255,0.9) 85%,
        white 90%, 
        white 100%
      )
    `,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textFillColor:"transparent",opacity:.8},d=(e,i,u)=>b(e).split("").map((m,s)=>n.jsx("div",{style:{...u,position:"relative"},children:n.jsx("div",{style:j,children:m})},s));return n.jsxs("div",{style:S,children:[n.jsx("div",{style:c,children:d(r.hours,a.hours,l)}),n.jsx("div",{style:c,children:d(r.minutes,a.minutes,l)}),n.jsx("div",{style:c,children:d(r.seconds,a.seconds,l)})]})};export{D as default};
