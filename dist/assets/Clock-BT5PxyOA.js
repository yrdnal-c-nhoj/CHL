import{r as o,j as t}from"./index-_Zh6IFgu.js";const c="/assets/stt-CQAc0zfY.ttf";function m(){const[a,n]=o.useState([]);function r(){const e=new Date,i=e.getHours().toString().padStart(2,"0"),d=e.getMinutes().toString().padStart(2,"0");return(i+d).split("")}o.useEffect(()=>{n(r());const e=setInterval(()=>n(r()),1e3);return()=>clearInterval(e)},[]);const s=`
    linear-gradient(
      0deg,
      #7E054EFF  0%,  #7E054EFF 24.9%,
      #A0E418FF 25%,#A0E418FF 49.9%,
       #7E054EFF 50%,  #7E054EFF 74.9%,
      #A0E418FF  75%, #0BF82BFF 100%
    )
  `;return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'CustomFont1001';
          src: url(${c}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        @keyframes slideStripes {
          from { background-position: 0 0; }
          to   { background-position: 200rem 200rem; }
        }

        @keyframes slideStripesReverse {
          from { background-position: 0 0; }
          to   { background-position: -200rem -200rem; }
        }

        .animated-bg {
          animation: slideStripesReverse 6040s linear infinite;
        }

        .animated-text {
          animation: slideStripes 6040s linear infinite;
          display: flex;
          font-family: 'CustomFont1001', sans-serif;
          font-size: 43vw;
          color: transparent;
          background: ${s};
          background-size: 0.8rem 0.8rem;
          -webkit-background-clip: text;
          background-clip: text;
        }

        .digit-box {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: -0.1rem;       /* fixed width for each digit */
          height: 32rem;      /* fixed height for equal boxing */
          overflow: hidden; /* ensures no clipping outside the box */
        }
      `}),t.jsx("div",{className:"animated-bg",style:{width:"100vw",height:"100dvh",backgroundImage:s,backgroundSize:"0.8rem 0.8rem",display:"flex",alignItems:"center",justifyContent:"center"},children:t.jsx("div",{className:"animated-text",children:a.map((e,i)=>t.jsx("span",{className:"digit-box",children:e},i))})})]})}export{m as default};
