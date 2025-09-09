import{r,j as t}from"./index-DCBP-5yl.js";const u="/assets/pal-BhEIMHAj.webp",M="/assets/palm-DIm0DA5U.webp",A="/assets/palm-C-d-CRXv.ttf",C="/assets/p1-DdezB0WG.webp",H="/assets/p2-B6tgc2gS.webp",P="/assets/p3-D70Nw7jY.webp",a="ClockFont__Scoped_9k2",_=()=>{const[n,f]=r.useState(()=>new Date);r.useEffect(()=>{const s=setInterval(()=>f(new Date),1e3);return()=>clearInterval(s)},[]);const h=r.useMemo(()=>{const s=`
      @font-face {
        font-family: '${a}';
        src: url(${A}) format('truetype');
        font-display: swap;
      }
    `;return t.jsx("style",{children:s})},[]),c=n.getSeconds()+n.getMilliseconds()/1e3,i=n.getMinutes()+c/60,b=n.getHours()%12+i/60,p=c*6,y=i*6,w=b*30,e="min(70vh, 70vw)",l="1rem",$={display:"flex",width:"100%",height:"100dvh",position:"relative",overflow:"hidden",isolation:"isolate"},d={width:"50%",height:"100%",backgroundSize:"cover",backgroundPosition:"center",contain:"strict"},S={...d,backgroundImage:`url(${u})`,transform:"scaleX(-1)",filter:"brightness(0.9) contrast(1.0) saturate(0.8)",backgroundSize:"80%",backgroundPosition:"center"},k={...d,backgroundImage:`url(${u})`,backgroundSize:"80%",filter:"brightness(0.9) contrast(1.0) saturate(0.8)"},v={position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"},x={position:"relative",width:e,height:e,borderRadius:"50%",backgroundImage:`url(${M})`,backgroundSize:"cover",backgroundPosition:"center",boxShadow:`0 0 0 ${l} rgba(0,0,0,0.25) inset, 0 0 0 ${l} rgba(255,255,255,0.08)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:`'${a}', sans-serif`,color:"#D8EEA1FF",filter:"drop-shadow(0 0 0.5rem rgba(0,0,0,0.3))"},I=s=>{const m=(s-3)*30,g=`calc(${e} * 0.36)`,D=`calc(50% + ${g} * ${Math.cos(m*Math.PI/180)})`,z=`calc(50% + ${g} * ${Math.sin(m*Math.PI/180)})`;return{position:"absolute",left:D,top:z,transform:"translate(-50%, -50%)",fontSize:`calc(${e} * 0.15)`,userSelect:"none",zIndex:1,color:"#D8EEA1FF",fontFamily:`'${a}', sans-serif`,textShadow:`
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
    `}},o={position:"absolute",left:"50%",bottom:"50%",transformOrigin:"center bottom",backgroundSize:"contain",backgroundRepeat:"no-repeat",backgroundPosition:"center bottom",zIndex:"6"},F={...o,width:`calc(${e} * 0.22)`,height:`calc(${e} * 0.56)`,transform:`translateX(-50%) rotate(${w}deg)`,backgroundImage:`url(${C})`,filter:"drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) saturate(5.5) brightness(2.2)"},j={...o,width:`calc(${e} * 0.39)`,height:`calc(${e} * 0.495)`,transform:`translateX(-50%) rotate(${y}deg)`,backgroundImage:`url(${H})`,filter:"drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) saturate(1.5) brightness(2.2)"},E={...o,width:`calc(${e} * 0.56)`,height:`calc(${e} * 0.47)`,transform:`translateX(-50%) rotate(${p}deg)`,backgroundImage:`url(${P})`,filter:"drop-shadow(0 0 0.3rem rgba(0,0,0,0.5)) saturate(1.5) brightness(2.2)"};return t.jsxs("div",{style:$,children:[h,t.jsx("div",{style:S}),t.jsx("div",{style:k}),t.jsx("div",{style:v,children:t.jsxs("div",{style:x,"aria-label":"Analog clock",children:[[1,2,3,4,5,6,7,8,9,10,11,12].map(s=>t.jsx("div",{style:I(s),children:s},s)),t.jsx("div",{style:F}),t.jsx("div",{style:j}),t.jsx("div",{style:E})]})})]})};export{_ as default};
