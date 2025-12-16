import{r,j as t}from"./index-37WBs3jL.js";const a=({value:e})=>{const[o,s]=r.useState(e),[i,n]=r.useState(e),[l,d]=r.useState(!1);r.useEffect(()=>{if(e!==o){n(o),d(!0);const m=setTimeout(()=>{s(e),d(!1)},600);return()=>clearTimeout(m)}},[e,o]);const p=String(o).padStart(2,"0"),f=String(i).padStart(2,"0");return t.jsxs("div",{className:"flip-container",children:[t.jsxs("div",{className:`flip-card ${l?"flipping":""}`,children:[t.jsx("div",{className:"top-half",children:t.jsx("span",{children:p})}),t.jsx("div",{className:"bottom-half",children:t.jsx("span",{children:p})}),t.jsx("div",{className:"flipping-top",children:t.jsx("span",{children:f})}),t.jsx("div",{className:"flipping-bottom",children:t.jsx("span",{children:p})})]}),t.jsx("style",{jsx:!0,children:`
        .flip-container {
          position: relative;
          width: 80px;
          height: 120px;
          perspective: 1000px;
          margin: 0 8px;
        }

        .flip-card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }

        .top-half,
        .bottom-half,
        .flipping-top,
        .flipping-bottom {
          position: absolute;
          width: 100%;
          height: 50%;
          overflow: hidden;
          background: #1a1a1a;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 80px;
          font-weight: bold;
          font-family: 'Arial Narrow', Arial, sans-serif;
        }

        .top-half {
          top: 0;
          border-bottom: 1px solid #000;
          transform-origin: bottom;
        }

        .bottom-half {
          bottom: 0;
          border-top: 1px solid #333;
          transform-origin: top;
          align-items: flex-start;
          padding-top: 12px;
        }

        .bottom-half span {
          transform: translateY(-50%);
        }

        .flipping-top {
          top: 0;
          border-bottom: 1px solid #000;
          transform-origin: bottom;
          transform: rotateX(0deg);
          animation: ${l?"flipTop 0.6s ease-in forwards":"none"};
        }

        .flipping-bottom {
          bottom: 0;
          border-top: 1px solid #333;
          transform-origin: top;
          transform: rotateX(90deg);
          animation: ${l?"flipBottom 0.6s ease-out forwards":"none"};
        }

        @keyframes flipTop {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(-90deg);
          }
        }

        @keyframes flipBottom {
          0% {
            transform: rotateX(90deg);
          }
          100% {
            transform: rotateX(0deg);
          }
        }
      `})]})},x=()=>{const[e,o]=r.useState(new Date);r.useEffect(()=>{const n=setInterval(()=>{o(new Date)},1e3);return()=>clearInterval(n)},[]);const s=e.getHours().toString().padStart(2,"0"),i=e.getMinutes().toString().padStart(2,"0");return t.jsx("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",minHeight:"100vh",backgroundColor:"#111",fontFamily:"Arial, sans-serif"},children:t.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[t.jsx(a,{value:parseInt(s[0])}),t.jsx(a,{value:parseInt(s[1])}),t.jsx("div",{style:{color:"#444",fontSize:"80px",margin:"0 20px",fontWeight:"bold"},children:":"}),t.jsx(a,{value:parseInt(i[0])}),t.jsx(a,{value:parseInt(i[1])})]})})};export{x as default};
