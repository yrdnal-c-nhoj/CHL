import{r as o,j as t}from"./index-0e73aqg0.js";const d="/assets/hori-B_RXP1B6.otf",c="/assets/4c558c5dbff1828f2b87582dc49526e8-C3H_XxIx.gif",f="/assets/sdfwef-RBVpXVS6.gif",h="/assets/ewfsdfsd-CsK_7g8W.gif",g=()=>{const[r,l]=o.useState("");return o.useEffect(()=>{const i=()=>{const s=new Date;let e=s.getHours();const a=String(s.getMinutes()).padStart(2,"0");e=e%12,e===0&&(e=12),l(`${e}${a}`)};i();const n=setInterval(i,1e3);return()=>clearInterval(n)},[]),t.jsxs("div",{style:{width:"100vw",height:"100vh",margin:0},children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'HorizonFont';
            src: url(${d}) format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          html {
            background-size: cover;
          }
        `}),t.jsx("div",{style:{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-end",overflow:"hidden",position:"fixed",bottom:0,left:0,zIndex:2},children:t.jsx("img",{src:c,alt:"Layer 1",style:{opacity:.5,width:"100%",height:"60vh",objectFit:"cover"}})}),t.jsx("div",{style:{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"flex-end",overflow:"hidden",position:"fixed",bottom:0,left:0,zIndex:1},children:t.jsx("img",{src:f,alt:"Layer 2",style:{width:"100%",height:"70vh",objectFit:"cover"}})}),t.jsx("div",{style:{position:"fixed",width:"100vw",height:"50vh",overflow:"hidden",zIndex:5},children:t.jsx("img",{src:h,alt:"Layer 3",style:{width:"100%",height:"150%"}})}),t.jsx("div",{style:{position:"fixed",top:"50%",left:"50%",transform:"translate(-50%, -50%)",display:"flex",alignItems:"center",fontSize:"7rem",fontFamily:"HorizonFont, sans-serif",background:"linear-gradient(to bottom, rgb(136, 145, 95) 50%, rgb(78, 136, 183) 50%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",backgroundClip:"text",zIndex:10,userSelect:"none"},children:r.split("").map((i,n)=>t.jsx("span",{style:{display:"inline-block",minWidth:"2.5rem",textAlign:"center",margin:0,padding:0},children:i},n))})]})};export{g as default};
