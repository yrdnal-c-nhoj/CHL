import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useClockTime } from '@/utils/clockUtils';

// --- Utilities ---

const formatHour = (date: Date): string => date.getHours().toString().padStart(2, '0');
const formatMinute = (date: Date): string => date.getMinutes().toString().padStart(2, '0');

/**
 * Updates a canvas with text for sphere mapping.
 * Uses the 0.25 and 0.75 horizontal positions to ensure text appears 
 * on "front" and "back" of the sphere.
 */
const updateSphereCanvas = (
  canvas: HTMLCanvasElement,
  text: string,
  bgColor: string,
  font: string
) => {
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add shadow for better readability
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
  ctx.shadowBlur = 15;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  ctx.fillStyle = '#E8E8E8';
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Draw twice so the number is visible from multiple angles
  ctx.fillText(text, canvas.width * 0.25, canvas.height / 2);
  ctx.fillText(text, canvas.width * 0.75, canvas.height / 2);

  // Reset shadow
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
};

// --- Component ---

const Clock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const time = useClockTime();
  
  // Refs to Three.js objects for direct updates without re-renders
  const planetMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const moonMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    background: 'radial-gradient(circle at 50% 50%, #ff6b6b 0%, #4ecdc4 25%, #45b7d1 50%, #96ceb4 75%, #ffeaa7 100%)',
  };

  const gradientOverlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #B3780A 0%, #90D809 100%)',
    opacity: 0.8,
    pointerEvents: 'none',
    zIndex: 1,
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let planet: THREE.Mesh;
    let moon: THREE.Mesh;
    let animationId: number;
    const threeClock = new THREE.Clock();

    const init = () => {
      // 1. Scene Setup
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.set(0, 5, 35);

      // 2. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const spotLight = new THREE.SpotLight('#ffffff', 1500); // Intensity adjusted for Three.js late versions
      spotLight.position.set(20, 40, 40);
      spotLight.angle = Math.PI / 6;
      spotLight.penumbra = 0.3;
      scene.add(spotLight);

      const fillLight = new THREE.PointLight(0xffffff, 500);
      fillLight.position.set(-20, -10, 20);
      scene.add(fillLight);

      // 3. Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      container.appendChild(renderer.domElement);

      // 4. Objects (Planet - Hours)
      const planetGeo = new THREE.SphereGeometry(10, 64, 64);
      const planetCanvas = document.createElement('canvas');
      planetCanvas.width = 1024; // Higher res for the big sphere
      planetCanvas.height = 512;
      
      const planetTex = new THREE.CanvasTexture(planetCanvas);
      const planetMat = new THREE.MeshStandardMaterial({ 
        map: planetTex,
        roughness: 0.4,
        metalness: 0.1 
      });
      
      planetMaterialRef.current = planetMat;
      planet = new THREE.Mesh(planetGeo, planetMat);
      planet.position.set(0, 2, -10);
      scene.add(planet);

      // 5. Objects (Moon - Minutes)
      const moonGeo = new THREE.SphereGeometry(3, 64, 64);
      const moonCanvas = document.createElement('canvas');
      moonCanvas.width = 512;
      moonCanvas.height = 256;
      
      const moonTex = new THREE.CanvasTexture(moonCanvas);
      const moonMat = new THREE.MeshStandardMaterial({ 
        map: moonTex,
        roughness: 0.3,
        metalness: 0.2 
      });
      
      moonMaterialRef.current = moonMat;
      moon = new THREE.Mesh(moonGeo, moonMat);
      scene.add(moon);

      // Initial Texture Draw
      const now = new Date();
      updateSphereCanvas(planetCanvas, formatHour(now), '#1034A6', '900 300px "Abril Fatface", serif');
      updateSphereCanvas(moonCanvas, formatMinute(now), '#FF4500', 'bold 120px "Space Mono", monospace');
      planetTex.needsUpdate = true;
      moonTex.needsUpdate = true;
    };

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsed = threeClock.getElapsedTime();

      // Slow rotation for the Planet
      if (planet) planet.rotation.y += 0.005;

      // Orbit logic for the Moon
      if (moon) {
        moon.rotation.y -= 0.02;
        moon.position.x = 22 * Math.cos(elapsed * 0.5);
        moon.position.z = 15 * Math.sin(elapsed * 0.5) - 10;
        moon.position.y = 2 + Math.sin(elapsed) * 2; // Slight vertical bobbing
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    // Ensure fonts are loaded before starting to avoid "jumping" fonts on canvas
    document.fonts.ready.then(() => {
      init();
      animate();
    });

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      renderer?.dispose();
      if (container.contains(renderer?.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update textures whenever the 'time' prop/hook changes
  useEffect(() => {
    const hourStr = formatHour(time);
    const minuteStr = formatMinute(time);

    if (planetMaterialRef.current?.map) {
      const tex = planetMaterialRef.current.map as THREE.CanvasTexture;
      updateSphereCanvas(tex.image, hourStr, '#1034A6', '900 300px "Abril Fatface", serif');
      // Apply silver color
      const canvas = tex.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#E8E8E8';
      ctx.fillText(hourStr, canvas.width * 0.25, canvas.height / 2);
      ctx.fillText(hourStr, canvas.width * 0.75, canvas.height / 2);
      tex.needsUpdate = true;
    }

    if (moonMaterialRef.current?.map) {
      const tex = moonMaterialRef.current.map as THREE.CanvasTexture;
      updateSphereCanvas(tex.image, minuteStr, '#FF4500', 'bold 120px "Space Mono", monospace');
      // Apply silver color
      const canvas = tex.image as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#E8E8E8';
      ctx.fillText(minuteStr, canvas.width * 0.25, canvas.height / 2);
      ctx.fillText(minuteStr, canvas.width * 0.75, canvas.height / 2);
      tex.needsUpdate = true;
    }
  }, [time]);

  return (
    <div style={containerStyle}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Space+Mono:wght@700&display=swap');
      `}</style>
      <div style={gradientOverlayStyle}></div>
      <div 
        ref={containerRef} 
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 2 }} 
      />
    </div>
  );
};

export default Clock;