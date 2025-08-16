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
        fill="url(#blue1)"
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
        fill="url(#blue2)"
        transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
      />
      <defs>
        <radialGradient id="blue1" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </radialGradient>
        <radialGradient id="blue2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#2563eb" />
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
    className={`bg-white/30 backdrop-blur-lg border border-blue-200/40 shadow-2xl shadow-blue-200/30 rounded-2xl ${className}`}
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
      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-6 shadow-lg shadow-blue-300/40"
    >
      {subtitle}
    </motion.div>
    <motion.h1
      className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-400 to-blue-800 mb-4 leading-tight drop-shadow-lg"
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
    <div className="p-3 bg-blue-100 rounded-lg">
      <Icon className="w-6 h-6 text-blue-600" />
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
    className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/30 transition-colors hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </motion.button>
);

export const PageLayout = ({ children, onMouseMove }) => (
  <div
    className="relative min-h-screen pt-16 pb-20 px-4 sm:px-6 lg:px-8"
    style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
    onMouseMove={onMouseMove}
  >
    <div className="relative z-10 max-w-7xl mx-auto">
      {children}
    </div>
  </div>
);
