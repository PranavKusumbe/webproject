import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PillBottle3D from '../components/PillBottle3D';

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const features = [
    { icon: '📊', title: 'Dashboard', desc: 'View all medicines', link: '/dashboard' },
    { icon: '➕', title: 'Add Medicine', desc: 'Register new medicine', link: '/add' },
    { icon: '🔍', title: 'Search', desc: 'Find medicines quickly', link: '/search' },
    { icon: '⚠️', title: 'Expired', desc: 'Manage expired items', link: '/expired' },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl w-full"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 mb-4">
            Medicine Inventory
          </h1>
          <p className="text-2xl text-gray-300 mb-8">
            Manage your pharmacy with style 💊
          </p>
        </motion.div>

        {/* 3D Pill Bottle */}
        <motion.div
          variants={itemVariants}
          className="mb-12"
        >
          <PillBottle3D />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <Link key={index} to={feature.link}>
              <motion.div
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
                  rotateY: 5
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 text-center cursor-pointer transform-gpu hover:bg-gradient-to-br hover:from-blue-900 hover:to-purple-900 transition-all duration-300"
              >
                <div className="text-6xl mb-4 animate-float">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.desc}
                </p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to manage your inventory?
          </h2>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-2xl transition-all"
            >
              Get Started →
            </motion.button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Home;
