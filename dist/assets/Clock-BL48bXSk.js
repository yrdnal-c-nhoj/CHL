import{r as a,j as t}from"./index-CRYDvM5t.js";const p="/assets/suv-BE9Vq26Y.ttf",h="/assets/suv-CBvsV9zK.gif",b="/assets/suvx-CIoEUrQS.jpg",k=()=>{const[s,i]=a.useState({h:"00",m:"00",ampm:"AM"});a.useEffect(()=>{new FontFace("suv",`url(${p})`).load().then(n=>{document.fonts.add(n)});const o=()=>{const n=new Date;let e=n.getHours();const u=n.getMinutes(),f=e>=12?"PM":"AM";e=e%12,e=e||12,i({h:String(e).padStart(2,"0"),m:String(u).padStart(2,"0"),ampm:f})};o();const m=setInterval(o,1e3);return()=>clearInterval(m)},[]);const l={margin:0,height:"100vh",width:"100vw",display:"flex",justifyContent:"flex-start",alignItems:"flex-start",background:"#7E8280FF",fontFamily:"suv, sans-serif",padding:"0vw",boxSizing:"border-box",overflow:"hidden"},d={position:"fixed",left:"200px",top:"51vh",transform:"translateY(-50%)",display:"flex",textAlign:"left",zIndex:2,lineHeight:1,gap:"0rem"},r={fontFamily:"suv, sans-serif",display:"block",fontSize:"1.1rem",color:"transparent",backgroundImage:`
      linear-gradient(
        145deg,
        #ffffff 0%,
        #d0d0d0 25%,
        #b0b0b0 50%,
        #eeeeee 70%,
        #999999 100%
      )
    `,WebkitBackgroundClip:"text",backgroundClip:"text",WebkitTextFillColor:"transparent",textShadow:`
      0.05rem 0.05rem 0.1rem rgba(255, 255, 255, 0.8),
      -0.05rem -0.05rem 0.1rem rgba(0, 0, 0, 0.4),
      0.05rem -0.05rem 0.03rem rgba(255, 255, 255, 0.3),
      -0.05rem 0.05rem 0.03rem rgba(0, 0, 0, 0.3),
      0 0 0.1rem rgba(255, 255, 255, 0.4)
    `,fontWeight:900,letterSpacing:"-0.1rem"},c={position:"fixed",bottom:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${h})`,backgroundPosition:"right bottom",backgroundRepeat:"no-repeat",backgroundSize:"auto 100vh",filter:"brightness(160%) saturate(190%) hue-rotate(30deg)",zIndex:2,pointerEvents:"none",transform:"scaleX(-1)"},g={position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${b})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"brightness(100%) saturate(120%)",zIndex:1};return t.jsxs("div",{style:l,children:[t.jsx("div",{style:g}),t.jsx("div",{style:c}),t.jsxs("div",{id:"clock",style:d,children:[t.jsx("span",{style:r,children:s.h}),t.jsx("span",{style:r,children:s.m}),t.jsx("span",{style:r,children:s.ampm})]})]})};export{k as default};
