import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// Helper function to create clock drawer for a single canvas
const createClockDrawer = (canvas) => {
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  return () => {
    const now = new Date();
    const hrs = now.getHours();
    const mins = now.getMinutes();
    const secs = now.getSeconds();
    const ms = now.getMilliseconds();

    // White clock background
    ctx.fillStyle = '#AB9F9F';
    ctx.fillRect(0, 0, 512, 512);

    // Outer Rim
    ctx.strokeStyle = '#22222200';
    ctx.lineWidth = 0;
    ctx.beginPath();
    ctx.arc(256, 256, 220, 0, Math.PI * 2);
    ctx.stroke();

    // Hour Ticks
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#000000';
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      ctx.beginPath();
      ctx.moveTo(256 + Math.cos(angle) * 195, 256 + Math.sin(angle) * 195);
      ctx.lineTo(256 + Math.cos(angle) * 215, 256 + Math.sin(angle) * 215);
      ctx.stroke();
    }

    const drawHand = (angle, length, width, color) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(256, 256);
      ctx.lineTo(256 + Math.sin(angle) * length, 256 - Math.cos(angle) * length);
      ctx.stroke();
    };

    // Continuous, smooth calculations
    const secAngle = ((secs + ms / 1000) * Math.PI) / 30;
    const minAngle = ((mins + secs / 60) * Math.PI) / 30;
    const hrAngle = (((hrs % 12) + mins / 60) * Math.PI) / 6;

    drawHand(hrAngle, 110, 12, '#111111'); // Hour
    drawHand(minAngle, 160, 8, '#444444');  // Minute
    drawHand(secAngle, 185, 4, '#ff3333');  // Second

    // Center Node
    ctx.fillStyle = '#ff3333';
    ctx.beginPath();
    ctx.arc(256, 256, 10, 0, Math.PI * 2);
    ctx.fill();
  };
};

const PyramidMesh = () => {
  const meshRef = useRef();
  const textureRef = useRef(null);

  // 1. Isolate the geometry faces and correct UV mapping for the clock face
  const pyramidGeometry = useMemo(() => {
    // Create a 4-segmented cone and convert to separate independent triangles
    const geo = new THREE.ConeGeometry(2, 3, 4).toNonIndexed();
    geo.clearGroups();

    // Group 0: First triangle face (vertices 0-2) -> gets the Clock Material
    geo.addGroup(0, 3, 0);
    // Group 1: The remaining faces and base -> gets the Plain Material
    geo.addGroup(3, geo.attributes.position.count - 3, 1);

    // Remap UVs for the first face so the clock texture fits beautifully inside the triangle
    const pos = geo.attributes.position;
    const uv = geo.attributes.uv;
    const bottomVerts = [];

    for (let i = 0; i < 3; i++) {
      if (pos.getY(i) > 0) {
        // Apex/Top vertex maps to top-middle of texture
        uv.setXY(i, 0.5, 1);
      } else {
        bottomVerts.push(i);
      }
    }
    // Sort bottom vertices to assign bottom-left (0,0) and bottom-right (1,0) textures properly
    if (uv.getX(bottomVerts[0]) < uv.getX(bottomVerts[1])) {
      uv.setXY(bottomVerts[0], 0, 0);
      uv.setXY(bottomVerts[1], 1, 0);
    } else {
      uv.setXY(bottomVerts[0], 1, 0);
      uv.setXY(bottomVerts[1], 0, 0);
    }

    uv.needsUpdate = true;
    return geo;
  }, []);

  // 2. Generate exactly two materials (Clock vs Plain)
  const [materials] = useState(() => {
    // Material 0: Clock Face
    const canvas = document.createElement('canvas');
    const drawFn = createClockDrawer(canvas);
    const clockTexture = new THREE.CanvasTexture(canvas);
    
    textureRef.current = { texture: clockTexture, drawFn };

    const clockMat = new THREE.MeshStandardMaterial({
      map: clockTexture,
      roughness: 0.2,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    // Material 1: Plain Background for the rest of the pyramid
    const plainMat = new THREE.MeshStandardMaterial({
      color: '#222222',
      roughness: 0.5,
      metalness: 0.1,
      side: THREE.DoubleSide
    });

    return [clockMat, plainMat];
  });

  // Animation Loop
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.4;
    }

    // Update the single clock texture smoothly
    if (textureRef.current) {
      textureRef.current.drawFn();
      textureRef.current.texture.needsUpdate = true;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={pyramidGeometry}
      material={materials}
    >
      {/*
        The clock is applied only to Material index 0 (first triangle face group).
        The other faces use Material index 1 (plain), but remain visible while the pyramid rotates.
      */}
    </mesh>
  );
};

export default function SpinningPyramid() {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundImage: 'linear-gradient(135deg, #F3F363 0%, #DD9174 50%, #D2AB11 100%)',
        backgroundColor: '#7D7781',
      }}
    >
      <Canvas camera={{ position: [0, 0, 5.5], fov: 55 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[5, 8, 5]} intensity={2.6} />
        <directionalLight position={[-5, -2, -5]} intensity={2.4} />

        <PyramidMesh />

        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  );
}