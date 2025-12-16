import{r as s,j as n}from"./index-37WBs3jL.js";const m="/assets/mem-D-Mopbgq.ttf",f="/assets/mem-CS6gb2bC.gif";function g(){const[e,o]=s.useState(new Date);s.useEffect(()=>{const r=setInterval(()=>o(new Date),1e3);return()=>clearInterval(r)},[]);let t=e.getHours();const a=e.getMinutes();e.getSeconds(),t=t%12||12;const c=r=>r.toString().padStart(2,"0"),i={fontFamily:"'250930', sans-serif",fontSize:"20vh",color:"#B6C8C9FF",textShadow:"1px 0 2rem #350342FF, 0 3px 4rem #AF0404FF",display:"flex",justifyContent:"center",alignItems:"center",height:"100dvh",width:"100vw",backgroundImage:`url(${f})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"blur(0.3rem) brightness(0.6) contrast(1.8)",overflow:"hidden",transform:"skew(-10deg, 5deg) scaleX(1.2) scaleY(1.1)"},l=`${t}:${c(a)}`;return n.jsxs("div",{style:i,children:[n.jsx("style",{children:`@font-face {
            font-family: '250930';
            src: url(${m}) format('truetype');
            font-weight: normal;
            font-style: normal;
        }`}),l]})}export{g as default};
