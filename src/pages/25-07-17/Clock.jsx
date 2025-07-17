import React, { useEffect, useRef } from 'react';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.module.js';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/jsm/controls/OrbitControls.js';
import './Georgia.ttf'; // Assuming Georgia.ttf is in the same folder

const MobiusClock = () => {
  const canvasRef = useRef(null);
  const clockCanvasRef = useRef(document.createElement('canvas'));
  const lastMinuteRef = useRef(null);
  const timeStringRef = useRef('');

  useEffect(() => {
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, canvas: canvasRef.current });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // Clock canvas setup
    clockCanvasRef.current.width = 51.2 * 16; // Equivalent to 512px in rem (assuming 1rem = 10px for simplicity)
    clockCanvasRef.current.height = 12.8 * 16; // Equivalent to 128px in rem
    const clockContext = clockCanvasRef.current.getContext('2d');
    const clockTexture = new THREE.CanvasTexture(clockCanvasRef.current);
    clockTexture.minFilter = THREE.LinearFilter;
    clockTexture.wrapS = THREE.RepeatWrapping;
    clockTexture.wrapT = THREE.RepeatWrapping;

    // Möbius strip geometry
    const geometry = new THREE.ParametricGeometry((u, v, target) => {
      const r = 1;
      const w = 0.2;
      const theta = u * Math.PI * 2;
      const t = v * 2 - 1;
      const x = (r + w * t * Math.cos(theta / 2)) * Math.cos(theta);
      const y = (r + w * t * Math.cos(theta / 2)) * Math.sin(theta);
      const z = w * t * Math.sin(theta / 2);
      target.set(x, y, z);
    }, 100, 20);

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: clockTexture,
      side: THREE.DoubleSide,
      metalness: 0.2,
      roughness: 0.3,
    });

    const mobius = new THREE.Mesh(geometry, material);
    scene.add(mobius);

    // Lighting
    scene.add(new THREE.AmbientLight(0x404040));
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 3;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Clock texture update
    const updateClockTexture = () => {
      const now = new Date();
      const currentMinute = now.getMinutes();
      let currentHour = now.getHours();
      const ampm = currentHour >= 12 ? 'PM' : 'AM';
      currentHour = currentHour % 12 || 12;

      if (currentMinute !== lastMinuteRef.current) {
        lastMinuteRef.current = currentMinute;
        const hourStr = currentHour.toString();
        const minuteStr = currentMinute.toString().padStart(2, '0');
        timeStringRef.current = `${hourStr}:${minuteStr} ${ampm}`;
      }

      clockContext.clearRect(0, 0, clockCanvasRef.current.width, clockCanvasRef.current.height);
      clockContext.fillStyle = 'rgba(255, 255, 255, 0.6)';
      clockContext.fillRect(0, 0, clockCanvasRef.current.width, clockCanvasRef.current.height);
      clockContext.font = `${51.2 / 4.5}rem Georgia`; // Font size adjusted to rem
      clockContext.fillStyle = '#000000';
      clockContext.textBaseline = 'middle';
      clockContext.textAlign = 'left';
      clockContext.fillText(timeStringRef.current, 1, clockCanvasRef.current.height / 2);
      clockTexture.needsUpdate = true;
    };

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      mobius.rotation.x += 0.003;
      mobius.rotation.y += 0.005;
      mobius.rotation.z += 0.002;
      controls.update();
      updateClockTexture();
      clockTexture.offset.x -= 0.002;
      if (clockTexture.offset.x < -1) {
        clockTexture.offset.x += 1;
      }
      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100vw',
        height: '100vh',
        background: 'radial-gradient(circle at center, #e39dd8 0%, #ffee69 100%)',
      }}
    />
  );
};

export default MobiusClock;