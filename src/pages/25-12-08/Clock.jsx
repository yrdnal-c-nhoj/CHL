// src/pages/25-12-07/Clock.jsx
import React, { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import plaidImage from './h2o.webp'

const Icosahedron = () => {
  const size = 2.5
  const groupRef = useRef()

  // Add time state for analog clock
  const [time, setTime] = React.useState(() => new Date())

  React.useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate clock hand rotations
  const secondsDegrees = (time.getSeconds() / 60) * 360
  const minutesDegrees =
    ((time.getMinutes() * 60 + time.getSeconds()) / 3600) * 360
  const hoursDegrees =
    ((time.getHours() % 12) / 12) * 360 + (time.getMinutes() / 60) * 30

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.5
      groupRef.current.rotation.y += delta * 0.7
      groupRef.current.rotation.z += delta * 0.3
    }
  })

  // Create different colors for each triangular face
  const coloredGeometry = React.useMemo(() => {
    const geometry = new THREE.IcosahedronGeometry(size, 0)

    // Create 20 clearly different colors - all different hues
    const distinctColors = [
      '#FF0000',
      '#FF6600',
      '#FFD700',
      '#FFFF00',
      '#ADFF2F',
      '#00FF00',
      '#00FFFF',
      '#0000FF',
      '#8A2BE2',
      '#FF1493',
      '#FF69B4',
      '#DC143C',
      '#FF6347',
      '#FFA07A',
      '#FA8072',
      '#F0E68C',
      '#90EE90',
      '#87CEEB',
      '#9370DB',
      '#DDA0DD'
    ]

    // For icosahedron (20 faces), each triangle gets its own material
    // Create groups to assign different materials to different faces
    const groups = []
    for (let i = 0; i < 20; i++) {
      groups.push({
        start: i * 3, // Each triangle has 3 vertices/indices
        count: 3,
        materialIndex: i
      })
    }
    geometry.groups = groups

    // Create materials for each group - all facets at 30% opacity
    const materials = distinctColors.map(
      color =>
        new THREE.MeshStandardMaterial({
          color: color,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.3
        })
    )

    return { geometry, materials }
  }, [])

  return (
    <group ref={groupRef}>
      {/* Icosahedron with 20 different colored triangular faces */}
      <mesh
        geometry={coloredGeometry.geometry}
        material={coloredGeometry.materials}
      />

      {/* Create a completely opaque, full-color interior version */}
      <mesh
        geometry={coloredGeometry.geometry}
        material={coloredGeometry.materials}
        scale={[0.98, 0.98, 0.98]}
        renderOrder={1}
      />

      {/* Wireframe edges for visibility */}
      <lineSegments scale={1.01}>
        <edgesGeometry args={[coloredGeometry.geometry]} />
        <lineBasicMaterial
          color='black'
          linewidth={2}
          transparent
          opacity={0.6}
        />
      </lineSegments>

      {/* Analog Clock in the center */}
      <group>
        {/* Clock face background */}
        <mesh position={[0, 0, 0.1]}>
          <cylinderGeometry args={[0.8, 0.8, 0.02, 32]} />
          <meshBasicMaterial color='#ffffff' />
        </mesh>

        {/* Main hour markers: 12, 3, 6 - made big */}
        {[0, 3, 6].map(i => {
          const angle = (i * 30 * Math.PI) / 180
          const radius = 0.65
          const x = Math.sin(angle) * radius
          const z = Math.cos(angle) * radius

          return (
            <mesh key={i} position={[x, 0, z + 0.01]}>
              <boxGeometry args={[0.12, 0.08, 0.01]} />
              <meshBasicMaterial color='black' />
            </mesh>
          )
        })}

        {/* Clock Hands */}
        <mesh
          position={[0, 0, 0.12]}
          rotation={[0, 0, (secondsDegrees * Math.PI) / 180]}
        >
          <boxGeometry args={[0.005, 0.65, 0.005]} />
          <meshBasicMaterial color='red' />
        </mesh>

        <mesh
          position={[0, 0, 0.13]}
          rotation={[0, 0, (minutesDegrees * Math.PI) / 180]}
        >
          <boxGeometry args={[0.02, 0.55, 0.01]} />
          <meshBasicMaterial color='black' />
        </mesh>

        <mesh
          position={[0, 0, 0.14]}
          rotation={[0, 0, (hoursDegrees * Math.PI) / 180]}
        >
          <boxGeometry args={[0.03, 0.4, 0.01]} />
          <meshBasicMaterial color='black' />
        </mesh>

        {/* Center hub */}
        <mesh position={[0, 0, 0.15]}>
          <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
          <meshBasicMaterial color='black' />
        </mesh>
      </group>
    </group>
  )
}

export default function Clock () {
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0,
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `url(${plaidImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter:
            'contrast(0.1) brightness(1.8) hue-rotate(35deg) saturate(6.2)',
          zIndex: 0
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{
          background: 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1
        }}
      >
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} intensity={1.5} color='#6CF373FF' />

        <Icosahedron />

        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  )
}
