import{r,j as t}from"./index-CB5Z5zkF.js";const g="/assets/Ant-CeJtPBFA.ttf",x="/assets/ants-B6z3yTct.gif",u="/assets/ants1-BIH-2GJ5.gif",b=()=>{const[e,i]=r.useState(new Date);r.useEffect(()=>{const o=setInterval(()=>i(new Date),1e3);return()=>clearInterval(o)},[]);const d=e.getHours()%12,a=e.getMinutes(),s=e.getSeconds(),h=(d+a/60)*30,c=(a+s/60)*6,l=s*6;return t.jsxs(t.Fragment,{children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'Ant';
          src: url(${g}) format('truetype');
        }

        body, #root {
          margin: 0;
          padding: 0;
          height: 100%;
        }

        .container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100dvh;
          width: 100vw;
          background-color: rgb(255, 254, 254);
          position: relative;
          overflow: hidden;
        }

        .clock {
          width: 60vh;
          height: 60vh;
          max-width: 400px;
          max-height: 400px;
          min-width: 200px;
          min-height: 200px;
          border-radius: 50%;
          position: relative;
          z-index: 4;
        }

        .number {
          font-family: 'Ant', sans-serif;
          position: absolute;
          width: 100%;
          height: 100%;
          text-align: center;
          font-size: 22vh;
        }

        .number span {
          display: inline-block;
          transform: translateY(-17.5vw);
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          z-index: 10;
          transform: translateX(-50%);
        }

        .hour-hand {
          width: 0.5vw;
          height: 29vw;
          background-color: black;
          max-width: 8px;
          max-height: 80px;
          min-width: 4px;
          min-height: 40px;
        }

        .minute-hand {
          width: 0.4vw;
          height: 25vw;
          background-color: black;
          max-width: 6px;
          max-height: 100px;
          min-width: 3px;
          min-height: 50px;
        }

        .second-hand {
          width: 0.3vw;
          height: 50vw;
          background-color: rgb(9, 9, 9);
          max-width: 4px;
          max-height: 120px;
          min-width: 2px;
          min-height: 60px;
        }

        .center {
          width: 10px;
          height: 10px;
          background-color: black;
          border-radius: 50%;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          z-index: 11;
        }
      `}),t.jsxs("div",{className:"container",children:[t.jsx("div",{style:{backgroundImage:`url(${u})`,backgroundRepeat:"no-repeat",backgroundSize:"cover",backgroundPosition:"center",position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:1}}),t.jsx("div",{style:{backgroundImage:`url(${x})`,backgroundRepeat:"repeat",backgroundSize:"35vh 45vh",position:"absolute",top:0,left:0,right:0,bottom:0,zIndex:2}}),t.jsxs("div",{className:"clock",children:[[...Array(12)].map((o,n)=>{const m=(n+1)*30;return t.jsx("div",{className:"number",style:{transform:`rotate(${m}deg)`},children:t.jsx("span",{style:{color:"black"},children:n+1})},n)}),t.jsx("div",{className:"hand hour-hand",style:{transform:`translateX(-50%) rotate(${h}deg)`}}),t.jsx("div",{className:"hand minute-hand",style:{transform:`translateX(-50%) rotate(${c}deg)`}}),t.jsx("div",{className:"hand second-hand",style:{transform:`translateX(-50%) rotate(${l}deg)`}}),t.jsx("div",{className:"center"})]})]})]})};export{b as default};
