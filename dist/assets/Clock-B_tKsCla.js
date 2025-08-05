import{r as n,j as e}from"./index-CZtQCcTu.js";const l="/assets/clouds-C0b2CGed.gif",v="/assets/clo-BmyCvn6x.ttf",M=()=>{const[a,c]=n.useState(""),[d,m]=n.useState(""),[f,g]=n.useState(""),[u,y]=n.useState(""),x=`
    @font-face {
      font-family: 'CloFont';
      src: url(${v}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `,s=i=>i.split("").map(r=>`<span class="digit" style="font-size: ${(Math.random()*9+1.5).toFixed(2)}rem;">${r}</span>`).join("");return n.useEffect(()=>{const i=()=>{const o=new Date;let t=o.getHours();const p=o.getMinutes(),h=o.getSeconds(),j=t>=12?"PM":"AM";t=t%12,t===0&&(t=12),c(s(String(t))),m(s(String(p).padStart(2,"0"))),g(s(String(h).padStart(2,"0"))),y(s(j))};i();const r=setInterval(i,1e3);return()=>clearInterval(r)},[]),e.jsxs(e.Fragment,{children:[e.jsx("style",{children:x}),e.jsx("style",{children:`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        .digit {
          display: inline-block;
          line-height: 1;
          color: #bed3ef;
          font-family: 'CloFont', serif;
          text-align: center;
          user-select: none;
          transition: font-size 0.3s ease;
        }
        .digit-group {
          display: flex;
          gap: 0rem;
          justify-content: center;
        }
      `}),e.jsxs("div",{style:{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden",position:"relative",margin:0,padding:0,backgroundSize:"cover"},children:[e.jsxs("div",{className:"timeStack",style:{display:"flex",flexDirection:"row",zIndex:6,fontFamily:"'CloFont', serif",color:"#bed3ef",fontSize:"2.5rem",textAlign:"center",gap:"0rem"},children:[e.jsx("div",{id:"hours",style:{display:"flex",justifyContent:"center",alignItems:"center"},dangerouslySetInnerHTML:{__html:a}}),e.jsx("div",{id:"minutes",style:{display:"flex",justifyContent:"center",alignItems:"center"},dangerouslySetInnerHTML:{__html:d}}),e.jsx("div",{id:"seconds",style:{display:"flex",justifyContent:"center",alignItems:"center"},dangerouslySetInnerHTML:{__html:f}}),e.jsx("div",{id:"ampm",style:{display:"flex",justifyContent:"center",alignItems:"center"},dangerouslySetInnerHTML:{__html:u}})]}),e.jsx("img",{src:l,alt:"Clouds Background",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:2,objectFit:"cover"}}),e.jsx("img",{src:l,alt:"Clouds Background Mirrored",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:2,objectFit:"cover",transform:"scaleX(-1)",opacity:.5}})]})]})};export{M as default};
