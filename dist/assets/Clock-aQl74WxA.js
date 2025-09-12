import{r as o,j as n}from"./index-Dc0OWZGp.js";const l="/assets/mem-D-Mopbgq.ttf",u="/assets/mem-CS6gb2bC.gif";function g(){const[t,r]=o.useState(new Date);o.useEffect(()=>{const s=setInterval(()=>r(new Date),1e3);return()=>clearInterval(s)},[]);let e=t.getHours();const a=t.getMinutes();t.getSeconds(),e=e%12||12;const c=s=>s.toString().padStart(2,"0"),i={fontFamily:"'CustomFont', sans-serif",fontSize:"20vh",color:"#B6C8C9FF",textShadow:"1px 0 2rem #350342FF, 0 3px 4rem #AF0404FF",display:"flex",justifyContent:"center",alignItems:"center",height:"100dvh",width:"100vw",backgroundImage:`url(${u})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"blur(0.3rem) brightness(0.6) contrast(1.8)",overflow:"hidden",transform:"skew(-10deg, 5deg) scaleX(1.2) scaleY(1.1)"},m=`${e}:${c(a)}`;return n.jsxs("div",{style:i,children:[n.jsx("style",{children:`@font-face {
            font-family: 'CustomFont';
            src: url(${l}) format('truetype');
            font-weight: normal;
            font-style: normal;
        }`}),m]})}export{g as default};
