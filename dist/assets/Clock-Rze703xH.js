import{r,j as n}from"./index-DVyFz-Rf.js";const j="/assets/ang-Ebm9nMhq.ttf",D={0:"51vh",1:"46vh",2:"21vh",3:"28vh",4:"54vh",5:"51vh",6:"29vh",7:"55vh",8:"23vh",9:"20vh"},C={0:"33vh",1:"29vh",2:"26vh",3:"23vh",4:"21vh",5:"19vh",6:"17vh",7:"14vh"},I=()=>{const[i,d]=r.useState(["","",""]),[f,u]=r.useState(["","",""]),[c,v]=r.useState(!1),a=r.useRef([]);r.useEffect(()=>{const t=()=>{const o=new Date;let s=o.getHours();const h=o.getMinutes(),x=o.getSeconds();s=s%12||12;const E=s.toString(),F=h.toString().padStart(2,"0"),w=x.toString().padStart(2,"0");d([E,F,w])};t();const e=setInterval(t,1e3);return()=>clearInterval(e)},[]),r.useEffect(()=>{const t=()=>v(window.innerWidth<=600);return t(),window.addEventListener("resize",t),()=>window.removeEventListener("resize",t)},[]),r.useEffect(()=>(a.current.forEach(clearTimeout),a.current=[],a.current.push(setTimeout(()=>{u(i)},300)),()=>a.current.forEach(clearTimeout)),[i]);const y=t=>{const e=parseInt(t,10);return c?C[e]||"19vh":D[e]||"19vh"},S={display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",height:"100dvh",width:"100vw",margin:0,backgroundColor:"#ff00ff",fontFamily:"AngFont, system-ui",fontStyle:"normal"},g={display:"flex",flexDirection:c?"column":"row",alignItems:"center"},l={display:"flex",flexDirection:"row"},p={width:c?"15vw":"13vh",height:c?"18vh":"auto",display:"flex",alignItems:"center",justifyContent:"center",position:"relative"},m=(t,e)=>t.split("").map((o,s)=>{const h=f[e]&&f[e][s]!==t[s];return n.jsx("div",{style:p,children:n.jsx("span",{style:{position:"absolute",color:"#EB11E0FF",textShadow:"4rem 0rem #E71BCBFF, 6rem 0rem #ED0EC4FF, -4rem 0rem #ED0EC4FF, -6rem 0rem #ED0EC4FF",fontSize:y(o),animation:h?"fadeInOut 0.3s ease-in-out":void 0,transformOrigin:"center",display:"inline-block"},children:o})},`${e}-${s}`)});return n.jsxs("div",{style:S,children:[n.jsxs("div",{style:g,children:[n.jsx("div",{style:l,children:m(i[0],0)}),n.jsx("div",{style:l,children:m(i[1],1)}),n.jsx("div",{style:l,children:m(i[2],2)})]}),n.jsx("style",{children:`
        @font-face {
          font-family: 'AngFont';
          src: url(${j}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes fadeInOut {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.9);
          }
        }
      `})]})};export{I as default};
