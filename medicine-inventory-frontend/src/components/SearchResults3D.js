import React, { useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import MedicineCard3D from './MedicineCard3D';

// Sliding card arrangement scene
const SearchResultsScene = ({ results, onCardClick, onCardHover }) => {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      // Gentle wave animation
      const time = state.clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.3) * 0.1;
    }
  });

  // Arrange cards in a grid with slide-in positions
  const cardPositions = useMemo(() => {
    const positions = [];
    const columns = 4;
    const spacing = 1.5;
    
    results.forEach((_, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      
      const x = (col - columns / 2 + 0.5) * spacing;
      const y = -row * 2;
      const z = 0;
      
      positions.push([x, y, z]);
    });
    
    return positions;
  }, [results]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 2, 8]} />
      <OrbitControls
        enableZoom={true}
        minDistance={5}
        maxDistance={15}
        maxPolarAngle={Math.PI / 2}
        enablePan={true}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[0, 5, 5]} intensity={1} color="#8b5cf6" />
      <spotLight
        position={[0, 10, 0]}
        angle={0.6}
        penumbra={1}
        intensity={1}
        color="#3b82f6"
      />
      
      {/* Cards */}
      <group ref={groupRef}>
        {results.map((medicine, index) => {
          const isExpired = new Date(medicine.expiryDate) < new Date();
          const isLowStock = medicine.stock < 20;
          
          return (
            <MedicineCard3D
              key={medicine._id}
              position={cardPositions[index]}
              medicine={medicine}
              onClick={onCardClick}
              onHover={onCardHover}
              isExpired={isExpired}
              isLowStock={isLowStock}
              index={index}
            />
          );
        })}
      </group>
      
      {/* Ambient sparkles */}
      <Sparkles
        count={50}
        scale={10}
        size={2}
        speed={0.3}
        opacity={0.4}
        color="#8b5cf6"
      />
      
      {/* Environment */}
      <Environment preset="city" />
      
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Grid helper */}
      <gridHelper args={[20, 20, '#3b82f6', '#1e293b']} position={[0, -5, 0]} />
    </>
  );
};

// Main component with motion animations
const SearchResults3D = ({ results, onCardClick }) => {
  const [hoveredCard, setHoveredCard] = React.useState(null);
  const [selectedCard, setSelectedCard] = React.useState(null);

  const handleCardClick = (medicine) => {
    setSelectedCard(medicine);
    onCardClick?.(medicine);
  };

  return (
    <div className="relative w-full h-[700px]">
      {/* 3D Canvas */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full h-full"
      >
        <Canvas shadows>
          <SearchResultsScene
            results={results}
            onCardClick={handleCardClick}
            onCardHover={setHoveredCard}
          />
        </Canvas>
      </motion.div>

      {/* Hover Info Panel */}
      {hoveredCard && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="absolute left-4 top-4 bg-black bg-opacity-80 backdrop-blur-md rounded-xl p-4 max-w-xs border border-blue-500"
          style={{
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.5)'
          }}
        >
          <div className="flex items-start gap-3">
            <div className="text-4xl">💊</div>
            <div className="flex-1">
              <h3 className="text-white font-bold text-lg mb-1">
                {hoveredCard.name}
              </h3>
              <p className="text-blue-300 text-sm mb-2">
                ID: {hoveredCard.medicineId}
              </p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Manufacturer:</span>
                  <span className="text-white">{hoveredCard.manufacturer}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Stock:</span>
                  <span className={hoveredCard.stock < 20 ? 'text-yellow-400' : 'text-green-400'}>
                    {hoveredCard.stock} units
                  </span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Price:</span>
                  <span className="text-green-400">₹{hoveredCard.price}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Expiry:</span>
                  <span className={new Date(hoveredCard.expiryDate) < new Date() ? 'text-red-400' : 'text-white'}>
                    {new Date(hoveredCard.expiryDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Selected Card Details Modal */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedCard(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 max-w-md w-full border-2 border-blue-500 shadow-2xl"
            style={{
              boxShadow: '0 0 40px rgba(59, 130, 246, 0.6)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="text-7xl mb-4 animate-bounce">💊</div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {selectedCard.name}
              </h2>
              <p className="text-blue-400">
                {selectedCard.medicineId}
              </p>
            </div>

            <div className="space-y-4 text-white">
              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Manufacturer:</span>
                <span className="font-semibold">{selectedCard.manufacturer}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Stock:</span>
                <span className={`font-bold ${selectedCard.stock < 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                  {selectedCard.stock} units
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Price:</span>
                <span className="font-bold text-green-400">₹{selectedCard.price}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                <span className="text-gray-400">Expiry Date:</span>
                <span className={new Date(selectedCard.expiryDate) < new Date() ? 'text-red-400 font-bold' : 'text-white'}>
                  {new Date(selectedCard.expiryDate).toLocaleDateString()}
                </span>
              </div>

              {new Date(selectedCard.expiryDate) < new Date() && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-3 text-center"
                >
                  <p className="text-red-300 font-bold">⚠️ EXPIRED MEDICINE</p>
                </motion.div>
              )}

              {selectedCard.stock < 20 && new Date(selectedCard.expiryDate) >= new Date() && (
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="bg-yellow-900 bg-opacity-50 border border-yellow-500 rounded-lg p-3 text-center"
                >
                  <p className="text-yellow-300 font-bold">⚠️ LOW STOCK</p>
                </motion.div>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCard(null)}
              className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg"
            >
              Close
            </motion.button>
          </motion.div>
        </motion.div>
      )}

      {/* Controls Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-md rounded-lg px-6 py-3"
      >
        <p className="text-gray-300 text-sm text-center">
          🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click card for details
        </p>
      </motion.div>
    </div>
  );
};

export default SearchResults3D;
