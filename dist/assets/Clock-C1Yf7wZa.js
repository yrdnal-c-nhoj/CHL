import{r as s,j as n}from"./index-CB5Z5zkF.js";const h="/assets/zod-ypFEwwQ0.ttf",b="/assets/sta-ZRxUOtAh.gif",C="/assets/stars-Bw7vBWrp.webp",I="/assets/zod-BPcOOUyJ.gif",m=["l","a","b","c","d","e","f","g","h","i","j","k"],z=()=>{const[u,p]=s.useState(new Date),[r,g]=s.useState(m.map(()=>({angle:Math.random()*360,radius:(100+Math.random()*50)*.6,speed:.02+Math.random()*.04,scale:1+Math.random()*.5}))),x=s.useRef(r);x.current=r,s.useEffect(()=>{let t;const e=()=>{p(new Date),t=requestAnimationFrame(e)};return t=requestAnimationFrame(e),()=>cancelAnimationFrame(t)},[]),s.useEffect(()=>{let t;const e=()=>{g(o=>o.map(a=>({...a,angle:(a.angle-a.speed+360)%360}))),t=requestAnimationFrame(e)};return t=requestAnimationFrame(e),()=>cancelAnimationFrame(t)},[]),s.useEffect(()=>{const t=[];return m.forEach((e,o)=>{const a=()=>{g(c=>{const i=[...c],l=i[o];let d=l.speed+(Math.random()-.5)*.06;return d=Math.min(.1,Math.max(.005,d)),i[o]={...l,speed:d},i}),t[o]=setTimeout(a,100+Math.random()*900)};t[o]=setTimeout(a,100+Math.random()*900)}),()=>{t.forEach(e=>clearTimeout(e))}},[]),s.useEffect(()=>{const t={backgroundImage:document.body.style.backgroundImage,backgroundSize:document.body.style.backgroundSize,backgroundPosition:document.body.style.backgroundPosition,backgroundRepeat:document.body.style.backgroundRepeat,margin:document.body.style.margin,padding:document.body.style.padding,height:document.body.style.height,display:document.body.style.display,justifyContent:document.body.style.justifyContent,alignItems:document.body.style.alignItems};document.body.style.backgroundImage=`url(${b})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat",document.body.style.margin="0",document.body.style.padding="0",document.body.style.height="100vh",document.body.style.display="flex",document.body.style.justifyContent="center",document.body.style.alignItems="center";const e=document.createElement("style");e.textContent=`
      html, body {
        margin: 0;
        padding: 0;
        height: 100dvh;
        overflow: hidden;
      }

      .html-image {
        position: absolute;
        width: 260px;
        height: 260px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        animation: rotateClockwise 30s linear infinite;
        z-index: 1;
      }

      @keyframes rotateClockwise {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }

      .numeral {
  position: absolute;
  font-size: 9.5rem;
  font-family: 'MyCustomFont', sans-serif;
  text-align: center;
  width: 2rem;
  pointer-events: none;
  z-index: 30;

  /* Brass metallic effect */
  background: linear-gradient(
    135deg,
    #FFD86F 0%,
    #D4AF37 50%,
    #B8860B 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  /* Optional subtle glow for extra shine */
  text-shadow:
    0 0 1px #FFF4CC,
    0 0 2px #FFD86F,
    0 0 4px #D4AF37;
}


    `,document.head.appendChild(e);const o=new FontFace("MyCustomFont",`url(${h}) format('woff2')`);return o.load().then(()=>{document.fonts.add(o)}).catch(console.error),()=>{Object.assign(document.body.style,t),document.head.removeChild(e)}},[]);const y=u.getMinutes(),F=u.getHours()%12+y/60,k=y/60*360,w=F/12*360,v={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},j={position:"relative",width:"min(16rem, 90vw)",height:"min(16rem, 90vw)",borderRadius:"50%",boxShadow:"0 0 20px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4},M={position:"absolute",width:"0.5rem",height:"0.5rem",backgroundColor:"#000",borderRadius:"50%",zIndex:6,top:"50%",left:"50%",transform:"translate(-50%, -50%)"},f=(t,e,o,a,c)=>({position:"absolute",top:"50%",left:"50%",width:t,height:e,backgroundColor:o,transform:`translate(-50%, -100%) rotate(${a}deg)`,transformOrigin:"bottom center",zIndex:c,transition:"transform 0.1s linear",borderRadius:"0.2rem"});return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${h}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}),n.jsx("div",{style:v,children:n.jsxs("div",{style:j,children:[n.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${b})`,backgroundSize:"cover",backgroundPosition:"center",borderRadius:"50%",zIndex:0,filter:"hue-rotate(120deg)"}}),n.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${C})`,backgroundSize:"cover",backgroundPosition:"center",borderRadius:"50%",zIndex:1}}),n.jsx("img",{src:I,alt:"HTML Logo",className:"html-image"}),n.jsx("div",{style:M}),n.jsx("div",{style:f("0.25rem","4rem","#556389FF",w,5)}),n.jsx("div",{style:f("0.15rem","5rem","#3E5E6DFF",k,5)}),m.map((t,e)=>{const i=r[e].radius+20,l=0+Math.cos(r[e].angle*Math.PI/180)*i,d=0-Math.sin(r[e].angle*Math.PI/180)*i;return n.jsx("div",{className:"numeral",style:{left:`calc(30% + ${l}px)`,top:`calc(50% + ${d}px)`,transform:`translate(-50%, -50%) scale(${r[e].scale})`,transformOrigin:"center center"},children:t},t)})]})})]})};export{z as default};
