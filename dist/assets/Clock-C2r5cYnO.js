import{r as m,j as l}from"./index-0e73aqg0.js";const x="/assets/ion-DpY4wNjQ.ttf",C="/assets/ion-DRb4h9OW.jpeg",T="/assets/isky-h2mvMB-A.webp",u=2,h=.01,S=20,p=["silver","lightgray","darkgray","gainsboro","#b0c4de","#c0c0c0","#a9a9a9","#dcdcdc","#d3d3d3","#eeeeee","#f5f5f5","#a5b487","#adcbce"],b=["spin-a","spin-b","spin-c"];function $(){if(Math.random()<.5){const e=Math.floor(100+Math.random()*130);return`rgb(${e}, ${e}, ${e})`}else return p[Math.floor(Math.random()*p.length)]}function E(e){const r=e+1;return r%29===0?"#b99b5b":r%25===0?"#a32934":r%24===0?"#861024":r%13===0?"#d0b35d":r%34===0?"#3e7abc":$()}function j(){const e=new Date,r=e.getHours()%12||12,t=e.getMinutes().toString().padStart(2,"0"),n=e.getHours()>=12?"PM":"AM";return`${r} ${t} ${n}`}let k=0;function g(e,r,t){const n=j(),a=[];for(const o of n)a.push({char:o,color:E(k)}),k++;const s=1+Math.random()*2.9,i=5+Math.random()*90,d=h+Math.random()*(S-h),f=b[Math.floor(Math.random()*b.length)],c=20+Math.random()*30;return{id:Math.random().toString(36).slice(2),direction:e,spans:a,fontSize:s,topVh:i,driftDuration:d,spinName:f,spinDuration:c,startTime:Date.now()}}function I(){const[e,r]=m.useState([]);return m.useRef(null),m.useEffect(()=>{const t=document.createElement("style");return t.innerHTML=`
      @font-face {
        font-family: 'ion';
        src: url(${x}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }

      body, html, #root {
        margin: 0; padding: 0; height: 100vh; width: 100vw; overflow: hidden;
        background: rgb(4, 30, 60);
        perspective: 1000px;
        font-size: 16px; /* base font-size for rem */
      }

      @keyframes drift-right {
        from { transform: translateX(-120%); }
        to   { transform: translateX(120vw); }
      }
      @keyframes drift-left {
        from { transform: translateX(120vw); }
        to   { transform: translateX(-120%); }
      }
      @keyframes spin-a {
        from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        to   { transform: rotateX(180deg) rotateY(360deg) rotateZ(90deg); }
      }
      @keyframes spin-b {
        from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        to   { transform: rotateX(360deg) rotateY(180deg) rotateZ(270deg); }
      }
      @keyframes spin-c {
        from { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
        to   { transform: rotateX(90deg) rotateY(270deg) rotateZ(360deg); }
      }

      .clock-wrapper {
        position: absolute;
        will-change: transform;
        pointer-events: none;
        z-index: 6;
      }

      .clock {
        font-family: 'ion', monospace;
        display: inline-block;
        transform-style: preserve-3d;
        will-change: transform;
        filter: saturate(80%) brightness(80%);
        text-shadow: 0 0 0.375rem rgb(214 241 11), 0 0 0.1875rem rgb(188 211 234);
      }
    `,document.head.appendChild(t),()=>{document.head.removeChild(t)}},[]),m.useEffect(()=>{let t;function n(){r(a=>{const s=Date.now(),i=a.filter(o=>s-o.startTime<o.driftDuration*1e3),d=i.filter(o=>o.direction==="left"),f=i.filter(o=>o.direction==="right"),c=[...i];return d.length<u&&c.push(g("left")),f.length<u&&c.push(g("right")),c}),t=setTimeout(n,1e3)}return n(),()=>{clearTimeout(t)}},[]),m.useEffect(()=>{let t;function n(){r(a=>{const s=Math.random()<.5?"left":"right";return[...a,g(s)]}),t=setTimeout(n,300+Math.random()*1500)}return n(),()=>{clearTimeout(t)}},[]),l.jsxs(l.Fragment,{children:[l.jsx("img",{src:T,alt:"Sky background",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"contrast(90%) saturate(200%)",zIndex:1,pointerEvents:"none"}}),l.jsx("img",{src:C,alt:"Ion background",style:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundSize:"cover",backgroundPosition:"center",backgroundRepeat:"no-repeat",filter:"contrast(90%) saturate(90%)",opacity:.5,zIndex:2,pointerEvents:"none"}}),e.map(({id:t,direction:n,spans:a,fontSize:s,topVh:i,driftDuration:d,spinName:f,spinDuration:c,startTime:o})=>{const v=`drift-${n}`;return l.jsx("div",{className:"clock-wrapper",style:{top:`${i}vh`,left:0,animation:`${v} ${d}s linear forwards`,pointerEvents:"none",zIndex:6,willChange:"transform"},children:l.jsx("div",{className:"clock",style:{fontSize:`${s}rem`,animation:`${f} ${c}s linear infinite`},children:a.map(({char:w,color:y},M)=>l.jsx("span",{style:{color:y},children:w},M))})},t)})]})}export{I as default};
