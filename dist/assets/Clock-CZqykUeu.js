import{r as o,j as t}from"./index-CPtGTb2j.js";const c="/assets/hori-B_RXP1B6.otf",f="/assets/4c558c5dbff1828f2b87582dc49526e8-C3H_XxIx.gif",h="/assets/sdfwef-RBVpXVS6.gif",x="/assets/ewfsdfsd-CsK_7g8W.gif",m=()=>{const[r,l]=o.useState("");return o.useEffect(()=>{const e=()=>{const n=new Date;let i=n.getHours();const a=String(n.getMinutes()).padStart(2,"0");i=i%12,i===0&&(i=12);const d=`${i}${a}`;l(d)};e();const s=setInterval(e,1e3);return()=>clearInterval(s)},[]),t.jsxs("div",{style:{width:"100vw",height:"100vh",margin:0},children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'HorizonFont';
            src: url(${c}) format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          html {
            background-size: cover;
          }
        `}),t.jsx("div",{style:{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-end",overflow:"hidden",position:"fixed",bottom:0,left:0,zIndex:2},children:t.jsx("img",{src:f,alt:"Layer 1",style:{opacity:.5,width:"100%",height:"60vh",objectFit:"cover"}})}),t.jsx("div",{style:{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-end",overflow:"hidden",position:"fixed",bottom:0,left:0,zIndex:1},children:t.jsx("img",{src:h,alt:"Layer 2",style:{width:"100%",height:"70vh",objectFit:"cover"}})}),t.jsx("div",{style:{position:"fixed",width:"100vw",height:"50vh",overflow:"hidden",zIndex:5},children:t.jsx("img",{src:x,alt:"Layer 3",style:{width:"100%",height:"150%"}})}),t.jsx("div",{style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"flex",alignItems:"center",fontSize:"7rem",fontFamily:"HorizonFont, sans-serif",background:"linear-gradient(to bottom, rgb(136, 145, 95) 50%, rgb(78, 136, 183) 50%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",zIndex:10,userSelect:"none"},children:r.padStart(4," ").split("").map((e,s)=>t.jsx("span",{style:{display:"inline-block",minWidth:"2.5rem",textAlign:"center"},children:e===" "?" ":e},s))})]})};export{m as default};
