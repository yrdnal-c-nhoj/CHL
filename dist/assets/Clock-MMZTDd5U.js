import{r as a,j as e}from"./index-BG825qbX.js";const h="/assets/cubic-_0yVhNzr.ttf",b="/assets/earth-VbS5y9B0.webp",u=["rgba(102, 51, 0, 0.75)","rgba(194, 178, 128, 0.75)","rgba(85, 87, 17, 0.75)","rgba(160, 82, 45, 0.75)","rgba(34, 32, 52, 0.75)","rgba(230, 180, 140, 0.75)"];function S(){const[o,n]=a.useState(new Date),[s,i]=a.useState(!1);a.useEffect(()=>{new FontFace("CustomHexFont",`url(${h})`).load().then(r=>{document.fonts.add(r),i(!0)})},[]),a.useEffect(()=>{const t=setInterval(()=>n(new Date),1e3);return()=>clearInterval(t)},[]);const d=(()=>{let t=o.getHours();const r=o.getMinutes();return t===0&&(t=12),t>12&&(t-=12),`${t}${r.toString().padStart(2,"0")}`})(),l={position:"relative",width:"100vw",height:"100dvh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"},c={position:"absolute",inset:0,backgroundImage:`url(${b})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"brightness(0.8) contrast(1.15)",zIndex:0},m={position:"relative",width:"24rem",height:"24rem",perspective:"290rem",zIndex:1},g={width:"100%",height:"100%",transformStyle:"preserve-3d",animation:"biteviteRotate 120s infinite linear"},p={position:"absolute",width:"100%",height:"100%",display:"flex",alignItems:"center",justifyContent:"center",backdropFilter:"blur(0.125rem)"},x={fontFamily:"'CustomHexFont', 'Courier New', monospace",fontSize:"9.5rem",background:"linear-gradient(135deg, #5B3A1A 0%, #7A5230 40%, #3E2A15 100%)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textShadow:`
      1px 1px 0 #3b2713,
      -1px -1px 1px #F0E4D5FF,
      2px 2px 2px rgba(0,0,0,0.6),
      -2px -2px 1px rgba(255,255,255,0.05),
      0 0 2px #EAE6E3FF,
      0 1px 3px rgba(0,0,0,0.8),
      0 -1px 2px rgba(255,255,255,0.05)
    `,filter:"contrast(1.2) brightness(0.9)",letterSpacing:"0.01em"},f={front:"translateZ(12rem)",back:"translateZ(-12rem) rotateY(180deg)",right:"rotateY(90deg) translateZ(12rem)",left:"rotateY(-90deg) translateZ(12rem)",top:"rotateX(90deg) translateZ(12rem)",bottom:"rotateX(-90deg) translateZ(12rem)"};return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        @keyframes biteviteRotate {
          0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
          25% { transform: rotateX(90deg) rotateY(90deg) rotateZ(90deg); }
          50% { transform: rotateX(180deg) rotateY(180deg) rotateZ(180deg); }
          75% { transform: rotateX(270deg) rotateY(270deg) rotateZ(270deg); }
          100% { transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg); }
        }

        @media (max-width: 600px) {
          .hexa-perspective {
            perspective: 500rem !important;
            width: 15rem !important;
            height: 15rem !important;
          }

          .hexa-time {
            font-size: 5rem !important;
          }
        }
      `}),e.jsxs("div",{style:l,children:[e.jsx("div",{style:c}),s&&e.jsx("div",{style:m,className:"hexa-perspective",children:e.jsx("div",{style:g,children:["front","back","right","left","top","bottom"].map((t,r)=>e.jsx("div",{style:{...p,transform:f[t],backgroundColor:u[r]},children:e.jsx("div",{style:x,className:"hexa-time",children:d})},t))})})]})]})}export{S as default};
