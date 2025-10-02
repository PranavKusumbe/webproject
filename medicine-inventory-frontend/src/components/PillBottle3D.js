import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';

const PillBottle = () => {
  const bottleRef = useRef();
  const capRef = useRef();

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Floating animation
    if (bottleRef.current) {
      bottleRef.current.position.y = Math.sin(time * 0.5) * 0.3;
      bottleRef.current.rotation.y = time * 0.3;
    }
    
    if (capRef.current) {
      capRef.current.position.y = Math.sin(time * 0.5) * 0.3 + 2.5;
      capRef.current.rotation.y = time * 0.3;
    }
  });

  return (
    <group>
      {/* Bottle Body */}
      <mesh ref={bottleRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 3, 32]} />
        <meshStandardMaterial
          color="#4f46e5"
          transparent
          opacity={0.7}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Bottle Cap */}
      <mesh ref={capRef} position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
        <meshStandardMaterial
          color="#ef4444"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Label */}
      <mesh position={[0, 0, 0.81]}>
        <planeGeometry args={[1.5, 1.5]} />
        <meshStandardMaterial
          color="#ffffff"
          roughness={0.5}
        />
      </mesh>
    </group>
  );
};

const PillBottle3D = () => {
  return (
    <div className="w-full h-[500px]">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <OrbitControls
          enableZoom={false}
          autoRotate
          autoRotateSpeed={2}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
        />
        
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="#8b5cf6" />
        
        <PillBottle />
        
        <Environment preset="sunset" />
      </Canvas>
    </div>
  );
};

export default PillBottle3D;
