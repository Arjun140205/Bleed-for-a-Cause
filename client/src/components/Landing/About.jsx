import React, { useRef } from 'react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { FaTint, FaHandHoldingHeart, FaShieldAlt, FaMapMarkerAlt, FaUsers, FaHeartbeat } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

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

const About = () => {
  const navigate = useNavigate();
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  // For interactive icon animation
  const iconVariants = {
    initial: { scale: 1, rotate: 0 },
    hover: { scale: 1.15, rotate: [0, 10, -10, 0], transition: { duration: 0.6 } },
  };

  // For glassmorphism card style
  const glass =
    'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';

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
            Life-Saving Community
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Connecting Compassionate Donors with Those in Need
          </motion.h1>
          
          <motion.p
            className="text-2xl max-w-3xl mx-auto text-red-900/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Leveraging technology to ensure timely access to safe blood supplies while promoting a culture of regular donation
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
            { label: 'Lives Saved', value: '50K+', color: 'from-red-400 to-red-600' },
            { label: 'Donors', value: '120K+', color: 'from-red-500 to-red-700' },
            { label: 'Hospitals', value: '500+', color: 'from-red-300 to-red-500' },
            { label: 'Success Rate', value: '98%', color: 'from-red-600 to-red-900' },
          ].map((stat, i) => (
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

        {/* Mission Section */}
        <motion.div 
          className={`mb-20 ${glass} shadow-red-200/40`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-red-400/60 to-red-700/60 opacity-80"></div>
            <div className="relative z-10 p-10 md:p-16">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 text-center drop-shadow-lg">Our Mission</h2>
              <p className="text-2xl text-white/90 leading-relaxed text-center max-w-4xl mx-auto">
                To create a reliable, efficient, and transparent platform that connects blood donors with 
                hospitals and patients in need, ensuring timely access to safe blood supplies while 
                promoting a culture of regular blood donation.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <div className="mb-20">
          <motion.h2 
            className="text-4xl font-extrabold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 drop-shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Why Choose Our Platform
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { icon: FaTint, title: 'Simplified Donation', desc: 'Intuitive platform connecting donors with verified blood banks and hospitals', color: 'from-red-400 to-red-600' },
              { icon: FaHandHoldingHeart, title: 'Community Driven', desc: 'Powered by compassionate donors committed to saving lives daily', color: 'from-red-500 to-red-700' },
              { icon: FaShieldAlt, title: 'Safe & Verified', desc: 'Rigorous screening and quality control for all donations', color: 'from-red-300 to-red-500' },
              { icon: FaMapMarkerAlt, title: 'Location Tracking', desc: 'Find the nearest donation centers with real-time availability', color: 'from-red-600 to-red-900' },
              { icon: FaUsers, title: 'Donor Network', desc: 'Connect with other donors and organize community drives', color: 'from-red-400 to-red-700' },
              { icon: FaHeartbeat, title: 'Health Tracking', desc: 'Monitor your donation history and health impact', color: 'from-red-500 to-red-800' },
            ].map((f, i) => (
            <motion.div 
                key={f.title}
                className={`p-10 rounded-3xl ${glass} flex flex-col items-center text-center group transition-transform duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-400/60 relative overflow-hidden`}
                whileHover={{ scale: 1.08 }}
              >
            <motion.div 
                  className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 bg-gradient-to-br ${f.color} shadow-lg shadow-red-200/40`}
                  variants={iconVariants}
                  initial="initial"
                  whileHover="hover"
                  animate="initial"
                >
                  <f.icon className="text-white text-4xl drop-shadow-lg animate-pulse group-hover:animate-none" />
            </motion.div>
                <h3 className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400 drop-shadow-lg">{f.title}</h3>
                <p className="text-lg text-red-900/80">{f.desc}</p>
                {/* Artistic floating blood drop */}
            <motion.div 
                  className="absolute -top-6 -right-6"
                  animate={{ y: [0, 10, 0] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }}
            >
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                    <ellipse cx="20" cy="30" rx="10" ry="16" fill="#ef4444" fillOpacity="0.25" />
                    <path d="M20 6 C24 16, 32 22, 20 38 C8 22, 16 16, 20 6 Z" fill="#ef4444" />
                  </svg>
            </motion.div>
            </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div 
          className="mt-16 rounded-3xl p-12 text-center shadow-2xl bg-gradient-to-r from-red-500 via-red-400 to-red-700 relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.4 }}
        >
          {/* Animated shine effect */}
          <motion.div
            className="absolute left-0 top-0 w-full h-full pointer-events-none"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ repeat: Infinity, duration: 4 }}
            style={{ background: 'linear-gradient(120deg, #fff3 30%, #fff6 50%, #fff3 70%)', mixBlendMode: 'overlay' }}
          />
          <h2 className="text-4xl font-extrabold mb-6 text-white drop-shadow-lg">
            Join Our Life-Saving Community
          </h2>
          <p className="text-2xl max-w-2xl mx-auto mb-8 text-white/90">
            Every donation matters. Become part of a network that's saved thousands of lives 
            and continues to make a difference daily.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.button 
              className="bg-white text-red-600 font-bold px-10 py-5 rounded-xl hover:bg-red-100 transition-colors shadow-lg shadow-red-200/40 text-xl relative overflow-hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/login')}
            >
              <span className="relative z-10">Become a Donor</span>
              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 bg-red-200/40 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
            <motion.button 
              className="bg-transparent border-2 border-white text-white font-bold px-10 py-5 rounded-xl hover:bg-white/10 transition-colors text-xl shadow-lg shadow-red-200/40 relative overflow-hidden"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/banks')}
            >
              <span className="relative z-10">Find a Donation Center</span>
              {/* Ripple effect */}
              <motion.span
                className="absolute inset-0 bg-white/10 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </div>
          <div className="mt-8 text-white/80">
            <p>
              Already a member?{' '}
              <a href="/login" className="text-white font-semibold underline">Sign in</a>
            </p>
          </div>
        </motion.div>

        {/* Testimonial Section */}
        <motion.div 
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.6 }}
        >
          <h2 className="text-4xl font-extrabold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 drop-shadow-lg">
            Donor Stories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                name: 'Sarah Johnson',
                role: 'Regular donor for 5 years',
                quote:
                  'This platform made it so easy to find where my blood type was needed most. I\'ve donated 12 times through this app and saved multiple lives!',
              },
              {
                name: 'Michael Chen',
                role: 'Blood recipient',
                quote:
                  'When I needed an emergency transfusion, this network found a matching donor in just 2 hours. I owe my life to this incredible community.',
              },
              {
                name: 'Dr. Anika Patel',
                role: 'Hospital Administrator',
                quote:
                  'Our hospital has reduced blood shortage emergencies by 75% since joining this platform. The real-time donor matching is revolutionary.',
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
                    <FaHandHoldingHeart className="text-red-500 text-3xl animate-pulse group-hover:animate-none" />
                </div>
                  <div className="ml-4 text-left">
                    <h4 className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-red-700 to-red-400 drop-shadow-lg">{t.name}</h4>
                    <p className="text-red-900/80">{t.role}</p>
            </div>
                </div>
                <p className="italic text-lg text-red-900/90">"{t.quote}"</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;