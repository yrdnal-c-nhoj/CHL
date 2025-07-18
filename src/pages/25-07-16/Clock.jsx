import React, { useEffect, useRef } from 'react';
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';

const MobiusStrip = () => {
  const mountRef = useRef(null);
  const clockCanvasRef = useRef(null);

  useEffect(() => {
    // Create canvas for clock texture
    const clockCanvas = document.createElement('canvas');
    clockCanvas.width = 512;
    clockCanvas.height = 256;
    clockCanvasRef.current = clockCanvas;
    const ctx = clockCanvas.getContext('2d');

    // Function to update clock texture
    const updateClockTexture = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { hour12: true });

      // Clear canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, clockCanvas.width, clockCanvas.height);

      // Draw time
      ctx.font = 'bold 60px Arial';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(timeString, clockCanvas.width / 2, clockCanvas.height / 2);

      // Update texture
      texture.needsUpdate = true;
    };

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Möbius strip geometry
    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    const indices = [];
    const uv = [];

    const width = 0.5; // Width of the strip
    const segments = 100; // Number of segments along the strip
    const widthSegments = 10; // Number of segments across the width
    const textureRepeat = 7; // Repeat texture 7 times along the strip

    for (let i = 0; i <= segments; i++) {
      const u = (i / segments) * Math.PI * 2;
      for (let j = 0; j <= widthSegments; j++) {
        const v = (j / widthSegments) * width - width / 2;
        const x = (1 + v * Math.cos(u / 2)) * Math.cos(u);
        const y = (1 + v * Math.cos(u / 2)) * Math.sin(u);
        const z = v * Math.sin(u / 2);
        vertices.push(x, y, z);
        // Adjust UV mapping to repeat texture 7 times along u
        uv.push((i / segments) * textureRepeat, j / widthSegments);
      }
    }

    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < widthSegments; j++) {
        const a = i * (widthSegments + 1) + j;
        const b = a + 1;
        const c = (i + 1) * (widthSegments + 1) + j;
        const d = c + 1;
        indices.push(a, b, d);
        indices.push(a, d, c);
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    // Create texture from canvas
    const texture = new THREE.CanvasTexture(clockCanvas);
    texture.wrapS = THREE.RepeatWrapping; // Ensure texture repeats correctly
    const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    const mobius = new THREE.Mesh(geometry, material);
    scene.add(mobius);

    camera.position.z = 3;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      updateClockTexture(); // Update clock every frame
      mobius.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    // Update clock every second
    const clockInterval = setInterval(updateClockTexture, 1000);

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(clockInterval);
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div className="w-full h-screen bg-gray-900 flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
};

export default MobiusStrip;