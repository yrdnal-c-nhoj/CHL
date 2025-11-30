import{r as s,j as n}from"./index-_Zh6IFgu.js";const b="/assets/dots-T_wUUQTL.otf",v="/assets/dot-CG13gqB0.jpg";function S(){const[d,a]=s.useState(new Date),[r,l]=s.useState(window.innerWidth<600);s.useEffect(()=>{const t=()=>{l(window.innerWidth<600)};window.addEventListener("resize",t);const e=setInterval(()=>{a(new Date)},1e3);return()=>{clearInterval(e),window.removeEventListener("resize",t)}},[]);const c=t=>{let e=t.getHours();const i=String(t.getMinutes()).padStart(2,"0"),w=String(t.getSeconds()).padStart(2,"0");return e=e%12||12,e=e.toString(),{hours:e,minutes:i,seconds:w}},{hours:g,minutes:p,seconds:h}=c(d),x={display:"flex",justifyContent:"center",alignItems:"center",height:"100dvh",width:"100vw",flexDirection:r?"column":"row",gap:"0.1rem",overflow:"hidden"},f={display:"flex",flexDirection:"row",gap:"0.1rem",alignItems:"center",justifyContent:"center"},m={width:"9rem",height:"9rem",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11rem",fontFamily:"'dots', monospace",backgroundColor:"rgba(251, 148, 5, 0.1)",borderRadius:"0.2em",color:"rgb(4, 2, 109)",textShadow:`
      #f6320b 1px 1px 20px,
      #94f00b -1px 1px 20px,
      #f72808 1px -1px 20px,
      #a5f507 -1px -1px 20px
    `},o=t=>n.jsx("div",{style:f,children:[...t].map((e,i)=>n.jsx("div",{style:m,children:e},i))}),u=`
    @font-face {
      font-family: 'dots';
      src: url(${b}) format('opentype');
    }

    html, body {
      height: 100%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      overflow: hidden;
    }

    *, *::before, *::after {
      box-sizing: inherit;
    }
  `;return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:u}),n.jsxs("div",{style:{position:"relative",width:"100vw",height:"100vh",overflow:"hidden"},children:[n.jsx("div",{style:{backgroundImage:`url(${v})`,backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",position:"absolute",filter:"hue-rotate(50deg)",top:0,left:0,width:"100%",height:"100%",zIndex:0,opacity:.6}}),n.jsxs("div",{style:{...x,position:"relative",zIndex:1},children:[o(g),o(p),o(h)]})]})]})}export{S as default};
