import { motion } from 'framer-motion';

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

export const GlassCard = ({ children, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30 rounded-2xl ${className}`}
  >
    {children}
  </motion.div>
);

export const SectionTitle = ({ children, subtitle }) => (
  <div className="text-center mb-12">
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-6 shadow-lg shadow-red-300/40"
    >
      {subtitle}
    </motion.div>
    <motion.h1
      className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-4 leading-tight drop-shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
    >
      {children}
    </motion.h1>
  </div>
);

export const InfoCard = ({ icon: Icon, title, value, className = "" }) => (
  <GlassCard className={`p-6 flex items-center space-x-4 ${className}`}>
    <div className="p-3 bg-red-100 rounded-lg">
      <Icon className="w-6 h-6 text-red-600" />
    </div>
    <div>
      <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
      <p className="text-gray-900 text-lg font-semibold">{value}</p>
    </div>
  </GlassCard>
);

export const Button = ({ children, className = "", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-lg shadow-lg shadow-red-500/30 transition-colors hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export const PageLayout = ({ children, onMouseMove }) => (
  <div
    className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
    style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
    onMouseMove={onMouseMove}
  >
    <div className="relative z-10 max-w-7xl mx-auto">
      {children}
    </div>
  </div>
);
