import{r as o,j as n}from"./index-37WBs3jL.js";const y="/assets/code-B6rwVUUa.ttf",b="/assets/bar-BI9yMmnW.ttf",j="/assets/bgpo-Dr-hSm-u.webp",k="/assets/wh-pM2yP7oS.webp";function w(){const[s,a]=o.useState(new Date);o.useEffect(()=>{const t=setInterval(()=>a(new Date),10);return()=>clearInterval(t)},[]);const i=t=>{let e=t.getHours();const f=t.getMinutes(),m=t.getSeconds(),u=t.getMilliseconds();e=e%12||12;const p=e.toString().padStart(2,"0"),x=f.toString().padStart(2,"0"),h=m.toString().padStart(2,"0"),S=Math.floor(u/10).toString().padStart(2,"0");return[...p,...x,...h,...S]},c={display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100dvh",width:"100%",backgroundImage:`url(${j}), url(${k})`,backgroundSize:"100% 100%",backgroundPosition:"center, center",backgroundRepeat:"no-repeat, no-repeat"},l={display:"flex",transform:"translateX(-10%) translateY(90%)"},d={display:"flex",flexDirection:"column",lineHeight:1,margin:0,padding:0},r=(t,e)=>({fontSize:e,fontWeight:"bold",color:"#275254FF",textAlign:"center",fontFamily:t,margin:0,padding:0,lineHeight:1,letterSpacing:"0.05em",textShadow:`
      1px 0 #4a3a28, 
      -1px 0 #4a3a28, 
      0 1px #4a3a28, 
      0 -1px #4a3a28
    `,backgroundImage:'url("./cardboard_texture.jpg")',backgroundSize:"cover",WebkitBackgroundClip:"text",filter:"contrast(85%) brightness(95%)"}),g=i(s);return n.jsxs("div",{style:c,children:[n.jsx("style",{children:`
          @font-face {
            font-family: 'CodeFont';
            src: url(${y}) format('truetype');
          }
          @font-face {
            font-family: 'BarFont';
            src: url(${b}) format('truetype');
          }
        `}),n.jsx("div",{style:l,children:g.map((t,e)=>n.jsxs("div",{style:d,children:[n.jsx("div",{style:r("BarFont","0.5rem"),children:t}),n.jsx("div",{style:r("CodeFont","4rem"),children:t})]},e))})]})}export{w as default};
