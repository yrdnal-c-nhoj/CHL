import{r as i,j as t}from"./index-ZBdI8QuT.js";const x="/assets/blank-Bo-7oweH.jpg",a="/assets/Cross-CCJxksT5.otf",v=()=>{const[s,c]=i.useState(new Date);i.useEffect(()=>{new FontFace("Cross",`url(${a})`).load().then(r=>{document.fonts.add(r)});const n=setInterval(()=>{c(new Date)},1e3);return()=>clearInterval(n)},[]);const l=()=>`hsl(${Math.floor(Math.random()*360)}, 100%, 70%)`,m=()=>{let e=s.getHours();const n=e>=12?"PM":"AM";return e=e%12||12,{hours:String(e),minutes:String(s.getMinutes()).padStart(2,"0"),seconds:String(s.getSeconds()).padStart(2,"0"),ampm:n}},{hours:d,minutes:p,seconds:f,ampm:h}=m(),u={display:"inline-block",width:"0.4em",textAlign:"center",transition:"color 0.3s ease",userSelect:"none"},g={display:"flex",gap:"0.1em",justifyContent:"center"},o=e=>t.jsx("div",{style:g,children:e.split("").map((n,r)=>t.jsx("span",{style:{...u,color:l()},children:n},r))});return t.jsxs("div",{style:{height:"100vh",width:"100vw",overflow:"hidden",position:"relative",display:"flex",alignItems:"center",justifyContent:"center",backgroundColor:"black",fontFamily:"Cross, sans-serif"},children:[t.jsx("style",{children:`
          @font-face {
            font-family: 'Cross';
            src: url(${a}) format('opentype');
          }

          .clock-container {
            display: flex;
            flex-direction: row;
            gap: 1rem;
            font-size: 12rem;
            z-index: 4;
            line-height: 0.7;
          }

          .am-pm {
            font-size: 0.001rem;
            color: transparent;
          }

          @media (max-width: 768px) {
            .clock-container {
              flex-direction: column;
              font-size: 12rem;
              gap: 1rem;
              align-items: center;
            }

            .am-pm {
              font-size: 0.001rem;
              color: transparent;
            }
          }
        `}),t.jsx("img",{src:x,alt:"Background",style:{position:"absolute",top:0,left:0,width:"100vw",height:"100vh",objectFit:"cover",zIndex:0}}),t.jsxs("div",{className:"clock-container",children:[o(d),o(p),o(f),t.jsx("div",{className:"am-pm",children:h})]})]})};export{v as default};
