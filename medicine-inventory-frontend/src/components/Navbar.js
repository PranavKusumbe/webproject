import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '🏠 Home' },
    { path: '/dashboard', label: '📊 Dashboard' },
    { path: '/add', label: '➕ Add Medicine' },
    { path: '/search', label: '🔍 Search' },
    { path: '/expired', label: '⚠️ Expired' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-gray-900 bg-opacity-90 backdrop-blur-md shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2"
            >
              <span className="text-3xl">💊</span>
              <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                MediTrack
              </span>
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {item.label}
                </motion.button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
