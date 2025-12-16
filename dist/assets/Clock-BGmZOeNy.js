import{r,j as n}from"./index-37WBs3jL.js";const M="/assets/roc-BjTFMfYx.webp",k="/assets/roc-DipUw7cj.ttf";function I(){const[p,g]=r.useState(new Date),[i,u]=r.useState([]);r.useEffect(()=>{const t=setInterval(()=>g(new Date),6e4);return()=>clearInterval(t)},[]),r.useEffect(()=>{const t=window.innerWidth<=768,e=[],h=6,$=t?8:12;for(let o=0;o<h;o++){const S=o*$,j=(h-1-o)*(t?1.5:2.5);let a;o<2?a=30:o>=4?a=5:a=15;let d,m;o>=4?(d=t?7:9,m=t?18:25):(d=t?9:11,m=t?26:38);const s=t?.7:1;e.push({display:"inline-block",fontFamily:"'Roco Revival', serif",fontSize:`${d+Math.random()*m}vh`,color:"#D3C4C0FF",textShadow:`
          2px 2px 4px rgba(255, 20, 147, 0.4),
          4px 4px 8px rgba(50, 205, 50, 0.4),
          0 0 8px rgba(255, 20, 147, 0.6),
          0 0 7px rgba(50, 205, 50, 0.4)
        `,padding:`${.1+Math.random()*(t?5:11.3)}vh ${.1+Math.random()*.4}vh`,margin:`${.01+Math.random()*(t?1.2:2.4)}vh`,position:"absolute",zIndex:a,transform:`
          translate(${j}vh, ${S}vh)
          rotate(${(Math.random()*60-30)*s}deg)
          skew(${(Math.random()*15-7.5)*s}deg, ${(Math.random()*15-7.5)*s}deg)
          scale(${.8+Math.random()*.4*s}, ${.8+Math.random()*.4*s})
        `,transformOrigin:"center center",transition:"all 0.3s ease"})}u(e)},[]);const c=p.getHours(),x=p.getMinutes(),v=c>=12,l=(c%12===0?12:c%12).toString().split(""),f=x.toString().padStart(2,"0").split(""),y={fontFamily:"'Roco Revival', serif",height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"flex-start",paddingTop:"15vh",backgroundImage:`url(${M})`,backgroundSize:"cover",backgroundPosition:"left",backgroundRepeat:"no-repeat",backgroundColor:"#000",overflow:"hidden",position:"relative",backgroundAttachment:"fixed","@media (max-width: 768px)":{backgroundSize:"contain",backgroundPosition:"center center"}},w={display:"flex",flexDirection:"row",flexWrap:"nowrap",justifyContent:"center",alignItems:"center","@media (max-width: 768px)":{transform:"scale(0.8)"},"@media (max-width: 480px)":{transform:"scale(0.6)"}},b=(v?"pm":"am").split("");return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:`
          @font-face {
            font-family: 'Roco Revival';
            src: url(${k}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}),n.jsx("div",{style:y,children:n.jsxs("div",{style:w,children:[l.map((t,e)=>n.jsx("div",{style:i[e],children:t},`h-${e}`)),f.map((t,e)=>n.jsx("div",{style:i[l.length+e],children:t},`m-${e}`)),b.map((t,e)=>n.jsx("div",{style:i[l.length+f.length+e],children:t},`ampm-${e}`))]})})]})}export{I as default};
