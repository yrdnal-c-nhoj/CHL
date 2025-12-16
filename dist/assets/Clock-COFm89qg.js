import{r as e,j as a}from"./index-37WBs3jL.js";const i="/assets/digi-D68qVRwS.ttf",m="/assets/bg-DexFbDpg.webp",x="/assets/bg1-CmzrQEax.jpg";function h(){const[l,d]=e.useState(c()),[s,n]=e.useState(!1);function c(){const t=new Date,o=String(t.getHours()).padStart(2,"0"),r=String(t.getMinutes()).padStart(2,"0"),g=String(t.getSeconds()).padStart(2,"0");return`${o}:${r}:${g}`}e.useEffect(()=>{const t=setInterval(()=>{d(c())},1e3);return()=>clearInterval(t)},[]);const u=`
    @font-face {
      font-family: 'TodayFont';
      src: url(${i}) format('truetype');
      font-weight: normal;
      font-style: normal;
      font-display: swap;
    }
  `;e.useEffect(()=>{let t=!0;try{new FontFace("TodayFont",`url(${i})`).load().then(r=>{t&&(document.fonts.add(r),n(!0))}).catch(()=>{t&&n(!0)})}catch{n(!0)}return()=>{t=!1}},[]);const f={position:"relative",display:"flex",alignItems:"center",justifyContent:"center",width:"100vw",height:"100dvh",overflow:"hidden",backgroundImage:`url(${m}), url(${x})`,backgroundRepeat:"no-repeat, no-repeat",backgroundPosition:"center center, calc(50% - 4vw) center",backgroundSize:"90% auto, 380% auto",backgroundColor:"#000"},p={fontFamily:"TodayFont, monospace",fontSize:"13vw",color:"#F70E12E5",textShadow:"1px 1px 0px #F1EAEBA0, -1px -1px 0px #0E0D0DFF",transform:"scaleX(-1) translateX(-1vw)",textAlign:"center",zIndex:2,opacity:s?1:0,transition:"opacity 160ms linear",pointerEvents:s?"auto":"none"};return a.jsxs("div",{style:f,children:[a.jsx("style",{children:u}),a.jsx("div",{style:p,children:l})]})}export{h as default};
