import { useState, useEffect, useRef } from "react";
import { FaUser, FaTint, FaCalendarAlt, FaNotesMedical, FaMapMarkerAlt, FaEnvelope, FaPhone } from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import { motion } from "framer-motion";

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

const DonorProfile = () => {
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  useEffect(() => {
    const fetchDonorData = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await fetch(`${BASE_URL}/auth/verify/donor`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();
        setDonor(data.user);
      } catch (error) {
        console.error("Error fetching donor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorData();
  }, []);

  // For glassmorphism card style
  const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';
  
  // Icon variants for animation
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.15, rotate: [0, 10, -10, 0], transition: { duration: 0.6 } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="relative z-10 max-w-7xl mx-auto">
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
            DONOR PROFILE
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {donor?.name || "Donor Profile"}
          </motion.h1>
        </motion.div>
        
        {donor && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className={`${glass} rounded-2xl overflow-hidden p-8`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <motion.div 
                        className="w-32 h-32 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg"
                        whileHover={{ scale: 1.05 }}
                      >
                        {donor.name ? donor.name[0].toUpperCase() : <FaUser />}
                      </motion.div>
                      <motion.div
                        className="absolute -bottom-2 -right-2 bg-white text-red-500 rounded-full w-10 h-10 flex items-center justify-center shadow-md"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                      >
                        <FaTint size={20} />
                      </motion.div>
                    </div>
                  </div>

                  <div className="space-y-4 bg-white/50 p-6 rounded-xl">
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="font-semibold text-lg text-gray-800">{donor.name}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <div className="flex items-center">
                        <FaEnvelope className="text-red-500 mr-2" />
                        <p className="font-semibold text-gray-800">{donor.email}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <div className="flex items-center">
                        <FaPhone className="text-red-500 mr-2" />
                        <p className="font-semibold text-gray-800">{donor.phone || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className={`${glass} p-6 rounded-xl`}>
                    <div className="flex items-center mb-4">
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className="p-3 bg-red-100 text-red-600 rounded-full mr-4"
                      >
                        <FaTint size={20} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Blood Type</h3>
                        <p className="text-2xl font-bold text-red-600">{donor.bloodType?.replace("_", "+") || "Not specified"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${glass} p-6 rounded-xl`}>
                    <div className="flex items-center mb-4">
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className="p-3 bg-red-100 text-red-600 rounded-full mr-4"
                      >
                        <FaCalendarAlt size={20} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Last Donation</h3>
                        <p className="text-gray-700">
                          {donor.lastDonationDate 
                            ? new Date(donor.lastDonationDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })
                            : "No donation record"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${glass} p-6 rounded-xl`}>
                    <div className="flex items-center mb-4">
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className="p-3 bg-red-100 text-red-600 rounded-full mr-4"
                      >
                        <FaMapMarkerAlt size={20} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Location</h3>
                        <p className="text-gray-700">
                          {donor.district && donor.state 
                            ? `${donor.district}, ${donor.state}`
                            : "Location not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className={`${glass} p-6 rounded-xl`}>
                    <div className="flex items-center mb-4">
                      <motion.div
                        variants={iconVariants}
                        whileHover="hover"
                        className="p-3 bg-red-100 text-red-600 rounded-full mr-4"
                      >
                        <FaNotesMedical size={20} />
                      </motion.div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">Medical Condition</h3>
                        <p className="text-gray-700">{donor.medicalCondition || "None specified"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-red-500 to-red-700 text-white py-3 rounded-lg hover:from-red-600 hover:to-red-800 transition-colors duration-300 font-medium shadow-lg shadow-red-300/40"
                >
                  Edit Profile
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DonorProfile;
