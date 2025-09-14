import{r as c,j as l}from"./index-CVcA385j.js";const S="/assets/back-DH1ui0sU.ttf",C=()=>{const f=["h0","h1","m0","m1","s0","s1"],u=c.useRef({}),o=c.useRef({}),g=c.useRef({}),h=c.useRef({}),m=c.useRef({});return c.useEffect(()=>{const a=document.createElement("style");a.textContent=`
      @font-face {
        font-family: 'back';
        src: url(${S}) format('truetype');
      }
      .digitTrain span {
        color: rgb(4, 95, 151);
        text-shadow: #f24e07 0.2rem 0.2rem 0;
      }
      .digitTrain span.active {
        color: #FF5500FF; /* Bright red for active digit */
        text-shadow: #080707FF 0.2rem 0.2rem 0;
      }
      .digitTrain span.leaving {
        transition: opacity 0.4s linear;
        opacity: 0;
      }
    `,document.head.appendChild(a)},[]),c.useEffect(()=>{const a=()=>{const t=document.createDocumentFragment();for(let r=0;r<50;r++){const e=document.createElement("span");e.textContent=r%10,t.appendChild(e)}return t};f.forEach(t=>{const r=document.getElementById(t+"train");r.appendChild(a()),u.current[t]=r,o.current[t]=0,g.current[t]=null,h.current[t]=0,m.current[t]=0});const w=(t,r,e)=>t+(r-t)*e,k=(t,r)=>{const e=u.current[t],s=o.current[t],i=Array.from(e.children);for(let n=s+1;n<i.length;n++)if(i[n].textContent===r)return n;for(let n=0;n<=s;n++)if(i[n].textContent===r)return n;return s},v=()=>{const t=new Date;[...t.getHours().toString().padStart(2,"0"),...t.getMinutes().toString().padStart(2,"0"),...t.getSeconds().toString().padStart(2,"0")].forEach((e,s)=>{const i=f[s],n=u.current[i];if(e!==g.current[i]){Array.from(n.children).forEach(x=>{x.classList.contains("leaving")||x.classList.remove("active")});const p=n.querySelector("span.active");p&&(p.classList.add("leaving"),p.addEventListener("animationend",()=>p.classList.remove("leaving","active"),{once:!0})),o.current[i]=k(i,e);const b=n.children[0].offsetWidth||0;h.current[i]=o.current[i]*b,g.current[i]=e;const y=n.children[o.current[i]];y&&y.classList.add("active")}}),f.forEach(e=>{const s=u.current[e];m.current[e]=w(m.current[e],h.current[e],.1),s.style.transform=`translateX(-${m.current[e]}px)`}),requestAnimationFrame(v)};v()},[]),l.jsx("div",{style:d.body,children:l.jsx("div",{style:d.wrapper,children:l.jsx("div",{style:d.clock,role:"timer","aria-label":"Digital clock",children:f.map(a=>l.jsx("div",{style:d.clockRow,children:l.jsx("div",{id:`${a}train`,className:"digitTrain",style:d.digitTrain})},a))})})})},d={body:{margin:0,padding:0,height:"100dvh",width:"100vw",backgroundImage:"linear-gradient(24deg, #211408 6.25%, #f3a64e 6.25%, #ea8007 25%, #fff 25%, #f9c2c2 31.25%, #e3630d 31.25%, #e3630d 50%, #211408 50%, #0b30ea 56.25%, #ed8917 56.25%, #ed8917 75%, #f60808 75%, #fff 81.25%, #e3630d 81.25%, #e3630d 100%)",backgroundSize:"6vw 2vh",display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden",flexDirection:"column"},wrapper:{transform:"translateX(25vw)",animation:"rotateClock 17s ease-in-out infinite",width:"100vw",height:"100vh",display:"flex",justifyContent:"center",alignItems:"center"},clock:{fontFamily:"back, monospace",display:"flex",flexDirection:"column"},clockRow:{display:"flex",alignItems:"center",height:"3rem",width:"100vw",padding:"0 1rem",boxSizing:"border-box",position:"relative"},digitTrain:{display:"flex",alignItems:"center",fontSize:"3.5rem",whiteSpace:"nowrap",transition:"transform 0.4s linear"}};export{C as default};
