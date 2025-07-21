import{r as d,j as e}from"./index-5HPYteOP.js";const l="/assets/cam-BBSpB4DN.otf",g="/assets/cam-Bz0QzPgV.webp",f="/assets/camr-DeCU43Bf.webp",b="/assets/ca-T9tuVB6L.webp",h="/assets/camer-DJIombdV.webp",p=()=>(d.useEffect(()=>{const o=document.getElementById("hourHand"),c=document.getElementById("minuteHand"),a=document.getElementById("secondHand"),s=()=>{const n=new Date,t=n.getSeconds(),r=n.getMinutes(),m=n.getHours()%12;o.style.transform=`rotate(${(m+r/60)*30}deg)`,c.style.transform=`rotate(${(r+t/60)*6}deg)`,a.style.transform=`rotate(${t*6}deg)`};s();const i=setInterval(s,1e3);return()=>clearInterval(i)},[]),d.useEffect(()=>{const o=document.querySelector(".clock"),c=["f/1.0","f/1.4","f/2.0","f/2.8","f/4.0","f/5.6","f/8.0","f/11","f/16","f/22","f/32","f/45"];for(let a=1;a<=12;a++){const s=a/12*2*Math.PI,i=50+42*Math.sin(s),n=50-42*Math.cos(s),t=document.createElement("div");t.className="number",t.style.left=`${i}%`,t.style.top=`${n}%`,t.textContent=c[a-1],o.appendChild(t)}},[]),e.jsxs("div",{style:{margin:0,background:"#111",height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"},children:[e.jsx("style",{children:`
        @font-face {
          font-family: 'cam';
          src: url(${l}) format('opentype');
        }

        :root {
          font-size: 2vh;
        }

        .clock {
          width: 80vw;
          height: 80vw;
          max-width: 80vh;
          max-height: 80vh;
          border-radius: 50%;
          position: relative;
          opacity: 0.6;
          z-index: 9;
        }

        .number {
          position: absolute;
          font-family: 'cam';
          font-size: 2rem;
          color: white;
          transform: translate(-50%, -50%);
          background: linear-gradient(135deg, #e0e0e0 0%, #f8f8f8 20%, #b0b0b0 50%, #f0f0f0 80%, #d0d0d0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
          text-shadow:
            0 0 0.3rem #ffffffaa,
            0 0 0.6rem #ccccccaa,
            0 0 0.9rem #bbbbbb88;
        }

        .hand {
          position: absolute;
          bottom: 50%;
          left: 50%;
          transform-origin: bottom center;
          border-radius: 0.3rem;
          background: linear-gradient(
            to top,
            #cccccc 0%,
            #eeeeee 25%,
            #8d8b8b 50%,
            #ffffff 75%,
            #888888 100%
          );
        }

        .hour {
          width: 1rem;
          height: 20%;
        }

        .minute {
          width: 0.7rem;
          height: 30%;
          background: #ccc;
        }

        .second {
          width: 0.3rem;
          height: 40%;
        }

        .center {
          position: absolute;
          width: 2rem;
          height: 2rem;
          background: #fff;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 10;
        }

        .bgimage, .bgimage2, .bgimage3, .bgimage4 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          object-fit: cover;
          filter: brightness(120%);
        }

        .bgimage2 { z-index: 1; }
        .bgimage  { z-index: 2; opacity: 0.5; }
        .bgimage3 { z-index: 3; opacity: 0.4; }
        .bgimage4 { z-index: 4; opacity: 0.2; width: 104vw; }
      `}),e.jsx("img",{src:h,className:"bgimage4",alt:"bg4"}),e.jsx("img",{src:b,className:"bgimage3",alt:"bg3"}),e.jsx("img",{src:g,className:"bgimage",alt:"bg1"}),e.jsx("img",{src:f,className:"bgimage2",alt:"bg2"}),e.jsxs("div",{className:"clock",children:[e.jsx("div",{className:"center"}),e.jsx("div",{className:"hand hour",id:"hourHand"}),e.jsx("div",{className:"hand minute",id:"minuteHand"}),e.jsx("div",{className:"hand second",id:"secondHand"})]})]}));export{p as default};
