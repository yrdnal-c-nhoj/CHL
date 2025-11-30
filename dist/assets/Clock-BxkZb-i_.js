import{r as c,j as t}from"./index-_Zh6IFgu.js";const m="/assets/bard-vJUT4tpN.webp",h="/assets/barrs-CfNbVD-n.webp",g="/assets/ber-BHXkwH1E.otf",u=()=>(c.useEffect(()=>{const r=()=>{const n=new Date,s=n.getSeconds(),a=n.getMinutes(),i=n.getHours(),o=s*6,l=a*6+s*.1,d=i%12/12*360+a/60*30;document.getElementById("second").style.transform=`translateX(-50%) rotate(${o}deg)`,document.getElementById("minute").style.transform=`translateX(-50%) rotate(${l}deg)`,document.getElementById("hour").style.transform=`translateX(-50%) rotate(${d}deg)`},e=setInterval(r,1e3);return r(),()=>clearInterval(e)},[]),t.jsxs("div",{style:{width:"100vw",height:"100dvh",overflow:"hidden",background:"#000",fontSize:"1rem"},children:[t.jsx("style",{children:`
        @font-face {
          font-family: 'ber';
          src: url(${g}) format('opentype');
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
        }

        .spin-wrapper {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 380vw;
          height: 280vh;
          transform-origin: center;
          animation: spin 60s linear infinite;
          transform: translate(-50%, -50%);
        }

        .half {
          position: absolute;
          top: 0;
          width: 50%;
          height: 100%;
          overflow: hidden;
        }

        .left {
          left: 0;
        }

        .right {
          right: 0;
        }

        .half img {
          position: absolute;
          width: 200%;
          height: 100%;
          object-fit: cover;
          filter: brightness(0.9) contrast(1.4);
        }

        .left img {
          transform: rotate(-90deg);
          left: 0;
        }

        .right img {
          transform: rotate(-90deg);
          right: 0;
        }

        .center-line {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0.3vw;
          height: 100%;
          background: rgb(128, 126, 126);
        }

        @keyframes spin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes counterspin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        .clock {
          position: absolute;
          font-family: 'ber', sans-serif;
          top: 50%;
          left: 50%;
          width: 100vmin;
          height: 100vmin;
          border: 0.3vw solid rgb(128, 126, 126);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
          animation: counterspin 60s linear infinite;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom;
          background: rgb(128, 126, 126);
          z-index: 12;
        }

        .hour {
          width: 0.4vw;
          height: 30%;
        }

        .minute {
          width: 0.4vw;
          height: 50%;
        }

        .second {
          width: 0vw;
          height: 45%;
          background: red;
        }

        .number {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8vmin;
          height: 8vmin;
          line-height: 8vmin;
          text-align: center;
          font-size: 1.5rem;
          font-family: 'ber', Arial, sans-serif;
          color: rgb(128, 126, 126);
          z-index: 13;
          transform: translate(-50%, -50%) rotate(calc(30deg * var(--i))) translateY(-42vmin) rotate(calc(-30deg * var(--i)));
        }



     
      `}),t.jsxs("div",{className:"container",children:[t.jsxs("div",{className:"spin-wrapper",children:[t.jsx("div",{className:"half left",children:t.jsx("img",{src:m,alt:"Left Image"})}),t.jsx("div",{className:"half right",children:t.jsx("img",{src:h,alt:"Right Image"})}),t.jsx("div",{className:"center-line"})]}),t.jsxs("div",{className:"clock",id:"clock",children:[[...Array(12)].map((r,e)=>t.jsx("div",{className:"number",style:{"--i":e+1},children:e+1},e)),t.jsx("div",{className:"hand hour",id:"hour"}),t.jsx("div",{className:"hand minute",id:"minute"}),t.jsx("div",{className:"hand second",id:"second"})]})]})]}));export{u as default};
