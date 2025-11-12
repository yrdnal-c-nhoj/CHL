import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import backgroundImage from './bg1.jpg';
import customFont from './oct.ttf'; // Vite will handle this as a blob

export default function OctahedronWithOverlay() {
  const mountRef = useRef(null);

  useEffect(() => {
    // --- Inject font for overlay text only ---
    const style = document.createElement('style');
    style.innerHTML = `
      @font-face {
        font-family: 'CustomFundy';
        src: url('${customFont}') format('truetype');
        font-weight: normal;
        font-style: normal;
      }
      .overlay-text {
        font-family: 'CustomFundy', sans-serif;
      }
    `;
    document.head.appendChild(style);

    // --- THREE.js setup ---
    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mountRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.OctahedronGeometry(2);
    const material = new THREE.MeshPhongMaterial({ color: 0x00ff88, shininess: 100, transparent: true, opacity: 0.7 });
    const octahedron = new THREE.Mesh(geometry, material);
    scene.add(octahedron);

    const wireframe = new THREE.LineSegments(new THREE.WireframeGeometry(geometry));
    wireframe.material.color.setHex(0x000000);
    wireframe.material.transparent = true;
    wireframe.material.opacity = 0.3;
    octahedron.add(wireframe);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      octahedron.rotation.x += 0.01;
      octahedron.rotation.y += 0.01;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      material.dispose();
      wireframe.geometry.dispose();
      renderer.dispose();
      document.head.removeChild(style);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay HTML text */}
      <div
        className="overlay-text"
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          color: '#00ff88',
          fontSize: '2rem',
          zIndex: 10,
          pointerEvents: 'none', // ensures clicks go through to canvas if needed
        }}
      >
        ✨ Windsurf Command ⭐
      </div>
    </div>
  );
}
