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
  const [lowStockWarning, setLowStockWarning] = useState(false);
  const [expiryWarning, setExpiryWarning] = useState('');
  const [submittedInfo, setSubmittedInfo] = useState(null);

  // Get today's date in YYYY-MM-DD format for min date validation
  const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear previous submission details when editing again
    if (submittedInfo) setSubmittedInfo(null);

    // Real-time validation for stock (low stock warning)
    if (name === 'stock') {
      const stockValue = parseInt(value);
      setLowStockWarning(stockValue > 0 && stockValue < 10);
    }

    // Real-time validation for expiry date
    if (name === 'expiryDate') {
      const selectedDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setExpiryWarning('⚠️ Cannot add medicine with expired date!');
      } else if (selectedDate <= new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        setExpiryWarning('⚠️ Medicine expires within 30 days');
      } else {
        setExpiryWarning('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Convert stock and price to numbers
      const medicineData = {
        ...formData,
        stock: parseInt(formData.stock),
        price: parseFloat(formData.price)
      };

      // Final validation check before submission
      const expiryDate = new Date(medicineData.expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (expiryDate < today) {
        setError('Cannot add medicine with expired date. Please check the expiry date.');
        setLoading(false);
        return;
      }

      const response = await medicineService.addMedicine(medicineData);
      
      // Show detailed success message
      setSubmittedInfo({
        medicineId: medicineData.medicineId,
        name: medicineData.name,
        stock: medicineData.stock
      });
      setSuccess(true);
      setError(null);
      
      // Show low stock warning in success message if applicable
      if (medicineData.stock < 10) {
        console.warn(`⚠️ Warning: ${medicineData.name} added with low stock (${medicineData.stock} units)`);
      }
      
      // Reset form
      setFormData({
        medicineId: '',
        name: '',
        manufacturer: '',
        expiryDate: '',
        stock: '',
        price: ''
      });
  setLowStockWarning(false);
  setExpiryWarning('');

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('Add medicine error:', err);
      
      // Enhanced error handling based on error type
      if (err.isNetworkError) {
        setError('❌ Network Error: Cannot connect to server. Please check if the backend is running.');
      } else if (err.isValidationError) {
        setError(`❌ Validation Error: ${err.message}`);
      } else if (err.response?.data?.message) {
        setError(`❌ ${err.response.data.message}`);
      } else {
        setError(err.message || '❌ Failed to add medicine. Please check all fields and try again.');
      }
      
      setSuccess(false);
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
            className="bg-green-600 bg-opacity-50 backdrop-blur-md rounded-xl p-6 mb-6"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">✅</div>
              <p className="text-white font-bold text-xl mb-2">
                Medicine Added Successfully!
              </p>
              <div className="text-green-100 text-sm space-y-1">
                <p>✓ Medicine ID: {submittedInfo?.medicineId}</p>
                <p>✓ Name: {submittedInfo?.name}</p>
                <p>✓ Stock: {submittedInfo?.stock} units</p>
              </div>
              {submittedInfo?.stock !== undefined && submittedInfo.stock < 10 && (
                <div className="mt-3 bg-yellow-600 bg-opacity-40 rounded-lg p-2">
                  <p className="text-yellow-100 text-sm">
                    ⚠️ Low Stock Warning: Stock is below 10 units
                  </p>
                </div>
              )}
              <p className="text-green-200 text-sm mt-3">
                Redirecting to dashboard...
              </p>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-600 bg-opacity-50 backdrop-blur-md rounded-xl p-6 mb-6"
          >
            <div className="text-center">
              <div className="text-5xl mb-3">❌</div>
              <p className="text-white font-bold text-lg mb-2">
                Failed to Add Medicine
              </p>
              <p className="text-red-100 text-sm">{error}</p>
              <div className="mt-4 text-left bg-red-700 bg-opacity-30 rounded-lg p-3">
                <p className="text-red-100 text-xs font-semibold mb-1">Troubleshooting:</p>
                <ul className="text-red-200 text-xs space-y-1">
                  <li>• Check if backend server is running on port 5000</li>
                  <li>• Verify all required fields are filled correctly</li>
                  <li>• Ensure expiry date is not in the past</li>
                  <li>• Check that stock and price are positive numbers</li>
                </ul>
              </div>
            </div>
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
                min={getTodayDate()}
                className="w-full px-4 py-3 bg-gray-900 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              {expiryWarning && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 p-2 rounded-lg text-sm ${
                    expiryWarning.includes('Cannot')
                      ? 'bg-red-600 bg-opacity-40 text-red-100'
                      : 'bg-yellow-600 bg-opacity-40 text-yellow-100'
                  }`}
                >
                  {expiryWarning}
                </motion.div>
              )}
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
                {lowStockWarning && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 p-2 bg-yellow-600 bg-opacity-40 rounded-lg"
                  >
                    <p className="text-yellow-100 text-xs flex items-center">
                      <span className="mr-1">⚠️</span>
                      Low Stock Warning: Below 10 units
                    </p>
                  </motion.div>
                )}
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
          className="mt-6 space-y-3"
        >
          <div className="bg-blue-600 bg-opacity-30 backdrop-blur-md rounded-xl p-4">
            <p className="text-gray-200 text-sm text-center">
              💡 All fields marked with * are required
            </p>
          </div>
          
          <div className="bg-purple-600 bg-opacity-30 backdrop-blur-md rounded-xl p-4">
            <p className="text-gray-200 text-sm font-semibold mb-2">📋 Validation Rules:</p>
            <ul className="text-gray-300 text-xs space-y-1">
              <li>✓ Expiry date must be in the future</li>
              <li>✓ Stock must be 0 or greater</li>
              <li>✓ Price must be greater than 0</li>
              <li>⚠️ Low stock alert triggers when stock {'<'} 10</li>
            </ul>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AddMedicine;
