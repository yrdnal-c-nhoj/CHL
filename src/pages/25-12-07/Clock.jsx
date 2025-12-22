import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

import backgroundImage from './h2o.webp'
import backgroundImage2 from './water.gif'
import font251207 from './isoca.ttf'
import useFontLoader from './useFontLoader'

export default function IcosahedronScene() {
  // Load font safely
  useFontLoader('WaterFont', font251207, 'truetype')

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#000814',
        overflow: 'hidden'
      }}
    >
      {/* Secondary background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage2})`,
          backgroundSize: 'cover',
          filter: 'contrast(265%) brightness(100%) hue-rotate(44deg) saturate(180%)',
          backgroundPosition: 'center',
          opacity: 0.6,
          zIndex: -1
        }}
      />

      {/* Animated water background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(65%) brightness(185%) hue-rotate(44deg) saturate(1800%)',
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
        <pointLight position={[-10, -10, -10]} intensity={0.6} color='#204080' />

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

function FloatingIcosahedron() {
  const groupRef = useRef()
  const [time, setTime] = useState('')

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

  const { geometry, edges } = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.2, 0).toNonIndexed()
    const pos = geo.getAttribute('position')
    const colors = new Float32Array(pos.count * 3)
    const color = new THREE.Color()
    const palette = ['#A198EE', '#E4ECF0', '#2A2AE8', '#065555']
    const assignment = [0, 1, 2, 0, 3, 1, 2, 3, 1, 0, 2, 3, 0, 2, 1, 3, 0, 1, 3, 2]

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
    return { geometry: geo, edges: new THREE.EdgesGeometry(geo) }
  }, [])

  useFrame((state, delta) => {
    if (!groupRef.current) return
    const t = state.clock.elapsedTime
    groupRef.current.rotation.x += delta * -0.22
    groupRef.current.rotation.y += delta * 0.18
    groupRef.current.rotation.z += delta * -0.26
    const radius = 1.25
    groupRef.current.position.x = Math.sin(t * 0.3 + Math.PI) * radius
    groupRef.current.position.z = Math.cos(t * 0.3 + Math.PI) * radius
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={geometry}>
        <meshStandardMaterial
          vertexColors
          side={THREE.FrontSide}
          flatShading
          metalness={0.2}
          roughness={0.4}
          transparent
          opacity={0.38}
        />
      </mesh>

      <mesh geometry={geometry} scale={0.97}>
        <meshBasicMaterial color='#4088ff' opacity={0} transparent />
      </mesh>

      <mesh geometry={geometry} scale={1.004}>
        <meshBasicMaterial wireframe color='#6993E6FF' opacity={0} transparent />
      </mesh>

      <lineSegments geometry={edges}>
        <lineBasicMaterial color='#F1F3F6FF' linewidth={0} />
      </lineSegments>

      <Html center scale={0.36} position={[0, 0, 0]} transform>
        <div
          style={{
            color: '#4153F5FF',
            fontSize: '70px',
            letterSpacing: '3px',
            opacity: 0.4,
            fontFamily: "'WaterFont', monospace",
            userSelect: 'none',
            pointerEvents: 'none',
            textShadow:
              '-2px -1px 0 #0F0219FF, 1px -1px 0 #E22333FF, -3px 1px 0 #F6EFEFFF, 1px 3px 0 #E7EBE6FF'
          }}
        >
          {time}
        </div>
      </Html>
    </group>
  )
}
