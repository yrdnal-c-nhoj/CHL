import{r as o,j as e}from"./index-CPtGTb2j.js";const c="/assets/scr-BwpOa2jX.otf",p="/assets/bg-BO_Wz1Hf.webp",r="DigitalClockFont__Scoped",f=()=>{const[n,s]=o.useState(new Date);o.useEffect(()=>{const l=setInterval(()=>s(new Date),1e3);return()=>clearInterval(l)},[]);let t=n.getHours();const a=t>=12?"PM":"AM";t=t%12,t=t===0?12:t;const i=n.getMinutes().toString().padStart(2,"0");return e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${p})`,backgroundSize:"170%",backgroundRepeat:"no-repeat",backgroundPosition:"center",display:"flex",justifyContent:"center",alignItems:"center"},children:e.jsxs("div",{style:{width:"220px",height:"220px",padding:"15px",transform:"rotate(-3deg) translateY(-20px)",backgroundColor:"#ffff99",boxShadow:"5px 5px 15px rgba(0,0,0,0.3), -3px -3px 10px rgba(0,0,0,0.2)",border:"1px solid #e0e0e0",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("style",{children:`
            @font-face {
              font-family: '${r}';
              src: url(${c}) format('truetype');
              font-weight: normal;
              font-style: normal;
            }
          `}),e.jsx("div",{style:{fontFamily:r,fontSize:"2rem",color:"#3174E9FF",textAlign:"center",userSelect:"none"},children:`${t}:${i} ${a}`})]})})};export{f as default};
