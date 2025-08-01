import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import mobFontUrl from './mob.otf';

const MobiusStripClock = () => {
  const containerRef = useRef();
  const [timeString, setTimeString] = useState(''); // For accessibility

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    try {
      if (!renderer.getContext()) {
        containerRef.current.innerHTML = '<p>Sorry, WebGL is not supported.</p>';
        console.error('WebGL not supported');
        return;
      }
    } catch (error) {
      containerRef.current.innerHTML = '<p>Error initializing WebGL.</p>';
      console.error('Error initializing WebGL:', error);
      return;
    }

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace; // Fixed for Three.js >= r152
    renderer.domElement.style.cssText = 'width: 100vw; height: 100vh; display: block;';
    containerRef.current.appendChild(renderer.domElement);

    // Clock texture
    const clockCanvas = document.createElement('canvas');
    const dpr = window.devicePixelRatio || 1;
    clockCanvas.width = 512 * dpr;
    clockCanvas.height = 128 * dpr;
    const clockContext = clockCanvas.getContext('2d');
    if (!clockContext) {
      console.error('Canvas context not supported');
      return;
    }
    clockContext.scale(dpr, dpr);
    const clockTexture = new THREE.CanvasTexture(clockCanvas);
    clockTexture.minFilter = THREE.LinearFilter;
    clockTexture.wrapS = THREE.RepeatWrapping;
    clockTexture.wrapT = THREE.RepeatWrapping;

    // Font setup
    let fontLoaded = false;
    const loadFont = async () => {
      try {
        const fontFace = new FontFace('mob', `url(${mobFontUrl})`);
        await fontFace.load();
        document.fonts.add(fontFace);
        fontLoaded = true;
      } catch (error) {
        console.warn('Font loading failed, using fallback:', error);
        fontLoaded = false;
      }
    };

    // Möbius strip
    const mobiusFunction = (u, v, target) => {
      const r = 1;
      const w = 0.2;
      const theta = u * Math.PI * 2;
      const t = v * 2 - 1;
      const x = (r + w * t * Math.cos(theta / 2)) * Math.cos(theta);
      const y = (r + w * t * Math.cos(theta / 2)) * Math.sin(theta);
      const z = w * t * Math.sin(theta / 2);
      target.set(x, y, z);
    };

    const geometry = new ParametricGeometry(mobiusFunction, 50, 10); // Reduced segments for performance
    const material = new THREE.MeshBasicMaterial({
      map: clockTexture,
      side: THREE.DoubleSide,
      emissive: 0xffffff,
      emissiveIntensity: 1,
    });

    const mobius = new THREE.Mesh(geometry, material);
    const mobiusInner = new THREE.Mesh(geometry.clone(), material.clone());
    mobiusInner.scale.set(2.5, 2.5, 2.5);
    scene.add(mobius, mobiusInner);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.minDistance = 2;
    controls.maxDistance = 5;

    // Clock update
    let lastMinute = null;
    const updateClockTexture = () => {
      const now = new Date();
      const minute = now.getMinutes();
      let hour = now.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;

      if (minute !== lastMinute) {
        lastMinute = minute;
        const newTimeString = `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        setTimeString(newTimeString); // Update for accessibility

        clockContext.clearRect(0, 0, clockCanvas.width / dpr, clockCanvas.height / dpr);
        clockContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
        clockContext.fillRect(0, 0, clockCanvas.width / dpr, clockCanvas.height / dpr);

        const fontSize = Math.min(clockCanvas.width / dpr / 4.5, clockCanvas.height / dpr);
        clockContext.font = `${fontSize}px ${fontLoaded ? 'mob' : 'Arial'}`;
        clockContext.fillStyle = '#EFF1F1FF';
        clockContext.textAlign = 'left';
        clockContext.textBaseline = 'middle';
        clockContext.fillText(newTimeString, 10, (clockCanvas.height / dpr) / 2);

        clockTexture.needsUpdate = true;
      }
    };

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      mobius.rotation.x += 0.003;
      mobius.rotation.y += 0.005;
      mobius.rotation.z += 0.002;
      mobiusInner.rotation.x -= 0.002;
      mobiusInner.rotation.y -= 0.003;
      mobiusInner.rotation.z -= 0.001;
      controls.update();
      clockTexture.offset.x -= 0.002;
      if (clockTexture.offset.x < -1) clockTexture.offset.x += 1;
      renderer.render(scene, camera);
    };

    // Start animation and clock updates
    loadFont().then(() => {
      updateClockTexture(); // Initial update after font loading
      animate();
      const timeUpdateInterval = setInterval(updateClockTexture, 1000);

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };
      window.addEventListener('resize', handleResize);

      // Cleanup
      return () => {
        clearInterval(timeUpdateInterval);
        window.removeEventListener('resize', handleResize);
        if (containerRef.current) {
          containerRef.current.removeChild(renderer.domElement);
        }
        geometry.dispose();
        material.dispose();
        clockTexture.dispose();
        renderer.dispose();
      };
    });

    // Initial font style injection (for compatibility)
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'mob';
        src: url(${mobFontUrl}) format('opentype');
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        background: 'radial-gradient(circle at center, #ff5978 0%, #8000ff 100%)',
      }}
    >
      <span style={{ display: 'none' }} aria-live="polite">
        {timeString}
      </span>
    </div>
  );
};

export default MobiusStripClock;