import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaTimesCircle, FaWeight, FaCalendarAlt, FaPlane, FaPrescriptionBottleAlt, FaHeartbeat } from 'react-icons/fa';

// Animated SVG Red Blobs for background
const AnimatedBlobs = ({ mouse }) => (
  <div className="pointer-events-none fixed inset-0 z-0">
    <motion.svg
      width="100vw"
      height="100vh"
      viewBox="0 0 1440 900"
      className="absolute top-0 left-0 w-full h-full"
      style={{ filter: 'blur(60px)', opacity: 0.35 }}
    >
      <motion.ellipse
        cx={400 + (mouse.x || 0) * 0.1}
        cy={300 + (mouse.y || 0) * 0.1}
        initial={{ rx: 320, ry: 180 }}
        animate={{
          rx: [320, 340, 320],
          ry: [180, 200, 180],
        }}
        fill="url(#red1)"
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
      />
      <motion.ellipse
        cx={1100 - (mouse.x || 0) * 0.08}
        cy={600 - (mouse.y || 0) * 0.08}
        initial={{ rx: 220, ry: 120 }}
        animate={{
          rx: [220, 250, 220],
          ry: [120, 140, 120],
        }}
        fill="url(#red2)"
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <defs>
        <radialGradient id="red1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ff4d4f" />
          <stop offset="100%" stopColor="#b91c1c" />
        </radialGradient>
        <radialGradient id="red2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f87171" />
          <stop offset="100%" stopColor="#991b1b" />
        </radialGradient>
      </defs>
    </motion.svg>
  </div>
);

const EligibilityChecker = () => {
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };
  
  const [formData, setFormData] = useState({
    weight: "",
    lastDonation: "",
    recentTravel: "",
    medications: "",
    healthCondition: "",
  });

  const [eligibility, setEligibility] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/check-eligibility", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setEligibility(data);
    } catch (error) {
      console.error("Error checking eligibility:", error);
    }
  };

  // For glassmorphism card style
  const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';
  
  // Icon variants for animation
  const iconVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.15, rotate: [0, 10, -10, 0], transition: { duration: 0.6 } },
  };

  return (
    <div 
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-6 shadow-lg shadow-red-300/40"
            style={{ letterSpacing: 2 }}
          >
            BLOOD DONATION ELIGIBILITY
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Check Your Eligibility
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Find out if you're eligible to donate blood today and help save lives.
          </motion.p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className={`${glass} rounded-2xl overflow-hidden max-w-xl mx-auto`}
        >
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <div className="flex items-center mb-2">
                  <motion.div 
                    variants={iconVariants}
                    whileHover="hover"
                    className="mr-2 text-red-500"
                  >
                    <FaWeight size={18} />
                  </motion.div>
                  <label className="text-gray-800 font-medium">Weight (kg):</label>
                </div>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <motion.div 
                    variants={iconVariants}
                    whileHover="hover"
                    className="mr-2 text-red-500"
                  >
                    <FaCalendarAlt size={18} />
                  </motion.div>
                  <label className="text-gray-800 font-medium">Last Donation (days ago):</label>
                </div>
                <input
                  type="number"
                  name="lastDonation"
                  value={formData.lastDonation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <motion.div 
                    variants={iconVariants}
                    whileHover="hover"
                    className="mr-2 text-red-500"
                  >
                    <FaPlane size={18} />
                  </motion.div>
                  <label className="text-gray-800 font-medium">Recent International Travel (days ago):</label>
                </div>
                <input
                  type="number"
                  name="recentTravel"
                  value={formData.recentTravel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <motion.div 
                    variants={iconVariants}
                    whileHover="hover"
                    className="mr-2 text-red-500"
                  >
                    <FaPrescriptionBottleAlt size={18} />
                  </motion.div>
                  <label className="text-gray-800 font-medium">Current Medications:</label>
                </div>
                <input
                  type="text"
                  name="medications"
                  value={formData.medications}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              
              <div>
                <div className="flex items-center mb-2">
                  <motion.div 
                    variants={iconVariants}
                    whileHover="hover"
                    className="mr-2 text-red-500"
                  >
                    <FaHeartbeat size={18} />
                  </motion.div>
                  <label className="text-gray-800 font-medium">Health Conditions:</label>
                </div>
                <select
                  name="healthCondition"
                  value={formData.healthCondition}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                >
                  <option value="">Select Health Condition</option>
                  <option value="none">None</option>
                  <option value="hypertension">Hypertension</option>
                  <option value="diabetes">Diabetes</option>
                  <option value="anemia">Anemia</option>
                </select>
              </div>
              
              <motion.button
                type="submit"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-6 py-4 font-bold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg shadow-red-500/30"
              >
                Check Eligibility
              </motion.button>
            </form>
            
            {eligibility && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-8 p-6 rounded-xl bg-white/60 border border-gray-100"
              >
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Eligibility Result</h2>
                <div className="flex items-center mb-3">
                  {eligibility.isEligible ? (
                    <FaCheckCircle size={24} className="text-green-500 mr-2" />
                  ) : (
                    <FaTimesCircle size={24} className="text-red-500 mr-2" />
                  )}
                  <p className={`text-xl font-semibold ${eligibility.isEligible ? 'text-green-600' : 'text-red-600'}`}>
                    {eligibility.isEligible ? "You Are Eligible to Donate" : "You Are Not Eligible to Donate"}
                  </p>
                </div>
                <p className="text-gray-700 bg-white/50 p-4 rounded-lg border border-gray-100">
                  {eligibility.message}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EligibilityChecker;