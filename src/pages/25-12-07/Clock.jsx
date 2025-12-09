// IcosahedronScene.jsx
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import backgroundImage from './h2o.webp'
import fontFile from './water.otf' // ← make sure this is .woff2 (or .woff)

export default function IcosahedronScene () {
  // Proper font preloading + @font-face
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = fontFile
    document.head.appendChild(link)

    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'WaterFont';
        src: url('${fontFile}') format('woff2');
        font-display: swap;
      }
      @keyframes ripple {
        0%   { background-position: 0% 0%; }
        100% { background-position: 100% 100%; }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000814',
        overflow: 'hidden'
      }}
    >
      {/* Animated water background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter:
            'contrast(65%) brightness(185%) hue-rotate(44deg) saturate(1800%)',
          opacity: 0.78,
          animation: 'ripple 48s linear infinite',
          zIndex: 0
        }}
      />

      <Canvas
        camera={{ position: [0, 0, 3.8], fov: 45 }}
        style={{ position: 'relative', zIndex: 1 }}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color='#a0c0ff' />
        <pointLight
          position={[-10, -10, -10]}
          intensity={0.6}
          color='#204080'
        />

        <FloatingIcosahedron />
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={8}
          autoRotate
          autoRotateSpeed={0.3}
        />
      </Canvas>
    </div>
  )
}

function FloatingIcosahedron () {
  const groupRef = useRef()
  const [time, setTime] = useState('')

  // Live clock
  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit'
        })
      )
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  // Geometry + vertex colors (20 triangles → 20 colors)
  const { geometry, edges } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 0).toNonIndexed()
    const pos = geo.getAttribute('position')
    const colors = new Float32Array(pos.count * 3)
    const color = new THREE.Color()

    const palette = ['#A198EE', '#E4ECF0', '#2A2AE8', '#065555']
    const assignment = [
      0, 1, 2, 0, 3, 1, 2, 3, 1, 0, 2, 3, 0, 2, 1, 3, 0, 1, 3, 2
    ]

    for (let i = 0; i < pos.count; i += 3) {
      const triIdx = Math.floor(i / 3)
      const col = palette[assignment[triIdx % 20]]
      color.set(col)
      for (let k = 0; k < 3; k++) {
        const idx = (i + k) * 3
        colors[idx] = color.r
        colors[idx + 1] = color.g
        colors[idx + 2] = color.b
      }
    }

    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    const edgesGeo = new THREE.EdgesGeometry(geo)

    return { geometry: geo, edges: edgesGeo }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime

    groupRef.current.rotation.x += delta * -0.22
    groupRef.current.rotation.y += delta * -0.18
    groupRef.current.rotation.z += delta * 0.26

    // Gentle orbital drift
    const radius = 1.25
    groupRef.current.position.x = Math.sin(t * 0.3 + Math.PI) * radius
    groupRef.current.position.z = Math.cos(t * 0.3 + Math.PI) * radius
  })

  return (
    <group ref={groupRef}>
      {/* Main translucent faces */}
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.DoubleSide}
          flatShading
          metalness={0.2}
          roughness={0.4}
          transparent
          opacity={0.38}
        />
      </mesh>

      {/* Subtle inner glow */}
      <mesh geometry={geometry} scale={0.97}>
        <meshBasicMaterial color='#4088ff' opacity={0.22} transparent />
      </mesh>

      {/* Wireframe overlay */}
      <mesh geometry={geometry} scale={1.004}>
        <meshBasicMaterial
          wireframe
          color='#6993E6FF'
          opacity={0.9}
          transparent
        />
      </mesh>

      {/* Crisp black edges */}
      <lineSegments geometry={edges}>
        <lineBasicMaterial color='#F1F3F6FF' linewidth={5} />
      </lineSegments>

      {/* Clock */}
      <Html center scale={0.36} position={[0, 0, 0]} transform>
        <div
          style={{
            color: '#88bbff',
            fontSize: '66px',
            // fontWeight: 100,
            letterSpacing: '3px',
            fontFamily: "'WaterFont', monospace",
            userSelect: 'none',
            pointerEvents: 'none'
          }}
        >
          {time}
        </div>
      </Html>
    </group>
  )
}
