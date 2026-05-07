import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import fontUrl from '@/assets/fonts/2026/26-05-06-droplet.ttf';
import backgroundImage from '@/assets/images/2026/26-05/26-05-06/drops.jpg';

// ========================== CONSTANTS ==========================
const MAX_DROPLETS = 40;
const MAX_ENTRIES = MAX_DROPLETS * 2;
const FIXED_DT_MS = 8;
const MAX_FRAME_DT_MS = 100;
const MAX_CATCHUP = 6;

// === SIMULATION SPEED CONTROL ===
const SIM_SPEED = 1 / 3;        // Overall movement speed
const MERGE_SPLIT_SPEED = 1.0;  // Keep merging/splitting responsive

// Physics Constants (slowed down)
const DAMP = 0.993;
const TENSION_RANGE = 0.12;
const TENSION_F = 0.0004 * SIM_SPEED;
const MERGE_RATIO = 0.62;
const SPLIT_SPEED = 0.013 * MERGE_SPLIT_SPEED;        // kept fast
const SPLIT_MIN_R = 0.04;
const MAX_SPEED = 0.015 * SIM_SPEED;
const BOUNCE = 0.4;
const WANDER_F = 0.00004 * SIM_SPEED;
const CENTER_PULL = 0.000008 * SIM_SPEED;
const SOFT_STIFFNESS = 0.22 * SIM_SPEED;
const SOFT_DAMPING = 0.6;

// ========================== TYPES ==========================
type Droplet = {
  id: number;
  x: number;
  y: number;
  r: number;
  area: number;
  vx: number;
  vy: number;
  alive: boolean;
  wanderAngle: number;
  wanderSpeed: number;
  softPrevX: number;
  softPrevY: number;
  softOffX: number;
  softOffY: number;
  softVelX: number;
  softVelY: number;
};

// ========================== SHADERS (unchanged) ==========================
const VERTEX_SHADER = `void main(){ gl_Position = vec4(position, 1.0); }`;

const createFragmentShader = (maxEntries: number) => `
precision highp float;
#define MAX_N ${maxEntries}
uniform vec2 uRes;
uniform sampler2D uData;
uniform sampler2D uBg;
uniform int uCount;
uniform float uTime;

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = (uv - 0.5) * vec2(asp, 1.0);

  float field = 0.0;
  vec2 grad = vec2(0.0);
  vec2 lens = vec2(0.0);
  float lensW = 0.0;

  for(int i = 0; i < MAX_N; i++){
    if(i >= uCount) break;
    vec4 d = texture2D(uData, vec2((float(i)+0.5)/float(MAX_N), 0.5));
    vec2 c = d.xy;
    float r = d.z;
    if(r < 0.001) continue;

    vec2 delta = p - c;
    float dSq = dot(delta, delta) + 1e-5;
    float contrib = r * r / dSq;
    field += contrib;
    grad += -2.0 * contrib / dSq * delta;

    float w = r * r / (dSq + r * r);
    lens += (c - p) * w;
    lensW += w;
  }

  lens /= (lensW + 0.001);
  float lensLen = length(lens);
  float thr = 1.0;
  float edge = smoothstep(thr - 0.08, thr + 0.03, field);

  float refractStrength = 0.035;
  float mappedLens = atan(lensLen * 6.0) * refractStrength;
  vec2 refractDir = (lensLen > 1e-5) ? lens / lensLen : vec2(0.0);
  float refractMask = smoothstep(thr - 0.2, thr + 1.5, field);
  vec2 refractedUV = clamp(uv + refractDir * mappedLens * refractMask, 0.001, 0.999);

  vec3 bgClean = texture2D(uBg, uv).rgb;

  float gradLen = length(grad);
  float nScale = atan(gradLen * 0.5) * 0.3;
  vec2 nGrad = (gradLen > 1e-4) ? (grad / gradLen) * nScale : vec2(0.0);
  vec3 N = normalize(vec3(-nGrad, 1.0));
  vec3 L = normalize(vec3(0.3, 0.6, 1.0));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);

  float diff = max(dot(N, L), 0.0);
  float spec = pow(max(dot(N, H), 0.0), 180.0);
  float cosTheta = max(dot(N, V), 0.0);
  float fresnel = 0.04 + 0.96 * pow(1.0 - cosTheta, 4.0);
  float rim = smoothstep(thr + 0.6, thr, field) * edge;

  float caStr = 0.0018 * edge;
  vec3 bgCA = vec3(
    texture2D(uBg, refractedUV + vec2(caStr, caStr*0.5)).r,
    texture2D(uBg, refractedUV).g,
    texture2D(uBg, refractedUV - vec2(caStr, caStr*0.5)).b
  );

  float depth = smoothstep(thr, thr + 3.0, field);
  vec3 tint = mix(vec3(1.0), vec3(0.3, 0.5, 1.0), depth * 0.45);

  vec3 glassColor = bgCA * tint * (0.92 + 0.08 * diff)
                  + vec3(0.6) * spec * 0.85
                  + vec3(0.3, 0.6, 1.0) * rim * 0.22
                  + vec3(1.0) * fresnel * 0.10;

  float shadowField = smoothstep(thr - 0.35, thr - 0.05, field);
  vec3 bg = bgClean * (1.0 - shadowField * 0.06);

  float border = smoothstep(thr - 0.10, thr - 0.01, field) *
                 (1.0 - smoothstep(thr, thr + 0.06, field)) * 0.28;

  vec3 col = mix(bg, glassColor, edge) + vec3(0.3, 0.6, 1.0) * border;
  gl_FragColor = vec4(col, 1.0);
}
`;

