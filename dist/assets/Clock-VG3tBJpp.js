import{r as f,j as r}from"./index-CAwBPmbs.js";const S="/assets/z-Bn69_ZWI.gif",C="/assets/z2-D14x0fNY.gif",D="/assets/z3-DfSjcixQ.gif",k="/assets/z4-Bu9WuJhO.gif",H="/assets/z5-C7-ogJxR.gif",B="/assets/z6-Cgfd-1il.gif",W="/assets/z7-DaxThNfc.gif",X="/assets/z8-ciwLdcq5.webp",q="/assets/z9-hIOS73gU.webp",E="/assets/z10-DKtvpQ6-.gif",O="/assets/z11-GF2VAZgs.gif",P="/assets/z12-CzvwXqb6.gif",R="/assets/stteth-CxfAk1IW.gif",T="/assets/sss-fWHA3UqT.webp",Y="/assets/ste-BbPcZy8c.gif";function F(){const[i,u]=f.useState(new Date);f.useEffect(()=>{const t=setInterval(()=>u(new Date),30);return()=>clearInterval(t)},[]);const b=[k,S,C,O,P,H,B,W,X,q,D,E],d=i.getSeconds(),g=i.getMinutes(),w=i.getHours(),p=i.getMilliseconds(),m=d/60*360,x=(()=>{const t=p/1e3;return t<.5?m+Math.sin(t*Math.PI)*6:m})(),v=g/60*360+d/60*6,y=w%12/12*360+g/60*30,c=(t,s,e,o="")=>({position:"absolute",bottom:"50%",left:"50%",width:s,height:e,transform:`translateX(-50%) rotate(${t}deg)`,transformOrigin:"bottom center",filter:`
      drop-shadow(0.4rem 0.4rem 1.2rem rgba(0,0,0,0.55)) 
      drop-shadow(-0.1rem -0.1rem 0.1rem rgba(220,230,25,0.9))
      drop-shadow(0.05rem 0.05rem 0.05rem white)
      ${o}
    `});return r.jsx("div",{style:{height:"100dvh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center",background:"radial-gradient(circle, rgba(223, 221, 220, 0.2) 0%, rgba(159, 126, 120, 0.4) 80%)"},children:r.jsxs("div",{style:{position:"relative",height:"80vmin",width:"80vmin",borderRadius:"50%",boxShadow:"inset -1.2rem -1.2rem 2.4rem rgba(0,0,0,0.35), inset 1.2rem 1.2rem 2.4rem rgba(220,235,255,0.3), 0 1.5rem 3rem rgba(0,0,0,0.35)",background:"radial-gradient(circle at center, rgba(210,210,210,0.2) 10%, rgba(60,60,60,0.2) 90%)"},children:[b.map((t,s)=>{const e=s/12*2*Math.PI,o=35,z=50+o*Math.sin(e),I=50-o*Math.cos(e),l=Math.sin(e),h=-Math.cos(e),a=.09,$=l*a,j=h*a,M=-l*a,A=-h*a;let n=`
    drop-shadow(${M}rem ${A}rem 0 white)
    drop-shadow(0.6rem 0.6rem 1.4rem rgba(0,0,0,0.25))
    drop-shadow(-0.4rem -0.4rem 0.9rem rgba(200,220,255,0.4))
  `;return s!==6&&(n=`
      drop-shadow(${$}rem ${j}rem 0 black)
      ${n}
    `),n=`
    drop-shadow(0 0 0.9rem rgba(100,150,255,0.8))
    ${n}
  `,r.jsx("img",{src:t,alt:`digit-${s}`,style:{position:"absolute",top:`${I}%`,left:`${z}%`,transform:"translate(-50%, -50%)",height:"6rem",width:"auto",filter:n}},s)}),r.jsx("img",{src:R,alt:"hour-hand",style:{...c(y,"6vmin","17vmin"),opacity:.75}}),r.jsx("img",{src:T,alt:"minute-hand",style:{...c(v,"12.5vmin","28vmin"),opacity:.7}}),r.jsx("img",{src:Y,alt:"second-hand",style:{...c(x,"32vmin","38vmin"),transition:"transform 0.05s cubic-bezier(0.1, 2, 0.25, 1.5)"}})]})})}export{F as default};
