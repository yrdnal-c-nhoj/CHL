import { useEffect, useRef } from 'react';
import { useClock } from '@/utils/hooks';
import SRTime from '@/components/SRTime';
import styles from './Clock.module.css';

const TARGET_FPS = 120;
const DPR_LIMIT = 2;
const RAIN_DENSITY = 0.0003;
const RAIN_DIR = Math.PI * 0.4;
const RAIN_SPEED_MIN = 6;
const RAIN_SPEED_MAX = 70;
const TRAIL = 6.5;
const SPLASH_SPEED = 3.6;
const SPLASH_GRAVITY = 0.3;
const SPLASH_FRICTION = 0.98;
const SPLASH_PER_HIT_MIN = 4;
const SPLASH_PER_HIT_MAX = 10;
const DRIP_SPAWN_THRESHOLD = 3.0;
const DRIP_SPAWN_CHANCE = 0.0075;
const DRIP_GRAVITY = 0.6;
const POOL_DECAY = 0.96;
const POOL_FLOW = 0.3;
const POOL_VIS_MIN = 0.1;
const POOL_VIS_SCALE = 0.45;
const SLOPE_FLOW_BOOST = 10;
const SLOPE_DRIP_BONUS = 100;
const GROUND_ENABLED = true;
const GROUND_GAP_EM = 1;
const GROUND_THICK_EM = 0.25;
const GROUND_MIN_THICK = 12;
const EDGE_FAKE_RATE = 20;
const EDGE_SPLASH_COUNT_MIN = 2;
const EDGE_SPLASH_COUNT_MAX = 3;
const EDGE_SPLASH_SPEED = 0.2;
const EDGE_SPLASH_SPREAD = Math.PI * 0.9;
const EDGE_POOL_ADD_TOP = 0.1;
const GROUND_FAKE_WEIGHT = 0.0;
const GROUND_FAKE_COOLDOWN = 100000;

