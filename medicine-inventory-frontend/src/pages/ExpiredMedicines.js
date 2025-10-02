import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei';
import MedicineCard3D from '../components/MedicineCard3D';
import medicineService from '../services/api';

const ExpiredMedicines = () => {
  const [expiredMedicines, setExpiredMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [shatteringIds, setShatteringIds] = useState([]);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'list'

  useEffect(() => {
    fetchExpiredMedicines();
  }, []);

  const fetchExpiredMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineService.getExpiredMedicines();
      setExpiredMedicines(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch expired medicines');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm(`Are you sure you want to delete all ${expiredMedicines.length} expired medicine(s)?`)) {
      return;
    }

    try {
      setDeleting(true);
      await medicineService.deleteExpiredMedicines();
      await fetchExpiredMedicines(); // Refresh the list
    } catch (err) {
      alert('Failed to delete expired medicines');
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteSingle = async (id, name) => {
    if (!window.confirm(`Delete ${name}?`)) {
      return;
    }

    try {
      // Start shatter animation
      setShatteringIds(prev => [...prev, id]);
      
      // Wait for animation to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await medicineService.deleteMedicine(id);
      setExpiredMedicines(expiredMedicines.filter(m => m._id !== id));
      setShatteringIds(prev => prev.filter(shId => shId !== id));
    } catch (err) {
      alert('Failed to delete medicine');
      console.error(err);
      setShatteringIds(prev => prev.filter(shId => shId !== id));
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysExpired = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = Math.abs(today - expiry);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const shakeVariants = {
    shake: {
      x: [-10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
        repeat: Infinity,
        repeatDelay: 2
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="text-6xl"
        >
          💊
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-900 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 max-w-md text-center"
        >
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchExpiredMedicines}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">
                ⚠️ Expired Medicines
              </h1>
              <p className="text-gray-300">
                Manage expired inventory items
              </p>
            </div>
            {expiredMedicines.length > 0 && (
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('3d')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    viewMode === '3d'
                      ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  🎮 3D View
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode('list')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                    viewMode === 'list'
                      ? 'bg-gradient-to-r from-red-500 to-red-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  📋 List View
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Stats and Actions */}
        <motion.div
          variants={itemVariants}
          className="bg-red-900 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 mb-8 flex flex-col md:flex-row justify-between items-center"
        >
          <div>
            <motion.div
              variants={shakeVariants}
              animate="shake"
              className="text-6xl mb-2"
            >
              🚫
            </motion.div>
            <h2 className="text-3xl font-bold text-white">
              {expiredMedicines.length} Expired Item{expiredMedicines.length !== 1 ? 's' : ''}
            </h2>
            <p className="text-red-200">
              These medicines need immediate attention
            </p>
          </div>

          {expiredMedicines.length > 0 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDeleteAll}
              disabled={deleting}
              className={`mt-4 md:mt-0 px-8 py-4 rounded-xl font-bold text-lg transition-all ${
                deleting
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-2xl'
              } text-white`}
            >
              {deleting ? '⏳ Deleting...' : '🗑️ Delete All Expired'}
            </motion.button>
          )}
        </motion.div>

        {/* Expired Medicines Display */}
        {expiredMedicines.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-green-900 bg-opacity-50 backdrop-blur-md rounded-2xl p-12 text-center"
          >
            <div className="text-8xl mb-6">✅</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              All Good!
            </h3>
            <p className="text-gray-300 text-lg">
              No expired medicines found in your inventory
            </p>
          </motion.div>
        ) : viewMode === '3d' ? (
          <motion.div variants={itemVariants} className="h-[700px] bg-gray-900 bg-opacity-50 backdrop-blur-md rounded-2xl overflow-hidden">
            <Canvas shadows>
              <PerspectiveCamera makeDefault position={[0, 2, 8]} />
              <OrbitControls
                enableZoom={true}
                minDistance={5}
                maxDistance={15}
                maxPolarAngle={Math.PI / 2}
              />
              
              {/* Lighting */}
              <ambientLight intensity={0.3} />
              <directionalLight position={[10, 10, 5]} intensity={1} />
              <pointLight position={[0, 5, 5]} intensity={1.5} color="#ff0000" />
              <spotLight
                position={[0, 10, 0]}
                angle={0.6}
                penumbra={1}
                intensity={1}
                color="#ff0000"
              />
              
              {/* 3D Cards */}
              {expiredMedicines.map((medicine, index) => {
                const columns = 4;
                const row = Math.floor(index / columns);
                const col = index % columns;
                const x = (col - columns / 2 + 0.5) * 1.5;
                const y = -row * 2;
                
                return (
                  <MedicineCard3D
                    key={medicine._id}
                    position={[x, y, 0]}
                    medicine={medicine}
                    onClick={() => handleDeleteSingle(medicine._id, medicine.name)}
                    isExpired={true}
                    isLowStock={false}
                    shattering={shatteringIds.includes(medicine._id)}
                    index={index}
                  />
                );
              })}
              
              {/* Environment */}
              <Environment preset="night" />
              
              {/* Floor */}
              <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]} receiveShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial
                  color="#1a0000"
                  roughness={0.2}
                  metalness={0.8}
                />
              </mesh>

              {/* Red fog for atmosphere */}
              <fog attach="fog" args={['#1a0000', 10, 30]} />
            </Canvas>

            {/* Controls overlay */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 backdrop-blur-md rounded-lg px-6 py-3"
            >
              <p className="text-gray-300 text-sm text-center">
                🖱️ Drag to rotate • 🔍 Scroll to zoom • 👆 Click to delete with shatter effect
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="space-y-4"
          >
            {expiredMedicines.map((medicine) => (
              <motion.div
                key={medicine._id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-gradient-to-r from-red-900 to-red-700 bg-opacity-50 backdrop-blur-md rounded-2xl p-6 shadow-xl"
                style={{
                  boxShadow: '0 0 20px rgba(239, 68, 68, 0.5)'
                }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <motion.span
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        className="text-4xl mr-4"
                      >
                        💊
                      </motion.span>
                      <div>
                        <h3 className="text-2xl font-bold text-white">
                          {medicine.name}
                        </h3>
                        <p className="text-red-200">
                          ID: {medicine.medicineId} | {medicine.manufacturer}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                      <div>
                        <p className="text-gray-400 text-sm">Expired On</p>
                        <p className="text-white font-semibold">
                          {formatDate(medicine.expiryDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Days Expired</p>
                        <p className="text-red-300 font-semibold">
                          {getDaysExpired(medicine.expiryDate)} days
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Stock</p>
                        <p className="text-white font-semibold">
                          {medicine.stock} units
                        </p>
                      </div>

                      <div>
                        <p className="text-gray-400 text-sm">Value Loss</p>
                        <p className="text-red-300 font-semibold">
                          ₹{medicine.stock * medicine.price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDeleteSingle(medicine._id, medicine.name)}
                    className="mt-4 md:mt-0 md:ml-6 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all"
                  >
                    🗑️ Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Warning Info */}
        <motion.div
          variants={itemVariants}
          className="mt-8 bg-yellow-900 bg-opacity-30 backdrop-blur-md rounded-xl p-6"
        >
          <div className="flex items-start">
            <span className="text-3xl mr-4">⚠️</span>
            <div>
              <h4 className="text-white font-bold text-lg mb-2">
                Important Notice
              </h4>
              <p className="text-gray-300">
                Expired medicines should be disposed of properly according to local regulations.
                Do not sell or distribute expired medications as they may be ineffective or harmful.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ExpiredMedicines;
