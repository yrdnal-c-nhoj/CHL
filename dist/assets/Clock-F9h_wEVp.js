import{r as s,j as t}from"./index-37WBs3jL.js";const E="/assets/nono-BImCpj5e.ttf",R="/assets/crax-CUEIm23n.jpg";function $(){const[r,v]=s.useState(()=>new Date),[d,h]=s.useState(!1),a=s.useRef(!1),c="ClockFont2025_12_01",w="ClockFontStyle_2025_12_01",p="monospace";s.useEffect(()=>{if(a.current)return;const e=`
      @font-face {
        font-family: '${c}';
        src: url('${E}') format('truetype');
        font-display: swap; /* Tells browser to use fallback then swap */
      }
      
      /* Global Viewport Fixes */
      html, body {
        height: 100%; height: 100dvh; height: -webkit-fill-available;
        margin: 0; padding: 0; overflow: hidden;
      }
      body { min-height: 100dvh; min-height: -webkit-fill-available; }
    `,i=document.createElement("style");i.id=w,i.appendChild(document.createTextNode(e)),document.head.appendChild(i),document.fonts.load(`1em '${c}'`).then(()=>{h(!0)}).catch(I=>{console.error("Font loading failed, falling back.",I),h(!0)}),a.current=!0},[]),s.useEffect(()=>{if(!a.current)return;const e=setInterval(()=>v(new Date),1e3);return()=>clearInterval(e)},[]);const y={0:"1",1:"T",2:"m",3:"E",4:"F",5:"r",6:"L",7:"2",8:"q",9:"C"},l=s.useCallback(e=>e.split("").map(i=>y[i]||i).join(""),[]),u=l(String(r.getHours()).padStart(2,"0")),f=l(String(r.getMinutes()).padStart(2,"0")),g=l(String(r.getSeconds()).padStart(2,"0")),n=window.innerWidth<600,F=n?"32vw":"18vw",b=n?"26vw":"14vw",S=n?"24vw":"16vw",j=d?`'${c}', ${p}`:p,x={width:b,height:S,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:j,fontSize:F,color:"#071A16FF",borderRadius:"8px",textShadow:`
      -1px -1px 0 #F98016FF,
       1px -1px 0 #F98016FF,
      -1px  1px 0 #F98016FF,
       1px  1px 0 #F9800FFF
    `,userSelect:"none"},m={width:"100vw",height:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",backgroundImage:`url(${R})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",margin:0,padding:n?"2vh 0":"0",boxSizing:"border-box"},k={display:"flex",flexDirection:"row",gap:"3vw",alignItems:"center"},C={display:"flex",flexDirection:"column",gap:"4vh",alignItems:"center"},o=e=>t.jsxs("div",{style:{display:"flex",gap:n?"2vw":"1vw"},children:[t.jsx("div",{style:x,children:e[0]}),t.jsx("div",{style:x,children:e[1]})]});return d?t.jsx("div",{style:m,children:n?t.jsxs("div",{style:C,children:[o(u),o(f),o(g)]}):t.jsxs("div",{style:k,children:[o(u),o(f),o(g)]})}):t.jsx("div",{style:m,children:t.jsx("div",{style:{color:"white",fontSize:"4vh"},children:"Loading..."})})}export{$ as default};
