import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import { FaCheckCircle, FaClock, FaTimesCircle, FaCalendarCheck, FaMapMarkerAlt, FaTint, FaHospital } from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import ListItem from "../ui/ListItem";
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

const Donations = () => {
  const navigate = useNavigate();
  const [donationHistory, setDonationHistory] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchDonationHistory = async () => {
      if (userType !== "donor" || !authToken) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/donor/history`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: authToken }),
        });

        const data = await response.json();
        if (data.success) {
          setDonationHistory(data.donations);
          setUpcomingAppointments(data.appointments);
        }
      } catch (error) {
        console.error("Error fetching donation history:", error);
      }
    };

    fetchDonationHistory();
  }, [userType, authToken, navigate]);

  // For glassmorphism card style
  const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';

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
            YOUR CONTRIBUTION
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Donation History
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            Track your past donations and upcoming appointments
          </motion.p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className={`${glass} p-8 rounded-2xl md:col-span-2`}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-red-100 pb-3">
              <div className="flex items-center">
                <FaTint className="text-red-500 mr-3" />
                Your Donation History
              </div>
            </h3>
            
            {donationHistory.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center p-8 bg-white/50 rounded-xl"
              >
                <p className="text-gray-600">No donation history found</p>
              </motion.div>
            ) : (
              <div className="overflow-hidden rounded-xl bg-white/50">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-red-50 text-gray-700">
                      <th className="p-4 text-left rounded-tl-lg">Date</th>
                      <th className="p-4 text-left">Location</th>
                      <th className="p-4 text-left">Blood Type</th>
                      <th className="p-4 text-left rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationHistory.map((donation, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="border-b border-red-50 hover:bg-white/70 transition-colors"
                      >
                        <td className="p-4">{donation.date}</td>
                        <td className="p-4">{donation.location}</td>
                        <td className="p-4">{donation.bloodType}</td>
                        <td className={`p-4 font-semibold flex items-center ${
                          donation.status === "Completed" ? "text-green-600" : "text-amber-600"
                        }`}>
                          {donation.status === "Completed" ? (
                            <FaCheckCircle className="mr-2" />
                          ) : (
                            <FaClock className="mr-2" />
                          )}
                          {donation.status}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className={`${glass} p-8 rounded-2xl`}
          >
            <h3 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-red-100 pb-3">
              <div className="flex items-center">
                <FaCalendarCheck className="text-red-500 mr-3" />
                Upcoming Appointments
              </div>
            </h3>
            
            {upcomingAppointments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center p-8 bg-white/50 rounded-xl"
              >
                <p className="text-gray-600">No upcoming appointments</p>
              </motion.div>
            ) : (
              <div className="space-y-6">
                {upcomingAppointments.map((appointment, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-white/50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-red-50"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-red-500 font-semibold">
                        <FaHospital className="mr-2" />
                        {appointment.location}
                      </div>
                      <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-medium">
                        {appointment.status}
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-2 text-gray-700">
                      <FaCalendarCheck className="mr-2 text-gray-500" />
                      <p>{appointment.date}</p>
                      <span className="mx-2">•</span>
                      <p>{appointment.time}</p>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <FaMapMarkerAlt className="mr-2 text-gray-500" />
                      <p className="text-sm">{appointment.location}</p>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-4 bg-gradient-to-r from-red-500 to-red-600 text-white py-2 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors duration-300 font-medium text-sm shadow-md shadow-red-200"
                    >
                      View Details
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Donations;
