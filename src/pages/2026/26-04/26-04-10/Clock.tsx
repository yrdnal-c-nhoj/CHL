import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import styles from './Clock.module.css';

const Clock: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    let renderer: THREE.WebGLRenderer;
    let camera: THREE.PerspectiveCamera;
    let scene: THREE.Scene;
    let planet: THREE.Mesh;
    let moon: THREE.Mesh;
    let sphereBg: THREE.Mesh;
    let terrainGeometry: THREE.PlaneGeometry;
    let clock: THREE.Clock;
    let linesGeometry: THREE.BufferGeometry;
    let l_positionAttr: THREE.BufferAttribute;
    let terrain: THREE.Mesh;
    let lines: THREE.LineSegments;
    let animationId: number;
    let timeoutDebounce: ReturnType<typeof setTimeout>;

    const lineTotal = 1000;
    let frame = 0;
    let cameraDx = 0.05;
    let count = 0;
    let t = 0;
    let delta = 0;

    const init = () => {
      scene = new THREE.Scene();
      scene.background = new THREE.Color('#000000');
      scene.fog = new THREE.Fog('#3c1e02', 0.5, 50);

      camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.01, 1000);
      camera.position.set(0, 1, 32);

      const pointLight1 = new THREE.PointLight('#ffffff', 1, 0);
      pointLight1.position.set(0, 30, 30);
      scene.add(pointLight1);

      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(renderer.domElement);

      clock = new THREE.Clock();

      const loader = new THREE.TextureLoader();

      // Planet
      const texturePlanet = loader.load('https://i.ibb.co/h94JBXy/saturn3-ljge5g.jpg');
      texturePlanet.anisotropy = 16;
      const planetGeometry = new THREE.SphereGeometry(10, 50, 50);
      const planetMaterial = new THREE.MeshLambertMaterial({ map: texturePlanet, fog: false });
      planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planet.position.set(0, 8, -30);
      scene.add(planet);

      // Moon
      const textureMoon = loader.load('https://i.ibb.co/64zn361/moon-ndengb.jpg');
      textureMoon.anisotropy = 16;
      const moonGeometry = new THREE.SphereGeometry(2, 32, 32);
      const moonMaterial = new THREE.MeshPhongMaterial({ map: textureMoon, fog: false });
      moon = new THREE.Mesh(moonGeometry, moonMaterial);
      moon.position.set(0, 8, 0);
      scene.add(moon);

      // Sphere Background
      const textureSphereBg = loader.load('https://i.ibb.co/JCsHJpp/stars2-qx9prz.jpg');
      textureSphereBg.anisotropy = 16;
      const geometrySphereBg = new THREE.SphereGeometry(150, 32, 32);
      const materialSphereBg = new THREE.MeshBasicMaterial({ side: THREE.BackSide, map: textureSphereBg, fog: false });
      sphereBg = new THREE.Mesh(geometrySphereBg, materialSphereBg);
      sphereBg.position.set(0, 50, 0);
      scene.add(sphereBg);

      // Terrain
      terrainGeometry = new THREE.PlaneGeometry(70, 70, 20, 20);
      const terrainMaterial = new THREE.MeshBasicMaterial({ color: 0x3c1e02, fog: true });
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
        new THREE.LineBasicMaterial({ color: '#fff', fog: false })
      );
      terrainLine.rotation.x = -0.47 * Math.PI;
      terrainLine.rotation.z = THREE.MathUtils.degToRad(90);
      scene.add(terrainLine);

      // Stars
      linesGeometry = new THREE.BufferGeometry();
      linesGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6 * lineTotal), 3));
      linesGeometry.setAttribute('velocity', new THREE.BufferAttribute(new Float32Array(2 * lineTotal), 1));

      const l_vertex_Array = linesGeometry.getAttribute('position').array as Float32Array;
      const l_velocity_Array = linesGeometry.getAttribute('velocity').array as Float32Array;

      for (let i = 0; i < lineTotal; i++) {
        let x = THREE.MathUtils.randInt(-100, 100);
        let y = THREE.MathUtils.randInt(10, 40);
        if (x < 7 && x > -7 && y < 20) x += 14;
        let z = THREE.MathUtils.randInt(0, -300);

        l_vertex_Array[6 * i + 0] = l_vertex_Array[6 * i + 3] = x;
        l_vertex_Array[6 * i + 1] = l_vertex_Array[6 * i + 4] = y;
        l_vertex_Array[6 * i + 2] = l_vertex_Array[6 * i + 5] = z;

        l_velocity_Array[2 * i] = l_velocity_Array[2 * i + 1] = 0;
      }

      const starsMaterial = new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.5, fog: false });
      lines = new THREE.LineSegments(linesGeometry, starsMaterial);
      (linesGeometry.getAttribute('position') as THREE.BufferAttribute).setUsage(THREE.DynamicDrawUsage);
      scene.add(lines);

      l_positionAttr = linesGeometry.getAttribute('position') as THREE.BufferAttribute;
    };

    const animate = () => {
      planet.rotation.y += 0.002;
      sphereBg.rotation.x += 0.002;
      sphereBg.rotation.y += 0.002;
      sphereBg.rotation.z += 0.002;

      // Moon Animation
      moon.rotation.y -= 0.007;
      moon.rotation.x -= 0.007;
      moon.position.x = 15 * Math.cos(t) + 0;
      moon.position.z = 20 * Math.sin(t) - 35;
      t += 0.015;

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

      // Stars Animation
      const l_vertex_Array = linesGeometry.getAttribute('position').array as Float32Array;
      const l_velocity_Array = linesGeometry.getAttribute('velocity').array as Float32Array;

      for (let i = 0; i < lineTotal; i++) {
        const vel0 = l_velocity_Array?.[2 * i] ?? 0;
        const vel1 = l_velocity_Array?.[2 * i + 1] ?? 0;
        l_velocity_Array[2 * i] = vel0 + 0.0049;
        l_velocity_Array[2 * i + 1] = vel1 + 0.005;

        l_vertex_Array[6 * i + 2] += l_velocity_Array[2 * i];
        l_vertex_Array[6 * i + 5] += l_velocity_Array[2 * i + 1];

        if (l_vertex_Array[6 * i + 2] > 50) {
          l_vertex_Array[6 * i + 2] = l_vertex_Array[6 * i + 5] = THREE.MathUtils.randInt(-200, 10);
          l_velocity_Array[2 * i] = 0;
          l_velocity_Array[2 * i + 1] = 0;
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

      l_positionAttr.needsUpdate = true;
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

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div className={styles.container}>
      <div ref={containerRef} className={styles.canvasContainer}></div>
      <button className={styles.fullscreenBtn} onClick={toggleFullscreen}>
        {isFullscreen ? 'Exit Fullscreen' : 'Go Fullscreen'}
      </button>
    </div>
  );
};

export default Clock;
