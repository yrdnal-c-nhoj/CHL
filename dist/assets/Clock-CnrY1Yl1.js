import{r as n,j as t}from"./index-CR9JyEBx.js";const c="/assets/scr-BwpOa2jX.otf",p="/assets/bg-BO_Wz1Hf.webp",r="DigitalClockFont__Scoped",f=()=>{const[o,s]=n.useState(new Date);n.useEffect(()=>{const l=setInterval(()=>s(new Date),1e3);return()=>clearInterval(l)},[]);let e=o.getHours();const a=e>=12?"PM":"AM";e=e%12||12;const i=o.getMinutes().toString().padStart(2,"0");return t.jsxs("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",overflow:"hidden",display:"flex",justifyContent:"center",alignItems:"center"},children:[t.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",width:"140%",height:"140%",backgroundImage:`url(${p})`,backgroundSize:"cover",backgroundRepeat:"no-repeat",backgroundPosition:"center",transform:"translate(-50%, -50%) rotate(4deg)",zIndex:-1}}),t.jsxs("div",{style:{width:"180px",height:"180px",padding:"15px",transform:"rotate(-3deg) translateY(-20px)",backgroundColor:"#ffff99",boxShadow:"-3px 0px 6px rgba(0,0,0,0.5), 3px 0px 6px rgba(0,0,0,0.5), 0px 6px 12px rgba(0,0,0,0.8)",border:"1px solid #e0e0e0",display:"flex",justifyContent:"center",alignItems:"center"},children:[t.jsx("style",{children:`
            @font-face {
              font-family: '${r}';
              src: url(${c}) format('opentype');
              font-weight: normal;
              font-style: normal;
            }
          `}),t.jsx("div",{style:{fontFamily:r,fontSize:"2rem",color:"#3174E9",textAlign:"center",userSelect:"none"},children:`${e}:${i} ${a}`})]})]})};export{f as default};
