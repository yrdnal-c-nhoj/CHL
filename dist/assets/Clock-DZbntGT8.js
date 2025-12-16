import{r as c,j as e}from"./index-37WBs3jL.js";const M="/assets/eye-BKvg1p41.gif",D="/assets/eye3-Ci-RLL8K.ttf";function B({imageWidth:i="24vw",imageHeight:l="16vw"}){const[d,g]=c.useState(()=>new Date),[u,y]=c.useState(0);c.useEffect(()=>{const t=Date.now(),a=setInterval(()=>{g(new Date),y(Date.now()-t)},100);return()=>clearInterval(a)},[]);const p=t=>t.toString().padStart(2,"0");let r=d.getHours();const v=r>=12?"PM":"AM";r=r%12||12;const w=`${r}:${p(d.getMinutes())} ${v}`,f="DigitsFont-2025-11-10",b={position:"absolute",top:"1vh",right:"2vw",color:"#F7F0F0",fontSize:"min(4vw, 2.5vh)",fontFamily:`'${f}', monospace`,fontWeight:"normal",whiteSpace:"nowrap",zIndex:1,padding:"0.5vh 1vw",backgroundColor:"rgba(0, 0, 0, 0.2)",borderRadius:"5px",opacity:.9,textAlign:"center",transition:"all 0.3s ease"},x={display:"flex",alignItems:"center",justifyContent:"center",height:"100dvh",width:"100vw",position:"relative",overflow:"hidden"},S={position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:0,pointerEvents:"none",overflow:"hidden",opacity:1},$={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"grid",gridTemplateColumns:`repeat(30, ${i})`,gridAutoRows:`${l}`,marginLeft:`calc(-1 * ${i} / 2)`,marginTop:`calc(-1 * ${l} / 2)`},k={width:`${i}`,height:`${l}`,backgroundImage:`url(${M})`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",willChange:"transform"},j=()=>{const t=[];for(let o=0;o<30;o++)for(let n=0;n<30;n++){const s=(o+n)%2===1;t.push(e.jsx("div",{style:{...k,transform:s?"scaleX(-1)":"none"}},`${o}-${n}`))}return e.jsx("div",{style:$,children:t})},h={fontFamily:`'${timerFontFamilyName}', monospace`,fontSize:"14vh",lineHeight:"1",width:"auto",minWidth:"8vh",padding:"0 0.1vh",color:"#ff0000",textShadow:"0 0 1vh rgba(255, 0, 0, 0.7)",backgroundColor:"rgba(0, 0, 0, 0.7)",borderRadius:"1vh",boxShadow:"0 0 1.5vh rgba(0, 0, 0, 0.5)",margin:"0 0.6vh",display:"inline-flex",alignItems:"center",justifyContent:"center",transition:"transform 0.1s ease-out"},F={...h,width:"0.08vh",minWidth:"0.08vh",padding:0,backgroundColor:"transparent",boxShadow:"none"},C=t=>{const a=Math.floor(t/1e3),m=Math.floor(a%60),o=Math.floor(t%1e3/10),n=`${m}.${p(o)}`;return e.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"flex",alignItems:"center",justifyContent:"center",width:"auto",maxWidth:"95vw",padding:"0.1vh 0.1vw",backgroundColor:"rgba(0, 0, 0, 0.6)",borderRadius:"15px",border:"2px solid rgba(255, 0, 0, 0.7)",boxShadow:"0 0 20px rgba(255, 0, 0, 0.7)"},className:"timer-container",children:n.split("").map((s,I)=>e.jsx("span",{style:{...s==="."?F:h,opacity:1},children:s},I))})};return e.jsxs("div",{style:x,children:[e.jsx("style",{children:`
          @font-face {
            font-family: '${f}';
            src: url(${D}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: '${timerFontFamilyName}';
            src: url(${timerFont}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          .clock:hover {
            opacity: 1;
            background-color: rgba(0, 0, 0, 0.3);
          }
          @media (max-width: 600px) {
            .timer-container {
              padding: 2vh 3vw;
              border-radius: 22px;
            }
          }
        `}),e.jsx("div",{style:S,children:j()}),e.jsx("div",{style:b,className:"clock",children:w}),C(u)]})}export{B as default};
