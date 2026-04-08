import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let terrainGeometry: THREE.PlaneGeometry;
    let clock: THREE.Clock;
    let terrain: THREE.Mesh;
    let animationId: number;
    let timeoutDebounce: ReturnType<typeof setTimeout>;

    let frame = 0;
    let cameraDx = 0.05;
    let count = 0;
    let delta = 0;

    const init = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#F3F5F7');
      scene.fog = new THREE.Fog('#F1F1F4', 0.05, 50);

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
      camera.position.set(0, 1, 32);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      // Terrain
      terrainGeometry = new THREE.PlaneGeometry(70, 70, 20, 20);
      const terrainMaterial = new THREE.MeshBasicMaterial({ color: 0x11e0a, fog: true });
      terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
      terrain.rotation.x = -0.47 * Math.PI;
      terrain.rotation.z = THREE.MathUtils.degToRad(90);
      scene.add(terrain);

      const t_vertex_Array = terrainGeometry.getAttribute('position').array;
      (terrainGeometry.getAttribute('position') as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);

      terrainGeometry.setAttribute('myZ', new THREE.BufferAttribute(new Float32Array(t_vertex_Array.length / 3), 1));
      const t_myZ_Array = terrainGeometry.getAttribute('myZ').array as Float32Array;

      for (let i = 0; i < t_vertex_Array.length; i++) {
        t_myZ_Array[i] = THREE.MathUtils.randInt(0, 5);
      }

      // Terrain Lines
      const terrainLine = new THREE.LineSegments(
        terrainGeometry,
        new THREE.LineBasicMaterial({ color: '#f555ff', fog: false })
      );
      terrainLine.rotation.x = -0.47 * Math.PI;
      terrainLine.rotation.z = THREE.MathUtils.degToRad(90);
      scene.add(terrainLine);

    };

    const animate = () => {
      // Terrain Animation
      const t_vertex_Array = terrainGeometry.getAttribute('position').array as Float32Array;
      const t_myZ_Array = terrainGeometry.getAttribute('myZ').array as Float32Array;

      for (let i = 0; i < t_vertex_Array.length; i++) {
        if (i >= 210 && i <= 250) {
          t_vertex_Array[i * 3 + 2] = 0;
        } else {
          const myZ = t_myZ_Array?.[i] ?? 0;
          t_vertex_Array[i * 3 + 2] = Math.sin((i + count * 0.0003)) * (myZ - myZ * 0.5);
          count += 0.1;
        }
      }

      // Camera Movement
      camera.position.x += cameraDx;
      camera.position.y = -1.2 * (1 - Math.abs(frame / 2000 - 0.5) / 0.5);
      camera.lookAt(0, 0, 0);
      frame += 8;
      if (frame > 2000) frame = 0;
      if (camera.position.x > 18) cameraDx = -cameraDx;
      if (camera.position.x < -18) cameraDx = Math.abs(cameraDx);

      (terrainGeometry.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      renderer.render(scene, camera);
    };

    const limitFPS = (interval: number) => {
      const loop = () => {
        animationId = requestAnimationFrame(loop);
        delta += clock.getDelta();
        if (delta > interval) {
          animate();
          delta = delta % interval;
        }
      };
      loop();
    };

    const onWindowResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    const handleResize = () => {
      clearTimeout(timeoutDebounce);
      timeoutDebounce = setTimeout(onWindowResize, 80);
    };

    init();
    limitFPS(1 / 60);

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(timeoutDebounce);
      window.removeEventListener('resize', handleResize);
      if (renderer && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer?.dispose();
    };
  }, []);


  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.canvasContainer}></div>
    </div>
  );
};

export default Clock;
