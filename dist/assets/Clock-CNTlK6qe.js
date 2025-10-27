import{r as v,j as w}from"./index-DuxRGnoV.js";const D="/assets/sph-Cj25SHxs.ttf",p={hours:18,minutes:10,seconds:5},E={hours:6,minutes:7,seconds:8},$={hours:{bounce:.7,friction:.1},minutes:{bounce:.6,friction:.8},seconds:{bounce:.4,friction:.999}},C=[{name:"hours",colorClass:"hour-ball",countFn:()=>{const h=new Date().getHours();return h%12===0?12:h%12},max:12,size:p.hours,gravity:E.hours,properties:$.hours,width:100,height:20},{name:"minutes",colorClass:"minute-ball",countFn:()=>new Date().getMinutes(),max:60,size:p.minutes,gravity:E.minutes,properties:$.minutes,width:100,height:35},{name:"seconds",colorClass:"second-ball",countFn:()=>new Date().getSeconds(),max:60,size:p.seconds,gravity:E.seconds,properties:$.seconds,width:100,height:35}],X=()=>{const h=v.useRef(null),f=v.useRef({hours:null,minutes:null}),g=v.useRef({hours:0,minutes:0,seconds:0});return v.useEffect(()=>{const B=h.current;C.forEach((e,n)=>{let t=document.createElement("div");t.className="room",t.id=`${e.name}-room`,t.style.width=`${e.width}vw`,t.style.height=`${e.height}vh`;const u=C.slice(0,n).reduce((d,x)=>d+x.height,0);t.style.transform=`translateY(${u}vh)`,B.appendChild(t)});function k(e){return e.childElementCount+1}function T(e,n,t,u,d,x,S,s,c){const a=document.createElement("div");a.className=`ball ${n}`,a.innerText=k(e),a.style.width=`${t}vh`,a.style.height=`${t}vh`,a.style.fontSize=`${t/2.5}vh`;let r=Math.random()*(s-t),b=-30,o=Math.random()*(s-t),m=0,i=(Math.random()-.5)*100,l=(Math.random()-.5)*100;const M=d,I=x;let R=!0;(c==="hours"||c==="minutes")&&(f.current[c]=a),e.appendChild(a);function j(){R?(m+=u*.016,r+=i*.016,b+=m*.016,o+=l*.016,(r<=0||r>=s-t)&&(r=Math.max(0,Math.min(r,s-t)),i=-i*M),(o<=0||o>=s-t)&&(o=Math.max(0,Math.min(o,s-t)),l=-l*M),b>=S-t&&(b=S-t,m=-m*M,i*=I,l*=I,Math.abs(m)<2&&Math.abs(i)<2&&Math.abs(l)<2&&(R=!1,(c==="hours"||c==="minutes")&&f.current[c]===a&&(i=(Math.random()-.5)*10,l=(Math.random()-.5)*10)))):(c==="hours"||c==="minutes")&&f.current[c]===a&&(r+=i*.016,o+=l*.016,(r<=0||r>=s-t)&&(r=Math.max(0,Math.min(r,s-t)),i=-i),(o<=0||o>=s-t)&&(o=Math.max(0,Math.min(o,s-t)),l=-l),Math.random()<.01&&(i=(Math.random()-.5)*10,l=(Math.random()-.5)*10)),a.style.transform=`translateX(${r}vw) translateY(${b}vh) translateZ(${o-50}vh)`,requestAnimationFrame(j)}j()}function Y(e,n){const t=document.getElementById(e);for(;t.firstChild;)t.removeChild(t.firstChild);(n==="hours"||n==="minutes")&&(f.current[n]=null)}function F(){C.forEach(e=>{const n=e.countFn(),t=g.current[e.name]||0;(n<t||t>e.max)&&(Y(`${e.name}-room`,e.name),g.current[e.name]=0);for(let u=g.current[e.name]||0;u<n;u++){const d=document.getElementById(`${e.name}-room`);T(d,e.colorClass,e.size,e.gravity,e.properties.bounce,e.properties.friction,e.height,e.width,e.name)}g.current[e.name]=n})}F();const A=setInterval(F,1e3);return()=>clearInterval(A)},[]),w.jsxs(w.Fragment,{children:[w.jsx("style",{children:`
        @font-face {
          font-family: 'SphFont';
          src: url(${D}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body,html {
          width: 100%;
          height: 100%;
          background: #a10d0d;
          overflow: hidden;
          margin: 0;
        }

        #tower {
          position: absolute;
          top: 20vh;
          right: 15vw;
          transform-origin: top right;
          transform-style: preserve-3d;
          transform: scale(0.8) rotateX(20deg) rotateY(20deg);
          perspective: 1500px;
          width: 100vw;
          height: 100dvh;
          overflow: visible;
        }

        .room {
          position: absolute;
          transform-style: preserve-3d;
          width: 100vw;
          overflow: visible;
          height: auto;
        }

        .ball {
          font-family: 'SphFont', sans-serif;
          border-radius: 50%;
          position: absolute;
          transform-style: preserve-3d;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgb(7, 21, 112);
          user-select: none;
          box-shadow: 0 0 1vh rgba(0,0,0,0.3);
        }

        .hour-ball {
          background: radial-gradient(circle at 30%, #0dcaec, #056d7b);
        }

        .minute-ball {
          background: radial-gradient(circle at 30%, #dce30b, #c2b30c);
        }

        .second-ball {
          background: radial-gradient(circle at 30%, #f80, #c50);
        }
      `}),w.jsx("div",{id:"tower",ref:h})]})};export{X as default};
