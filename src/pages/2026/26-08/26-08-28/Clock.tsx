import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const MAZE_SIZE = 8;
const WALL_HEIGHT = 5;
const WALL_THICKNESS = 0.05;
const FLY_SPEED = 2.5;

const GRID_SIZE = 3;
const CELL_SIZE = MAZE_SIZE / GRID_SIZE;

type Cell = {
  visited: boolean;
  north: boolean;
  east: boolean;
  south: boolean;
  west: boolean;
};

export const InfiniteMaze: React.FC = () => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --------------------------------------------------
    // SCENE & CAMERA
    // --------------------------------------------------
    const scene = new THREE.Scene();
    const sceneColor = 0x0c0f17;
    scene.background = new THREE.Color(sceneColor);

    // Linear Fog creates a thick haze layer precisely tuned to mask distant chunk generation
    scene.fog = new THREE.Fog(sceneColor, 35, 120);

    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );

    // --------------------------------------------------
    // RENDERER
    // --------------------------------------------------
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.appendChild(renderer.domElement);

    // --------------------------------------------------
    // LIGHTING
    // --------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0x65789b, 1.5);
    scene.add(ambientLight);

    const hemisphereLight = new THREE.HemisphereLight(0x7fbfff, 0x1a1a24, 1.2);
    scene.add(hemisphereLight);

    const cyanLight = new THREE.DirectionalLight(0x00ccff, 3.5);
    cyanLight.castShadow = true;
    cyanLight.shadow.mapSize.set(2048, 2048);
    scene.add(cyanLight);

    const magentaLight = new THREE.DirectionalLight(0xff3399, 3.0);
    magentaLight.castShadow = true;
    magentaLight.shadow.mapSize.set(2048, 2048);
    scene.add(magentaLight);

    const cameraLight = new THREE.PointLight(0x40a0ff, 4, 80);
    scene.add(cameraLight);

    // --------------------------------------------------
    // MATERIALS & GEOMETRIES
    // --------------------------------------------------
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x485263,
      roughness: 0.38,
      metalness: 0.35,
      emissive: 0x091018,
      emissiveIntensity: 0.8,
    });

    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0xd0d5dd,
      roughness: 0.9,
      metalness: 0.05,
    });

    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0x00e1ff,
      transparent: true,
      opacity: 0.75,
    });

    const floorGeometry = new THREE.PlaneGeometry(1000, 1000);
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // --------------------------------------------------
    // PRNG PROCEDURAL MAZE GENERATOR
    // --------------------------------------------------
    const createRandom = (chunkX: number, chunkZ: number) => {
      let seed = Math.abs(
        Math.floor(Math.sin(chunkX * 127.1 + chunkZ * 311.7) * 100000)
      );
      return () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };
    };

    const generateMaze = (chunkX: number, chunkZ: number): Cell[][] => {
      const random = createRandom(chunkX, chunkZ);
      const grid: Cell[][] = Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => ({
          visited: false,
          north: true,
          east: true,
          south: true,
          west: true,
        }))
      );

      const stack: { x: number; z: number }[] = [];
      const startX = Math.floor(random() * GRID_SIZE);
      const startZ = Math.floor(random() * GRID_SIZE);

      grid[startZ][startX].visited = true;
      stack.push({ x: startX, z: startZ });

      const directions = [
        { x: 0, z: -1, wall: 'north', opposite: 'south' },
        { x: 1, z: 0, wall: 'east', opposite: 'west' },
        { x: 0, z: 1, wall: 'south', opposite: 'north' },
        { x: -1, z: 0, wall: 'west', opposite: 'east' },
      ] as const;

      while (stack.length > 0) {
        const current = stack[stack.length - 1];
        const neighbors = directions.filter((direction) => {
          const nx = current.x + direction.x;
          const nz = current.z + direction.z;
          return (
            nx >= 0 &&
            nx < GRID_SIZE &&
            nz >= 0 &&
            nz < GRID_SIZE &&
            !grid[nz][nx].visited
          );
        });

        if (neighbors.length === 0) {
          stack.pop();
          continue;
        }

        const direction =
          neighbors[Math.floor(random() * neighbors.length)];
        const nx = current.x + direction.x;
        const nz = current.z + direction.z;

        grid[current.z][current.x][direction.wall] = false;
        grid[nz][nx][direction.opposite] = false;
        grid[nz][nx].visited = true;

        stack.push({ x: nx, z: nz });
      }

      const entrance = Math.floor(GRID_SIZE / 2);
      grid[0][entrance].north = false;
      grid[GRID_SIZE - 1][entrance].south = false;

      return grid;
    };

    // --------------------------------------------------
    // CHUNK BUILDER
    // --------------------------------------------------
    const wallGeometryHorizontal = new THREE.BoxGeometry(
      CELL_SIZE,
      WALL_HEIGHT,
      WALL_THICKNESS
    );
    const wallGeometryVertical = new THREE.BoxGeometry(
      WALL_THICKNESS,
      WALL_HEIGHT,
      CELL_SIZE
    );
    const glowGeometryHorizontal = new THREE.BoxGeometry(
      CELL_SIZE * 0.98,
      0.06,
      WALL_THICKNESS * 1.2
    );
    const glowGeometryVertical = new THREE.BoxGeometry(
      WALL_THICKNESS * 1.2,
      0.06,
      CELL_SIZE * 0.98
    );

    const createWall = (
      group: THREE.Group,
      x: number,
      z: number,
      horizontal: boolean
    ) => {
      const wall = new THREE.Mesh(
        horizontal ? wallGeometryHorizontal : wallGeometryVertical,
        wallMaterial
      );
      wall.position.set(x, WALL_HEIGHT / 2, z);
      wall.castShadow = true;
      wall.receiveShadow = true;
      group.add(wall);

      const glow = new THREE.Mesh(
        horizontal ? glowGeometryHorizontal : glowGeometryVertical,
        glowMaterial
      );
      glow.position.set(x, WALL_HEIGHT + 0.03, z);
      group.add(glow);
    };

    const createMazeChunk = (chunkX: number, chunkZ: number) => {
      const group = new THREE.Group();
      group.position.set(chunkX * MAZE_SIZE, 0, chunkZ * MAZE_SIZE);

      const maze = generateMaze(chunkX, chunkZ);

      for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const cell = maze[z][x];
          const centerX = (x + 0.5) * CELL_SIZE - MAZE_SIZE / 2;
          const centerZ = (z + 0.5) * CELL_SIZE - MAZE_SIZE / 2;

          if (cell.north) createWall(group, centerX, centerZ - CELL_SIZE / 2, true);
          if (cell.west) createWall(group, centerX - CELL_SIZE / 2, centerZ, false);
          if (z === GRID_SIZE - 1 && cell.south) {
            createWall(group, centerX, centerZ + CELL_SIZE / 2, true);
          }
          if (x === GRID_SIZE - 1 && cell.east) {
            createWall(group, centerX + CELL_SIZE / 2, centerZ, false);
          }
        }
      }
      return group;
    };

    // --------------------------------------------------
    // CHUNK STREAMING (WIDE COVERAGE)
    // --------------------------------------------------
    const activeChunks = new Map<string, THREE.Group>();
    
    // Increased render distance to cover ultra-wide viewports
    const renderDistanceX = 18; // Left/Right width
    const renderDistanceZ = 16; // Forward/Backward depth

    const updateChunks = (currentX: number, currentZ: number) => {
      const centerChunkX = Math.floor(currentX / MAZE_SIZE);
      const centerChunkZ = Math.floor(currentZ / MAZE_SIZE);

      const needed = new Set<string>();

      for (let x = -renderDistanceX; x <= renderDistanceX; x++) {
        for (let z = -renderDistanceZ; z <= renderDistanceZ; z++) {
          const chunkX = centerChunkX + x;
          const chunkZ = centerChunkZ + z;
          const key = `${chunkX},${chunkZ}`;
          needed.add(key);

          if (!activeChunks.has(key)) {
            const chunk = createMazeChunk(chunkX, chunkZ);
            scene.add(chunk);
            activeChunks.set(key, chunk);
          }
        }
      }

      activeChunks.forEach((chunk, key) => {
        if (!needed.has(key)) {
          scene.remove(chunk);
          activeChunks.delete(key);
        }
      });
    };

    // --------------------------------------------------
    // ANIMATION & CAMERA TRAVERSAL
    // --------------------------------------------------
    const clock = new THREE.Clock();
    let cameraZ = 4;
    const EYE_HEIGHT = 16.0;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      cameraZ -= FLY_SPEED * delta;

      const driftX = Math.sin(elapsed * 0.22) * (MAZE_SIZE * 0.45);
      const bobY = Math.sin(elapsed * 1.2) * 0.35;

      const currentCameraY = EYE_HEIGHT + bobY;
      camera.position.set(driftX, currentCameraY, cameraZ);

      camera.lookAt(
        driftX * 0.7,
        -2.0,
        cameraZ - 75
      );

      cyanLight.position.set(-15, 30, cameraZ - 10);
      cyanLight.target.position.set(0, 0, cameraZ - 40);
      cyanLight.target.updateMatrixWorld();

      magentaLight.position.set(15, 28, cameraZ - 15);
      magentaLight.target.position.set(0, 0, cameraZ - 40);
      magentaLight.target.updateMatrixWorld();

      cameraLight.position.copy(camera.position);

      floor.position.set(0, 0, cameraZ);

      updateChunks(camera.position.x, camera.position.z);
      renderer.render(scene, camera);

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    // --------------------------------------------------
    // RESIZE & CLEANUP
    // --------------------------------------------------
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      activeChunks.forEach((chunk) => scene.remove(chunk));
      floorGeometry.dispose();
      wallGeometryHorizontal.dispose();
      wallGeometryVertical.dispose();
      glowGeometryHorizontal.dispose();
      glowGeometryVertical.dispose();
      wallMaterial.dispose();
      floorMaterial.dispose();
      glowMaterial.dispose();
      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100vw',
        height: '100dvh',
        overflow: 'hidden',
        margin: 0,
        padding: 0,
        backgroundColor: '#0c0f17',
      }}
    />
  );
};

export default InfiniteMaze;