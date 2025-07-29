import { useRef } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaHeartbeat, FaTint, FaUserMd } from 'react-icons/fa';
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

const Campaigns = () => {
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
  
  const activeCampaigns = [
    { 
      title: "Summer Blood Drive", 
      date: "March 3rd, 2025", 
      location: "City Convention Center",
      type: "Blood Drive",
      icon: FaTint,
      color: 'from-red-400 to-red-600',
      description: "Join our biggest blood donation event of the summer. Free health check-ups and refreshments for all donors."
    },
    { 
      title: "Emergency O-Negative Drive", 
      date: "Ongoing", 
      location: "All Donation Centers",
      type: "Urgent Request",
      icon: FaHeartbeat,
      color: 'from-red-600 to-red-900',
      description: "Critical shortage of O-negative blood. Your donation could save multiple lives in emergency situations."
    },
    { 
      title: "University Donation Challenge", 
      date: "April 15th, 2025", 
      location: "Campus Medical Center",
      type: "Blood Drive",
      icon: FaUsers,
      color: 'from-red-500 to-red-700',
      description: "Inter-university competition to encourage young donors. Win prizes and save lives!"
    },
    { 
      title: "Corporate Wellness Day", 
      date: "May 10th, 2025", 
      location: "Downtown Business District",
      type: "Blood Drive",
      icon: FaUserMd,
      color: 'from-red-300 to-red-500',
      description: "Partner with local businesses for employee wellness and blood donation. Special recognition for participating companies."
    }
  ];

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
            JOIN OUR MISSION
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Blood Donation Campaigns
          </motion.h1>
          
          <motion.p
            className="text-2xl max-w-3xl mx-auto text-red-900/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Be part of our community events that save lives. Every drop counts in our mission to ensure blood is available for all who need it.
          </motion.p>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {[
            { label: 'Active Campaigns', value: '12', color: 'from-red-400 to-red-600' },
            { label: 'Lives Impacted', value: '8.5K+', color: 'from-red-500 to-red-700' },
            { label: 'Partner Hospitals', value: '86', color: 'from-red-300 to-red-500' },
            { label: 'Donors Registered', value: '3.2K+', color: 'from-red-600 to-red-900' },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className={`rounded-3xl p-8 text-center ${glass} transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/60`}
              style={{
                background: `linear-gradient(135deg, var(--bg-surface) 60%, #fff0 100%)`,
              }}
              whileHover={{ scale: 1.07 }}
            >
              <div className={`text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r ${stat.color}`}>{stat.value}</div>
              <div className="mt-2 text-lg text-red-900/80 font-semibold tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Artistic Wavy Divider */}
        <svg className="w-full h-12 mb-12" viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 30 Q 360 60 720 30 T 1440 30 V60 H0V30Z" fill="#fee2e2" />
        </svg>

        {/* Upcoming Campaigns Section */}
        <motion.h2 
          className="text-4xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 drop-shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          Active & Upcoming Campaigns
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {activeCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.title}
              className={`p-8 rounded-3xl ${glass} transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/60 relative overflow-hidden`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Campaign Type Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-4 py-1.5 rounded-full text-white text-sm font-bold ${
                  campaign.type === "Urgent Request" 
                    ? "bg-gradient-to-r from-red-600 to-red-800"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}>
                  {campaign.type}
                </span>
              </div>

              {/* Campaign Icon */}
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${campaign.color} shadow-lg shadow-red-200/40`}>
                <campaign.icon className="text-white text-2xl" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400">{campaign.title}</h3>
              
              <p className="text-lg text-red-900/80 mb-4">{campaign.description}</p>
              
              <div className="flex items-center mb-2 text-red-900/70">
                <FaCalendarAlt className="mr-2 text-red-500" />
                <span>{campaign.date}</span>
              </div>
              
              <div className="flex items-center mb-5 text-red-900/70">
                <FaMapMarkerAlt className="mr-2 text-red-500" />
                <span>{campaign.location}</span>
              </div>
              
              <motion.button
                className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold rounded-xl hover:from-red-600 hover:to-red-800 transition-all duration-300 shadow-lg shadow-red-200/40"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Join Campaign
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-16 rounded-3xl py-20 px-8 md:py-24 md:px-12 text-center shadow-2xl relative overflow-hidden"
          style={{ 
            background: 'radial-gradient(circle at bottom right, #991b1b, #ef4444)',
            boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)' 
          }}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ delay: 1.6 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            animate={{ 
              x: ["0%", "100%"],
              opacity: [0.1, 0.3, 0.1]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 8,
              ease: "easeInOut" 
            }}
            style={{ 
              background: 'linear-gradient(120deg, transparent, rgba(255,255,255,0.3) 45%, transparent 55%)', 
              backgroundSize: '200% 100%',
              mixBlendMode: 'overlay' 
            }}
          />
          
          {/* Animated background dots */}
          <div className="absolute inset-0 overflow-hidden opacity-20">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white"
                style={{
                  width: Math.random() * 8 + 2 + 'px',
                  height: Math.random() * 8 + 2 + 'px',
                  left: Math.random() * 100 + '%',
                  top: Math.random() * 100 + '%',
                }}
                animate={{
                  opacity: [0.5, 1, 0.5],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: Math.random() * 3 + 2,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-8 drop-shadow-xl relative"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.8 }}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-red-100">
              Create Your Own Campaign
            </span>
          </motion.h2>
          
          <motion.p 
            className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/90"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 2 }}
          >
            Schools, businesses, community groups – organize your own blood donation event with our support.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row justify-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2.2 }}
          >
            <motion.button 
              className="group bg-white text-red-600 font-bold px-10 py-5 rounded-xl hover:bg-red-50 transition-all duration-300 shadow-xl shadow-red-700/30 text-xl relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(239, 68, 68, 0.4)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/contact')}
            >
              <span className="relative z-10 flex items-center justify-center">
                <motion.span
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Request a Campaign
                </motion.span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-0 group-hover:w-6 transition-all duration-300 overflow-hidden" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
              
              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-red-200/0 via-red-200/40 to-red-200/0 rounded-xl pointer-events-none"
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ x: "100%", opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </motion.button>
            
            <motion.button 
              className="group bg-transparent border-2 border-white text-white font-bold px-10 py-5 rounded-xl hover:bg-white/10 transition-all duration-300 text-xl shadow-xl shadow-red-700/20 relative overflow-hidden"
              whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(239, 68, 68, 0.3)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/eligibility')}
            >
              <span className="relative z-10 flex items-center justify-center">
                <motion.span
                  initial={{ x: -5 }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  Check Eligibility
                </motion.span>
                <motion.svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-6 w-0 group-hover:w-6 transition-all duration-300 overflow-hidden" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                  initial={{ x: -10, opacity: 0 }}
                  whileHover={{ x: 0, opacity: 1 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </motion.svg>
              </span>
              
              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 rounded-xl pointer-events-none"
                initial={{ x: "-100%", opacity: 0 }}
                whileHover={{ x: "100%", opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.5 }}
              />
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Community Impact */}
        <motion.div 
          className="mt-20 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <h2 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 drop-shadow-lg">
            Community Impact Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: 'City Hospital',
                role: 'Partner Hospital',
                quote:
                  'The Summer Blood Drive Campaign provided us with over 200 units of blood, helping us treat numerous emergency cases during the season.',
              },
              {
                name: 'University Medical Center',
                role: 'Campaign Organizer',
                quote:
                  'Our student campaign brought in 150 first-time donors! The support from Bleed for a Cause made organizing incredibly simple.',
              },
              {
                name: 'Community Health Initiative',
                role: 'Non-profit Partner',
                quote:
                  'By collaborating with Bleed for a Cause, we\'ve been able to extend our reach and save more lives in underserved communities.',
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                className={`rounded-3xl p-10 ${glass} shadow-lg shadow-red-200/40 transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/60 relative overflow-hidden group`}
                whileHover={{ scale: 1.07, rotate: [0, 2, -2, 0] }}
              >
                {/* Floating blood drop */}
                <motion.div
                  className="absolute -top-6 -left-6"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
                >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <ellipse cx="20" cy="30" rx="10" ry="16" fill="#ef4444" fillOpacity="0.25" />
                    <path d="M20 6 C24 16, 32 22, 20 38 C8 22, 16 16, 20 6 Z" fill="#ef4444" />
                  </svg>
                </motion.div>
                <div className="flex items-center mb-6">
                  <div className="bg-red-100 border-2 border-dashed border-red-300 rounded-xl w-16 h-16 flex items-center justify-center">
                    <FaTint className="text-red-500 text-3xl animate-pulse group-hover:animate-none" />
                  </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400 drop-shadow-lg">{t.name}</h4>
                    <p className="text-red-900/80">{t.role}</p>
                  </div>
                </div>
                <p className="italic text-lg text-red-900/90">&ldquo;{t.quote}&rdquo;</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Add PropTypes validation
AnimatedBlobs.propTypes = {
  mouse: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number
  })
};

export default Campaigns;