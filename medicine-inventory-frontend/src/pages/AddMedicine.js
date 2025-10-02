import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import medicineService from '../services/api';

const AddMedicine = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    medicineId: '',
    name: '',
    manufacturer: '',
    expiryDate: '',
    stock: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Convert stock and price to numbers
      const medicineData = {
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price)
      };

      await medicineService.addMedicine(medicineData);
      setSuccess(true);
      
      // Reset form
      setFormData({
        medicineId: '',
        name: '',
        manufacturer: '',
        expiryDate: '',
        stock: '',
        price: ''
      });

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to add medicine. Please check all fields.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="max-w-2xl w-full"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            ➕ Add Medicine
          </h1>
          <p className="text-gray-300">
            Register a new medicine in your inventory
          </p>
        </motion.div>

        {/* Success Message */}
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-600 bg-opacity-50 backdrop-blur-md rounded-xl p-4 mb-6 text-center"
          >
            <div className="text-4xl mb-2">✅</div>
            <p className="text-white font-semibold">
              Medicine added successfully! Redirecting to dashboard...
            </p>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-600 bg-opacity-50 backdrop-blur-md rounded-xl p-4 mb-6 text-center"
          >
            <div className="text-4xl mb-2">❌</div>
            <p className="text-white font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <motion.form
          variants={formVariants}
          onSubmit={handleSubmit}
          className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-8 shadow-2xl"
        >
          <div className="space-y-6">
            {/* Medicine ID */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold mb-2">
                Medicine ID *
              </label>
              <input
                type="text"
                name="medicineId"
                value={formData.medicineId}
                onChange={handleChange}
                required
                placeholder="e.g., M001"
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>

            {/* Medicine Name */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold mb-2">
                Medicine Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Paracetamol"
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>

            {/* Manufacturer */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold mb-2">
                Manufacturer *
              </label>
              <input
                type="text"
                name="manufacturer"
                value={formData.manufacturer}
                onChange={handleChange}
                required
                placeholder="e.g., Cipla"
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>

            {/* Expiry Date */}
            <motion.div variants={itemVariants}>
              <label className="block text-white font-semibold mb-2">
                Expiry Date *
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </motion.div>

            {/* Stock and Price Grid */}
            <div className="grid grid-cols-2 gap-6">
              {/* Stock */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-semibold mb-2">
                  Stock *
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="e.g., 50"
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </motion.div>

              {/* Price */}
              <motion.div variants={itemVariants}>
                <label className="block text-white font-semibold mb-2">
                  Price (₹) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="e.g., 15"
                  className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </motion.div>
            </div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-lg transition-all ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-2xl'
              } text-white`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-block mr-2"
                  >
                    ⏳
                  </motion.span>
                  Adding Medicine...
                </span>
              ) : (
                '➕ Add Medicine'
              )}
            </motion.button>
          </div>
        </motion.form>

        {/* Info Card */}
        <motion.div
          variants={itemVariants}
          className="mt-6 bg-blue-600 bg-opacity-30 backdrop-blur-md rounded-xl p-4 text-center"
        >
          <p className="text-gray-200 text-sm">
            💡 All fields marked with * are required
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddMedicine;
