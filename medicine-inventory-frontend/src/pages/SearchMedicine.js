import React, { useState } from 'react';
import { motion } from 'framer-motion';
import MedicineCard from '../components/MedicineCard';
import medicineService from '../services/api';

const SearchMedicine = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a medicine name');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await medicineService.searchMedicine(searchQuery);
      setResults(response.data);
    } catch (err) {
      setError('Failed to search. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await medicineService.deleteMedicine(id);
      // Remove from results
      setResults(results.filter(m => m._id !== id));
    } catch (err) {
      alert('Failed to delete medicine');
      console.error(err);
    }
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

  return (
    <div className="min-h-screen p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">
            🔍 Search Medicine
          </h1>
          <p className="text-gray-300">
            Find medicines by name
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearch}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter medicine name..."
              className="w-full px-6 py-5 bg-gray-800 bg-opacity-50 backdrop-blur-md text-white text-xl rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500 transition-all shadow-2xl neon-border"
              style={{
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
              }}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-8 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50"
            >
              {loading ? '⏳' : '🔍 Search'}
            </motion.button>
          </div>
        </motion.form>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto bg-red-600 bg-opacity-50 backdrop-blur-md rounded-xl p-4 mb-8 text-center"
          >
            <div className="text-4xl mb-2">❌</div>
            <p className="text-white font-semibold">{error}</p>
          </motion.div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="text-6xl"
            >
              💊
            </motion.div>
          </div>
        )}

        {/* Results */}
        {!loading && searched && (
          <motion.div variants={containerVariants}>
            {results.length === 0 ? (
              <motion.div
                variants={itemVariants}
                className="bg-gray-800 bg-opacity-50 backdrop-blur-md rounded-2xl p-12 text-center"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-400">
                  Try searching with a different name
                </p>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={itemVariants}
                  className="mb-6 text-center"
                >
                  <h2 className="text-2xl font-bold text-white">
                    Found {results.length} result{results.length !== 1 ? 's' : ''}
                  </h2>
                </motion.div>

                <motion.div
                  variants={containerVariants}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  {results.map((medicine) => (
                    <MedicineCard
                      key={medicine._id}
                      medicine={medicine}
                      onDelete={handleDelete}
                    />
                  ))}
                </motion.div>
              </>
            )}
          </motion.div>
        )}

        {/* Initial State */}
        {!loading && !searched && (
          <motion.div
            variants={itemVariants}
            className="bg-gradient-to-br from-blue-900 to-purple-900 bg-opacity-50 backdrop-blur-md rounded-2xl p-12 text-center"
          >
            <div className="text-8xl mb-6 animate-float">🔍</div>
            <h3 className="text-3xl font-bold text-white mb-4">
              Start Searching
            </h3>
            <p className="text-gray-300 text-lg">
              Enter a medicine name above to find matching results
            </p>
          </motion.div>
        )}

        {/* Search Tips */}
        <motion.div
          variants={itemVariants}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-blue-600 bg-opacity-30 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">💡</div>
            <h4 className="text-white font-semibold mb-2">Case Insensitive</h4>
            <p className="text-gray-300 text-sm">
              Search works with any case
            </p>
          </div>

          <div className="bg-purple-600 bg-opacity-30 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">🎯</div>
            <h4 className="text-white font-semibold mb-2">Partial Match</h4>
            <p className="text-gray-300 text-sm">
              Find medicines with partial names
            </p>
          </div>

          <div className="bg-pink-600 bg-opacity-30 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-4xl mb-2">⚡</div>
            <h4 className="text-white font-semibold mb-2">Fast Results</h4>
            <p className="text-gray-300 text-sm">
              Instant search results
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SearchMedicine;
