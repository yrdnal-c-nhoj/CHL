import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

const Clock = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Ground plane (clock face)
    const planeGeometry = new THREE.CircleGeometry(10, 64);
    const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x228B22, side: THREE.DoubleSide });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2; // Lay flat on the ground
    scene.add(plane);

    // Font loader for numbers
    const loader = new FontLoader();
    loader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
      const numberPositions = [
        { num: '12', x: 0, z: -9 },
        { num: '1', x: 4.5, z: -7.8 },
        { num: '2', x: 7.8, z: -4.5 },
        { num: '3', x: 9, z: 0 },
        { num: '4', x: 7.8, z: 4.5 },
        { num: '5', x: 4.5, z: 7.8 },
        { num: '6', x: 0, z: 9 },
        { num: '7', x: -4.5, z: 7.8 },
        { num: '8', x: -7.8, z: 4.5 },
        { num: '9', x: -9, z: 0 },
        { num: '10', x: -7.8, z: -4.5 },
        { num: '11', x: -4.5, z: -7.8 },
      ];

      numberPositions.forEach(({ num, x, z }) => {
        const textGeometry = new TextGeometry(num, {
          font: font,
          size: 1,
          height: 0.1,
        });
        const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        textMesh.position.set(x, 0.1, z); // Slightly above plane
        textMesh.rotation.x = -Math.PI / 2; // Face upward
        scene.add(textMesh);
      });
    });

    // Camera position: high up, slightly to one side, looking down
    camera.position.set(5, 10, 5);
    camera.lookAt(0, 0, 0);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Clock;