function Clock_26_10_02() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentTextRef = useRef('0000');
  const rebuildTextMaskRef = useRef<(() => void) | null>(null);
  const time = useClock();
  const timeText = `${String(time.getHours()).padStart(2, '0')}${String(time.getMinutes()).padStart(2, '0')}`;

  useEffect(() => {
    currentTextRef.current = timeText;
    rebuildTextMaskRef.current?.();
  }, [timeText]);

  useEffect(() => {
    const preconnect = document.createElement('link');
    preconnect.rel = 'preconnect';
    preconnect.href = 'https://fonts.gstatic.com';
    preconnect.crossOrigin = 'anonymous';

    const stylesheet = document.createElement('link');
    stylesheet.rel = 'stylesheet';
    stylesheet.href =
      'https://fonts.googleapis.com/css2?family=Cormorant:wght@700&display=swap';

    document.head.append(preconnect, stylesheet);
    return () => {
      preconnect.remove();
      stylesheet.remove();
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

    const fx = document.createElement('canvas');
    const fxc = fx.getContext('2d', { alpha: false, willReadFrequently: true }) as CanvasRenderingContext2D;
    const textCanvas = document.createElement('canvas');
    const tctx = textCanvas.getContext('2d') as CanvasRenderingContext2D;
    const DPR = Math.max(1, Math.min(DPR_LIMIT, window.devicePixelRatio || 1));
  // === Colors / Dither =======================================================
  const BG_COLOR = '#000000';
  const _RAIN_COLOR = '#ffffff';
  const BG_RGB = { r: 0, g: 0, b: 0 };
  const RAIN_RGB = { r: 255, g: 255, b: 255 };

  const lum8 = (r: number, g: number, b: number) => (r*77 + g*150 + b*29) >>> 8;
  const rgbaStr = (rgb: { r: number; g: number; b: number }, a: number = 1) => `rgba(${rgb.r|0},${rgb.g|0},${rgb.b|0},${a})`;

  const DR=255, DG=255, DB=255, DEN=195075, USE_PROJ=true;
  const PACKED_FG=0xffffffff, PACKED_BG=0xff000000;
  const _BG_LUM=0, _FG_LUM=255, _MID_LUM=127;
  const thrProjLUT = new Uint32Array(64);
  const thrLumLUT  = new Uint16Array(64);

  const BAYER8 = [
    0,48,12,60, 3,51,15,63, 32,16,44,28,35,19,47,31,
    8,56, 4,52,11,59, 7,55, 40,24,36,20,43,27,39,23,
    2,50,14,62, 1,49,13,61, 34,18,46,30,33,17,45,29,
    10,58, 6,54, 9,57, 5,53, 42,26,38,22,41,25,37,21
  ];
  for (let i=0;i<64;i++) thrProjLUT[i] = DEN * (BAYER8[i] as number * 2 + 1);

  // === Fixed typography ======================================================
  const FONT_FAMILY = "'Cormorant', serif";
  const FONT_WEIGHT = 700;
  const FONT_SIZE = 300;
  const fontSpec = (px: number) => `${FONT_WEIGHT} ${px}px ${FONT_FAMILY}`;

   // === State ================================================================
   let W=0, H=0, RAIN_COUNT=0;
   let gTopY=-1, gLeftX=0, gRightX=-1;        // floor extents

   // Mask + edges
   let maskData: Uint8ClampedArray | null=null;
   let ledgeFlags: Uint8Array | null=null;
   let pool: Float32Array | null=null;
   let slideNeighbor: Int32Array | null=null;
   let slopeDown: Uint8Array | null=null;
   const ledgeIndices: number[]=[];
   const edgeTopText: number[]=[], edgeTopGround: number[]=[], edgeBottom: number[]=[], edgeLeft: number[]=[], edgeRight: number[]=[];
   let edgeEmitAcc=0;

   // Particles
   const rain: Array<{ x: number; y: number; vx: number; vy: number }>=[]
   const splashes: Array<{ x: number; y: number; vx: number; vy: number; life: number }>=[]
   const drips: Array<{ x: number; y: number; vy: number; life: number }>=[]

  // === Resize / Mask build ==================================================
  function resize(){
    const w=window.innerWidth, h=window.innerHeight;
    W = Math.floor(w * DPR); H = Math.floor(h * DPR);
    canvas.width=W; canvas.height=H; canvas.style.width=w+'px'; canvas.style.height=h+'px';
    textCanvas.width=W; textCanvas.height=H;
    ctx.setTransform(1,0,0,1,0,0);

    RAIN_COUNT = Math.max(500, Math.floor(W*H*RAIN_DENSITY));
    rebuildTextMask();
    spawnInitialRain();
  }

  function rebuildTextMask(){
    tctx.clearRect(0,0,W,H);

    // text
    const fontPx = Math.floor(FONT_SIZE * DPR);
    const text = currentTextRef.current;
    tctx.fillStyle='#fff';
    tctx.textBaseline='middle';
    tctx.textAlign='center';
    tctx.font = fontSpec(fontPx);
    const maxWidth = W*0.82;
    const m = tctx.measureText(text);
    const scale = Math.min(1, maxWidth / Math.max(1, m.width));
    tctx.save(); tctx.translate(W/2, H/2); tctx.scale(scale, 1); tctx.fillText(text,0,0); tctx.restore(); 

    // floor (always thick)
    gTopY=-1; gLeftX=0; gRightX=-1;
    if (GROUND_ENABLED){
      const m2 = tctx.measureText(text);
      const baselineY = H/2;
      const descent = (m2.actualBoundingBoxDescent || (FONT_SIZE*0.2)) * DPR;
      const textBottom = baselineY + descent;
      const gapPx = Math.round(FONT_SIZE * GROUND_GAP_EM * DPR);
      const thickPx = Math.max(Math.round(GROUND_MIN_THICK * DPR),
                               Math.round(FONT_SIZE * GROUND_THICK_EM * DPR));
      const gTop = Math.min(H - thickPx - 1, Math.max(0, textBottom + gapPx));
      tctx.fillRect(0, gTop|0, W, thickPx);
      gTopY = gTop|0; gLeftX=0; gRightX=W-1;
    }

    // scan
    const img = tctx.getImageData(0,0,W,H); 
    maskData = img.data;

    ledgeFlags = new Uint8Array(W*H);
    pool = new Float32Array(W*H);
    slideNeighbor = new Int32Array(W*H); slideNeighbor.fill(-1);
    slopeDown = new Uint8Array(W*H);
    ledgeIndices.length=0;
    edgeTopText.length=0; edgeTopGround.length=0;
    edgeBottom.length=0; edgeLeft.length=0; edgeRight.length=0;

    const isSolid = (x: number,y: number) => {
      if (x<0||y<0||x>=W||y>=H) return false;
      return (maskData as Uint8ClampedArray)[((y*W + x) << 2) + 3]! > 127;
    };

    for (let y=0;y<H;y++){
      for (let x=0;x<W;x++){
        if (!isSolid(x,y)) continue;
        const idx=y*W + x;
        if (!isSolid(x,y-1)) {
          (ledgeFlags as Uint8Array)[idx]=1; ledgeIndices.push(idx);
          if (gTopY >= 0 && y===gTopY && x>=gLeftX && x<=gRightX) edgeTopGround.push(idx);
          else edgeTopText.push(idx);
        }
        if (!isSolid(x,y+1)) edgeBottom.push(idx);
        if (!isSolid(x-1,y)) edgeLeft.push(idx);
        if (!isSolid(x+1,y)) edgeRight.push(idx);
      }
    }

    // downhill/contour neighbor (prefer (1,1) > (1,0) > (0,1) > (2,1) > (2,0) > (-1,1))
    const OFF = [[1,1],[1,0],[0,1],[2,1],[2,0],[-1,1]];
    for (let i=0;i<ledgeIndices.length;i++){
      const idx=ledgeIndices[i] as number;
      const y=(idx/W)|0, x=idx - y*W;
      let best=-1, bestScore=-1e9, drop=0;
      for (let k=0;k<OFF.length;k++){
        const dx=(OFF[k] as number[])[0]!, dy=(OFF[k] as number[])[1]!;
        const nx=x+dx, ny=y+dy;
        if (nx<0||ny<0||nx>=W||ny>=H) continue;
        const nidx=ny*W + nx;
        if (!(ledgeFlags as Uint8Array)[nidx]!) continue;
        const d=ny-y;
        const score = d*10 + (dx>0?1:0) - Math.abs(dx)*0.2;
        if (score>bestScore){ bestScore=score; best=nidx; drop=d; }
      }
      (slideNeighbor as Int32Array)[idx]=best;
      (slopeDown as Uint8Array)[idx]=drop&3;
    }
  }

  // === Collision helpers =====================================================
  const isSolidAt = (x: number,y: number) => {
    const xi=x|0, yi=y|0;
    if (xi<0||yi<0||xi>=W||yi>=H) return false;
    return (maskData as Uint8ClampedArray)[((yi*W + xi) << 2) + 3]! > 127;
  };
  const isLedgeIdx = (idx: number) => ((ledgeFlags as Uint8Array)[idx]!)===1;
  function nearestTopSurfaceIndex(x: number,y: number){
    const xi = Math.max(0, Math.min(W-1, x|0));
    let yi = Math.max(0, Math.min(H-1, y|0));
    if (!isSolidAt(xi,yi)) { while (yi<H && !isSolidAt(xi,yi)) yi++; yi=Math.min(H-1, yi); }
    while (yi>=0 && isSolidAt(xi,yi)) yi--;
    yi = Math.min(H-1, yi+1);
    const idx=yi*W + xi;
    return isLedgeIdx(idx) ? idx : -1;
  }

  // === Particles =============================================================
  function spawnAtEntry(p: { x: number; y: number; vx: number; vy: number }){
    const dx=Math.cos(RAIN_DIR), dy=Math.sin(RAIN_DIR);
    const mx=Math.max(40, W*0.25), my=Math.max(40, H*0.25);
    const edges: ('top' | 'bottom' | 'left' | 'right')[] = []; if (dx>0) edges.push('left'); else edges.push('right');
                     if (dy>0) edges.push('top');  else edges.push('bottom');
    const L = { top:W+2*mx, bottom:W+2*mx, left:H+2*my, right:H+2*my };
    const e = Math.random() < (L[edges[0] as string] / (L[edges[0] as string] + L[edges[1] as string])) ? edges[0] as string : edges[1] as string;
    switch(e){
      case 'top':    p.x=Math.random()*(W+2*mx)-mx; p.y=-my - Math.random()*my; break;
      case 'bottom': p.x=Math.random()*(W+2*mx)-mx; p.y= H+my + Math.random()*my; break;
      case 'left':   p.x=-mx - Math.random()*mx;    p.y=Math.random()*(H+2*my)-my; break;
      case 'right':  p.x=W+mx + Math.random()*mx;   p.y=Math.random()*(H+2*my)-my; break;
    }
    const s = RAIN_SPEED_MIN + Math.random()*(RAIN_SPEED_MAX - RAIN_SPEED_MIN);
    p.vx = dx*s; p.vy = dy*s;
  }
  function spawnInitialRain(){ rain.length=0; for(let i=0;i<RAIN_COUNT;i++){ const p={x:0,y:0,vx:0,vy:0}; spawnAtEntry(p); rain.push(p);} splashes.length=0; drips.length=0; }
  const respawnDrop = (p: { x: number; y: number; vx: number; vy: number })=>spawnAtEntry(p);

  function spawnSplashes(x: number,y: number,count: number){
    for(let i=0;i<count;i++){
      const ang=(-Math.PI/2) + (Math.random()*Math.PI*0.6 - Math.PI*0.3);
      const sp=SPLASH_SPEED*(0.7+Math.random()*0.6);
      splashes.push({ x,y, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp, life:1.0 });
    }
  }
  function spawnSplashesDirected(x: number,y: number,normalAngle: number,count: number,baseSpeed: number,spread: number){
    for(let i=0;i<count;i++){
      const ang=normalAngle + (Math.random()*spread - spread*0.5);
      const sp=baseSpeed*(0.7+Math.random()*0.6);
      splashes.push({ x,y, vx:Math.cos(ang)*sp, vy:Math.sin(ang)*sp, life:0.8+Math.random()*0.4 });
    }
  }
  function spawnDripFromIndex(idx: number){
    const y=(idx/W)|0, x=idx - y*W;
    drips.push({ x:x + Math.random()*0.8 - 0.4, y:y - 0.6, vy:Math.random()*0.5, life:1.0 });
  }

  // Decorative edge events
  let _lastGroundFakeAt=-1;
  function spawnFakeEdgeEvent(now: number){
    const ltText=edgeTopText.length, ltGround=edgeTopGround.length;
    const lb=edgeBottom.length, ll=edgeLeft.length, lr=edgeRight.length;
    const ltWeighted = ltText + ltGround*GROUND_FAKE_WEIGHT;
    const total = ltWeighted + lb + ll + lr;
    if (total<=0) return;

    let r=Math.random()*total, arr=null, angle=0;
    if ((r-=ltWeighted) < 0) {
      if (ltWeighted<=0) return;
      let rr=Math.random()*ltWeighted;
      if ((rr-=ltText) < 0 || ltGround===0) { arr=edgeTopText; angle=-Math.PI/2; }
      else {
         if (GROUND_FAKE_COOLDOWN>0){
           if (_lastGroundFakeAt>=0 && now-_lastGroundFakeAt<GROUND_FAKE_COOLDOWN) return;
           _lastGroundFakeAt=now;
         }
        arr=edgeTopGround; angle=-Math.PI/2;
      }
    } else if ((r-=lb) < 0){ arr=edgeBottom; angle= Math.PI/2;
    } else if ((r-=ll) < 0){ arr=edgeLeft;   angle= Math.PI;
    } else {                 arr=edgeRight;  angle= 0; }

    if (!arr || arr.length===0) return;
    const idx=(arr as number[])[(Math.random()*arr.length)|0]!;
    const y=(idx/W)|0, x=idx - y*W;

    // Don’t emit from hidden area under the floor
    if (GROUND_ENABLED && gTopY>=0 && y > gTopY) return;

    const off=0.9, sx=x+Math.cos(angle)*off, sy=y+Math.sin(angle)*off;
    const cnt=EDGE_SPLASH_COUNT_MIN + (Math.random()*(EDGE_SPLASH_COUNT_MAX-EDGE_SPLASH_COUNT_MIN+1) | 0);
    spawnSplashesDirected(sx,sy,angle,cnt,EDGE_SPLASH_SPEED,EDGE_SPLASH_SPREAD);
    if (((ledgeFlags as Uint8Array)[idx]! )===1) (pool as Float32Array)[idx]!+=EDGE_POOL_ADD_TOP;
  }

  // === Post-process (pixelate + ordered dither) =============================
  let _lastPostW=0,_lastPostH=0;
  function applyPostProcess(){
    const pixelSize = 2;
    const useDither = true;
    if (pixelSize<=1 && !useDither) return;

    const postW = Math.max(1, (W/pixelSize)|0);
    const postH = Math.max(1, (H/pixelSize)|0);
    if (postW!==_lastPostW || postH!==_lastPostH){ fx.width=postW; fx.height=postH; _lastPostW=postW; _lastPostH=postH; }

    fxc.imageSmoothingEnabled = true;
    fxc.drawImage(canvas as HTMLCanvasElement, 0,0, postW,postH);

    if (useDither){
      const img = fxc.getImageData(0,0,postW,postH);
      const data=img.data, u32=new Uint32Array(data.buffer);
      let p=0;
      if (USE_PROJ){
        for (let y=0;y<postH;y++){ const y8=(y&7)<<3;
          for (let x=0;x<postW;x++, p+=4){
            const r=data[p] as number, g=data[p+1] as number, b=data[p+2] as number;
            const num = ((r-BG_RGB.r)*DR + (g-BG_RGB.g)*DG + (b-BG_RGB.b)*DB)|0;
            const thr = thrProjLUT[y8 | (x&7)] as number;
            u32[p>>2] = ((num<<7) > thr) ? PACKED_FG : PACKED_BG;
          }
        }
      } else {
        for (let y=0;y<postH;y++){ const y8=(y&7)<<3;
          for (let x=0;x<postW;x++, p+=4){
            const lum = lum8(data[p] as number, data[p+1] as number, data[p+2] as number);
            const thr = thrLumLUT[y8 | (x&7)] as number;
            u32[p>>2] = (lum > thr) ? PACKED_FG : PACKED_BG;
          }
        }
      }
      fxc.putImageData(img,0,0);
    }

    const prevSmooth=ctx.imageSmoothingEnabled;
    ctx.imageSmoothingEnabled=false;
    ctx.clearRect(0,0,W,H);
    ctx.drawImage(fx, 0,0, postW,postH, 0,0, W,H);
    ctx.imageSmoothingEnabled=prevSmooth;
  }

  // === Render clip (hide anything below floor) ==============================
  function beginFloorClip(){
    if (GROUND_ENABLED && gTopY>=0){
      ctx.save();
      ctx.beginPath();
      ctx.rect(0,0,W,gTopY);
      ctx.clip();
      return true;
    }
    return false;
  }
  const endFloorClip = (did: boolean)=>{ if (did) ctx.restore(); };

  // === Main loop / FPS ======================================================
  let lastFrameTime=0, lastT=0;
  const FRAME_INTERVAL = TARGET_FPS ? (1000/TARGET_FPS) : 0;

  let rafId = 0;

   function frame(t: number){
     if (lastT===0) { lastT = t; lastFrameTime = t; rafId = requestAnimationFrame(frame); return; }
     if (TARGET_FPS && t - lastFrameTime < FRAME_INTERVAL){ rafId = requestAnimationFrame(frame); return; }
     lastFrameTime = t;
     const dt = Math.min(33, t - lastT) / 16.67; lastT = t;

    // background
    ctx.fillStyle = BG_COLOR;
    ctx.fillRect(0,0,W,H);

    // clip above floor
    const clipped = beginFloorClip();

    // rain
    ctx.lineWidth=1;
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 0.55);
    ctx.beginPath();
    for (let i=0;i<rain.length;i++){
      const p=rain[i];
      const nx=p.x + p.vx*dt, ny=p.y + p.vy*dt;
      if (isSolidAt(nx,ny)){
        const hx=p.x + p.vx*dt*0.4, hy=p.y + p.vy*dt*0.4;
        const sIdx = nearestTopSurfaceIndex(hx,hy);
        if (sIdx !== -1) (pool as Float32Array)[sIdx]! += 8.0;
        const cnt = SPLASH_PER_HIT_MIN + (Math.random()*(SPLASH_PER_HIT_MAX - SPLASH_PER_HIT_MIN + 1)|0);
        spawnSplashes(hx,hy,cnt);
        respawnDrop(p);
      } else {
        ctx.moveTo(p.x - p.vx*TRAIL, p.y - p.vy*TRAIL);
        ctx.lineTo(p.x, p.y);
        p.x=nx; p.y=ny;
        if (p.x > W+20 || p.y > H+20) respawnDrop(p);
      }
    }
    ctx.stroke();

    // splashes
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 0.7);
    ctx.beginPath();
    for (let i=splashes.length-1;i>=0;i--){
      const s=splashes[i];
      s.vy += SPLASH_GRAVITY*dt;
      s.vx *= Math.pow(SPLASH_FRICTION, dt);
      s.vy *= Math.pow(SPLASH_FRICTION, dt);
      const px=s.x, py=s.y;
      s.x += s.vx*dt; s.y += s.vy*dt; s.life -= 0.02*dt;
      ctx.moveTo(px,py); ctx.lineTo(s.x,s.y);
      if (s.life<=0 || isSolidAt(s.x,s.y)){
        if (!isSolidAt(px,py)){
          const idx=nearestTopSurfaceIndex(s.x,s.y);
          if (idx!==-1) (pool as Float32Array)[idx]! += 0.2;
        }
        splashes.splice(i,1);
      }
    }
    ctx.stroke();

    // decorative edge hits
    edgeEmitAcc += EDGE_FAKE_RATE * dt;
    while (edgeEmitAcc >= 1){          spawnFakeEdgeEvent(t); edgeEmitAcc -= 1; }

    // pools (evaporate, slide, drip)
    for (let i=0;i<ledgeIndices.length;i++){
      const idx=ledgeIndices[i] as number;
      let v=(pool as Float32Array)[idx]!;
      if (v<=0.0001){ (pool as Float32Array)[idx]=0; continue; }
      v *= Math.pow(POOL_DECAY, dt);

      const sn=(slideNeighbor as Int32Array)[idx]!;
      if (sn!==-1){
        const drop=(slopeDown as Uint8Array)[idx]!;
        const flow = Math.min(v*0.9, v * (1 - Math.pow(1-POOL_FLOW, dt)) * (1 + SLOPE_FLOW_BOOST*drop));
        v -= flow; (pool as Float32Array)[sn]! += flow;

        if (v>DRIP_SPAWN_THRESHOLD && Math.random() < (DRIP_SPAWN_CHANCE + drop*SLOPE_DRIP_BONUS) * dt){
          spawnDripFromIndex(idx);
          v = Math.max(0, v - 0.8);
        }
      } else if (v>DRIP_SPAWN_THRESHOLD && Math.random() < DRIP_SPAWN_CHANCE*dt){
        spawnDripFromIndex(idx);
        v = Math.max(0, v - 0.8);
      }
      (pool as Float32Array)[idx]=v;    }

    // pool highlights
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 1);
    ctx.beginPath();
    for (let i=0;i<ledgeIndices.length;i++){
      const idx=ledgeIndices[i] as number, v=(pool as Float32Array)[idx]!;
      if (v > POOL_VIS_MIN){
        const y=(idx/W)|0, x=idx - y*W;
        const a = Math.min(1, (v - POOL_VIS_MIN) * POOL_VIS_SCALE);
        if (v>1.6 || Math.random()<0.6){
          ctx.strokeStyle = rgbaStr(RAIN_RGB, a);
          ctx.moveTo(x-0.5, y-0.6);
          ctx.lineTo(x+0.8, y-0.6);
        }
      }
    }
    ctx.stroke();

    // drips
    ctx.strokeStyle = rgbaStr(RAIN_RGB, 0.85);
    ctx.beginPath();
    for (let i=drips.length-1;i>=0;i--){
      const d=drips[i] as { x: number; y: number; vy: number; life: number };
      const px=d.x, py=d.y;
      d.vy += DRIP_GRAVITY*dt; d.y += d.vy*dt;
      ctx.moveTo(px,py); ctx.lineTo(d.x,d.y);
      const by=d.y+0.75;
      if (by>=0 && by<H && isSolidAt(d.x, by)){
        const sIdx=nearestTopSurfaceIndex(d.x, by);
        if (sIdx!==-1) (pool as Float32Array)[sIdx]! += 1.5;
        drips.splice(i,1); continue;
      }
      if (d.y > H+10) drips.splice(i,1);
    }
    ctx.stroke();

    // end clip
    endFloorClip(clipped);

    // FX + FPS
    applyPostProcess();
    rafId = requestAnimationFrame(frame);
  }


    rebuildTextMaskRef.current = rebuildTextMask;
    document.fonts.ready.then(() => {
      resize();
      rafId = requestAnimationFrame(frame);
      window.addEventListener('resize', resize, { passive: true });
    });

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(rafId);
      rebuildTextMaskRef.current = null;
    };
  }, []);

  return (
    <div className={styles.rainClock}>
      <canvas ref={canvasRef} aria-hidden="true" />
      <SRTime time={time} />
    </div>
  );
}

Clock_26_10_02.displayName = 'Clock_26_10_02';

export default Clock_26_10_02;
