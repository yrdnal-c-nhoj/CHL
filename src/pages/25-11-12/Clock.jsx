import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

import bgFull from './octo.webp' // full-size background
import bgTile from './octoh.webp' // repeating/tiled background
import custom251112tz from './oct.ttf'

export default function TwoBackgroundOctahedron () {
  const threeRef = useRef(null)
  const fontLoadedRef = useRef(false)

  // THREE.js Octahedron (unchanged)
  useEffect(() => {
    const mount = threeRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = null

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.01,
      1000
    )
    camera.position.z = 1

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    mount.appendChild(renderer.domElement)

    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')
    const texture = new THREE.CanvasTexture(canvas)

    const fontName = 'MyCustomFont'

    const updateClock = () => {
      const now = new Date()
      let h = now.getHours() % 12 || 12
      let m = now.getMinutes()
      const txt = `${h}:${m < 10 ? '0' + m : m}`

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.font = `110px ${fontLoadedRef.current ? fontName : 'Arial'}`
      ctx.fillStyle = '#043D91FF'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(
        txt,
        canvas.width / 2,
        canvas.height / 2 + canvas.height * 0.2
      )

      texture.needsUpdate = true
    }

    const font = new FontFace(fontName, `url(${custom251112tz})`)
    font.load().then(loaded => {
      document.fonts.add(loaded)
      fontLoadedRef.current = true
      updateClock()
    })

    updateClock()
    const clockInterval = setInterval(updateClock, 1000)

    const geometry = new THREE.OctahedronGeometry(2)

    // reassign UVs (unchanged)
    const uv = geometry.attributes.uv.array
    for (let i = 0; i < uv.length; i += 6) {
      uv[i] = 0
      uv[i + 1] = 0
      uv[i + 2] = 1
      uv[i + 3] = 0
      uv[i + 4] = 0.5
      uv[i + 5] = 1
    }
    geometry.attributes.uv.needsUpdate = true

    const material = new THREE.MeshPhongMaterial({
      color: 0xfff0f0,
      shininess: 100,
      transparent: true,
      // opacity: 0.6,
      side: THREE.DoubleSide,
      map: texture
    })

    const oct = new THREE.Mesh(geometry, material)
    scene.add(oct)

    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({ color: 0xffffff })
    )
    scene.add(wireframe)

    scene.add(new THREE.DirectionalLight(0xffffff, 1))
    scene.add(new THREE.AmbientLight(0xffffff, 0.4))

    const clock = new THREE.Clock()
    const animate = () => {
      requestAnimationFrame(animate)

      oct.rotation.x += 0.003
      oct.rotation.y += 0.005
      wireframe.rotation.x += 0.003
      wireframe.rotation.y += 0.005

      const t = clock.getElapsedTime()
      const zStart = -15,
        zEnd = 2
      const z =
        (zEnd + zStart) / 2 +
        Math.sin((t / 25) * Math.PI * 2) * ((zEnd - zStart) / 2)

      oct.position.z = wireframe.position.z = z

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(clockInterval)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      texture.dispose()
      mount.removeChild(renderer.domElement)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div
      style={{
        width: '100vw',
        height: '100dvh',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#000'
      }}
    >
      {/* FULL IMAGE BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgFull})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // opacity: 0.55,          // <--- adjust
          zIndex: 0
        }}
      />

      {/* FLOATING TILED BACKGROUND */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${bgTile})`,
          backgroundRepeat: 'repeat',
          backgroundSize: '100px 100px',
          animation: 'floatUp 45s linear infinite',
          opacity: 0.3, // <--- adjust
          zIndex: 0
        }}
      />

      {/* THREE.JS OCTAHEDRON */}
      <div
        ref={threeRef}
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none'
        }}
      />

      {/* FLOATING ANIMATION KEYFRAME */}
      <style>
        {`
          @keyframes floatUp {
            0% { background-position-y: 0px; }
            100% { background-position-y: -1000px; }
          }
        `}
      </style>
    </div>
  )
}
