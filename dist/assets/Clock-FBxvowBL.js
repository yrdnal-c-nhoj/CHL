import{r as b,j as d}from"./index-CBkcEe8T.js";import{S as F,P as R,W as A,C as B,L,M as j,D as k,T as W,B as G,a as H,E as T,b as P,c as D}from"./three.module-lJTtEs92.js";const I="/assets/fla-V39QxmBt.ttf",Q=()=>{const h=b.useRef(null);return b.useEffect(()=>{const p=h.current,f=new F,o=new R(75,window.innerWidth/window.innerHeight,.1,1e3),a=new A({antialias:!0,alpha:!0});a.setSize(window.innerWidth,window.innerHeight),p.appendChild(a.domElement);const i=document.createElement("canvas");i.width=512,i.height=512;const t=i.getContext("2d"),M="#130101FF",w=new B(i);w.minFilter=L;const m=()=>{t.clearRect(0,0,512,512),t.fillStyle="#ffffff",t.fillRect(0,0,512,512),t.shadowColor="black",t.shadowBlur=1,t.font='80px "fla", Arial, sans-serif',t.textAlign="center",t.textBaseline="middle",t.fillStyle=M;const e=new Date,r=e.getHours()%12||12,l=e.getMinutes().toString().padStart(2,"0"),y=`${r}:${l}`;t.fillText(y,256,366),w.needsUpdate=!0},g=[16711680,13849371,16214791,12059652].map(e=>new j({map:w,color:e,side:k,transparent:!1}));let n=new W(1).toNonIndexed();const x=new Float32Array(n.attributes.position.count*2),v=n.attributes.position.count/3;for(let e=0;e<v;e++){const r=e*3;x.set([0,0,1,0,.5,1],r*2)}n.setAttribute("uv",new G(x,2));for(let e=0;e<v;e++)n.addGroup(e*3,3,e%g.length);const s=new H(n,g);s.scale.set(4,4,4),f.add(s);const z=new T(n),S=new P({color:16777215}),c=new D(z,S);c.scale.set(4,4,4),f.add(c),o.position.z=4;const u=()=>{requestAnimationFrame(u),s.rotation.x+=.01,s.rotation.y+=.01,c.rotation.x+=.01,c.rotation.y+=.01;const e=performance.now()/1e3,r=14,l=-2,E=17-l;o.position.z=l+E*(Math.sin(2*Math.PI*e/r)+1)/2,m(),a.render(f,o)};document.fonts.load('bold 80px "fla"').then(()=>{m(),u()}).catch(e=>{console.warn("Font loading failed:",e),m(),u()});const C=()=>{o.aspect=window.innerWidth/window.innerHeight,o.updateProjectionMatrix(),a.setSize(window.innerWidth,window.innerHeight)};return window.addEventListener("resize",C),()=>{window.removeEventListener("resize",C),p.removeChild(a.domElement)}},[]),d.jsxs(d.Fragment,{children:[d.jsx("style",{children:`
        @font-face {
          font-family: 'fla';
          src: url(${I}) format('truetype');
          font-weight: normal;
          font-style: normal;
        }

        body {
          margin: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #b20832, #541c08);
        }

        .fire-gradient {
          height: 100vh;
          width: 100vw;
          overflow: hidden;
        }
      `}),d.jsx("div",{ref:h,className:"fire-gradient"})]})};export{Q as default};
