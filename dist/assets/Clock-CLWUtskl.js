import{r as s,j as x}from"./index-uKLSe8E3.js";const o="/assets/sha-DFlnkQrJ.ttf",h=()=>{const[p,a]=s.useState({hours:"00",minutes:"00",seconds:"00"});s.useEffect(()=>{const n=()=>{const t=new Date;a({hours:String(t.getHours()).padStart(2,"0"),minutes:String(t.getMinutes()).padStart(2,"0"),seconds:String(t.getSeconds()).padStart(2,"0")})},i=setInterval(n,1e3);return n(),()=>clearInterval(i)},[]);const c=`
    @font-face {
      font-family: 'sha';
      src: url(${o}) format('truetype');
    }
  `,r={margin:0,height:"100vh",width:"100%",display:"flex",justifyContent:"center",alignItems:"center",backgroundColor:"#FFFFFF",flexDirection:"column",fontFamily:"sha"},d={display:"flex",flexDirection:window.innerWidth>=768?"row":"column",alignItems:"center",justifyContent:"center",textAlign:"center",maxWidth:"90vw",letterSpacing:"0.15em",color:"#000000",textShadow:`
      1px -1px 0 #767676, -1px 2px 1px #737272, -2px 4px 1px #767474, -3px 6px 1px #787777,
      -4px 8px 1px #7b7a7a, -5px 10px 1px #7f7d7d, -6px 12px 1px #828181, -7px 14px 1px #868585,
      -8px 16px 1px #8b8a89, -9px 18px 1px #8f8e8d, -10px 20px 1px #949392, -11px 22px 1px #999897,
      -12px 24px 1px #9e9c9c, -13px 26px 1px #a3a1a1, -14px 28px 1px #a8a6a6, -15px 30px 1px #adabab,
      -16px 32px 1px #b2b1b0, -17px 34px 1px #b7b6b5, -18px 36px 1px #bcbbba, -19px 38px 1px #c1bfbf,
      -20px 40px 1px #c6c4c4, -21px 42px 1px #cbc9c8, -22px 44px 1px #cfcdcd, -23px 46px 1px #d4d2d1,
      -24px 48px 1px #d8d6d5, -25px 50px 1px #dbdad9, -26px 52px 1px #dfdddc, -27px 54px 1px #e2e0df,
      -28px 56px 1px #e4e3e2
    `},e={fontSize:window.innerWidth>=768?"15vw":"23vh",transition:"all 0.7s ease"};return x.jsxs(x.Fragment,{children:[x.jsx("style",{children:c}),x.jsx("div",{style:r,children:x.jsxs("div",{style:d,children:[x.jsx("div",{children:x.jsx("span",{style:e,children:p.hours})}),x.jsx("div",{children:x.jsx("span",{style:e,children:p.minutes})}),x.jsx("div",{children:x.jsx("span",{style:e,children:p.seconds})})]})})]})};export{h as default};
