import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  PerspectiveCamera, 
  Environment, 
  Sparkles,
  MeshDistortMaterial,
  Float,
  Trail
} from '@react-three/drei';
import { motion } from 'framer-motion';

// Neon Ring Component
const NeonRing = ({ radius, color, position }) => {
  const ringRef = useRef();

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.z = state.clock.getElapsedTime() * 0.5;
    }
  });

  return (
    <mesh ref={ringRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[radius, 0.05, 16, 100]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.8}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  );
};

// Enhanced Pill Bottle with Neon Lights
const EnhancedPillBottle = () => {
  const bottleRef = useRef();
  const capRef = useRef();
  const groupRef = useRef();
  const lightRef1 = useRef();
  const lightRef2 = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Main group rotation
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.3;
    }
    
    // Floating animation
    if (bottleRef.current) {
      bottleRef.current.position.y = Math.sin(time * 0.5) * 0.3;
    }
    
    if (capRef.current) {
      capRef.current.position.y = Math.sin(time * 0.5) * 0.3 + 2.5;
    }

    // Animated lights orbiting
    if (lightRef1.current) {
      lightRef1.current.position.x = Math.cos(time) * 3;
      lightRef1.current.position.z = Math.sin(time) * 3;
    }

    if (lightRef2.current) {
      lightRef2.current.position.x = Math.cos(time + Math.PI) * 3;
      lightRef2.current.position.z = Math.sin(time + Math.PI) * 3;
    }
  });

  return (
    <group ref={groupRef}>
      <Float
        speed={1.5}
        rotationIntensity={0.5}
        floatIntensity={0.5}
      >
        {/* Bottle Body with distortion effect */}
        <Trail
          width={2}
          length={8}
          color="#4f46e5"
          attenuation={(t) => t * t}
        >
          <mesh ref={bottleRef} position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.8, 0.8, 3, 32]} />
            <MeshDistortMaterial
              color="#4f46e5"
              transparent
              opacity={0.8}
              roughness={0.1}
              metalness={0.9}
              distort={0.3}
              speed={2}
              emissive="#4f46e5"
              emissiveIntensity={0.5}
            />
          </mesh>
        </Trail>

        {/* Bottle Cap with glow */}
        <mesh ref={capRef} position={[0, 2.5, 0]} castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
          <meshStandardMaterial
            color="#ef4444"
            roughness={0.2}
            metalness={0.9}
            emissive="#ef4444"
            emissiveIntensity={0.8}
          />
        </mesh>

        {/* Label */}
        <mesh position={[0, 0, 0.81]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshStandardMaterial
            color="#ffffff"
            roughness={0.3}
            metalness={0.2}
          />
        </mesh>

        {/* Neon Rings around bottle */}
        <NeonRing radius={1.5} color="#3b82f6" position={[0, 1, 0]} />
        <NeonRing radius={1.8} color="#8b5cf6" position={[0, 0, 0]} />
        <NeonRing radius={2.1} color="#ec4899" position={[0, -1, 0]} />

        {/* Sparkles effect */}
        <Sparkles
          count={100}
          scale={5}
          size={4}
          speed={0.4}
          opacity={0.6}
          color="#8b5cf6"
        />
      </Float>

      {/* Orbiting Point Lights */}
      <pointLight
        ref={lightRef1}
        position={[3, 2, 0]}
        intensity={3}
        distance={10}
        color="#3b82f6"
      />
      <pointLight
        ref={lightRef2}
        position={[-3, 2, 0]}
        intensity={3}
        distance={10}
        color="#ec4899"
      />

      {/* Spotlight from above */}
      <spotLight
        position={[0, 5, 0]}
        angle={0.5}
        penumbra={1}
        intensity={2}
        color="#8b5cf6"
        castShadow
      />
    </group>
  );
};

// Animated Background Cubes
const BackgroundCubes = () => {
  const cubesRef = useRef([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    cubesRef.current.forEach((cube, i) => {
      if (cube) {
        cube.rotation.x = time * 0.3 + i;
        cube.rotation.y = time * 0.2 + i;
        cube.position.y = Math.sin(time + i * 2) * 0.5;
      }
    });
  });

  return (
    <group>
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <mesh
          key={i}
          ref={el => cubesRef.current[i] = el}
          position={[x, 0, -5]}
        >
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial
            color="#3b82f6"
            transparent
            opacity={0.3}
            emissive="#3b82f6"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}
    </group>
  );
};

// Main Enhanced Component
const EnhancedPillBottle3D = () => {
  return (
    <div className="relative w-full h-[600px]">
      <Canvas shadows>
        <PerspectiveCamera makeDefault position={[0, 2, 10]} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={1}
          maxPolarAngle={Math.PI / 1.8}
          minPolarAngle={Math.PI / 3}
        />
        
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        {/* Main content */}
        <EnhancedPillBottle />
        <BackgroundCubes />
        
        {/* Environment */}
        <Environment preset="night" />
        
        {/* Fog for depth */}
        <fog attach="fog" args={['#0a0a1a', 10, 30]} />
        
        {/* Floor with reflection */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]} receiveShadow>
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
            color="#0f172a"
            roughness={0.1}
            metalness={0.9}
          />
        </mesh>
      </Canvas>

      {/* Animated gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 pointer-events-none bg-gradient-to-t from-purple-900 via-transparent to-blue-900"
      />

      {/* Neon text overlay */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-2"
            style={{
              textShadow: '0 0 20px rgba(139, 92, 246, 0.8), 0 0 40px rgba(139, 92, 246, 0.4)'
            }}
        >
          Futuristic 3D
        </h2>
        <p className="text-xl text-gray-300">
          Medicine Management System
        </p>
      </motion.div>
    </div>
  );
};

export default EnhancedPillBottle3D;