// Background and time overlay hooks
const useBackgroundAndTime = () => {
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    const context = c.getContext('2d', { alpha: false })!;
    const tex = new THREE.CanvasTexture(c);
    tex.minFilter = tex.magFilter = THREE.LinearFilter;
    return { canvas: c, ctx: context, texture: tex };
  }, []);

  const stateRef = useRef({
    lastTimeStr: '',
    fontLoaded: false,
    bgImage: null as HTMLImageElement | null,
  });

  // Load the custom font
  useEffect(() => {
    const loadFont = async () => {
      try {
        const font = new FontFace('26-05-06-droplet', `url(${fontUrl})`);
        await font.load();
        document.fonts.add(font);
        stateRef.current.fontLoaded = true;
      } catch (e) {
        console.warn("Font load failed", e);
      }
    };
    loadFont();
  }, []);

  const draw = useCallback(() => {
    const w = canvas.width;
    const h = canvas.height;
    
    // Don't draw if canvas has no dimensions
    if (w === 0 || h === 0) return;
    
    const timeStr = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    const { lastTimeStr, fontLoaded, bgImage } = stateRef.current;

    // Skip if background isn't ready or font isn't loaded to prevent FOUC
    if (!bgImage || !bgImage.complete || !fontLoaded) return;
    if (timeStr === lastTimeStr) return;

    // Always draw to update time and handle GIF animation
    ctx.fillStyle = '#1a3fa0';
    ctx.fillRect(0, 0, w, h);
    
    if (bgImage && bgImage.complete) {
      const imgRatio = bgImage.width / bgImage.height;
      const canvasRatio = w / h;
      
      let drawWidth, drawHeight, offsetX, offsetY;
      
      if (imgRatio > canvasRatio) {
        // Image is wider than canvas - fit to height
        drawHeight = h;
        drawWidth = h * imgRatio;
        offsetX = (w - drawWidth) / 2;
        offsetY = 0;
      } else {
        // Image is taller than canvas - fit to width
        drawWidth = w;
        drawHeight = w / imgRatio;
        offsetX = 0;
        offsetY = (h - drawHeight) / 2;
      }
      
      ctx.drawImage(bgImage, offsetX, offsetY, drawWidth, drawHeight);
    } else {
      // If image isn't ready, we skip the rest to avoid showing 
      // the clock over a plain background
      return;
    }

    // Draw time overlay with each digit in its own box
    ctx.fillStyle = '#BDD1EF';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `300 ${Math.round(w * 0.56)}px ${fontLoaded ? "'26-05-06-droplet'" : 'system-ui'}, sans-serif`;
    
    // Draw each digit in its own isolated box
    const timeChars = timeStr.split('');
    const charWidth = w * 0.08; // Width for each character box
    const startX = (w - timeChars.length * charWidth) / 2;
    
    for (let i = 0; i < timeChars.length; i++) {
      const charX = startX + i * charWidth;
      
      // Draw digit box
      ctx.strokeStyle = '#FFFFFF37';
      ctx.lineWidth = 0;
      ctx.strokeRect(charX - charWidth * 0.4, h * 0.4, charWidth * 1.8, h * 0.2);
      
      // Draw digit
      ctx.fillText(timeChars[i], charX, h * 0.5);
    }

    texture.needsUpdate = true;
    stateRef.current.lastTimeStr = timeStr;
  }, [canvas, ctx, texture]);

  // Load the background image
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      stateRef.current.bgImage = img;
      draw();
    };
  }, [draw]);

  const updateSize = useCallback((w: number, h: number) => {
    if (w > 0 && h > 0) {
      canvas.width = w;
      canvas.height = h;
      draw();
    }
  }, [canvas, draw]);

  return { texture, draw, updateSize };
};

