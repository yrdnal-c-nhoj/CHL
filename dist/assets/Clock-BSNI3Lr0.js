import{r as c,j as o}from"./index-_Zh6IFgu.js";const B="/assets/eye-BKvg1p41.gif",D="/assets/eye3-Ci-RLL8K.ttf",R="/assets/eye-BcOCOhxJ.ttf";function E({imageWidth:i="24vw",imageHeight:l="16vw"}){const[d,u]=c.useState(()=>new Date),[y,v]=c.useState(0);c.useEffect(()=>{const t=Date.now(),s=setInterval(()=>{u(new Date),v(Date.now()-t)},100);return()=>clearInterval(s)},[]);const p=t=>t.toString().padStart(2,"0");let r=d.getHours();const w=r>=12?"PM":"AM";r=r%12||12;const x=`${r}:${p(d.getMinutes())} ${w}`,f="DigitsFont-2025-11-10",h="TimerFont-2025-11-10",b={position:"absolute",top:"1vh",right:"2vw",color:"#F7F0F0",fontSize:"min(4vw, 2.5vh)",fontFamily:`'${f}', monospace`,fontWeight:"normal",whiteSpace:"nowrap",zIndex:1,padding:"0.5vh 1vw",backgroundColor:"rgba(0, 0, 0, 0.2)",borderRadius:"5px",opacity:.9,textAlign:"center",transition:"all 0.3s ease"},S={display:"flex",alignItems:"center",justifyContent:"center",height:"100dvh",width:"100vw",position:"relative",overflow:"hidden"},$={position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:0,pointerEvents:"none",overflow:"hidden",opacity:1},k={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"grid",gridTemplateColumns:`repeat(30, ${i})`,gridAutoRows:`${l}`,marginLeft:`calc(-1 * ${i} / 2)`,marginTop:`calc(-1 * ${l} / 2)`},j={width:`${i}`,height:`${l}`,backgroundImage:`url(${B})`,backgroundRepeat:"no-repeat",backgroundSize:"100% 100%",willChange:"transform"},C=()=>{const t=[];for(let e=0;e<30;e++)for(let n=0;n<30;n++){const a=(e+n)%2===1;t.push(o.jsx("div",{style:{...j,transform:a?"scaleX(-1)":"none"}},`${e}-${n}`))}return o.jsx("div",{style:k,children:t})},m={fontFamily:`'${h}', monospace`,fontSize:"14vh",lineHeight:"1",width:"auto",minWidth:"8vh",padding:"0 0.1vh",color:"#ff0000",textShadow:"0 0 1vh rgba(255, 0, 0, 0.7)",backgroundColor:"rgba(0, 0, 0, 0.7)",borderRadius:"1vh",boxShadow:"0 0 1.5vh rgba(0, 0, 0, 0.5)",margin:"0 0.6vh",display:"inline-flex",alignItems:"center",justifyContent:"center",transition:"transform 0.1s ease-out"},F={...m,width:"0.08vh",minWidth:"0.08vh",padding:0,backgroundColor:"transparent",boxShadow:"none"},I=t=>{const s=Math.floor(t/1e3),g=Math.floor(s%60),e=Math.floor(t%1e3/10),n=`${g}.${p(e)}`;return o.jsx("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"flex",alignItems:"center",justifyContent:"center",width:"auto",maxWidth:"95vw",padding:"0.1vh 0.1vw",backgroundColor:"rgba(0, 0, 0, 0.6)",borderRadius:"15px",border:"2px solid rgba(255, 0, 0, 0.7)",boxShadow:"0 0 20px rgba(255, 0, 0, 0.7)"},className:"timer-container",children:n.split("").map((a,M)=>o.jsx("span",{style:{...a==="."?F:m,opacity:1},children:a},M))})};return o.jsxs("div",{style:S,children:[o.jsx("style",{children:`
          @font-face {
            font-family: '${f}';
            src: url(${D}) format('truetype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          @font-face {
            font-family: '${h}';
            src: url(${R}) format('truetype');
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
        `}),o.jsx("div",{style:$,children:C()}),o.jsx("div",{style:b,className:"clock",children:x}),I(y)]})}export{E as default};
