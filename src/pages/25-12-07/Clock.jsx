// IcosahedronScene.jsx
import React, { useRef, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'
import backgroundImage from './h2o.webp' // Make sure to add your image file
import font251209 from './water.otf' // Import the custom font file

export default function IcosahedronScene () {
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @font-face {
        font-family: 'CustomFont251209';
        src: url('${font251209}') format('woff');
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  const containerStyle = {
    width: '100vw',
    height: '100vh',
    margin: 0,
    padding: 0,
    position: 'relative',
    overflow: 'hidden'
  }

  const backgroundStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'contrast(60%) brightness(133%) hue-rotate(44deg) saturate(900%)',
    zIndex: 0
  }

  return (
    <div style={containerStyle}>
      {/* Background with filters */}
      <div style={backgroundStyle}></div>

      <Canvas
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: '100%',
          background: 'transparent'
        }}
        camera={{ position: [0, 0, 3.6], fov: 45 }}
      >
        <ambientLight intensity={0.45} />
        <pointLight intensity={0.9} position={[5, 5, 5]} />
        <pointLight intensity={0.5} position={[-5, -5, -5]} />

        <FloatingIcosahedron />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>
    </div>
  )
}

function FloatingIcosahedron () {
  const groupRef = useRef()
  const formatTime = () => {
    const now = new Date()
    const h = now.getHours().toString().padStart(2, '0')
    const m = now.getMinutes().toString().padStart(2, '0')
    return `${h}:${m}`
  }

  const [time, setTime] = useState(formatTime())

  useEffect(() => {
    const interval = setInterval(() => setTime(formatTime()), 1000)
    return () => clearInterval(interval)
  }, [])

  const { meshGeometry } = useMemo(() => {
    const geom = new THREE.IcosahedronGeometry(1.2, 0)
    const nonIndexed = geom.toNonIndexed()
    const pos = nonIndexed.getAttribute('position')
    const count = pos.count
    const colors = new Float32Array(count * 3)
    const color = new THREE.Color()
    const selectedColors = ['#6965EDFF', '#04628BFF', '#0000ff', '#12EEEEFF']
    const colorIndices = [
      0,
      1,
      2,
      0,
      3, // 0
      1,
      2,
      3,
      1,
      0, // 5
      2,
      3,
      0,
      2,
      1, // 10
      3,
      0,
      1,
      3,
      2 // 15
    ] // 20 values, ensure no two adjacent triangles have same color

    for (let v = 0; v < count; v += 3) {
      const triangleIndex = v / 3
      if (triangleIndex >= colorIndices.length) continue
      color.setHex(
        selectedColors[colorIndices[triangleIndex]].replace('#', '0x')
      )
      for (let k = 0; k < 3; k++) {
        const idx = v + k
        colors[idx * 3] = color.r
        colors[idx * 3 + 1] = color.g
        colors[idx * 3 + 2] = color.b
      }
    }
    nonIndexed.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return { meshGeometry: nonIndexed }
  }, [])

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += 0.12 * delta
      groupRef.current.rotation.y += 0.08 * delta
      groupRef.current.rotation.z += 0.06 * delta
    }
  })

  return (
    <group ref={groupRef}>
      <mesh geometry={meshGeometry}>
        <meshStandardMaterial
          vertexColors={true}
          side={THREE.DoubleSide}
          flatShading={true}
          metalness={0.15}
          roughness={0.5}
          transparent={true}
          opacity={0.3}
        />
      </mesh>
      <mesh geometry={meshGeometry} scale={1.002}>
        <meshBasicMaterial
          wireframe={true}
          side={THREE.DoubleSide}
          polygonOffset={true}
          polygonOffsetFactor={-1}
          polygonOffsetUnits={1}
        />
      </mesh>
      <lineSegments geometry={new THREE.EdgesGeometry(meshGeometry)}>
        <lineBasicMaterial attach='material' linewidth={1.5} color='black' />
      </lineSegments>
      <Html scale={0.3} position={[0, 0, 0]} transform>
        <div
          style={{
            color: '#8095E6FF',
            fontSize: '50px',
            fontFamily: 'CustomFont251209, monospace'
          }}
        >
          {time}
        </div>
      </Html>
    </group>
  )
}
