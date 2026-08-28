import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAZE_SIZE = 12; // Units per maze chunk
const WALL_HEIGHT = 2.5;
const WALL_THICKNESS = 0.4;
const FLY_SPEED = 3.0;

export const InfiniteMaze: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050508);
    scene.fog = new THREE.FogExp2(0x050508, 0.025); // Soft atmospheric fade into horizon

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      200
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // --- Lighting Setup ---
    const ambientLight = new THREE.AmbientLight(0x1a1a24, 0.8);
    scene.add(ambientLight);

    // Left Light Source (Cyan / Cool Blue)
    const leftLight = new THREE.DirectionalLight(0x00d2ff, 2.5);
    leftLight.position.set(-20, 15, 0);
    leftLight.castShadow = true;
    leftLight.shadow.mapSize.width = 1024;
    leftLight.shadow.mapSize.height = 1024;
    scene.add(leftLight);

    // Right Light Source (Warm Magenta / Orange)
    const rightLight = new THREE.DirectionalLight(0xff5500, 2.5);
    rightLight.position.set(20, 15, 0);
    rightLight.castShadow = true;
    rightLight.shadow.mapSize.width = 1024;
    rightLight.shadow.mapSize.height = 1024;
    scene.add(rightLight);

    // --- Materials & Geometries ---
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x22252a,
      roughness: 0.4,
      metalness: 0.2,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x0a0b0d,
      roughness: 0.8,
      metalness: 0.1,
    });

    // Floor Mesh
    const floorGeometry = new THREE.PlaneGeometry(500, 500);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    scene.add(floorMesh);

    // --- Chunk Procedural Generation ---
    const activeChunks = new Map<string, THREE.Group>();

    const createMazeChunk = (chunkX: number, chunkZ: number): THREE.Group => {
      const chunkGroup = new THREE.Group();
      chunkGroup.position.set(chunkX * MAZE_SIZE, 0, chunkZ * MAZE_SIZE);

      // Simple grid-based wall placement using deterministic pseudo-random seed
      const seed = Math.sin(chunkX * 12.9898 + chunkZ * 78.233) * 43758.5453;
      const pseudoRandom = (offset: number) => {
        const x = Math.sin(seed + offset) * 10000;
        return x - Math.floor(x);
      };

      const wallGeometry = new THREE.BoxGeometry(MAZE_SIZE, WALL_HEIGHT, WALL_THICKNESS);

      // Grid walls within chunk
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (pseudoRandom(i * 3 + j) > 0.4) {
            const wall = new THREE.Mesh(wallGeometry, wallMaterial);
            wall.castShadow = true;
            wall.receiveShadow = true;

            const isRotated = pseudoRandom(i + j * 10) > 0.5;
            if (isRotated) wall.rotation.y = Math.PI / 2;

            const posX = (i - 1) * (MAZE_SIZE / 3);
            const posZ = (j - 1) * (MAZE_SIZE / 3);
            wall.position.set(posX, WALL_HEIGHT / 2, posZ);

            chunkGroup.add(wall);
          }
        }
      }

      return chunkGroup;
    };

    // --- Flight Controller ---
    let cameraZ = 0;
    const renderDistance = 6; // Chunks to render in each direction

    const updateChunks = (currentZ: number) => {
      const centerChunkZ = Math.floor(currentZ / MAZE_SIZE);
      const neededKeys = new Set<string>();

      for (let x = -renderDistance; x <= renderDistance; x++) {
        for (let z = -renderDistance; z <= renderDistance + 4; z++) {
          const chunkX = x;
          const chunkZ = centerChunkZ - z; // Generate ahead into the distance
          const key = `${chunkX},${chunkZ}`;
          neededKeys.add(key);

          if (!activeChunks.has(key)) {
            const chunk = createMazeChunk(chunkX, chunkZ);
            scene.add(chunk);
            activeChunks.set(key, chunk);
          }
        }
      }

      // Cleanup chunks that are out of range behind the camera
      activeChunks.forEach((chunk, key) => {
        if (!neededKeys.has(key)) {
          scene.remove(chunk);
          // Free geometry and material references in production loops
          activeChunks.delete(key);
        }
      });
    };

    // --- Animation Loop ---
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();

      // Advance camera position forward (into -Z)
      cameraZ -= FLY_SPEED * delta;

      // Gentle camera sway for floating effect
      const swayX = Math.sin(clock.getElapsedTime() * 0.5) * 1.5;
      const swayY = Math.cos(clock.getElapsedTime() * 0.8) * 0.5;

      camera.position.set(swayX, 6 + swayY, cameraZ);
      camera.lookAt(swayX * 0.5, 0, cameraZ - 20); // Look towards the horizon

      // Keep light sources relative to the flying camera position
      leftLight.position.set(-25 + swayX, 15, cameraZ - 10);
      leftLight.target.position.set(0, 0, cameraZ - 10);
      leftLight.target.updateMatrixWorld();

      rightLight.position.set(25 + swayX, 15, cameraZ - 10);
      rightLight.target.position.set(0, 0, cameraZ - 10);
      rightLight.target.updateMatrixWorld();

      // Keep floor aligned with flight
      floorMesh.position.z = cameraZ;

      updateChunks(cameraZ);

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };

    const animId = requestAnimationFrame(animate);

    // --- Window Resize Handling ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      container.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#050508',
      }}
    />
  );
};

export default InfiniteMaze;