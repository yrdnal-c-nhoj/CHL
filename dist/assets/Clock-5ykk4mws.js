import{r,j as t}from"./index-CacFjmHR.js";const h="/assets/sta-DBTSDb_D.gif",p="/assets/cur-6XqLElGZ.webp",x="/assets/pro-_00QEoet.gif",m="/assets/st-DgelOTb0.ttf",d="linear-gradient(135deg, #ffd700, #ffec85, #b8860b, #f5d742)",k=()=>{const c=r.useRef(null),l=r.useRef(null),f=r.useRef(null);r.useEffect(()=>{const s=()=>{const o=new Date,i=o.getSeconds(),a=o.getMinutes(),b=o.getHours()%12;c.current&&(c.current.style.transform=`rotate(${(b+a/60)*30}deg)`),l.current&&(l.current.style.transform=`rotate(${(a+i/60)*6}deg)`),f.current&&(f.current.style.transform=`rotate(${i*6}deg)`)};s();const n=setInterval(s,1e3);return()=>clearInterval(n)},[]),r.useEffect(()=>{new FontFace("ClockFont",`url(${m})`).load().then(n=>{document.fonts.add(n)}).catch(n=>console.error("Font loading failed:",n))},[]);const e=r.useMemo(()=>({background:{position:"absolute",bottom:0,left:0,width:"100vw",height:"100dvh",backgroundImage:`url(${h})`,backgroundSize:"100% 100%",backgroundRepeat:"no-repeat",backgroundPosition:"center center",pointerEvents:"none",zIndex:2,filter:"brightness(1.2)"},clockContainer:{position:"absolute",top:"60%",left:"50%",transform:"translate(-50%, -50%)",width:"39vmin",height:"39vmin",borderRadius:"50%",borderImageSlice:1,borderWidth:"0.8vmin",borderImageSource:d,boxShadow:`
        inset 0 0 10px 2px #fff9c2,
        inset 0 0 15px 4px #f7e063,
        0 0 12px 3px #ffdd55aa,
        0 0 6px 1px #b8860b88
      `,background:`
        radial-gradient(circle at 30% 30%, #fff8dc, #d4af37 70%),
        linear-gradient(135deg, #ffd700 25%, #b8860b 75%)
      `,backgroundBlendMode:"overlay",zIndex:2},clockFace:{position:"absolute",top:"50%",left:"50%",width:"90%",height:"90%",transform:"translate(-50%, -50%)",borderRadius:"50%",backgroundColor:"transparent",zIndex:3},overlay1:{position:"absolute",bottom:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${p})`,backgroundSize:"100% 100%",backgroundRepeat:"no-repeat",backgroundPosition:"center center",pointerEvents:"none",zIndex:20,filter:"brightness(0.8)"},overlay2:{position:"absolute",top:0,left:0,width:"100vw",height:"100vh",backgroundImage:`url(${x})`,backgroundSize:"100% 100%",backgroundRepeat:"no-repeat",backgroundPosition:"center center",pointerEvents:"none",zIndex:21,filter:"brightness(1.0)"},handBase:{position:"absolute",bottom:"50%",left:"50%",transformOrigin:"bottom center",transform:"rotate(0deg)"},hourHand:{width:"1.2vmin",height:"25%",background:d,borderRadius:"0.2vmin",boxShadow:`
        inset 0 0 4px #fff8a6,
        0 0 5px #b8860b
      `,zIndex:10},minuteHand:{width:"0.8vmin",height:"35%",background:d,borderRadius:"0.15vmin",boxShadow:`
        inset 0 0 3px #fff8a6,
        0 0 4px #b8860b
      `,zIndex:11},secondHand:{width:"0.4vmin",height:"40%",background:d,borderRadius:"0.1vmin",boxShadow:`
        inset 0 0 2px #fff8a6,
        0 0 3px #b8860b
      `,zIndex:12},number:{position:"absolute",fontFamily:"ClockFont, sans-serif",fontSize:"10vmin",color:"#b8860b",background:`
        linear-gradient(45deg, 
          #fff9b1, #ffd700, #fff8a6, #b8860b, #f5d742
        )
      `,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",textShadow:`
        0 0 8px #ffd700,
        0 0 15px #ffec85,
        0 0 20px #b8860b,
        1px 1px 1px #222220CC
      `,textAlign:"center",width:"20%",height:"20%",zIndex:9,display:"flex",alignItems:"center",justifyContent:"center",userSelect:"none"}}),[]),g=()=>{const s={XII:-90,III:0,VI:90,IX:180},n=30;return Object.entries(s).map(([o,i])=>{const a=i*Math.PI/180;let b=50+n*Math.cos(a),u=50+n*Math.sin(a);return u-=3,t.jsx("div",{style:{...e.number,left:`${b}%`,top:`${u}%`,transform:"translate(-50%, -50%)"},children:o},o)})};return t.jsxs("div",{style:{position:"relative",width:"100%",height:"100vh"},children:[t.jsx("div",{style:e.background}),t.jsx("div",{style:e.clockContainer,children:t.jsxs("div",{style:e.clockFace,children:[g(),t.jsx("div",{ref:c,style:{...e.handBase,...e.hourHand}}),t.jsx("div",{ref:l,style:{...e.handBase,...e.minuteHand}}),t.jsx("div",{ref:f,style:{...e.handBase,...e.secondHand}})]})}),t.jsx("div",{style:e.overlay1}),t.jsx("div",{style:e.overlay2})]})};export{k as default};
