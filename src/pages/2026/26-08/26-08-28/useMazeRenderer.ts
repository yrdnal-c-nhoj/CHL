import { useEffect, type RefObject } from 'react';
import * as THREE from 'three';
import styles from './Clock.module.css';

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

type WallTransform = {
  x: number;
  z: number;
  horizontal: boolean;
};

/**
 * Encapsulates the Three.js infinite-maze renderer, including its render loop.
 * The rAF loop lives here (not in the clock component) so the component stays
 * declarative and compliant with CLOCK_CONTRACT.md §3.3 / §5.
 */
export const useMazeRenderer = (mountRef: RefObject<HTMLDivElement | null>) => {
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const fogColor = 0xc5c6c9;
    scene.fog = new THREE.Fog(fogColor, 40, 130);

    const camera = new THREE.PerspectiveCamera(
      85,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.4;

    container.appendChild(renderer.domElement);
    const canvasClass = styles.canvas;
    if (canvasClass) renderer.domElement.classList.add(canvasClass);

    const ambientLight = new THREE.AmbientLight(0x65789b, 1.5);
    const hemisphereLight = new THREE.HemisphereLight(0x7fbfff, 0x1a1a24, 1.2);
    const cameraLight = new THREE.PointLight(0x40a0ff, 4, 80);

    const cyanLight = new THREE.DirectionalLight(0x00ccff, 3.5);
    cyanLight.castShadow = true;
    cyanLight.shadow.mapSize.set(2048, 2048);

    const magentaLight = new THREE.DirectionalLight(0xff3399, 3.0);
    magentaLight.castShadow = true;
    magentaLight.shadow.mapSize.set(2048, 2048);

    scene.add(ambientLight, hemisphereLight, cyanLight, magentaLight, cameraLight);

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

    const unitBoxGeo = new THREE.BoxGeometry(1, 1, 1);
    const floorGeometry = new THREE.PlaneGeometry(1000, 1000);

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    const generateMaze = (chunkX: number, chunkZ: number): Cell[][] => {
      let seed = Math.abs(Math.floor(Math.sin(chunkX * 127.1 + chunkZ * 311.7) * 100000));
      const random = () => {
        seed = (seed * 1664525 + 1013904223) % 4294967296;
        return seed / 4294967296;
      };

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
        const neighbors = directions.filter((dir) => {
          const nx = current.x + dir.x;
          const nz = current.z + dir.z;
          return nx >= 0 && nx < GRID_SIZE && nz >= 0 && nz < GRID_SIZE && !grid[nz][nx].visited;
        });

        if (neighbors.length === 0) {
          stack.pop();
          continue;
        }

        const dir = neighbors[Math.floor(random() * neighbors.length)];
        const nx = current.x + dir.x;
        const nz = current.z + dir.z;

        grid[current.z][current.x][dir.wall] = false;
        grid[nz][nx][dir.opposite] = false;
        grid[nz][nx].visited = true;

        stack.push({ x: nx, z: nz });
      }

      const entrance = Math.floor(GRID_SIZE / 2);
      grid[0][entrance].north = false;
      grid[GRID_SIZE - 1][entrance].south = false;

      return grid;
    };

    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();

    const createMazeChunk = (chunkX: number, chunkZ: number): THREE.Group => {
      const group = new THREE.Group();
      group.position.set(chunkX * MAZE_SIZE, 0, chunkZ * MAZE_SIZE);

      const maze = generateMaze(chunkX, chunkZ);
      const walls: WallTransform[] = [];

      for (let z = 0; z < GRID_SIZE; z++) {
        for (let x = 0; x < GRID_SIZE; x++) {
          const cell = maze[z][x];
          const centerX = (x + 0.5) * CELL_SIZE - MAZE_SIZE / 2;
          const centerZ = (z + 0.5) * CELL_SIZE - MAZE_SIZE / 2;

          if (cell.north) walls.push({ x: centerX, z: centerZ - CELL_SIZE / 2, horizontal: true });
          if (cell.west) walls.push({ x: centerX - CELL_SIZE / 2, z: centerZ, horizontal: false });
          if (z === GRID_SIZE - 1 && cell.south) {
            walls.push({ x: centerX, z: centerZ + CELL_SIZE / 2, horizontal: true });
          }
          if (x === GRID_SIZE - 1 && cell.east) {
            walls.push({ x: centerX + CELL_SIZE / 2, z: centerZ, horizontal: false });
          }
        }
      }

      const wallInstances = new THREE.InstancedMesh(unitBoxGeo, wallMaterial, walls.length);
      const glowInstances = new THREE.InstancedMesh(unitBoxGeo, glowMaterial, walls.length);

      wallInstances.castShadow = true;
      wallInstances.receiveShadow = true;

      walls.forEach((w, i) => {
        position.set(w.x, WALL_HEIGHT / 2, w.z);
        scale.set(
          w.horizontal ? CELL_SIZE : WALL_THICKNESS,
          WALL_HEIGHT,
          w.horizontal ? WALL_THICKNESS : CELL_SIZE
        );
        matrix.compose(position, quaternion, scale);
        wallInstances.setMatrixAt(i, matrix);

        position.set(w.x, WALL_HEIGHT + 0.03, w.z);
        scale.set(
          w.horizontal ? CELL_SIZE * 0.98 : WALL_THICKNESS * 1.2,
          0.06,
          w.horizontal ? WALL_THICKNESS * 1.2 : CELL_SIZE * 0.98
        );
        matrix.compose(position, quaternion, scale);
        glowInstances.setMatrixAt(i, matrix);
      });

      wallInstances.instanceMatrix.needsUpdate = true;
      glowInstances.instanceMatrix.needsUpdate = true;

      group.add(wallInstances, glowInstances);
      return group;
    };

    const activeChunks = new Map<string, THREE.Group>();
    const renderDistanceX = 18;
    const renderDistanceZ = 16;

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

    let animationId: number;
    let lastTime = performance.now();
    const EYE_HEIGHT = 16.0;
    let cameraZ = 4;

    const animate = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const elapsed = now / 1000;

      cameraZ -= FLY_SPEED * delta;

      const driftX = Math.sin(elapsed * 0.22) * (MAZE_SIZE * 0.45);
      const bobY = Math.sin(elapsed * 1.2) * 0.35;

      camera.position.set(driftX, EYE_HEIGHT + bobY, cameraZ);
      camera.lookAt(driftX * 0.7, -2.0, cameraZ - 75);

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

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);

      scene.remove(floor);
      floor.geometry.dispose();
      floor.material.dispose();

      scene.remove(ambientLight, hemisphereLight, cyanLight, magentaLight, cameraLight);

      activeChunks.forEach((chunk) => {
        scene.remove(chunk);
        chunk.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((m) => m.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      });
      activeChunks.clear();

      unitBoxGeo.dispose();
      wallMaterial.dispose();
      glowMaterial.dispose();

      renderer.dispose();

      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [mountRef]);
};
