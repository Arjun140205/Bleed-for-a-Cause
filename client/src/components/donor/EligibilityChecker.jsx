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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Donor Eligibility Checker
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Last Donation (days ago):</label>
            <input
              type="number"
              name="lastDonation"
              value={formData.lastDonation}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Recent International Travel (days ago):</label>
            <input
              type="number"
              name="recentTravel"
              value={formData.recentTravel}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Current Medications:</label>
            <input
              type="text"
              name="medications"
              value={formData.medications}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>
          <div>
            <label className="block text-gray-700">Health Conditions:</label>
            <select
              name="healthCondition"
              value={formData.healthCondition}
              onChange={handleChange}
              className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="">Select Health Condition</option>
              <option value="none">None</option>
              <option value="hypertension">Hypertension</option>
              <option value="diabetes">Diabetes</option>
              <option value="anemia">Anemia</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
          >
            Check Eligibility
          </button>
        </form>
        {eligibility && (
          <div className="mt-6">
            <h2 className="text-xl font-bold mb-2">Eligibility Result</h2>
            <p className={`text-lg font-semibold ${eligibility.isEligible ? 'text-green-600' : 'text-red-600'}`}>
              {eligibility.isEligible ? "Eligible to Donate" : "Not Eligible to Donate"}
            </p>
            <p className="text-gray-700 mt-2">{eligibility.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EligibilityChecker;