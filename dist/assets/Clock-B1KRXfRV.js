import{r as i,j as t}from"./index-37WBs3jL.js";const et="/assets/disc-DCr12WMC.ttf",O="/assets/water-aTLIImM6.webp",S="/assets/disc-DKRtrneP.gif",nt=()=>{const[l,T]=i.useState(new Date),[h,P]=i.useState(!1);if(i.useEffect(()=>{const e=document.createElement("style");return e.textContent=`
      @font-face {
        font-family: "ScopedClockFont";
        src: url("${et}") format("truetype");
        font-display: swap;
      }

      .scoped-clock * {
        font-family: "ScopedClockFont", sans-serif !important;
      }
    `,document.head.appendChild(e),()=>{document.head.removeChild(e)}},[]),i.useEffect(()=>{const s=[O,S].map(n=>new Promise(c=>{const a=new Image;a.src=n,a.onload=c,a.onerror=c}));Promise.all([...s]).then(()=>P(!0))},[]),i.useEffect(()=>{if(!h)return;const e=setInterval(()=>T(new Date),50);return()=>clearInterval(e)},[h]),!h)return t.jsx("div",{style:{width:"100vw",height:"100dvh",display:"flex",justifyContent:"center",alignItems:"center",background:"black",color:"white",fontSize:"2rem"}});const $=l.getHours(),y=$%12===0?12:$%12,f=l.getMinutes(),g=l.getSeconds(),F=l.getMilliseconds(),u=g+F/1e3,x=f+u/60,z=y+x/60,A=Math.floor(f/10),E=f%10,X=Math.floor(g/10),D=g%10,Y=-(z/12)*360-90,B=-(x/10/6)*360-90,L=-(x%10/10)*360-90,R=-(u/10/6)*360-90,H=-(u%10/10)*360-90,r=(e,s,n,c,a,W)=>{const M=[],p=360/e;for(let o=0;o<e;o++){const b=o*p,K=b+p,d=b*Math.PI/180,m=K*Math.PI/180,N=50+s*Math.cos(d),V=50+s*Math.sin(d),Z=50+s*Math.cos(m),q=50+s*Math.sin(m),G=50+n*Math.cos(d),J=50+n*Math.sin(d),Q=50+n*Math.cos(m),U=50+n*Math.sin(m),_=`
        M ${N} ${V}
        A ${s} ${s} 0 0 1 ${Z} ${q}
        L ${Q} ${U}
        A ${n} ${n} 0 0 0 ${G} ${J}
        Z
      `,j=b+p/2,I=j*Math.PI/180,v=(s+n)/2,w=50+v*Math.cos(I),C=50+v*Math.sin(I),tt=j+90;let k=o;a==="hours"&&(k=o===0?12:o),M.push(t.jsxs("g",{children:[t.jsx("path",{d:_,style:{fill:"transparent",stroke:"none"}}),t.jsx("text",{x:w,y:C,style:{textAnchor:"middle",alignmentBaseline:"middle",fontSize:W,fill:o===c?"#ED0B0BFF":"#CCC8CDFF",fontWeight:"bold",textShadow:o===c?`0.2rem 0.2rem 0 #000,
                     -0.2rem -0.2rem 0 #000,
                     0.2rem -0.2rem 0 #000,
                     -0.2rem 0.2rem 0 #000,
                     0.4rem 0.4rem 1rem #FF0000`:"none"},transform:`rotate(${tt}, ${w}, ${C})`,children:k})]},o))}return M};return t.jsx("div",{className:"scoped-clock",children:t.jsxs("div",{style:{width:"100vw",height:"100dvh",position:"relative",overflow:"hidden",backgroundImage:`url(${O})`,backgroundSize:"cover",backgroundPosition:"center",filter:"contrast(0.8) opacity(0.9) saturate(5.2) hue-rotate(90deg)",transform:"scaleX(-1)"},children:[t.jsx("div",{style:{position:"absolute",inset:0,backgroundColor:"rgba(0,0,0,0.4)",zIndex:1}}),t.jsxs("div",{style:{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%) scaleX(-1)",width:"90vmin",height:"90vmin",borderRadius:"50%",backgroundImage:`url(${S})`,backgroundSize:"cover",backgroundPosition:"center",filter:"contrast(2.4)",zIndex:2,display:"flex",justifyContent:"center",alignItems:"center"},children:[t.jsx("div",{style:{position:"absolute",inset:0,borderRadius:"50%",backgroundColor:"rgba(0,0,0,0.3)",zIndex:1}}),t.jsxs("svg",{viewBox:"0 0 100 100",style:{width:"100%",height:"100%",zIndex:2},children:[t.jsx("g",{transform:`rotate(${Y}, 50, 50)`,children:r(12,48,38,y,"hours","0.7rem")}),t.jsx("g",{transform:`rotate(${B}, 50, 50)`,children:r(6,38,30,A,"minutesTens","0.6rem")}),t.jsx("g",{transform:`rotate(${L}, 50, 50)`,children:r(10,30,22,E,"minutesOnes","0.5rem")}),t.jsx("g",{transform:`rotate(${R}, 50, 50)`,children:r(6,22,14,X,"secondsTens","0.4rem")}),t.jsx("g",{transform:`rotate(${H}, 50, 50)`,children:r(10,14,6,D,"secondsOnes","0.3rem")}),t.jsx("circle",{cx:"50",cy:"50",r:"6",fill:"transparent"})]})]})]})})};export{nt as default};
