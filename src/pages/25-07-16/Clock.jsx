import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import georgiaFont from './mob.otf';

const MobiusClock = () => {
  const containerRef = useRef();

  useEffect(() => {
    // Inject @font-face dynamically
    const fontFace = new FontFace('Georgia', `url(${georgiaFont})`);
    fontFace.load().then((loadedFont) => {
      document.fonts.add(loadedFont);
    });

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0);
    containerRef.current.appendChild(renderer.domElement);

    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 512;
    clockCanvas.height = 128;
    const clockContext = clockCanvas.getContext('2d');

    const clockTexture = new THREE.CanvasTexture(clockCanvas);
    clockTexture.minFilter = THREE.LinearFilter;
    clockTexture.wrapS = THREE.RepeatWrapping;
    clockTexture.wrapT = THREE.RepeatWrapping;

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

    const mobiusInner = new THREE.Mesh(geometry.clone(), material.clone());
    mobiusInner.scale.set(2.5, 2.5, 2.5);
    scene.add(mobiusInner);

    scene.add(new THREE.AmbientLight(0x404040));
    const pointLight = new THREE.PointLight(0xffffff, 1.2);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    let lastMinute = null;
    let timeString = '';

    function updateClockTexture() {
      const now = new Date();
      const currentMinute = now.getMinutes();
      let currentHour = now.getHours();
      const ampm = currentHour >= 12 ? 'PM' : 'AM';
      currentHour = currentHour % 12 || 12;

      if (currentMinute !== lastMinute) {
        lastMinute = currentMinute;
        const hourStr = currentHour.toString();
        const minuteStr = currentMinute.toString().padStart(2, '0');
        timeString = `${hourStr}:${minuteStr} ${ampm}`;
      }

      clockContext.clearRect(0, 0, clockCanvas.width, clockCanvas.height);
      clockContext.fillStyle = 'rgba(255,255,255,0.6)';
      clockContext.fillRect(0, 0, clockCanvas.width, clockCanvas.height);

      const fontSize = clockCanvas.width / 4.5;
      clockContext.font = `${fontSize}px Georgia`;
      clockContext.fillStyle = '#000000';
      clockContext.textBaseline = 'middle';
      clockContext.textAlign = 'left';
      clockContext.fillText(timeString, 10, clockCanvas.height / 2);

      clockTexture.needsUpdate = true;
    }

    function animate() {
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
    }

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      containerRef.current.innerHTML = '';
    };
  }, []);

  const containerStyle = {
    height: '100vh',
    width: '100vw',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    background: 'radial-gradient(circle at center, #627c8f 0%, #7a7127 100%)',
  };

  return <div ref={containerRef} style={containerStyle}></div>;
};

export default MobiusClock;
