import{r as m,j as s}from"./index-Ch2k27Fp.js";const $="/assets/slot-CqAjIBs2.otf",L="/assets/IMAGE_1688551792-DKVd5_QN.webp",w=document.createElement("style");w.textContent=`
  @font-face {
    font-family: 'slot';
    src: url(${$}) format('opentype');
  }
`;document.head.appendChild(w);const B=()=>{const[u,x]=m.useState({hour:"",minute:"",second:"",ampm:""}),[R,S]=m.useState(!1),[z,h]=m.useState([[],[],[]]),[E,f]=m.useState([[],[],[]]),p=m.useRef([]),g=m.useRef([]),T=["1","2","3","4","5","6","7","8","9","10","11","12"],I=Array.from({length:60},(t,e)=>e.toString().padStart(2,"0")),M=Array.from({length:60},(t,e)=>e.toString().padStart(2,"0")),j=["🍒","🍋","🍊","🍉","⭐","🔔","🧊","🫀","🔭","🍒","🍋","🍊","🍉","⭐","🔔"],c=()=>j[Math.floor(Math.random()*j.length)],y=()=>{const t=new Date;let e=t.getHours();const r=t.getMinutes(),n=t.getSeconds(),o=e>=12?"PM":"AM";return e=e%12||12,{hour:e.toString(),minute:r.toString().padStart(2,"0"),second:n.toString().padStart(2,"0"),ampm:o}},A=(t,e,r)=>{const n=e==="hour"?T:e==="minute"?I:M,o=n.indexOf(t),d=c(),l=[],C=[];for(let i=-1;i<=1;i++){const a=(o+i+n.length)%n.length;l.push(s.jsx("div",{children:n[a]},i)),C.push(s.jsx("div",{children:d},i))}h(i=>{const a=[...i];return a[r]=l,a}),f(i=>{const a=[...i];return a[r]=C,a})},D=()=>{x(y())},b=(t,e,r)=>{const n=p.current[t],o=g.current[t];n&&o&&(n.classList.remove("spinning"),o.classList.remove("spinning"),n.style.transform="translateY(0)",o.style.transform="translateY(0)",h(d=>{const l=[...d];return l[t]=[s.jsx("div",{children:e},0)],l}),f(d=>{const l=[...d];return l[t]=[s.jsx("div",{style:{opacity:.5},children:c()},-1),s.jsx("div",{children:c()},0),s.jsx("div",{style:{opacity:.5},children:c()},1)],l}),t===2&&(D(),setTimeout(()=>{S(!1),v()},1500)))},v=()=>{if(R)return;S(!0);const t=y(),e=[t.hour,t.minute,t.second];p.current.forEach((r,n)=>{if(r&&g.current[n]){r.classList.add("spinning"),g.current[n].classList.add("spinning");const o=n===0?"hour":n===1?"minute":"second";A(e[n],o,n)}}),setTimeout(()=>b(0,e[0]),500),setTimeout(()=>b(1,e[1]),1e3),setTimeout(()=>b(2,e[2]),1500)};return m.useEffect(()=>{(()=>{const e=y();x(e);const r=[e.hour,e.minute,e.second];h(r.map((n,o)=>[s.jsx("div",{children:n},0)])),f(r.map(()=>[s.jsx("div",{style:{opacity:.5},children:c()},-1),s.jsx("div",{children:c()},0),s.jsx("div",{style:{opacity:.5},children:c()},1)])),v()})()},[]),s.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100vh",width:"100vw",margin:0,backgroundColor:"#080808"},children:[s.jsx("img",{src:L,style:{backgroundSize:"cover",backgroundPosition:"center",position:"absolute",height:"100vh",width:"43.75rem",top:"50%",left:"50%",transform:"translate(-50%, -50%)",zIndex:1,opacity:.9},alt:"Background"}),s.jsxs("div",{id:"slot-machine",style:{border:"0.3125rem solid #333",padding:"1.25rem",backgroundColor:"#83773c",borderRadius:"0.625rem",boxShadow:"0 0 0.625rem rgba(0, 0, 0, 0.5)"},children:[s.jsx("div",{id:"reels",style:{display:"flex",justifyContent:"center"},children:[0,1,2].map(t=>s.jsxs("div",{id:`reel${t+1}`,style:{zIndex:3,width:"5rem",height:"11.25rem",border:"0.125rem solid #000",margin:0,overflow:"hidden",position:"relative",backgroundColor:"#f8f8f8",display:"flex",justifyContent:"center",alignItems:"center",backgroundImage:"linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 15%, rgba(0, 0, 0, 0) 85%, rgba(0, 0, 0, 0.4) 100%)",boxShadow:"inset 0 0 0.625rem rgba(0, 0, 0, 0.3)",borderRadius:"0.3125rem",userSelect:"none"},children:[s.jsx("div",{className:"reel-background",ref:e=>g.current[t]=e,style:{position:"absolute",top:0,left:0,width:"100%",height:"11.25rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",fontSize:"5rem",lineHeight:"6.25rem",opacity:.9,zIndex:1,userSelect:"none"},children:E[t]}),s.jsx("div",{className:"reel-content",ref:e=>p.current[t]=e,style:{fontFamily:"slot",color:"red",fontWeight:"bold",letterSpacing:"-0.1em",transform:"scaleX(1.1)",textShadow:`
                  -0.0625rem -0.0625rem 0 gold,
                  0.0625rem -0.0625rem 0 gold,
                  -0.0625rem 0.0625rem 0 gold,
                  0.0625rem 0.0625rem 0 gold,
                  -0.125rem -0.125rem 0 rgb(5, 5, 4),
                  0.125rem -0.0625rem 0 rgb(36, 36, 35),
                  -0.125rem 0.125rem 0 rgb(58, 58, 56),
                  0.125rem 0.125rem 0 rgb(21, 21, 20),
                  0 0 0.625rem gold,
                  0 0 1.25rem black
                `,fontSize:"3.625rem",lineHeight:"6.25rem",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"11.25rem",width:"100%",zIndex:2,userSelect:"none"},children:z[t]})]},t))}),s.jsx("div",{id:"time-display",style:{zIndex:2,marginTop:0,fontSize:0,fontWeight:"bold",textAlign:"center",color:"white",fontFamily:"sans-serif",userSelect:"none"},children:`${u.hour}:${u.minute}:${u.second} ${u.ampm}`})]})]})},Y=`
  .reel-background > div {
    height: 6.25rem;
    line-height: 6.25rem;
    width: 100%;
    text-align: center;
    flex-shrink: 0;
  }

  .reel-content > div {
    height: 6.25rem;
    line-height: 6.25rem;
    width: 100%;
    text-align: center;
    flex-shrink: 0;
  }

  .spinning {
    animation: spin 0.15s linear infinite;
  }

  @keyframes spin {
    0% { transform: translateY(0); }
    100% { transform: translateY(-6.25rem); }
  }
`,k=document.createElement("style");k.textContent=Y;document.head.appendChild(k);export{B as default};
