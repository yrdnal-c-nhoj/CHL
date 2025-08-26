import{r as i,j as t}from"./index-Dhx6LE5Y.js";const d="/assets/photo-1495578942200-c5f5d2137def-i1UZKR3P.avif",m=()=>{const[s,o]=i.useState({hours:0,minutes:0,seconds:0});i.useEffect(()=>{const e=()=>{const n=new Date;o({hours:n.getHours(),minutes:n.getMinutes(),seconds:n.getSeconds()})};e();const r=setInterval(e,1e3);return()=>clearInterval(r)},[]);const a={width:"2vw",height:"3vw",background:"radial-gradient(circle at 30% 30%, #7d9ac9, #a5c1e6)",boxShadow:"0 0 1vw 0.4vw rgba(117, 151, 215, 0.8)",animation:"pop 0.6s cubic-bezier(0.28, 0.84, 0.42, 1)"},l=e=>Array.from({length:e},(r,n)=>t.jsx("div",{style:a},n));return t.jsxs("div",{style:{margin:0,display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",position:"relative",boxSizing:"border-box"},children:[t.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",transform:"rotate(180deg)",backgroundImage:`url(${d})`,backgroundSize:"33% 33%",backgroundRepeat:"repeat",filter:"blur(4px) hue-rotate(180deg)",zIndex:1}}),t.jsx("div",{style:{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",alignItems:"center",zIndex:2},children:["hours","seconds","minutes"].map((e,r)=>t.jsx("div",{style:{position:"relative",width:"90vw",marginBottom:"2vh"},children:t.jsx("div",{style:{position:"relative",display:"grid",gridTemplateColumns:"repeat(auto-fill, 0.2vw)",justifyContent:"center",alignContent:"center",gap:"3vw",zIndex:2,pointerEvents:"none",height:"23vh"},children:l(s[e])})},e))}),t.jsx("style",{children:`
          @keyframes pop {
            0% { transform: scale(0); }
            70% { transform: scale(1.2); }
            100% { transform: scale(1); }
          }

          @media (max-width: 60vw) {
            div[style*="flex-direction: row"] {
              flex-direction: column !important;
            }
          }
        `})]})};export{m as default};
