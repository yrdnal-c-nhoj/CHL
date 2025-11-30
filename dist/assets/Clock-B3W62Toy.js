import{r as o,j as s}from"./index-_Zh6IFgu.js";const u="/assets/1-DpABnixM.png",m="/assets/12-6Qm5eKhB.png",f="/assets/11-C3Qmw2MY.png",v="/assets/10-tnJdFFTE.png",w="/assets/9-DB3_khMS.png",b="/assets/8-XkG3KslR.png",x="/assets/7-7zSOCPU_.png",y="/assets/6-P0wGeYVn.png",E="/assets/5-B4MuHZKf.png",j="/assets/4-CkjM4jiV.png",k="/assets/3-DMyBAXY6.png",I="/assets/2-dDZNGMD-.png",F="/assets/gears-FWRs3HL0.webp",K="/assets/small-BG_CeNLC.mp4",M="/assets/small-hsdTJBEw.webp";function O(){const[r,S]=o.useState(new Date),[B,l]=o.useState(!1),[C,D]=o.useState(0);o.useEffect(()=>{const t=setInterval(()=>S(new Date),16);return()=>clearInterval(t)},[]),o.useEffect(()=>{const t=setInterval(()=>{D(e=>(e-.1)%360)},16);return()=>clearInterval(t)},[]),o.useEffect(()=>{const t=[u,m,f,v,w,b,x,y,E,j,k,I,F,M];let e=0;t.forEach(n=>{const i=new Image;i.src=n,i.onload=()=>{e++,e===t.length&&l(!0)},i.onerror=()=>{e++,e===t.length&&l(!0)}})},[]);const c="min(80vw, 80vh)",h={x:50,y:50},g=38,R=[{src:u,angle:0,width:"30%",height:"30%"},{src:m,angle:30,width:"20%",height:"20%"},{src:f,angle:60,width:"20%",height:"20%"},{src:v,angle:90,width:"20%",height:"20%"},{src:w,angle:120,width:"25%",height:"25%"},{src:b,angle:150,width:"24%",height:"24%"},{src:x,angle:180,width:"24%",height:"24%"},{src:y,angle:210,width:"20%",height:"20%"},{src:E,angle:240,width:"22%",height:"22%"},{src:j,angle:270,width:"24%",height:"24%"},{src:k,angle:300,width:"21%",height:"21%"},{src:I,angle:330,width:"21%",height:"21%"}],A=r.getHours()%12,d=r.getMinutes(),p=r.getSeconds()+r.getMilliseconds()/1e3,z=(A+d/60)*30,$=(d+p/60)*6,G=p*6,a=(t,e,n)=>({position:"absolute",width:t,height:e,top:"50%",left:"50%",transformOrigin:"50% 100%",transform:`translate(-50%, -100%) rotate(${n}deg)`,background:`linear-gradient(
      135deg,
      #FDF8F8 0%,
      #B3B0B0 25%,
      #fff 50%,
      #939292 75%,
      #FAF7F7 100%
    )`,borderRadius:"0.5rem",boxShadow:`
      -2px -2px 0 #E2E2E1,
      2px 2px 0 #1E1E1E,
      0 0.3rem 0.5rem rgba(0,0,0,0.6),
      inset 0 0.15rem 0.3rem rgba(255,255,255,0.8),
      inset 0 -0.15rem 0.3rem rgba(0,0,0,0.4),
      0 0 8px #fff,
      0 0 12px #bbb
    `,pointerEvents:"none",border:"0.05rem solid #999",opacity:1}),P=(t,e)=>({position:"absolute",width:t,height:e,left:"50%",top:"50%",transform:"translate(-50%, -50%)",objectFit:"contain",filter:`
      grayscale(80%) 
      contrast(80%) 
      brightness(1.1)
      drop-shadow(2px 2px 0 #1E1E1E)
      drop-shadow(-2px -2px 0 #E2E2E1)
    `,opacity:.95});return B?s.jsxs("div",{style:{position:"relative",width:"100vw",height:"100dvh",display:"flex",justifyContent:"center",alignItems:"center",overflow:"hidden",isolation:"isolate",backgroundColor:"#111"},children:[s.jsx("video",{autoPlay:!0,loop:!0,muted:!0,playsInline:!0,style:{position:"absolute",width:"100vw",height:"100dvh",objectFit:"cover",filter:"saturate(0.3) contrast(1.1) brightness(1.3)",zIndex:-2},children:s.jsx("source",{src:K,type:"video/mp4"})}),s.jsx("img",{src:M,alt:"Fallback background",style:{position:"absolute",width:"100vw",height:"100dvh",objectFit:"cover",zIndex:-3}}),s.jsxs("div",{style:{position:"relative",width:"min(90vw, 90vh)",height:"min(90vw, 90vh)",borderRadius:"50%",overflow:"visible",isolation:"isolate",display:"flex",justifyContent:"center",alignItems:"center"},children:[s.jsx("div",{style:{position:"absolute",width:c,height:c,backgroundImage:`url(${F})`,backgroundSize:"cover",backgroundPosition:"center",filter:"grayscale(95%)",opacity:.9,zIndex:-1,transform:`rotate(${C}deg)`,transformOrigin:"50% 50%",transition:"transform 0.016s linear"}}),R.map((t,e)=>{const n=(t.angle-90)*(Math.PI/180),i=h.x+g*Math.cos(n),H=h.y+g*Math.sin(n);return s.jsx("img",{src:t.src,alt:`number ${e+1}`,style:{...P(t.width,t.height),left:`${i}%`,top:`${H}%`}},e)}),s.jsx("div",{style:a("0.8rem","24dvh",z)}),s.jsx("div",{style:a("0.5rem","36dvh",$)}),s.jsx("div",{style:a("0.15rem","40dvh",G)})]})]}):s.jsx("div",{style:{position:"fixed",top:0,left:0,width:"100vw",height:"100dvh",backgroundColor:"black"}})}export{O as default};
