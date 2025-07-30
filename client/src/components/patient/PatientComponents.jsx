import React from "react";
import { motion } from "framer-motion";

// Reusable animated blobs background for patient pages
export const AnimatedBlobs = ({ mouse }) => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <motion.svg
      width="100vw"
      height="100vh"
      viewBox="0 0 1440 900"
      className="absolute top-0 left-0 w-full h-full"
      style={{ filter: 'blur(60px)', opacity: 0.35 }}
    >
      <motion.ellipse
        cx={400 + (mouse?.x || 0) * 0.1}
        cy={300 + (mouse?.y || 0) * 0.1}
        initial={{ rx: 320, ry: 180 }}
        animate={{
          rx: [320, 340, 320],
          ry: [180, 200, 180],
        }}
        fill="url(#blue1)"
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx={1100 - (mouse?.x || 0) * 0.08}
        cy={600 - (mouse?.y || 0) * 0.08}
        initial={{ rx: 220, ry: 120 }}
        animate={{
          rx: [220, 250, 220],
          ry: [120, 140, 120],
        }}
        fill="url(#blue2)"
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <defs>
        <radialGradient id="blue1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1e40af" />
        </radialGradient>
        <radialGradient id="blue2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
        </radialGradient>
      </defs>
    </motion.svg>
  </div>
);

// Glassmorphism card component
export const GlassCard = ({ className = "", children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`relative backdrop-blur-md bg-white/80 border border-blue-100/50 shadow-xl rounded-xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

// Section title component
export const SectionTitle = ({ children, subtitle }) => (
  <motion.div 
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="text-center mb-12"
  >
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-6 shadow-lg shadow-blue-300/40"
      style={{ letterSpacing: 2 }}
    >
      PATIENT PORTAL
    </motion.div>
    
    <motion.h1 
      className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-indigo-600 mb-4 leading-tight drop-shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      {children}
    </motion.h1>
    
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="max-w-2xl mx-auto text-lg text-gray-600"
      >
        {subtitle}
      </motion.p>
    )}
  </motion.div>
);

// Custom styled button
export const Button = ({ children, onClick, className = "", primary = true, disabled = false }) => (
  <motion.button
    whileHover={{ scale: disabled ? 1 : 1.03 }}
    whileTap={{ scale: disabled ? 1 : 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50 shadow-md transition-all duration-200 ${
      primary 
        ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-blue-200/40" 
        : "bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-gray-200/30"
    } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"} ${className}`}
  >
    {children}
  </motion.button>
);

// Info card component
export const InfoCard = ({ icon, title, value, color = "bg-blue-500" }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        {icon}
      </div>
    </div>
  </motion.div>
);

// Page layout wrapper
export const PageLayout = ({ children, onMouseMove }) => {
  return (
    <div 
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-gray-100"
      onMouseMove={onMouseMove}
    >
      <div className="relative z-10 max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};
