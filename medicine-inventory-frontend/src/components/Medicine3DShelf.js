import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Text, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';

// 3D Medicine Bottle Component
const MedicineBottle3D = ({ position, medicine, onClick, isExpired, isLowStock }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (meshRef.current) {
      // Gentle floating animation
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.1;
      
      // Rotate on hover
      if (hovered) {
        meshRef.current.rotation.y += 0.02;
      }
      
      // Expired bottles shake
      if (isExpired) {
        meshRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 5) * 0.05;
      }
    }
  });

  const bottleColor = isExpired ? '#ef4444' : isLowStock ? '#f59e0b' : '#3b82f6';
  const emissiveColor = isExpired ? '#ff0000' : isLowStock ? '#ff8800' : '#0066ff';

  return (
    <group position={position}>
      {/* Bottle Body */}
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.2 : 1}
      >
        <cylinderGeometry args={[0.4, 0.4, 1.5, 32]} />
        <meshStandardMaterial
          color={bottleColor}
          transparent
          opacity={0.8}
          roughness={0.2}
          metalness={0.6}
          emissive={emissiveColor}
          emissiveIntensity={isExpired || isLowStock ? 0.3 : 0.1}
        />
      </mesh>

      {/* Bottle Cap */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.45, 0.45, 0.3, 32]} />
        <meshStandardMaterial
          color="#1f2937"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Label with Medicine Name */}
      <Text
        position={[0, 0, 0.41]}
        fontSize={0.15}
        color="white"
        anchorX="center"
        anchorY="middle"
        maxWidth={0.7}
      >
        {medicine.name.substring(0, 10)}
      </Text>

      {/* Stock number */}
      <Text
        position={[0, -0.3, 0.41]}
        fontSize={0.12}
        color={isLowStock ? '#fbbf24' : '#86efac'}
        anchorX="center"
        anchorY="middle"
      >
        {medicine.stock}
      </Text>

      {/* Glow effect for expired/low stock */}
      {(isExpired || isLowStock) && (
        <pointLight
          position={[0, 0, 0]}
          intensity={hovered ? 2 : 1}
          distance={2}
          color={isExpired ? '#ff0000' : '#ff8800'}
        />
      )}

      {/* Sparkles for hovered items */}
      {hovered && (
        <Sparkles
          count={20}
          scale={1.5}
          size={2}
          speed={0.4}
          opacity={0.6}
          color={bottleColor}
        />
      )}
    </group>
  );
};

// Shelf Component
const Shelf3D = ({ position, width = 8 }) => {
  return (
    <group position={position}>
      {/* Shelf surface */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, 0.1, 1.5]} />
        <meshStandardMaterial
          color="#4b5563"
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>
      
      {/* Shelf edge */}
      <mesh position={[0, -0.1, 0.75]}>
        <boxGeometry args={[width, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#374151"
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};

// Main Medicine Shelf Scene
const MedicineShelfScene = ({ medicines, onMedicineClick }) => {
  const shelves = [];
  const itemsPerShelf = 6;
  const numShelves = Math.ceil(medicines.length / itemsPerShelf);

  medicines.forEach((medicine, index) => {
    const shelfIndex = Math.floor(index / itemsPerShelf);
    const positionOnShelf = index % itemsPerShelf;
    
    const x = (positionOnShelf - 2.5) * 1.3; // Spacing between bottles
    const y = (numShelves - 1 - shelfIndex) * 2; // Shelf height
    const z = 0;

    const isExpired = new Date(medicine.expiryDate) < new Date();
    const isLowStock = medicine.stock < 20;

    shelves.push(
      <MedicineBottle3D
        key={medicine._id}
        position={[x, y, z]}
        medicine={medicine}
        onClick={() => onMedicineClick(medicine)}
        isExpired={isExpired}
        isLowStock={isLowStock}
      />
    );
  });

  // Create shelf platforms
  const shelfPlatforms = [];
  for (let i = 0; i < numShelves; i++) {
    shelfPlatforms.push(
      <Shelf3D key={i} position={[0, i * 2 - 0.8, 0]} width={8} />
    );
  }

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 10]} />
      <OrbitControls
        enableZoom={true}
        minDistance={5}
        maxDistance={20}
        maxPolarAngle={Math.PI / 2}
        enablePan={true}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />
      <pointLight position={[0, 5, 5]} intensity={0.8} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={0.5}
        castShadow
      />
      
      {/* Shelf platforms */}
      {shelfPlatforms}
      
      {/* Medicine bottles */}
      {shelves}
      
      {/* Environment */}
      <Environment preset="warehouse" />
      
      {/* Background */}
      <mesh position={[0, 0, -5]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </>
  );
};

// Main Component with UI
const Medicine3DShelf = ({ medicines, onMedicineClick }) => {
  const [showInstructions, setShowInstructions] = useState(true);

  return (
    <div className="relative w-full h-[600px]">
      <Canvas shadows>
        <MedicineShelfScene medicines={medicines} onMedicineClick={onMedicineClick} />
      </Canvas>
      
      {/* Instructions Overlay */}
      {showInstructions && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 bg-black bg-opacity-70 backdrop-blur-md rounded-lg p-4 max-w-xs"
        >
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-white font-bold text-sm">🎮 Controls</h3>
            <button
              onClick={() => setShowInstructions(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <ul className="text-gray-300 text-xs space-y-1">
            <li>🖱️ Drag to rotate view</li>
            <li>🔍 Scroll to zoom in/out</li>
            <li>👆 Click bottle for details</li>
            <li>🔴 Red glow = Expired</li>
            <li>🟡 Yellow glow = Low stock</li>
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Medicine3DShelf;
