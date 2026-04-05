import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useClockTime } from '@/utils/clockUtils';
import styles from './Clock.module.css';

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
      camera = new THREE.PerspectiveCamera(
        55,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      // Pull camera back further on mobile (narrow screens)
      const isMobile = window.innerWidth / window.innerHeight < 1;
      camera.position.set(0, 0, isMobile ? 80 : 30);

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
      planet.position.set(0, 0, 0);
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

      // Slow rotation for the Planet + gentle floating drift
      if (planet) {
        planet.rotation.y += 0.005;
        planet.position.x = Math.sin(elapsed * 0.3) * 2;
        planet.position.y = Math.cos(elapsed * 0.2) * 1.5;
      }

      // Orbit logic for the Moon - centered on planet
      if (moon) {
        moon.rotation.y -= 0.02;
        moon.position.x = 18 * Math.cos(elapsed * 0.5);
        moon.position.z = 18 * Math.sin(elapsed * 0.5);
        moon.position.y = Math.sin(elapsed) * 2;
      }

      renderer.render(scene, camera);
    };

    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      // Update camera Z on resize/rotation
      const isMobile = container.clientWidth / container.clientHeight < 1;
      camera.position.z = isMobile ? 80 : 30;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    // Wait for fonts to load before initializing to avoid fallback font on canvas
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
    <div className={styles.container}>
      <div className={styles.gradientOverlay} />
      <div ref={containerRef} className={styles.canvasContainer} />
    </div>
  );
};

export default Clock;