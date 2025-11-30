import{r as f,j as e}from"./index-_Zh6IFgu.js";const h="/assets/mint-D5QiKBk3.ttf",p="/assets/mint-BVfrxjz-.png",x="/assets/minty-U3qSJK4x.webp",y="/assets/min-DOavwTqd.png",v="/assets/candy-fv77z8tJ.jpg",j=()=>(f.useEffect(()=>{const c=document.getElementById("clock");for(let t=1;t<=12;t++){const n=document.createElement("div");n.className="number",n.style.transform=`rotate(${t*30}deg) skew(-15deg)`;const s=document.createElement("span");s.textContent=t,n.appendChild(s),c.appendChild(n)}const o=document.querySelector(".hand.hour"),r=document.querySelector(".hand.minute"),i=document.querySelector(".hand.second"),a=()=>{const t=new Date,n=t.getSeconds(),s=t.getMinutes(),l=t.getHours(),d=n*6,u=s*6+n*.1,g=l%12*30+s*.5;i.style.transform=`translateX(-50%) rotate(${d}deg)`,r.style.transform=`translateX(-50%) rotate(${u}deg)`,o.style.transform=`translateX(-50%) rotate(${g}deg)`};a();const m=setInterval(a,1e3);return[o,r,i].forEach(t=>{t.onerror=()=>{console.error(`Failed to load image for ${t.alt} at ${t.src}`),t.style.background=t.classList.contains("hour")?"blue":t.classList.contains("minute")?"green":"red",t.style.width=t.classList.contains("hour")?"0.3rem":t.classList.contains("minute")?"0.2rem":"0.1rem",t.style.height=t.classList.contains("hour")?"6rem":t.classList.contains("minute")?"8rem":"10rem"}}),()=>clearInterval(m)},[]),e.jsxs("div",{style:{margin:0,height:"100vh",width:"100vw",display:"flex",alignItems:"center",justifyContent:"center",background:"#85ed6b",overflow:"hidden"},children:[e.jsx("style",{children:`
          @font-face {
            font-family: 'mint';
            src: url(${h}) format('truetype');
          }

          .clock {
            z-index: 6;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 60vmin;
            height: 60vmin;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .number {
            position: absolute;
            width: 100%;
            height: 100%;
            text-align: center;
            font-family: 'mint';
            font-size: 4rem;
            color: #8AE3A8;
            text-shadow: 0.05rem 0.05rem 0 rgb(10, 39, 17), 0.1rem 0.1rem 0 #f1f6f2;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1;
          }

          .number span {
            display: block;
            transform: translateY(-15vmin);
          }

          .hand {
            position: absolute;
            bottom: 50%;
            left: 50%;
            transform-origin: 50% 100%;
            transform: translateX(-50%) rotate(0deg);
            pointer-events: none;
            height: auto;
            object-fit: contain;
          }

          .hour {
            height: 10vmin;
            z-index: 2;
          }

          .minute {
            height: 16vmin;
            z-index: 3;
          }

          .second {
            height: 20vmin;
            z-index: 4;
          }

          .bgimage {
            background-image: url(${v});
            background-size: cover;
            background-position: center;
            position: fixed;
            height: 100vh;
            width: 100vw;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 1;
            opacity: 0.4;
          }
        `}),e.jsx("div",{className:"bgimage"}),e.jsxs("div",{className:"clock",id:"clock",children:[e.jsx("img",{className:"hand hour",src:p,alt:"Hour Hand"}),e.jsx("img",{className:"hand minute",src:x,alt:"Minute Hand"}),e.jsx("img",{className:"hand second",src:y,alt:"Second Hand"}),e.jsx("div",{className:"center-dot"})]})]}));export{j as default};
