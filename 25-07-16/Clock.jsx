import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry.js';
import mobFontUrl from './mob.otf';

const MobiusStripClock = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Inject font
    const style = document.createElement('style');
    style.textContent = `
      @font-face {
        font-family: 'mob';
        src: url(${mobFontUrl}) format('opentype');
      }
    `;
    document.head.appendChild(style);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.display = 'block';
    containerRef.current.appendChild(renderer.domElement);

    // Clock texture
    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 512;
    clockCanvas.height = 128;
    const clockContext = clockCanvas.getContext('2d');
    const clockTexture = new THREE.CanvasTexture(clockCanvas);
    clockTexture.minFilter = THREE.LinearFilter;
    clockTexture.wrapS = THREE.RepeatWrapping;
    clockTexture.wrapT = THREE.RepeatWrapping;

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

    const geometry = new ParametricGeometry(mobiusFunction, 100, 20);
    const material = new THREE.MeshBasicMaterial({
      map: clockTexture,
      side: THREE.DoubleSide,
      emissive: 0xffffff,
      emissiveIntensity: 1,
    });

    const mobius = new THREE.Mesh(geometry, material);
    const mobiusInner = new THREE.Mesh(geometry.clone(), material.clone());
    mobiusInner.scale.set(2.5, 2.5, 2.5);

    scene.add(mobius);
    scene.add(mobiusInner);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let lastMinute = null;
    let timeString = '';

    const updateClockTexture = () => {
      const now = new Date();
      const minute = now.getMinutes();
      let hour = now.getHours();
      const ampm = hour >= 12 ? 'PM' : 'AM';
      hour = hour % 12 || 12;

      if (minute !== lastMinute) {
        lastMinute = minute;
        timeString = `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
      }

      clockContext.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
      clockContext.fillStyle = 'rgba(0, 0, 0, 0.5)';
      clockContext.fillRect(0, 0, clockCanvas.width, clockCanvas.height);

      const fontSize = Math.round(clockCanvas.width / 4.5);
      clockContext.font = `${fontSize}px mob`;
      clockContext.fillStyle = '#EFF1F1FF'; // Cyan text for high contrast
      clockContext.textAlign = 'left';
      clockContext.textBaseline = 'middle';
      clockContext.fillText(timeString, 10, clockCanvas.height / 2);

      clockTexture.needsUpdate = true;
    };

    const animate = () => {
      requestAnimationFrame(animate);

      mobius.rotation.x += 0.003;
      mobius.rotation.y += 0.005;
      mobius.rotation.z += 0.002;

      mobiusInner.rotation.x -= 0.002;
      mobiusInner.rotation.y -= 0.003;
      mobiusInner.rotation.z -= 0.001;

      controls.update();
      updateClockTexture();

      clockTexture.offset.x -= 0.002;
      if (clockTexture.offset.x < -1) clockTexture.offset.x += 1;

      renderer.render(scene, camera);
    };

    animate();

    let redraws = 0;
    const forceRedraw = () => {
      updateClockTexture();
      redraws++;
      if (redraws < 10) requestAnimationFrame(forceRedraw);
    };
    forceRedraw();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.head.removeChild(style);
      containerRef.current.removeChild(renderer.domElement);
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
    />
  );
};

export default MobiusStripClock;