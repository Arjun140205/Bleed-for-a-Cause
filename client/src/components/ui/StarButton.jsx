import { forwardRef, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const StarButton = forwardRef(({ 
  className = "",
  color,
  isActive = false,
  children,
  onClick,
  as: Component = null,
  to,
  ...props 
}, ref) => {

  // For animated hover gradient
  const btnRef = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [mouseX, setMouseX] = useState(0);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  const handleMouseMove = (e) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    setMouseX(relX);
    x.set(relX);
  };

  const handleMouseEnter = () => setHovered(true);
  const handleMouseLeave = () => setHovered(false);

  const content = (
    <>
      {/* No filled background for active, only hover effect */}
      {hovered && !isActive && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX}px 50%, #fca5a5 0%, #ef4444 40%, transparent 70%)`,
            opacity: 0.18
          }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 0.2 }}
        />
      )}
      {/* Border */}
      <div 
        className={`absolute inset-0 rounded-full border-2 transition-colors duration-200 border-red-600 group-hover:border-red-600`}
      />
      {/* Content */}
      <div className={`relative px-5 py-2 z-10 text-center min-w-[90px] font-semibold transition-all duration-200 group-hover:scale-110 ${isActive ? 'text-red-600' : 'text-red-600 group-hover:text-white'}`}>
        {children}
      </div>
      {/* Animated gradient underline for active */}
      {isActive && (
        <motion.div
          layoutId="nav-underline"
          className="absolute left-4 right-4 bottom-1 h-1 rounded-full pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, #f87171 0%, #ef4444 100%)',
            boxShadow: '0 2px 16px 0 #ef444488',
            opacity: 0.7
          }}
        />
      )}
      {/* Mouse-following hover gradient */}
      {hovered && !isActive && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${mouseX}px 50%, #fca5a5 0%, #ef4444 40%, transparent 70%)`,
            opacity: 0.18
          }}
          animate={{ opacity: 0.18 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </>
  );

  if (Component) {
    // Render as e.g. <Link>
    return (
      <motion.div
        ref={btnRef}
        className={`group relative inline-flex items-center justify-center ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        <Component to={to} onClick={onClick} className="w-full h-full contents">
          {content}
        </Component>
      </motion.div>
    );
  }

  // Default: render as button
  return (
    <motion.button 
      ref={btnRef}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {content}
    </motion.button>
  );
});

StarButton.displayName = 'StarButton';

export default StarButton;
