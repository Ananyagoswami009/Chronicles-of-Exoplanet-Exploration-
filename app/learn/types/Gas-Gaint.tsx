"use client"
import './learn.css';
import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, Text, Html } from '@react-three/drei'
import { Button } from "@/components/ui/button"

function Exoplanet(props) {
  const mesh = useRef()

  useFrame((state, delta) => {
    mesh.current.rotation.y += delta * 0.2
  })

  return (
    <mesh {...props} ref={mesh}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial color="#4da6ff" metalness={0.5} roughness={0.7} />
    </mesh>
  )
}

function InfoPanel({ setShowInfo }) {
  return (
    <Html position={[0, 0, 2]}>
      <div className="bg-white bg-opacity-75 text-white p-4 rounded-lg max-w-sm">
        <h2 className="text-xl font-bold mb-2">Exoplanet Facts</h2>
        <ul className="list-disc list-inside mb-4">
          <li>Exoplanets are planets outside our solar system</li>
          <li>Over 5,000 exoplanets have been discovered</li>
          <li>Some exoplanets could potentially harbor life</li>
          <li>They come in a wide variety of sizes and compositions</li>
        </ul>
        <Button onClick={() => setShowInfo(false)}>Close</Button>
      </div>
    </Html>
  )
}

export default function Component() {
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div className="w-full h-screen relative">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Exoplanet position={[0, 0, 0]} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <OrbitControls enableZoom={false} />
        <Text 
          position={[0, 1.5, 0]} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          fontSize={0.5}
        >
          Gas-Gaint
        </Text>
        {showInfo && <InfoPanel setShowInfo={setShowInfo} />}
      </Canvas>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <Button onClick={() => setShowInfo(!showInfo)}>
          {showInfo ? 'Hide Info' : 'Show Info'}
        </Button>
      </div>
    </div>
  )
}