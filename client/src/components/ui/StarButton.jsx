import { forwardRef } from 'react';
import { motion } from 'framer-motion';

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
  const defaultColor = color || "#991b1b"; // red-800

  const content = (
    <>
      {/* Background glow on hover */}
      <div 
        className={`absolute inset-0 rounded-full transition-all duration-200 ${
          isActive ? 'opacity-10' : 'opacity-0 group-hover:opacity-5'
        }`}
        style={{
          background: `radial-gradient(circle at center, ${defaultColor} 0%, transparent 70%)`
        }}
      />
      {/* Border */}
      <div 
        className={`absolute inset-0 rounded-full border transition-colors duration-200
          ${isActive 
            ? 'border-red-700/40' 
            : 'border-red-700/30'
          }
        `}
      />
      {/* Content */}
      <div className="relative px-5 py-2 z-10 text-center min-w-[90px] text-red-700/90 transition-transform duration-200 group-hover:scale-105">
        {children}
      </div>
      {/* Active state glow */}
      {isActive && (
        <div 
          className="absolute -inset-[2px] rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle at center,
              ${defaultColor} 0%,
              transparent 70%
            )`
          }}
        />
      )}
    </>
  );

  if (Component) {
    // Render as e.g. <Link>
    return (
      <motion.div
        ref={ref}
        className={`group relative inline-flex items-center justify-center ${className}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
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
      ref={ref}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.2,
        ease: [0.25, 0.1, 0.25, 1]
      }}
      {...props}
    >
      {content}
    </motion.button>
  );
});

StarButton.displayName = 'StarButton';

export default StarButton;
