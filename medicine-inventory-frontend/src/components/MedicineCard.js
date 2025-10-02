import React, { useState } from 'react';
import { motion } from 'framer-motion';

const MedicineCard = ({ medicine, onDelete, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  
  const isExpired = new Date(medicine.expiryDate) < new Date();
  const isLowStock = medicine.stock < 20;
  
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    hover: { 
      scale: 1.05, 
      rotateY: 10,
      z: 50,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      onHoverStart={() => setShowDetails(true)}
      onHoverEnd={() => setShowDetails(false)}
      className={`relative bg-gradient-to-br ${
        isExpired 
          ? 'from-red-900 to-red-700' 
          : isLowStock
          ? 'from-yellow-900 to-yellow-700'
          : 'from-indigo-900 to-purple-900'
      } rounded-2xl p-6 shadow-2xl cursor-pointer transform-gpu perspective-1000`}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Status Badge */}
      {(isExpired || isLowStock) && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`absolute top-4 right-4 ${
            isExpired ? 'bg-red-500' : 'bg-yellow-500'
          } text-white px-3 py-1 rounded-full text-xs font-bold`}
        >
          {isExpired ? '⚠️ EXPIRED' : '⚠️ LOW STOCK'}
        </motion.div>
      )}

      {/* Medicine Icon */}
      <div className="text-6xl mb-4 animate-float">
        💊
      </div>

      {/* Medicine Name */}
      <h3 className="text-2xl font-bold text-white mb-2">
        {medicine.name}
      </h3>

      {/* Medicine ID */}
      <p className="text-blue-300 text-sm mb-4">
        ID: {medicine.medicineId}
      </p>

      {/* Details (shown on hover) */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: showDetails ? 1 : 0,
          height: showDetails ? 'auto' : 0
        }}
        className="overflow-hidden"
      >
        <div className="space-y-2 text-white">
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Manufacturer:</span>
            <span className="font-semibold">{medicine.manufacturer}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Stock:</span>
            <span className={`font-bold ${isLowStock ? 'text-yellow-300' : 'text-green-300'}`}>
              {medicine.stock} units
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Price:</span>
            <span className="font-semibold text-green-300">₹{medicine.price}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-gray-300">Expiry:</span>
            <span className={`font-semibold ${isExpired ? 'text-red-300' : 'text-blue-300'}`}>
              {formatDate(medicine.expiryDate)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-4">
            {onUpdate && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(medicine);
                }}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Update
              </motion.button>
            )}
            
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (window.confirm(`Delete ${medicine.name}?`)) {
                    onDelete(medicine._id);
                  }
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Delete
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Base Info (always visible) */}
      {!showDetails && (
        <div className="space-y-2 text-white mt-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Stock:</span>
            <span className="font-bold">{medicine.stock}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Price:</span>
            <span className="font-bold text-green-300">₹{medicine.price}</span>
          </div>
        </div>
      )}

      {/* Hover Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showDetails ? 0 : 1 }}
        className="text-center text-gray-400 text-sm mt-4"
      >
        Hover for details
      </motion.div>
    </motion.div>
  );
};

export default MedicineCard;
