import{r,j as s}from"./index-DhGayC4d.js";const v="/assets/cora-BXnQLDXN.ttf",F=()=>{const[a,d]=r.useState(new Date),[n,u]=r.useState(!1);if(r.useEffect(()=>{new FontFace("CustomFont",`url(${v})`).load().then(t=>{document.fonts.add(t),u(!0)})},[]),r.useEffect(()=>{if(!n)return;let e;const t=()=>{d(new Date),e=requestAnimationFrame(t)};return e=requestAnimationFrame(t),()=>cancelAnimationFrame(e)},[n]),!n)return null;let i=a.getHours()%12;i===0&&(i=12);const l=a.getMinutes(),c=a.getSeconds(),f=[{value:i,max:12,isHour:!0},{value:Math.floor(l/10),max:5,isHour:!1},{value:l%10,max:9,isHour:!1},{value:Math.floor(c/10),max:5,isHour:!1},{value:c%10,max:9,isHour:!1}],x=29,m=2,g=e=>(e.isHour?(e.value-1)/11:e.value/e.max)*x+m,h=(e,t)=>{const o=Math.floor(e/t*255);return`rgb(${o}, ${o}, ${o})`},b={width:"100vw",height:"100vh",margin:0,padding:0,display:"flex",flexDirection:"row",alignItems:"stretch",boxSizing:"border-box"};return s.jsxs(s.Fragment,{children:[s.jsx("style",{children:`
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
  `}),s.jsx("div",{style:b,children:f.map((e,t)=>{const o=g(e),p=h(e.value,e.max);return s.jsx("div",{className:"clock-digit",style:{flex:`${o} 1 0`,fontSize:`${o}vw`,backgroundColor:p},children:e.value},t)})})]})};export{F as default};
