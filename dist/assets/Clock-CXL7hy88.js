import{r as s,j as e}from"./index-CB5Z5zkF.js";const j="/assets/anim-D4HPaunJ.ttf",k="/assets/anim-DRY7hANd.jpg",z=()=>{const[i,h]=s.useState(new Date),[p,f]=s.useState(new Date),[w,v]=s.useState(window.innerWidth>=768);s.useEffect(()=>{const t=setInterval(()=>{f(i),h(new Date)},1e3);return()=>clearInterval(t)},[i]),s.useEffect(()=>{const t=()=>v(window.innerWidth>=768);return window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]);const m=t=>{const g=t.getHours(),d=t.getMinutes(),u=t.getSeconds(),n=S=>String(S).padStart(2,"0");return{hours:n(g),minutes:n(d),seconds:n(u)}},o=m(i),r=m(p),y=t=>t.replace(/9/g,"q"),x={width:"100vw",height:"100dvh",display:"flex",flexDirection:w?"row":"column",justifyContent:"center",alignItems:"center",backgroundImage:`url(${k})`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"CustomClockFont"},a={display:"flex"},l={padding:"1rem 1.2rem",fontSize:"6rem",minWidth:"4rem",minHeight:"4rem",textAlign:"center",position:"relative",overflow:"hidden"},b={position:"absolute",top:0,left:0,width:"100%",height:"100%",display:"flex",justifyContent:"center",alignItems:"center",background:`
      linear-gradient(
        to bottom,
        rgba(20,20,20,0.9) 15%,  
        rgba(128,128,128,0.9) 40%,     
        rgba(128,128,128,0.9) 50%, 
        rgba(225,225,255,0.9) 85%,
        white 90%,   /* starts pure white */
        white 100%   /* stays pure white bottom 10% */
      )
    `,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",textFillColor:"transparent",opacity:.8},c=(t,g,d)=>y(t).split("").map((u,n)=>e.jsx("div",{style:{...d,position:"relative"},children:e.jsx("div",{style:b,children:u})},n));return e.jsxs("div",{style:x,children:[e.jsx("style",{children:`
          @font-face {
            font-family: 'CustomClockFont';
            src: url(${j}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}),e.jsx("div",{style:a,children:c(o.hours,r.hours,l)}),e.jsx("div",{style:a,children:c(o.minutes,r.minutes,l)}),e.jsx("div",{style:a,children:c(o.seconds,r.seconds,l)})]})};export{z as default};
