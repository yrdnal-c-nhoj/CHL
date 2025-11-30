import{r as n,j as r}from"./index-_Zh6IFgu.js";function l(){const[o,i]=n.useState(new Date().getHours());n.useEffect(()=>{const e=()=>{i(new Date().getHours())};e();const t=setInterval(e,1e3);return()=>clearInterval(t)},[]);const a=Array.from({length:25},(e,t)=>t);return r.jsxs("div",{style:{display:"flex",flexDirection:"column",height:"100vh",width:"100vw",backgroundColor:"#000",color:"#0f0",fontFamily:"monospace",fontSize:"clamp(2rem, 8vw, 10vh)",fontWeight:"bold",overflow:"hidden",padding:"2vh 0",boxSizing:"border-box",alignItems:"center",justifyContent:"center",gap:"1vh"},children:[a.map(e=>{const t=e===o;return r.jsx("div",{style:{width:"100%",textAlign:"center",padding:"1vh 0",backgroundColor:t?"#0f0":"transparent",color:t?"#000":"#0f0",border:t?"none":"2px solid #0f0",borderRadius:t?"8px":"0",transition:"all 0.6s ease",opacity:t?1:.3,transform:t?"scale(1.1)":"scale(1)"},children:e.toString().padStart(2,"0")},e)}),r.jsx("style",{jsx:!0,children:`
        @media (min-width: 768px) {
          div[style*="flexDirection: column"] {
            flex-direction: row !important;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 2vw;
            padding: 2vw;
          }
          div[style*="flexDirection: column"] > div {
            width: auto !important;
            padding: 2vh 3vw !important;
            font-size: clamp(3rem, 6vw, 8vh) !important;
          }
        }
      `})]})}export{l as default};
