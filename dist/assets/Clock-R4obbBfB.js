import{r as a,j as e}from"./index-37WBs3jL.js";const u="/assets/muybridge-BeVWNfY4.webp",p="/assets/muy-B2_MbT_R.ttf",l="#BE83E6FF",t={position:"relative",width:"clamp(20px, 7vw, 40px)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"MuybridgeFont, serif",fontSize:"clamp(44px, 32vw, 68px)",color:l,textShadow:"0.5px 0.5px 0px black, -0.5px -0.5px 0px white",flexShrink:1,minWidth:0,overflow:"hidden"};function m(){const[i,d]=a.useState(new Date);a.useEffect(()=>{const h=setInterval(()=>d(new Date),100);return()=>clearInterval(h)},[]);const c={position:"fixed",top:0,left:0,right:0,bottom:0,width:"100%",height:"100%",minHeight:"-webkit-fill-available",backgroundImage:`url(${u})`,backgroundSize:"cover",backgroundPosition:"center",backgroundColor:"#090909FF",display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden",touchAction:"manipulation",WebkitOverflowScrolling:"touch",overscrollBehavior:"none"},x={display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"MuybridgeFont, serif",width:"100%",maxWidth:"100vw",boxSizing:"border-box",transform:"scale(0.9)",position:"absolute",bottom:"25vh",left:0,right:0},n={fontSize:"clamp(34px, 22vw, 58px)",color:l,lineHeight:1,paddingBottom:"1.5vw",flexShrink:0},o=String(i.getHours()).padStart(2,"0"),r=String(i.getMinutes()).padStart(2,"0"),s=String(i.getSeconds()).padStart(2,"0");return e.jsxs("div",{style:c,children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'MuybridgeFont';
          src: url(${p}) format('opentype');
        }
        /* Prevent font boosting on mobile */
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
          * {
            -webkit-text-size-adjust: 100%;
            text-size-adjust: 100%;
            -moz-text-size-adjust: 100%;
          }
        }
      `}),e.jsxs("div",{style:x,children:[e.jsx("div",{style:t,"aria-hidden":"true",children:o[0]}),e.jsx("div",{style:t,"aria-hidden":"true",children:o[1]}),e.jsx("div",{style:n,"aria-hidden":"true",children:":"}),e.jsx("div",{style:t,"aria-hidden":"true",children:r[0]}),e.jsx("div",{style:t,"aria-hidden":"true",children:r[1]}),e.jsx("div",{style:n,"aria-hidden":"true",children:":"}),e.jsx("div",{style:t,"aria-hidden":"true",children:s[0]}),e.jsx("div",{style:t,"aria-hidden":"true",children:s[1]})]})]})}export{m as default};
