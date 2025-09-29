import{r as s,j as t}from"./index-Bgm5-oK8.js";const F="/assets/wall-BvrHVh_b.webp",T="/assets/not-BahwupoK.otf",M="/assets/not2-DPHBGKuD.otf";function $(){const[r,x]=s.useState(!1),[i,v]=s.useState(new Date),[n,w]=s.useState(window.innerWidth<768),[S,j]=s.useState(!1),b="22vw",k="8rem",I="0.6vw",D="-0.7rem",C="-3vw",z="-1.5rem",d=n?b:k,m=n?I:D,p=n?C:z;if(s.useEffect(()=>{const e=document.createElement("style");e.innerHTML=`
      @font-face {
        font-family: "FontA";
        src: url(${T}) format("opentype");
        font-display: swap;
      }
      @font-face {
        font-family: "FontB";
        src: url(${M}) format("opentype");
        font-display: swap;
      }
      @keyframes fadeLoop {
        0% { opacity: 0; }
        11.75% { opacity: 1; }
        30% { opacity: 1; }
        61.25% { opacity: 0; }
        100% { opacity: 0; }
      }
    `,document.head.appendChild(e),Promise.all([document.fonts.load("1rem FontA"),document.fonts.load("1rem FontB"),new Promise((L,H)=>{const l=new Image;l.src=F,l.onload=L,l.onerror=H})]).then(()=>x(!0));const a=setInterval(()=>v(new Date),1e3),c=()=>w(window.innerWidth<768);return window.addEventListener("resize",c),()=>{clearInterval(a),window.removeEventListener("resize",c)}},[]),s.useEffect(()=>{if(!r)return;const e=setTimeout(()=>j(!0),3e3);return()=>clearTimeout(e)},[r]),!r)return t.jsx("div",{style:{width:"100vw",height:"100dvh",background:"black"}});const B=i.getHours()%12||12,E=i.getMinutes(),P=i.getSeconds(),f=i.getHours()>=12?"PM":"AM",u=e=>e.toString().padStart(2,"0"),y=B.toString(),h=u(E),g=u(P),o=e=>t.jsxs("div",{style:{position:"relative",display:"flex",justifyContent:"center",alignItems:"center",width:n?"17vw":"6rem",height:n?"17vw":"5rem",marginLeft:e===":"?p:m,marginRight:e===":"?p:m},children:[t.jsx("span",{style:{fontFamily:"FontA, sans-serif",fontSize:d,color:"#F44444FF",textShadow:`
            -0.2rem -0.2rem 0 #F5F3D6FF,
            0.2rem 0.2rem 0 #000000,
            0.4rem 0.4rem 1rem rgba(250,180,0,0.9),
            0 0 1.5rem #CAFF44FF,
            0 0 2.5rem #04FF00FF,
            0 0 3.5rem #66FFB3FF
          `,position:"absolute"},children:e}),t.jsx("span",{style:{fontFamily:"FontB, sans-serif",fontSize:d,color:"#5CB6FFFF",position:"absolute",textShadow:"0 0 1rem rgba(10,144,255,0.7)",opacity:0,animation:S?"fadeLoop 15s linear infinite":"none"},children:e})]}),A=()=>{if(n)return t.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"center"},children:[t.jsx("div",{style:{display:"flex"},children:[...y].map(o)}),t.jsx("div",{style:{display:"flex"},children:[...h].map(o)}),t.jsx("div",{style:{display:"flex"},children:[...g].map(o)}),t.jsx("div",{style:{display:"flex"},children:[...f].map(o)})]});{const e=[...y,":",...h,":",...g,...f];return t.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",flexDirection:"row"},children:e.map((a,c)=>o(a))})}};return t.jsxs("div",{style:{width:"100vw",height:"100dvh",position:"relative",display:"flex",justifyContent:"center",alignItems:"center",background:"black"},children:[t.jsx("div",{style:{position:"absolute",inset:0,backgroundImage:`url(${F})`,backgroundSize:"cover",backgroundPosition:"center",filter:"brightness(0.7) contrast(1.9)",opacity:.6,zIndex:0}}),t.jsx("div",{style:{position:"relative",zIndex:1},children:A()})]})}export{$ as default};
