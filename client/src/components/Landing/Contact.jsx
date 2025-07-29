import React, { useRef, useState } from "react";
import PropTypes from 'prop-types';
import { motion } from "framer-motion";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from "react-icons/fa";

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

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  
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
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!name || !email || !message) {
      setIsSuccess(false);
      setModalMessage('Please fill in all fields.');
      setShowModal(true);
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setIsSuccess(false);
      setModalMessage('Please enter a valid email address.');
      setShowModal(true);
      setLoading(false);
      return;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsSuccess(true);
    setModalMessage('Your message has been sent successfully! We\'ll get back to you soon.');
    setShowModal(true);

    // Reset form
    setName('');
    setEmail('');
    setMessage('');
    setLoading(false);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div
      className="relative min-h-screen py-30 px-4 sm:px-6 lg:px-8 overflow-x-hidden bg-white text-slate-900"
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
            GET IN TOUCH
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Contact Us
          </motion.h1>
          
          <motion.p
            className="text-2xl max-w-3xl mx-auto text-red-900/80 mb-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            We're here to answer your questions and help you make a difference through blood donation.
          </motion.p>

          <motion.div
            className="flex justify-center space-x-6 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.a
              href="#contact-form"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white rounded-full overflow-hidden bg-gradient-to-r from-red-600 to-red-500 shadow-xl shadow-red-300/30"
              whileHover={{ 
                scale: 1.05,
                boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.4), 0 8px 10px -6px rgba(239, 68, 68, 0.4)'
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-80 group-hover:h-80 opacity-10"></span>
              <span className="relative flex items-center">
                <span>Send Message</span>
                <FaPaperPlane className="ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
            </motion.a>
            
            <motion.a
              href="tel:1-800-555-HELP"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold rounded-full overflow-hidden border-2 border-red-500 text-red-600 hover:text-white transition-colors duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
              <span className="absolute inset-0 w-full h-full bg-red-600 translate-y-full transition-transform duration-300 group-hover:translate-y-0"></span>
              <span className="relative flex items-center">
                <FaPhoneAlt className="mr-2" />
                <span>Call Helpline</span>
              </span>
            </motion.a>
          </motion.div>
        </motion.div>

        {/* Contact Grid */}
        <motion.div 
          className="grid md:grid-cols-2 gap-12 mb-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {/* Contact Info Card */}
          <motion.div
            className="rounded-3xl p-8 md:p-10 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30 bg-white/30"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Contact Information
            </motion.h2>
            <motion.div 
              className="space-y-6 text-lg text-red-900/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, staggerChildren: 0.2 }}
            >
              <motion.div 
                className="flex items-center gap-4" 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-300/40">
                  <FaPhoneAlt />
                </div>
                <div>
                  <p className="font-semibold text-red-800">Call Us</p>
                  <p>1-800-555-HELP (24/7 Helpline)</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-300/40">
                  <FaEnvelope />
                </div>
                <div>
                  <p className="font-semibold text-red-800">Email Us</p>
                  <p>support@bleedforacause.org</p>
                </div>
              </motion.div>
              
              <motion.div 
                className="flex items-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-300/40">
                  <FaMapMarkerAlt />
                </div>
                <div>
                  <p className="font-semibold text-red-800">Visit Us</p>
                  <p>123 Life Saver Street, Health City</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Form Card */}
          <motion.div
            id="contact-form"
            className="rounded-3xl p-8 md:p-10 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30 bg-white/30"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.h2 
              className="text-2xl md:text-3xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              Send a Message
            </motion.h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border-2 border-red-200/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200/50 transition-all duration-300 bg-white/70 placeholder-red-400/70 text-red-900"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
              >
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border-2 border-red-200/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200/50 transition-all duration-300 bg-white/70 placeholder-red-400/70 text-red-900"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
              >
                <textarea
                  placeholder="Your Message"
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-5 py-4 rounded-xl border-2 border-red-200/50 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200/50 transition-all duration-300 bg-white/70 placeholder-red-400/70 text-red-900"
                ></textarea>
              </motion.div>
              
              <motion.button
                type="submit"
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-red-300/40 relative overflow-hidden flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05, boxShadow: "0 15px 30px rgba(239, 68, 68, 0.3)" }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                disabled={loading}
              >
                {loading ? (
                  <motion.div 
                    className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                ) : (
                  <>
                    Send Message
                    <FaPaperPlane />
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>

      {/* Call-to-Action Section */}
      <motion.div 
        className="rounded-3xl py-20 px-8 md:py-24 md:px-12 text-center shadow-2xl relative overflow-hidden mb-20"
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
            Join Our Blood Donor Community
          </span>
        </motion.h2>
        
        <motion.p 
          className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 text-white/90"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 2 }}
        >
          Become part of our network of lifesavers. Every donation can save up to three lives.
        </motion.p>
      </motion.div>

      {/* Modal */}
      {showModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="p-8 rounded-3xl shadow-2xl w-[90%] sm:w-[450px] text-center relative overflow-hidden border border-red-100/40 backdrop-blur-lg bg-white/80"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close Icon */}
            <motion.button
              onClick={closeModal}
              className="absolute top-6 right-6 text-red-400 hover:text-red-600 text-2xl font-bold transition-colors"
              aria-label="Close"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </motion.button>

            {/* Icon */}
            <motion.div 
              className="mb-6"
              initial={{ scale: 0.5 }}
              animate={{ scale: [0.5, 1.2, 1] }}
              transition={{ duration: 0.5 }}
            >
              {isSuccess ? (
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-green-400 to-green-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-400 to-red-600 flex items-center justify-center text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </motion.div>

            {/* Title */}
            <motion.h3 
              className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {isSuccess ? 'Message Sent!' : 'Oops!'}
            </motion.h3>

            {/* Message */}
            <motion.p 
              className="mb-8 text-lg text-red-900/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {modalMessage}
            </motion.p>

            {/* OK Button */}
            <motion.button
              onClick={closeModal}
              className={`px-10 py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                isSuccess
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-green-300/30'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-300/30'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isSuccess ? 'Great!' : 'Try Again'}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
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

export default Contact;