import{r,j as e}from"./index-DhGayC4d.js";const u="/assets/pal-BhEIMHAj.webp",M="/assets/palm-DIm0DA5U.webp",A="/assets/palm-C-d-CRXv.ttf",C="/assets/p1-hX7IiVBD.gif",H="/assets/p2-B6tgc2gS.webp",P="/assets/p3-CfvKGR1e.gif",a="ClockFont__Scoped_9k2",R=()=>{const[n,f]=r.useState(()=>new Date);r.useEffect(()=>{const s=setInterval(()=>f(new Date),1e3);return()=>clearInterval(s)},[]);const h=r.useMemo(()=>{const s=`
      @font-face {
        font-family: '${a}';
        src: url(${A}) format('truetype');
        font-display: swap;
      }
    `;return e.jsx("style",{children:s})},[]),c=n.getSeconds()+n.getMilliseconds()/1e3,i=n.getMinutes()+c/60,b=n.getHours()%12+i/60,p=c*6,y=i*6,$=b*30,t="min(70vh, 70vw)",l="1rem",S={display:"flex",width:"100%",height:"100dvh",position:"relative",overflow:"hidden",isolation:"isolate"},d={width:"50%",height:"100%",backgroundSize:"cover",backgroundPosition:"center",contain:"strict"},k={...d,backgroundImage:`url(${u})`,transform:"scaleX(-1)",filter:"brightness(0.9) contrast(1.0) saturate(0.8)",backgroundSize:"80%",backgroundPosition:"center"},w={...d,backgroundImage:`url(${u})`,backgroundSize:"80%",filter:"brightness(0.9) contrast(1.0) saturate(0.8)"},v={position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"},x={position:"relative",width:t,height:t,borderRadius:"50%",backgroundImage:`url(${M})`,backgroundSize:"cover",backgroundPosition:"center",boxShadow:`0 0 0 ${l} rgba(0,0,0,0.25) inset, 0 0 0 ${l} rgba(255,255,255,0.08)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:`'${a}', sans-serif`,color:"#D8EEA1FF",filter:"drop-shadow(0 0 0.5rem rgba(0,0,0,0.3))"},I=s=>{const g=(s-3)*30,m=`calc(${t} * 0.36)`,D=`calc(50% + ${m} * ${Math.cos(g*Math.PI/180)})`,z=`calc(50% + ${m} * ${Math.sin(g*Math.PI/180)})`;return{position:"absolute",left:D,top:z,transform:"translate(-50%, -50%)",fontSize:`calc(${t} * 0.15)`,userSelect:"none",zIndex:1,color:"#D8EEA1FF",fontFamily:`'${a}', sans-serif`,textShadow:`
      /* soft glow */
      0 0 0.2rem #D8EEA1FF,
      0 0 0.4rem #D8EEA1FF,
      0 0 0.6rem #D8EEA1FF,
      /* hard thin black outline */
      -0.05rem -0.05rem 0 #000,
      0.05rem -0.05rem 0 #000,
      -0.05rem 0.05rem 0 #000,
      0.05rem 0.05rem 0 #000,
      /* hard thin white outline */
      -0.025rem -0.025rem 0 #fff,
      0.025rem -0.025rem 0 #fff,
      -0.025rem 0.025rem 0 #fff,
      0.025rem 0.025rem 0 #fff
    `}},o={position:"absolute",left:"50%",bottom:"50%",transformOrigin:"center bottom",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center bottom",zIndex:"6"},F={...o,width:`calc(${t} * 0.22)`,height:`calc(${t} * 0.56)`,transform:`translateX(-50%) rotate(${$}deg)`,backgroundImage:`url(${C})`,filter:"drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) saturate(5.5) brightness(2.2)"},j={...o,width:`calc(${t} * 0.39)`,height:`calc(${t} * 0.495)`,transform:`translateX(-50%) rotate(${y}deg)`,backgroundImage:`url(${H})`,filter:"drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) saturate(1.5) brightness(2.2)"},E={...o,width:`calc(${t} * 0.56)`,height:`calc(${t} * 0.47)`,transform:`translateX(-50%) rotate(${p}deg)`,backgroundImage:`url(${P})`,filter:"drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) saturate(1.5) brightness(2.2)"};return e.jsxs("div",{style:S,children:[h,e.jsx("div",{style:k}),e.jsx("div",{style:w}),e.jsx("div",{style:v,children:e.jsxs("div",{style:x,"aria-label":"Analog clock",children:[[1,2,3,4,5,6,7,8,9,10,11,12].map(s=>e.jsx("div",{style:I(s),children:s},s)),e.jsx("div",{style:F}),e.jsx("div",{style:j}),e.jsx("div",{style:E})]})})]})};export{R as default};
