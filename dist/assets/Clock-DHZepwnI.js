import{r as o,j as e}from"./index-BG825qbX.js";const i="/assets/gol-D6x6nAp8.ttf",c="/assets/go-BkLfjxLl.gif",m=()=>{const[n,s]=o.useState(()=>new Date);o.useEffect(()=>{const t=setInterval(()=>s(new Date),1e3);return()=>clearInterval(t)},[]);const r=()=>{let t=n.getHours()%12;t===0&&(t=12);const a=n.getMinutes();return`${t}${a.toString().padStart(2,"0")}`};return e.jsxs("div",{style:{height:"100dvh",width:"100vw",backgroundImage:`url(${c})`,backgroundSize:"cover",backgroundPosition:"center",fontFamily:"CustomFont, sans-serif",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("style",{children:`
          @font-face {
            font-family: 'CustomFont';
            src: url(${i}) format('truetype');
            font-weight: normal;
            font-style: normal;
          }
        `}),e.jsx("div",{style:{fontSize:"4rem",color:"#F0ECD8FF",textShadow:"0 0 1rem black"},children:r()})]})};export{m as default};
