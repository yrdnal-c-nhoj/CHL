import{r as a,j as r}from"./index-37WBs3jL.js";const p="/assets/cora-BXnQLDXN.ttf",k=()=>{const[s,u]=a.useState(new Date),[n,f]=a.useState(!1);if(a.useEffect(()=>{let e=!1;return(async()=>{try{const i=await new FontFace("CustomFont",`url(${p})`).load();e||(document.fonts.add(i),f(!0))}catch(t){console.error("Font failed to load:",t)}})(),()=>{e=!0}},[]),a.useEffect(()=>{if(!n)return;let e;const o=()=>{u(new Date),e=requestAnimationFrame(o)};return o(),()=>cancelAnimationFrame(e)},[n]),!n)return null;let l=s.getHours()%12;l===0&&(l=12);const c=s.getMinutes(),d=s.getSeconds(),x=[{value:l,max:12,isHour:!0},{value:Math.floor(c/10),max:5},{value:c%10,max:9},{value:Math.floor(d/10),max:5},{value:d%10,max:9}],m=29,h=2,g=e=>(e.isHour?(e.value-1)/11:e.value/e.max)*m+h,y=(e,o)=>{const t=Math.floor(e/o*255);return`rgb(${t}, ${t}, ${t})`},b={width:"100vw",height:"100vh",display:"flex",flexDirection:"row"};return r.jsxs(r.Fragment,{children:[r.jsx("style",{children:`
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
      filter: saturate(300%);
    }
    .clock-digit:last-child {
      border-right: none;
    }
    @keyframes borderFade {
      0% { border-color: black; }
      50% { border-color: white; }
      100% { border-color: black; }
    }
  `}),r.jsx("div",{style:b,children:x.map((e,o)=>{const t=g(e),i=y(e.value,e.max);return r.jsx("div",{className:"clock-digit",style:{flex:`${t} 1 0`,fontSize:`${t}vw`,backgroundColor:i},children:e.value},o)})})]})};export{k as default};
