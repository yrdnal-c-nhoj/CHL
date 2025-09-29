import{r as o,j as t}from"./index-Bgm5-oK8.js";const g="/assets/q-DuLxDLeV.webp",u="/assets/q-CDiXh74X.otf";function p(){const[n,c]=o.useState(new Date),[d,h]=o.useState(0);o.useEffect(()=>{const s=setInterval(()=>c(new Date),40),f=setInterval(()=>{h(x=>x===0?1:0)},100);return()=>{clearInterval(s),clearInterval(f)}},[]);const r=n.getHours().toString().padStart(2,"0"),i=n.getMinutes().toString().padStart(2,"0"),a=n.getSeconds().toString().padStart(2,"0"),l=Math.floor(n.getMilliseconds()/10).toString().padStart(2,"0"),e=({children:s})=>t.jsx("div",{style:{width:"1.5ch",textAlign:"center",display:"inline-block",userSelect:"none"},children:s});return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${u}) format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          html, body, #root {
            margin: 0; padding: 0; height: 100%;
            font-family: 'MyCustomFont', monospace, sans-serif;
          }
        `}),t.jsxs("div",{style:{height:"100vh",width:"100vw",backgroundImage:`url(${g})`,backgroundSize:"110% 110%",backgroundPosition:`${d}px 0px`,display:"flex",justifyContent:"center",alignItems:"center",fontSize:"10vh",color:"#fff",textShadow:"2px 2px 4px rgba(0,0,0,0.7)",userSelect:"none",transition:"none"},children:[t.jsx(e,{children:r[0]}),t.jsx(e,{children:r[1]}),t.jsx(e,{children:i[0]}),t.jsx(e,{children:i[1]}),t.jsx(e,{children:a[0]}),t.jsx(e,{children:a[1]}),t.jsx(e,{children:l[0]}),t.jsx(e,{children:l[1]})]})]})}export{p as default};
