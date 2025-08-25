import{r as s,j as t}from"./index-CRYDvM5t.js";const p="/assets/shrub-DI6lEoDP.jpeg",g="/assets/Tr-BvsM_sFV.ttf",h=()=>({top:`${Math.random()*80+10}%`,left:`${Math.random()*80+10}%`}),x=()=>({transform:`rotate(${Math.random()*20-10}deg)`}),v=()=>{const[a,i]=s.useState(new Date),[l,c]=s.useState(0),r=s.useMemo(()=>Array.from({length:10},()=>({position:h(),tilt:x()})),[]);s.useEffect(()=>{const n=setInterval(()=>i(new Date),1e3);return()=>clearInterval(n)},[]),s.useEffect(()=>{const n=setInterval(()=>{c(o=>(o+1)%r.length)},1e3);return()=>clearInterval(n)},[r.length]);const d=n=>{const o=r.length;let e=n-l;return e<0&&(e+=o),e<=5?e/5:1-(e-5)/4},f=a.getHours()%12||12,m=a.getMinutes().toString().padStart(2,"0");return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'MyCustomFont';
          src: url(${g}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          background: black;
          overflow: hidden;
        }
      `}),t.jsx("div",{style:{position:"fixed",inset:0,pointerEvents:"none",zIndex:0},children:t.jsx("div",{style:{position:"absolute",inset:0,backgroundImage:`url(${p})`,backgroundSize:"cover",backgroundPosition:"center",filter:"saturate(0.3) brightness(0.45) contrast(1.5)",zIndex:0}})}),t.jsx("div",{style:{position:"fixed",inset:0,overflow:"hidden",zIndex:10,pointerEvents:"none",backgroundColor:"transparent",fontFamily:"'MyCustomFont', Arial, sans-serif"},children:r.map(({position:n,tilt:o},e)=>{const u=d(e);return t.jsxs("time",{style:{position:"absolute",display:"flex",color:"#E9F2D7FF",fontSize:"1.0rem",transition:"opacity 2s linear",opacity:u,...n,...o,pointerEvents:"none",textShadow:"0 0 5px rgba(0,0,0,0.7)",userSelect:"none",whiteSpace:"nowrap"},"aria-live":"polite",children:[t.jsx("span",{children:f}),t.jsx("span",{children:m})]},e)})})]})};export{v as default};
