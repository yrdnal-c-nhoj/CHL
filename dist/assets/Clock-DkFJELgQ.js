import{r,j as n}from"./index-uKLSe8E3.js";const f="/assets/zod-ypFEwwQ0.ttf",b="/assets/sta-BMegOlue.gif",I="/assets/stars-Bw7vBWrp.webp",C="/assets/zod-BPcOOUyJ.gif",l=["l","a","b","c","d","e","f","g","h","i","j","k"],z=()=>{const[m,p]=r.useState(new Date),[s,u]=r.useState(l.map(()=>({angle:Math.random()*360,radius:(100+Math.random()*50)*.6,speed:.02+Math.random()*.04,scale:1+Math.random()*.5}))),x=r.useRef(s);x.current=s,r.useEffect(()=>{let t;const e=()=>{p(new Date),t=requestAnimationFrame(e)};return t=requestAnimationFrame(e),()=>cancelAnimationFrame(t)},[]),r.useEffect(()=>{let t;const e=()=>{u(o=>o.map(a=>({...a,angle:(a.angle-a.speed+360)%360}))),t=requestAnimationFrame(e)};return t=requestAnimationFrame(e),()=>cancelAnimationFrame(t)},[]),r.useEffect(()=>{const t=[];return l.forEach((e,o)=>{const a=()=>{u(d=>{const i=[...d],h=i[o];let c=h.speed+(Math.random()-.5)*.06;return c=Math.min(.1,Math.max(.005,c)),i[o]={...h,speed:c},i}),t[o]=setTimeout(a,100+Math.random()*900)};t[o]=setTimeout(a,100+Math.random()*900)}),()=>{t.forEach(e=>clearTimeout(e))}},[]),r.useEffect(()=>{const t={backgroundImage:document.body.style.backgroundImage,backgroundSize:document.body.style.backgroundSize,backgroundPosition:document.body.style.backgroundPosition,backgroundRepeat:document.body.style.backgroundRepeat,margin:document.body.style.margin,padding:document.body.style.padding,height:document.body.style.height,display:document.body.style.display,justifyContent:document.body.style.justifyContent,alignItems:document.body.style.alignItems};document.body.style.backgroundImage=`url(${b})`,document.body.style.backgroundSize="cover",document.body.style.backgroundPosition="center",document.body.style.backgroundRepeat="no-repeat",document.body.style.margin="0",document.body.style.padding="0",document.body.style.height="100vh",document.body.style.display="flex",document.body.style.justifyContent="center",document.body.style.alignItems="center";const e=document.createElement("style");e.textContent=`
      html, body {
        margin: 0;
        padding: 0;
        height: 100vh;
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
  font-size: 6.5rem;
  color: #FDCA84FF;
  font-family: 'MyCustomFont', sans-serif;
  text-align: center;
  width: 2rem;
  pointer-events: none;
  z-index: 30;
  text-shadow: 1px 1px  #0667E6FF;
}

    `,document.head.appendChild(e);const o=new FontFace("MyCustomFont",`url(${f}) format('woff2')`);return o.load().then(()=>{document.fonts.add(o)}).catch(console.error),()=>{Object.assign(document.body.style,t),document.head.removeChild(e)}},[]);const g=m.getMinutes(),w=m.getHours()%12+g/60,k=g/60*360,F=w/12*360,v={position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)"},j={position:"relative",width:"min(16rem, 90vw)",height:"min(16rem, 90vw)",borderRadius:"50%",boxShadow:"0 0 20px rgba(0,0,0,0.2)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:4},M={position:"absolute",width:"0.5rem",height:"0.5rem",backgroundColor:"#000",borderRadius:"50%",zIndex:6,top:"50%",left:"50%",transform:"translate(-50%, -50%)"},y=(t,e,o,a,d)=>({position:"absolute",top:"50%",left:"50%",width:t,height:e,backgroundColor:o,transform:`translate(-50%, -100%) rotate(${a}deg)`,transformOrigin:"bottom center",zIndex:d,transition:"transform 0.1s linear",borderRadius:"0.2rem"});return n.jsxs(n.Fragment,{children:[n.jsx("style",{children:`
          @font-face {
            font-family: 'MyCustomFont';
            src: url(${f}) format('woff2');
            font-weight: normal;
            font-style: normal;
          }
        `}),n.jsx("div",{style:v,children:n.jsxs("div",{style:j,children:[n.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${b})`,backgroundSize:"cover",backgroundPosition:"center",borderRadius:"50%",zIndex:0}}),n.jsx("div",{style:{position:"absolute",top:0,left:0,width:"100%",height:"100%",backgroundImage:`url(${I})`,backgroundSize:"cover",backgroundPosition:"center",borderRadius:"50%",zIndex:1}}),n.jsx("img",{src:C,alt:"HTML Logo",className:"html-image"}),n.jsx("div",{style:M}),n.jsx("div",{style:y("0.25rem","4rem","#556389FF",F,5)}),n.jsx("div",{style:y("0.15rem","5rem","#3E5E6DFF",k,5)}),l.map((t,e)=>{const d=0+Math.cos(s[e].angle*Math.PI/180)*s[e].radius,i=0-Math.sin(s[e].angle*Math.PI/180)*s[e].radius;return n.jsx("div",{className:"numeral",style:{left:`calc(50% + ${d}px)`,top:`calc(50% + ${i}px)`,transform:`translate(-50%, -50%) scale(${s[e].scale})`,transformOrigin:"center center"},children:t},t)})]})})]})};export{z as default};
