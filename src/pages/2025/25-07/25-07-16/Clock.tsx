import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import { useMultipleFontLoader } from '../../../../utils/fontLoader';
import mobFontUrl from '../../../../assets/fonts/2025/25-07-16-mob.otf';

const MobiusStripClock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [timeString, setTimeString] = useState<string>('');

  const fontConfigs = [{ fontFamily: 'mob', fontUrl: mobFontUrl }];
  const fontsLoaded = useMultipleFontLoader(fontConfigs);

  useEffect(() => {
    // Wait until fonts are ready and container exists
    if (!fontsLoaded || !containerRef.current) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap DPR for performance
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // --- Canvas Texture ---
    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 1024; // Higher res for the strip
    clockCanvas.height = 256;
    const ctx = clockCanvas.getContext('2d');
    const clockTexture = new THREE.CanvasTexture(clockCanvas);
    clockTexture.wrapS = THREE.RepeatWrapping;

    // --- Möbius Geometry ---
    const mobiusFunc = (u: number, v: number, target: THREE.Vector3) => {
      const r = 1.5;
      const w = 0.4;
      const theta = u * Math.PI * 2;
      const t = v * 2 - 1;
      const x = (r + w * t * Math.cos(theta / 2)) * Math.cos(theta);
      const y = (r + w * t * Math.cos(theta / 2)) * Math.sin(theta);
      const z = w * t * Math.sin(theta / 2);
      target.set(x, y, z);
    };

    const geometry = new ParametricGeometry(mobiusFunc, 100, 20);
    const material = new THREE.MeshBasicMaterial({ 
      map: clockTexture, 
      side: THREE.DoubleSide,
      transparent: true 
    });

    const mobius = new THREE.Mesh(geometry, material);
    scene.add(mobius);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- Update Logic ---
    let animationFrameId: number;
    
    const updateClock = () => {
      const now = new Date();
      const displayTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      
      if (ctx) {
        ctx.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
        // Draw background for the text path
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.fillRect(0, 0, clockCanvas.width, clockCanvas.height);
        
        // Draw Text
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 120px mob, Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        // Repeat the time across the texture so it's always visible on the strip
        ctx.fillText(displayTime, clockCanvas.width / 4, clockCanvas.height / 2);
        ctx.fillText(displayTime, (3 * clockCanvas.width) / 4, clockCanvas.height / 2);
        
        clockTexture.needsUpdate = true;
      }
      setTimeString(displayTime);
    };

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      mobius.rotation.y += 0.005;
      mobius.rotation.z += 0.002;
      
      // Infinite scroll effect
      clockTexture.offset.x -= 0.001;
      
      controls.update();
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    // --- Start ---
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    animate();
    window.addEventListener('resize', handleResize);

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(clockInterval);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      clockTexture.dispose();
      renderer.dispose();
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, [fontsLoaded]); // Re-run when fonts actually load

  return (
    <div ref={containerRef} style={{ width: '100vw', height: '100dvh', background: 'radial-gradient(circle, #ff5978, #8000ff)' }}>
      <span className="sr-only" aria-live="polite" style={{ position: 'absolute', opacity: 0 }}>
        {timeString}
      </span>
    </div>
  );
};

export default MobiusStripClock;