import{r as l,j as r}from"./index-Bgm5-oK8.js";const p="/assets/cora-BXnQLDXN.ttf",v=()=>{const[s,c]=l.useState(new Date);l.useEffect(()=>{let e;const t=()=>{c(new Date),e=requestAnimationFrame(t)};return e=requestAnimationFrame(t),()=>cancelAnimationFrame(e)},[]);let a=s.getHours()%12;a===0&&(a=12);const n=s.getMinutes(),i=s.getSeconds(),u=[{value:a,max:12,isHour:!0},{value:Math.floor(n/10),max:5,isHour:!1},{value:n%10,max:9,isHour:!1},{value:Math.floor(i/10),max:5,isHour:!1},{value:i%10,max:9,isHour:!1}],d=29,f=2,m=e=>(e.isHour?(e.value-1)/11:e.value/e.max)*d+f,x=(e,t)=>{const o=Math.floor(e/t*255);return`rgb(${o}, ${o}, ${o})`},g={width:"100vw",height:"100vh",margin:0,padding:0,display:"flex",flexDirection:"row",alignItems:"stretch",boxSizing:"border-box"},h=`
    @font-face {
      font-family: 'CustomFont';
      src: url(${p}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    .clock-digit {
      font-family: 'CustomFont', sans-serif;
      text-shadow: -4px 0px 0px black, 2px 0px 0px white;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: flex 0.6s ease-in-out, font-size 0.6s ease-in-out,
                  background-color 0.6s ease-in-out, color 0.6s ease-in-out;
      border-right: 1px solid black;
      animation: borderFade 12s infinite linear;
        filter: saturate(300%); /* <-- increases saturation */

    }
    .clock-digit:last-child {
      border-right: none;
    }
    @keyframes borderFade {
      0% { border-color: black; }
      50% { border-color: white; }
      100% { border-color: black; }
    }
  `;return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:h}),r.jsx("div",{style:g,children:u.map((e,t)=>{const o=m(e),b=x(e.value,e.max);return r.jsx("div",{className:"clock-digit",style:{flex:`${o} 1 0`,fontSize:`${o}vw`,backgroundColor:b},children:e.value},t)})})]})};export{v as default};
