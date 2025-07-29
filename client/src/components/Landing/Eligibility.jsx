import { useState, useRef } from 'react';
import { differenceInMonths } from "date-fns";
import bloodDonationImg from '/bloodDonation.png';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaTimesCircle, FaHeartbeat, FaWeight, FaCalendarAlt, FaMedkit, FaProcedures, FaSmile, FaQuestionCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

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

const Eligibility = () => {
  const navigate = useNavigate();
  
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };
  
  // For glassmorphism card style
  const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';

  const [formData, setFormData] = useState({
    age: "", weight: "", lastDonation: "", chronicDisease: "No", diseaseName: "", recentProcedure: "No", feelingHealthy: "Yes",
  });

  const [eligibility, setEligibility] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkEligibility = () => {
    if (!formData.age || !formData.weight || !formData.lastDonation) {
      setEligibility("Please fill out all required fields.");
      return;
    }

    const age = Number(formData.age);
    const weight = Number(formData.weight);
    const lastDonationDate = new Date(formData.lastDonation);
    const monthsSinceLastDonation = differenceInMonths(new Date(), lastDonationDate);

    if (age < 18 || age > 65) {
      setEligibility("Not eligible: Age must be between 18 and 65.");
    } else if (weight < 50) {
      setEligibility("Not eligible: Minimum weight should be more than 50 kg.");
    } else if (formData.chronicDisease === "Yes" && !formData.diseaseName.trim()) {
      setEligibility("Not eligible: Please specify your chronic disease.");
    } else if (formData.chronicDisease === "Yes") {
      setEligibility("Not eligible: You have a chronic disease.");
    } else if (formData.recentProcedure === "Yes") {
      setEligibility("Not eligible: Wait 6 months after tattoo/piercing/surgery.");
    } else if (formData.feelingHealthy === "No") {
      setEligibility("Not eligible: You must be in good health to donate.");
    } else if (monthsSinceLastDonation < 3) {
      setEligibility("Not eligible: You must wait at least 3 months between donations.");
    } else {
      setEligibility("Eligible: You meet the requirements to donate blood.");
    }
  };

  return (
    <div
      className="relative min-h-screen py-30 px-4 sm:px-6 lg:px-8 overflow-x-hidden"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-8 shadow-lg shadow-red-300/40"
            style={{ letterSpacing: 2 }}
          >
            CHECK YOUR ELIGIBILITY
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Blood Donation Eligibility Test
          </motion.h1>
          
          <motion.p
            className="text-2xl max-w-3xl mx-auto text-red-900/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Donating blood is a simple, safe, and life-saving act. Take our quick self-assessment to check if you're eligible to donate blood today.
          </motion.p>
        </motion.div>

        {/* Eligibility Form Section */}
        <div className="flex flex-col md:flex-row gap-12 items-start max-w-6xl mx-auto">
          <motion.div 
            className="w-full md:w-1/2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div
              className={`p-8 space-y-6 rounded-3xl ${glass} shadow-xl shadow-red-200/40`}
              style={{
                background: `linear-gradient(135deg, var(--bg-surface) 60%, #fff0 100%)`,
              }}
            >
            <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400">Donor Eligibility Form</h3>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                <FaHeartbeat className="text-red-500" />
                <span>Your Age</span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                style={{
                  color: "var(--text-main)"
                }}
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Enter your age (years)"
              />
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                <FaWeight className="text-red-500" />
                <span>Your Weight (kg)</span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                style={{
                  color: "var(--text-main)"
                }}
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="Enter your weight in kg"
              />
            </div>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                <FaCalendarAlt className="text-red-500" />
                <span>Last Donation Date</span>
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                style={{
                  color: "var(--text-main)"
                }}
                type="date"
                name="lastDonation"
                value={formData.lastDonation}
                onChange={handleChange}
              />
              <p className="text-sm text-red-700/70 italic">Blood can be donated every 3 months safely</p>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                <FaMedkit className="text-red-500" />
                <span>Do you have any chronic diseases?</span>
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                name="chronicDisease"
                value={formData.chronicDisease}
                onChange={handleChange}
                className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                style={{
                  color: "var(--text-main)"
                }}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </motion.select>
            </div>
            {formData.chronicDisease === "Yes" && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3"
              >
                <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                  <FaQuestionCircle className="text-red-500" />
                  <span>If Yes, please specify</span>
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                  style={{
                    color: "var(--text-main)"
                  }}
                  name="diseaseName"
                  value={formData.diseaseName}
                  onChange={handleChange}
                  placeholder="Type your condition here"
                />
              </motion.div>
            )}
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                <FaProcedures className="text-red-500" />
                <span>Have you had a tattoo, piercing, or surgery in the last 6 months?</span>
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                name="recentProcedure"
                value={formData.recentProcedure}
                onChange={handleChange}
                className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                style={{
                  color: "var(--text-main)"
                }}
              >
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </motion.select>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center space-x-2 font-medium text-lg text-red-900/90">
                <FaSmile className="text-red-500" />
                <span>Are you currently feeling healthy?</span>
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                name="feelingHealthy"
                value={formData.feelingHealthy}
                onChange={handleChange}
                className="w-full border-2 border-red-200/50 p-3 rounded-xl bg-white/50 backdrop-blur-sm focus:border-red-400 focus:ring-2 focus:ring-red-200 transition-all duration-300"
                style={{
                  color: "var(--text-main)"
                }}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </motion.select>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full mt-8 py-4 px-6 rounded-xl bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-xl shadow-lg shadow-red-300/40 hover:shadow-xl hover:shadow-red-400/50 transition-all duration-300"
              onClick={checkEligibility}
            >
              Check Eligibility
            </motion.button>
            
            {eligibility && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-6 rounded-xl text-center font-medium text-lg shadow-lg ${
                  eligibility.startsWith("Eligible") ? 
                    "bg-gradient-to-r from-green-500/10 to-green-600/10 border-2 border-green-500/30 text-green-600" : 
                    "bg-gradient-to-r from-red-500/10 to-red-600/10 border-2 border-red-500/30 text-red-600"
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-2">
                  {eligibility.startsWith("Eligible") ? (
                    <FaCheckCircle className="text-green-500 text-2xl" />
                  ) : (
                    <FaTimesCircle className="text-red-500 text-2xl" />
                  )}
                </div>
                {eligibility}
              </motion.div>
            )}
          </div>
          </motion.div>
          
          <motion.div 
            className="w-full md:w-1/2 flex justify-center items-center"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute -inset-4 bg-gradient-to-r from-red-300 via-red-500 to-red-600 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
              <img
                src={bloodDonationImg}
                alt="Donate Blood"
                className="w-full max-w-lg object-contain relative z-10 drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Eligibility Requirements Section */}
        <motion.div 
          className="mt-20 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 drop-shadow-lg">
            Basic Eligibility Requirements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: 'Age',
                description: 'You should be between 18 and 65 years old to donate blood. Some centers may accept donors up to age 70.',
              },
              {
                title: 'Weight',
                description: 'You should weigh at least 50 kg (110 lbs) to be eligible for blood donation.',
              },
              {
                title: 'Health Status',
                description: 'You should be in good health, feeling well and able to perform normal activities.',
              },
              {
                title: 'Medical History',
                description: 'No history of hepatitis B or C, HIV, or other chronic diseases that may disqualify you.',
              },
              {
                title: 'Recent Procedures',
                description: 'No tattoos, piercings, or surgeries in the last 6 months to ensure safety.',
              },
              {
                title: 'Time Between Donations',
                description: 'You must wait at least 3 months between whole blood donations to allow your body to recover.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                className={`rounded-3xl p-8 ${glass} shadow-lg shadow-red-200/40 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/60 relative overflow-hidden`}
                whileHover={{ scale: 1.07 }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1 }}
              >
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400">{item.title}</h3>
                <p className="text-lg text-red-900/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Banner */}
        <motion.div 
          className="mt-16 rounded-3xl p-12 text-center shadow-2xl bg-gradient-to-r from-red-500 via-red-400 to-red-700 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <motion.div
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ background: 'linear-gradient(120deg, #fff3 30%, #fff6 50%, #fff3 70%)', mixBlendMode: 'overlay' }}
          />
          <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">
            Ready to Save Lives?
          </h2>
          <p className="text-2xl max-w-2xl mx-auto mb-8 text-white/90">
            If you're eligible to donate, find a donation center near you and make an appointment today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button 
              className="bg-white text-red-600 font-bold px-10 py-5 rounded-xl hover:bg-red-100 transition-colors shadow-lg shadow-red-200/40 text-xl relative overflow-hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
            >
              Register as Donor
            </motion.button>
            <motion.button 
              className="bg-transparent border-2 border-white text-white font-bold px-10 py-5 rounded-xl hover:bg-white/10 transition-colors text-xl shadow-lg shadow-red-200/40 relative overflow-hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/banks')}
            >
              Find Donation Centers
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Add PropTypes validation
AnimatedBlobs.propTypes = {
  mouse: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
};

export default Eligibility;