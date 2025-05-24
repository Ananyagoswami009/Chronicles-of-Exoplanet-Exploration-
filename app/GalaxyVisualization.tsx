'use client'

import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import Link from 'next/link'

interface Exoplanet {
  name: string
  pl_orbper: number
  pl_rade: number
  pl_masse: number
  st_dist: number
  pl_type: string
}

const planetTypeColors: { [key: string]: string } = {
  'Super Earth': '#ffcc00',
  'Gas Giant': '#ff0000',
  'Neptune-like': '#0000ff',
  'Terrestrial': '#00ff00',
  'Unknown': '#ffffff',
}

const NASA_API_KEY = 'SRX1gE9z1T27mIJ8uMPl4cialBcuUTksX5dFg0qc'

export default function MilkyWayGalaxy() {
  const mountRef = useRef<HTMLDivElement>(null)
  const [tooltipData, setTooltipData] = useState<Exoplanet | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const mountNode = mountRef.current
    let renderer: THREE.WebGLRenderer | null = null
    let controls: any

    const initScene = async () => {
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls')

      // Scene setup
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
      renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(window.innerWidth, window.innerHeight)
      mountNode.appendChild(renderer.domElement)

      // Camera position
      camera.position.set(0, 50, 150)
      camera.lookAt(scene.position)

      // Orbit controls
      controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05

      // Galaxy particles (existing galaxy setup)
      const particlesGeometry = new THREE.BufferGeometry()
      const particleCount = 500000
      const positions = new Float32Array(particleCount * 3)
      const colors = new Float32Array(particleCount * 3)

      const colorInside = new THREE.Color('#ffffff')
      const colorOutside = new THREE.Color('#0066ff')

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3

        const radius = Math.pow(Math.random(), 1.5) * 800
        const spinAngle = radius * 0.5
        const branchAngle = (i % 5) / 5 * Math.PI * 2

        const randomX = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius
        const randomY = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3
        const randomZ = Math.pow(Math.random(), 2) * (Math.random() < 0.5 ? 1 : -1) * 0.3 * radius

        positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
        positions[i3 + 1] = randomY
        positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

        const mixedColor = colorInside.clone()
        mixedColor.lerp(colorOutside, radius / 800)

        colors[i3] = mixedColor.r
        colors[i3 + 1] = mixedColor.g
        colors[i3 + 2] = mixedColor.b
      }

      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.2,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true
      })

      const particles = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particles)

      // Black Hole in the center
      const blackHoleGeometry = new THREE.SphereGeometry(5, 32, 32)
      const blackHoleMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
      const blackHole = new THREE.Mesh(blackHoleGeometry, blackHoleMaterial)
      scene.add(blackHole)

      // Fetch exoplanet data from NASA API
      const fetchExoplanets = async () => {
        try {
          const response = await fetch(`https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=exoplanets&select=pl_name,pl_orbper,pl_rade,pl_masse,st_dist,pl_type&format=json&api_key=${NASA_API_KEY}`)
          const data = await response.json()

          const exoplanets: Exoplanet[] = data.map((planet: any) => ({
            name: planet.pl_name,
            pl_orbper: parseFloat(planet.pl_orbper),
            pl_rade: parseFloat(planet.pl_rade),
            pl_masse: parseFloat(planet.pl_masse),
            st_dist: parseFloat(planet.st_dist),
            pl_type: planet.pl_type || "Unknown",
          }))

          return exoplanets.filter(planet => !isNaN(planet.st_dist)).slice(0, 1000)
        } catch (error) {
          console.error('Error fetching exoplanet data:', error)
          return []
        }
      }

      // Add exoplanets as particles inside the galaxy
      fetchExoplanets().then((exoplanets) => {
        const exoplanetPositions = new Float32Array(exoplanets.length * 3)
        const exoplanetColors = new Float32Array(exoplanets.length * 3)

        exoplanets.forEach((planet, i) => {
          const i3 = i * 3

          const radius = Math.min(planet.st_dist * 2, 800)
          const theta = Math.random() * Math.PI * 2
          const phi = Math.acos((Math.random() * 2) - 1)

          exoplanetPositions[i3] = radius * Math.sin(phi) * Math.cos(theta)
          exoplanetPositions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
          exoplanetPositions[i3 + 2] = radius * Math.cos(phi)

          const colorHex = planetTypeColors[planet.pl_type] || '#ffffff'
          const color = new THREE.Color(colorHex)
          exoplanetColors[i3] = color.r
          exoplanetColors[i3 + 1] = color.g
          exoplanetColors[i3 + 2] = color.b
        })

        const exoplanetGeometry = new THREE.BufferGeometry()
        exoplanetGeometry.setAttribute('position', new THREE.BufferAttribute(exoplanetPositions, 3))
        exoplanetGeometry.setAttribute('color', new THREE.BufferAttribute(exoplanetColors, 3))

        const exoplanetMaterial = new THREE.PointsMaterial({
          size: 1,
          sizeAttenuation: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          vertexColors: true
        })

        const exoplanetPoints = new THREE.Points(exoplanetGeometry, exoplanetMaterial)
        exoplanetPoints.userData = { exoplanets }
        scene.add(exoplanetPoints)
      })

      // Raycaster for planet selection and hovering
      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()

      const onMouseMove = (event: MouseEvent) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        raycaster.setFromCamera(mouse, camera)

        const intersects = raycaster.intersectObjects(scene.children)

        setTooltipData(null)

        for (let i = 0; i < intersects.length; i++) {
          const object = intersects[i].object

          if (object instanceof THREE.Points && object.userData.exoplanets) {
            const exoplanets = object.userData.exoplanets
            const index = Math.floor(intersects[i].index)
            if (index < exoplanets.length) {
              setTooltipData(exoplanets[index])
              break
            }
          }
        }
      }

      window.addEventListener('mousemove', onMouseMove)

      // Animation
      const animate = () => {
        requestAnimationFrame(animate)
        controls.update()
        renderer?.render(scene, camera)
      }
      animate()

      // Resize handler
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer?.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener('resize', handleResize)

      // Cleanup
      return () => {
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', onMouseMove)
        controls.dispose()
        renderer?.dispose()
      }
    }

    initScene()

    // Cleanup
    return () => {
      if (renderer && mountNode) {
        mountNode.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="relative w-full h-screen">
      <nav className="absolute top-0 left-0 right-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="flex items-center space-x-8"> 
          <Link href="/" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
          <Link href="/learn" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Learn
          </Link>
          <Link href="/quiz" className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
            Quiz
          </Link>
        </div>
      </nav>
      <div ref={mountRef} className="w-full h-full" />
      {tooltipData && (
        <div className="absolute top-20 left-4 bg-black bg-opacity-75 text-white p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-2">{tooltipData.name}</h2>
          <p>Orbital Period: {tooltipData.pl_orbper?.toFixed(2)} days</p>
          <p>Radius: {tooltipData.pl_rade?.toFixed(2)} Earth radii</p>
          <p>Mass: {tooltipData.pl_masse?.toFixed(2)} Earth masses</p>
          <p>Distance from Earth: {tooltipData.st_dist?.toFixed(2)} parsecs</p>
          <p>Planet Type: {tooltipData.pl_type}</p>
        </div>
      )}
    </div>
  )
}