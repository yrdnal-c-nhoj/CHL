import{r,j as e}from"./index-37WBs3jL.js";const B="/assets/bin3-W7jPts0S.ttf",T="/assets/bin1-CdB699iJ.otf",d="digitalFont",f="techFont";function D(){const[n,p]=r.useState(new Date),[u,m]=r.useState(!0);r.useEffect(()=>{const t=setInterval(()=>p(new Date),50);return()=>clearInterval(t)},[]),r.useEffect(()=>{let t=!1;const l=()=>{t||m(!1)};if(document&&document.fonts&&document.fonts.load){const o=document.fonts.ready.catch(()=>{}),a=document.fonts.load(`400 16px "${d}"`).catch(()=>{}),c=document.fonts.load(`400 16px "${f}"`).catch(()=>{});return Promise.race([Promise.all([o,a,c]),new Promise(k=>setTimeout(k,2e3))]).then(l),()=>{t=!0}}else{const o=setTimeout(l,300);return()=>clearTimeout(o)}},[]);const s=t=>t.toString(2).padStart(8,"0").split(""),x=`
    @font-face { 
      font-family: '${d}'; 
      src: url(${B}) format('truetype'); 
      font-display: block;
    }
    @font-face { 
      font-family: '${f}'; 
      src: url(${T}) format('opentype'); 
      font-display: block;
    }
  `,y={position:"relative",display:"flex",justifyContent:"center",alignItems:"center",height:"100svh",width:"100vw",overflow:"hidden",paddingTop:"env(safe-area-inset-top)",paddingBottom:"env(safe-area-inset-bottom)",paddingLeft:"env(safe-area-inset-left)",paddingRight:"env(safe-area-inset-right)",WebkitTextSizeAdjust:"100%",textSizeAdjust:"100%"},g={display:"flex",flexDirection:"row",gap:0,padding:0,position:"relative",zIndex:1,width:"100%",height:"100%"},F={display:"flex",flexDirection:"column",alignItems:"stretch",justifyContent:"stretch",padding:0,flex:1,height:"100%"},v={display:"flex",flexDirection:"column-reverse",justifyContent:"stretch",alignItems:"stretch",flex:1,width:"100%"},S={width:"100%",flexShrink:0,height:"9vh",display:"flex",justifyContent:"center",alignItems:"center",fontSize:"8vh",fontFamily:d,color:"#F713DCFF",backgroundColor:"#024236FF",paddingTop:"1vh",paddingBottom:"1vh",textShadow:`
      1px 1px 0 #000,
      -1px -1px 0 #000,
      1px -1px 0 #FFF,
      -1px 1px 0 #FFF
    `},j=t=>({width:"100%",flex:1,display:"flex",justifyContent:"center",alignItems:"center",fontSize:"7vh",fontFamily:f,color:t==="1"?"#F6F2F2FF":"#020202FF",backgroundColor:t==="1"?"#1100CCFF":"#EFFA26FF",margin:0,transition:"all 0.3s ease"}),i=(t,l,o)=>e.jsxs("div",{style:F,children:[e.jsx("div",{style:v,children:l.map((a,c)=>e.jsx("div",{style:j(a),children:a},c))}),e.jsx("div",{style:S,children:o.toString().padStart(2,"0")})]}),C=s(n.getHours()),w=s(n.getMinutes()),b=s(n.getSeconds()),h=Math.floor(n.getMilliseconds()/10),I=s(h);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:x}),e.jsxs("div",{style:y,children:[e.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100svh",backgroundColor:"#000",opacity:u?1:0,transition:"opacity 400ms ease-out",pointerEvents:"none",zIndex:9999,willChange:"opacity",transform:"translateZ(0)"}}),e.jsxs("div",{style:g,children:[i("H",C,n.getHours()),i("M",w,n.getMinutes()),i("S",b,n.getSeconds()),i("MS",I,h)," "]})]})]})}export{D as default};
