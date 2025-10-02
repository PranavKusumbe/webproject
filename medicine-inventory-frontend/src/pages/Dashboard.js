import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import MedicineCard from '../components/MedicineCard';
import Medicine3DShelf from '../components/Medicine3DShelf';
import medicineService from '../services/api';

const Dashboard = () => {
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('3d'); // '3d' or 'cards'
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    expired: 0,
    lowStock: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchMedicines();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await medicineService.getAllMedicines();
      setMedicines(response.data);
      calculateStats(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch medicines. Make sure the backend is running on port 5000.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const now = new Date();
    const expired = data.filter(m => new Date(m.expiryDate) < now).length;
    const lowStock = data.filter(m => m.stock < 20).length;
    const totalValue = data.reduce((sum, m) => sum + (m.stock * m.price), 0);

    setStats({
      total: data.length,
      expired,
      lowStock,
      totalValue
    });
  };

  const handleDelete = async (id) => {
    try {
      await medicineService.deleteMedicine(id);
      fetchMedicines(); // Refresh the list
      setSelectedMedicine(null); // Close modal if open
    } catch (err) {
      alert('Failed to delete medicine');
      console.error(err);
    }
  };

  const handleMedicineClick = (medicine) => {
    setSelectedMedicine(medicine);
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
          <h2 className="text-2xl font-bold text-white mb-4">Connection Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={fetchMedicines}
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
                📊 Dashboard
              </h1>
              <p className="text-gray-300">
                Manage your medicine inventory
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('3d')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  viewMode === '3d'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                🎮 3D View
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('cards')}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  viewMode === 'cards'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                📇 Card View
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="text-4xl mb-2">📦</div>
            <div className="text-3xl font-bold text-white">{stats.total}</div>
            <div className="text-blue-200">Total Medicines</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-green-600 to-green-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-bold text-white">₹{stats.totalValue}</div>
            <div className="text-green-200">Total Value</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-yellow-600 to-yellow-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="text-4xl mb-2">⚠️</div>
            <div className="text-3xl font-bold text-white">{stats.lowStock}</div>
            <div className="text-yellow-200">Low Stock</div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-6 shadow-xl"
          >
            <div className="text-4xl mb-2">🚫</div>
            <div className="text-3xl font-bold text-white">{stats.expired}</div>
            <div className="text-red-200">Expired</div>
          </motion.div>
        </motion.div>

        {/* Medicines Display */}
        {medicines.length === 0 ? (
          <motion.div
            variants={itemVariants}
            className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-12 text-center"
          >
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-2xl font-bold text-white mb-2">No medicines yet</h3>
            <p className="text-gray-400">Add your first medicine to get started!</p>
          </motion.div>
        ) : viewMode === '3d' ? (
          <motion.div variants={itemVariants}>
            <Medicine3DShelf 
              medicines={medicines} 
              onMedicineClick={handleMedicineClick}
            />
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {medicines.map((medicine) => (
              <MedicineCard
                key={medicine._id}
                medicine={medicine}
                onDelete={handleDelete}
              />
            ))}
          </motion.div>
        )}

        {/* Medicine Details Modal */}
        <AnimatePresence>
          {selectedMedicine && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setSelectedMedicine(null)}
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
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
                    {selectedMedicine.name}
                  </h2>
                  <p className="text-blue-400">
                    {selectedMedicine.medicineId}
                  </p>
                </div>

                <div className="space-y-4 text-white">
                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Manufacturer:</span>
                    <span className="font-semibold">{selectedMedicine.manufacturer}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Stock:</span>
                    <span className={`font-bold ${selectedMedicine.stock < 20 ? 'text-yellow-400' : 'text-green-400'}`}>
                      {selectedMedicine.stock} units
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Price:</span>
                    <span className="font-bold text-green-400">₹{selectedMedicine.price}</span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-800 rounded-lg">
                    <span className="text-gray-400">Expiry Date:</span>
                    <span className={new Date(selectedMedicine.expiryDate) < new Date() ? 'text-red-400 font-bold' : 'text-white'}>
                      {new Date(selectedMedicine.expiryDate).toLocaleDateString()}
                    </span>
                  </div>

                  {new Date(selectedMedicine.expiryDate) < new Date() && (
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-3 text-center"
                    >
                      <p className="text-red-300 font-bold">⚠️ EXPIRED MEDICINE</p>
                    </motion.div>
                  )}
                </div>

                <div className="flex gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (window.confirm(`Delete ${selectedMedicine.name}?`)) {
                        handleDelete(selectedMedicine._id);
                      }
                    }}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold py-3 rounded-lg shadow-lg"
                  >
                    🗑️ Delete
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedMedicine(null)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-3 rounded-lg shadow-lg"
                  >
                    Close
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Dashboard;
