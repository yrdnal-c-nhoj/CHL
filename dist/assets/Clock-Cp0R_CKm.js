import{r as o,j as t}from"./index-BuZTN8H9.js";const r="/assets/clouds-C0b2CGed.gif",h="/assets/clo-BmyCvn6x.ttf",F=()=>{const[l,c]=o.useState(""),[d,m]=o.useState(""),[p,x]=o.useState(""),f=`
    @font-face {
      font-family: 'CloFont';
      src: url(${h}) format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  `,i=s=>s.split("").map((a,n)=>`<span class="digit" style="font-size: ${(Math.random()*11+1.5).toFixed(2)}rem;" data-key="${Date.now()+n}">${a}</span>`).join("");return o.useEffect(()=>{const s=()=>{const n=new Date;let e=n.getHours();const u=n.getMinutes(),g=e>=12?"PM":"AM";e=e%12||12,c(i(String(e))),m(i(String(u).padStart(2,"0"))),x(i(g))};s();const a=setInterval(s,5e3);return()=>clearInterval(a)},[]),t.jsxs(t.Fragment,{children:[t.jsx("style",{children:f}),t.jsx("style",{children:`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .digit {
          display: inline-block;
          line-height: 0.9;
          color: #E5EBF0FF;
          font-family: 'CloFont', serif;
          text-align: center;
          user-select: none;
          transition: opacity 1s ease, transform 1s ease, font-size 1s ease;
          text-shadow:
            19px 19px 0 #C9D2DEFF,
            -19px -19px 0 #E1E5EBFF,    
            0 -21px 0 #A8C4CCFF,
            -20px 0px 0 #A9B7D2FF,
            0 21px 0 #B3B8CEFF,
            20px 0px 0 #9FB5C1FF,
            -20px 23px 0 #CFD5DDFF,  
            20px -23px 0 #E3E7ECFF;
          opacity: 0;
          transform: scale(0.95);
          animation: fadePulse 5s ease-in-out infinite;
        }

        @keyframes fadePulse {
          0% {
            opacity: 0;
            transform: scale(0.95);
          }
          20% {
            opacity: 1;
            transform: scale(1);
          }
          80% {
            opacity: 1;
            transform: scale(1);
          }
          100% {
            opacity: 0;
            transform: scale(0.95);
          }
        }

        .timeStack {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          font-family: 'CloFont', serif;
          color: #bed3ef;
          text-align: center;
          gap: 0.2rem;
          z-index: 6;
        }

        @media (min-width: 768px) {
          .timeStack {
            flex-direction: row;
          }
        }
      `}),t.jsxs("div",{style:{width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden",position:"relative",margin:0,padding:0,backgroundSize:"cover"},children:[t.jsxs("div",{className:"timeStack",children:[t.jsx("div",{id:"hours",dangerouslySetInnerHTML:{__html:l}}),t.jsx("div",{id:"minutes",dangerouslySetInnerHTML:{__html:d}}),t.jsx("div",{id:"ampm",dangerouslySetInnerHTML:{__html:p}})]}),t.jsx("img",{src:r,alt:"Clouds Background",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:2,objectFit:"cover"}}),t.jsx("img",{src:r,alt:"Clouds Background Mirrored",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",zIndex:2,objectFit:"cover",transform:"scaleX(-1)",opacity:.5}})]})]})};export{F as default};