// ========================== MAIN COMPONENT ==========================
const WaterDropletsClock: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<{ 
    renderer: THREE.WebGLRenderer | null, 
    scene: THREE.Scene | null, 
    camera: THREE.OrthographicCamera | null, 
    material: THREE.ShaderMaterial | null 
  }>({ renderer: null, scene: null, camera: null, material: null });

  const dropletsRef = useRef<Droplet[]>([]);
  const uidRef = useRef(0);
  const lastRef = useRef(0);
  const accRef = useRef(0);
  const pausedRef = useRef(false);

  // Initialize background and time hook
  const { texture: bgTexture, draw: drawBackground, updateSize } = useBackgroundAndTime();

  const createDroplet = useCallback((x?: number, y?: number): Droplet => {
    const area = Math.PI * (0.025 + Math.random() * 0.045) ** 2;
    const angle = Math.random() * Math.PI * 2;
    const spd = (0.0004 + Math.random() * 0.0007) * SIM_SPEED;

    return {
      id: uidRef.current++,
      x: x ?? (Math.random() - 0.5) * 0.7,
      y: y ?? (Math.random() - 0.5) * 0.5,
      r: Math.sqrt(area / Math.PI),
      area,
      vx: Math.cos(angle) * spd,
      vy: Math.sin(angle) * spd,
      alive: true,
      wanderAngle: Math.random() * Math.PI * 2,
      wanderSpeed: 0.3 + Math.random() * 0.5,
      softPrevX: x ?? (Math.random() - 0.5) * 0.7,
      softPrevY: y ?? (Math.random() - 0.5) * 0.5,
      softOffX: 0,
      softOffY: 0,
      softVelX: 0,
      softVelY: 0,
    };
  }, []);

  const seedInitialDroplets = useCallback(() => {
    dropletsRef.current = Array.from({ length: 12 }, () => createDroplet());
  }, [createDroplet]);

  const applyForces = useCallback(() => {
    const droplets = dropletsRef.current;

    for (const d of droplets) {
      d.wanderAngle += (Math.random() - 0.5) * d.wanderSpeed;
      d.vx += Math.cos(d.wanderAngle) * WANDER_F;
      d.vy += Math.sin(d.wanderAngle) * WANDER_F;
      d.vx -= d.x * CENTER_PULL;
      d.vy -= d.y * CENTER_PULL;
    }

    // Surface tension
    for (let i = 0; i < droplets.length; i++) {
      const a = droplets[i];
      for (let j = i + 1; j < droplets.length; j++) {
        const b = droplets[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dSq = dx * dx + dy * dy;
        const rng = TENSION_RANGE + a.r + b.r;

        if (dSq < rng * rng && dSq > 1e-5) {
          const dist = Math.sqrt(dSq);
          const s = 1 - dist / rng;
          const f = s * TENSION_F;
          const fx = (dx / dist) * f;
          const fy = (dy / dist) * f;
          a.vx += fx;
          a.vy += fy;
          b.vx -= fx;
          b.vy -= fy;
        }
      }
    }
  }, []);

  const integrate = useCallback(() => {
    const aspect = window.innerWidth / window.innerHeight;
    const droplets = dropletsRef.current;

    for (const d of droplets) {
      let speed = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      if (speed > MAX_SPEED) {
        const s = MAX_SPEED / speed;
        d.vx *= s;
        d.vy *= s;
      }

      d.x += d.vx;
      d.y += d.vy;
      d.vx *= DAMP;
      d.vy *= DAMP;

      const wx = aspect * 0.5;
      const wy = 0.5;

      if (d.x - d.r < -wx) { d.x = -wx + d.r; d.vx = Math.abs(d.vx) * BOUNCE; }
      if (d.x + d.r > wx) { d.x = wx - d.r; d.vx = -Math.abs(d.vx) * BOUNCE; }
      if (d.y - d.r < -wy) { d.y = -wy + d.r; d.vy = Math.abs(d.vy) * BOUNCE; }
      if (d.y + d.r > wy) { d.y = wy - d.r; d.vy = -Math.abs(d.vy) * BOUNCE; }
    }
  }, []);

  const mergeDroplets = useCallback(() => {
    const droplets = dropletsRef.current;
    for (let i = 0; i < droplets.length; i++) {
      const a = droplets[i];
      if (!a.alive) continue;
      for (let j = i + 1; j < droplets.length; j++) {
        const b = droplets[j];
        if (!b.alive) continue;

        const dist = Math.hypot(b.x - a.x, b.y - a.y);
        if (dist < (a.r + b.r) * MERGE_RATIO) {
          const na = a.area + b.area;
          a.x = (a.x * a.area + b.x * b.area) / na;
          a.y = (a.y * a.area + b.y * b.area) / na;
          a.vx = (a.vx * a.area + b.vx * b.area) / na;
          a.vy = (a.vy * a.area + b.vy * b.area) / na;
          a.r = Math.sqrt(na / Math.PI);
          a.area = na;
          b.alive = false;
        }
      }
    }
    for (let i = droplets.length - 1; i >= 0; i--) {
      if (!droplets[i].alive) droplets.splice(i, 1);
    }
  }, []);

  const splitDroplets = useCallback(() => {
    const droplets = dropletsRef.current;
    const toAdd: Droplet[] = [];

    for (const d of droplets) {
      if (d.r < SPLIT_MIN_R) continue;
      const sp = Math.sqrt(d.vx * d.vx + d.vy * d.vy);
      if (sp < SPLIT_SPEED) continue;

      const ha = d.area * 0.5;
      const nr = Math.sqrt(ha / Math.PI);
      const nx = -d.vy / sp || 0;
      const ny = d.vx / sp || 0;
      const off = nr * 0.7;

      d.r = nr;
      d.area = ha;
      d.x -= nx * off;
      d.y -= ny * off;

      toAdd.push({
        ...createDroplet(d.x + nx * off * 2, d.y + ny * off * 2),
        vx: d.vx + nx * sp * 0.35,
        vy: d.vy + ny * sp * 0.35,
      });
    }

    for (const d of toAdd) {
      if (droplets.length < MAX_DROPLETS) droplets.push(d);
    }
  }, [createDroplet]);

  const updateSoftBodies = useCallback(() => {
    for (const d of dropletsRef.current) {
      const dx = d.x - d.softPrevX;
      const dy = d.y - d.softPrevY;

      d.softVelX += (dx - d.softOffX) * SOFT_STIFFNESS;
      d.softVelY += (dy - d.softOffY) * SOFT_STIFFNESS;
      d.softVelX *= SOFT_DAMPING;
      d.softVelY *= SOFT_DAMPING;

      d.softOffX += d.softVelX;
      d.softOffY += d.softVelY;
      d.softPrevX = d.x;
      d.softPrevY = d.y;
    }
  }, []);

  const autoSpawn = useCallback(() => {
    if (dropletsRef.current.length < 10 && Math.random() < 0.012) {
      dropletsRef.current.push(createDroplet());
    }
  }, [createDroplet]);

  const fixedUpdate = useCallback(() => {
    applyForces();
    integrate();
    mergeDroplets();
    splitDroplets();
    updateSoftBodies();
    autoSpawn();
  }, [applyForces, integrate, mergeDroplets, splitDroplets, updateSoftBodies, autoSpawn]);

  const syncToTexture = useCallback((dropletTex: THREE.DataTexture, material: THREE.ShaderMaterial) => {
    const buf = dropletTex.image.data as Float32Array;
    const n = Math.min(dropletsRef.current.length, MAX_DROPLETS);

    for (let i = 0; i < n; i++) {
      const d = dropletsRef.current[i];
      const base = i * 4;
      buf[base] = d.x; buf[base + 1] = d.y; buf[base + 2] = d.r; buf[base + 3] = 1;

      const gi = (n + i) * 4;
      buf[gi] = d.x - d.softOffX * 3.5;
      buf[gi + 1] = d.y - d.softOffY * 3.5;
      buf[gi + 2] = d.r * 0.68;
      buf[gi + 3] = 1;
    }

    dropletTex.needsUpdate = true;
    material.uniforms.uCount.value = n * 2;
  }, []);

  // Setup
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ antialias: false });
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const dropletTex = new THREE.DataTexture(
      new Float32Array(MAX_ENTRIES * 4),
      MAX_ENTRIES, 1,
      THREE.RGBAFormat,
      THREE.FloatType
    );
    dropletTex.minFilter = dropletTex.magFilter = THREE.NearestFilter;

    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: createFragmentShader(MAX_ENTRIES),
      uniforms: {
        uRes: { value: new THREE.Vector2(renderer.domElement.width, renderer.domElement.height) },
        uData: { value: dropletTex },
        uBg: { value: bgTexture },
        uCount: { value: 0 },
        uTime: { value: 0 },
      },
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));
    sceneRef.current = { renderer, scene, camera, material };

    updateSize(renderer.domElement.width, renderer.domElement.height);

    seedInitialDroplets();

    let frameId: number;
    const loop = () => {
      if (pausedRef.current) {
        frameId = requestAnimationFrame(loop);
        return;
      }

      const now = performance.now();
      const dt = Math.min(now - lastRef.current, MAX_FRAME_DT_MS);
      lastRef.current = now;
      accRef.current += dt;

      let updates = 0;
      while (accRef.current >= FIXED_DT_MS && updates < MAX_CATCHUP) {
        fixedUpdate();
        accRef.current -= FIXED_DT_MS;
        updates++;
      }
      if (updates >= MAX_CATCHUP) accRef.current = 0;

      material.uniforms.uTime.value = now * 0.001;
      syncToTexture(dropletTex, material);
      drawBackground();

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(loop);
    };

    lastRef.current = performance.now();
    loop();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      material.uniforms.uRes.value.set(renderer.domElement.width, renderer.domElement.height);
      updateSize(renderer.domElement.width, renderer.domElement.height);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', () => {
      pausedRef.current = document.hidden;
      if (!pausedRef.current) lastRef.current = performance.now();
    });

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      if (mount && renderer.domElement) mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [seedInitialDroplets, fixedUpdate, syncToTexture, bgTexture, drawBackground, updateSize]);

  return (
    <div ref={mountRef} style={{ 
      position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw', 
      height: '100dvh'
    }} />
  );
};

export default WaterDropletsClock;