import{r as s,j as n}from"./index-37WBs3jL.js";const h="/assets/dog-uek2Omj8.ttf",I=()=>{const[r,c]=s.useState(""),[i,l]=s.useState(new Date),a=async()=>{try{const t=await(await fetch("https://dog.ceo/api/breeds/image/random")).json();t.status==="success"&&c(t.message)}catch(e){console.error("Error fetching puppy image:",e)}};s.useEffect(()=>{a();const e=setInterval(()=>{l(new Date)},1e3),t=setInterval(()=>{a()},3e3);return()=>{clearInterval(e),clearInterval(t)}},[]);const m=e=>{let t=e.getHours();const o=e.getMinutes(),d=t>=12?"pm":"am";t=t%12,t=t||12;const p=o<10?`0${o}`:o;return`${t}${p} ${d}`.split("").join(" ")},u={width:"100vw",height:"100vh",backgroundImage:r?`url(${r})`:"none",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",display:"flex",justifyContent:"center",alignItems:"center",margin:0,overflow:"hidden",backgroundColor:"#333"},f={fontFamily:"CustomFont, sans-serif",fontSize:"6vh",color:"#F9EBE5FF",textShadow:"0.3vh 0.3vh 0.6vh rgba(0,0,0,0.9)",fontWeight:"bold",userSelect:"none",transform:"translateY(10vh)"},g=`
    @font-face {
      font-family: 'CustomFont';
      src: url(${h}) format('woff2');
      font-weight: normal;
      font-style: normal;
      font-display: block;
    }
  `;return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:g}),n.jsx("div",{style:u,children:n.jsx("div",{style:f,children:m(i)})})]})};export{I as default};
