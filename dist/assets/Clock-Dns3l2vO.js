import{r as o,j as e}from"./index-OUh6MNAn.js";const d="/assets/anglerfish-gif_anglerfish_idle_swim-BsnSiqVG.webp",l="/assets/Deep-Sea-Anglerfish-Fuse-xDXzDFDC.webp",p="/assets/qsxwwd-BJvLd6XY.webp",g="/assets/spin-CtGGTJTE.gif",h=()=>{const[r,s]=o.useState("");return o.useEffect(()=>{const n=()=>{const a=new Date;let i=a.getHours(),t=a.getMinutes();i=i%24,t=t<10?"0"+t:t,s(`${i} ${t}`)};n();const c=setInterval(n,1e3);return()=>clearInterval(c)},[]),e.jsxs("div",{style:{height:"100vh",width:"100vw",overflow:"hidden",backgroundColor:"#093063",position:"relative",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${d})`,backgroundRepeat:"no-repeat",backgroundPosition:"center center",backgroundSize:"100% 100%",opacity:.9,zIndex:1}}),e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${l})`,backgroundRepeat:"no-repeat",backgroundPosition:"center center",backgroundSize:"100% 100%",opacity:.4,zIndex:2}}),e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${p})`,backgroundRepeat:"repeat",backgroundPosition:"center center",backgroundSize:"33% 33%",opacity:.4,zIndex:4}}),e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${g})`,backgroundRepeat:"no-repeat",backgroundPosition:"center center",backgroundAttachment:"fixed",transform:"scaleX(-1)",opacity:.3,zIndex:5}}),e.jsx("div",{style:{fontFamily:"'Barriecito', Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",fontSize:"14rem",whiteSpace:"nowrap",background:"linear-gradient(90deg, #369b91, #0e8c68, #711579)",backgroundSize:"75%",backgroundRepeat:"no-repeat",backgroundClip:"text",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",animation:"animate 3s linear infinite",opacity:.3,zIndex:9,position:"relative"},children:r}),e.jsx("style",{children:`
          @keyframes animate {
            0% { background-position: -500%; }
            50% { background-position: 500%; }
            100% { background-position: 100%; }
          }

          @media (min-aspect-ratio: 1/1) {
            div[style*="Barriecito"] {
              font-size: calc(100vw / 5);
              transform: scaleY(calc(100vh / (10 * 1em)));
            }
          }

          @media (max-aspect-ratio: 1/1) {
            div[style*="Barriecito"] {
              font-size: calc(100vh / 5);
              transform: scaleX(calc(100vw / (10 * 1em)));
            }
          }
        `})]})};export{h as default};
