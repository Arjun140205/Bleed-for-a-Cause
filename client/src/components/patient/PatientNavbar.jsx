import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserCircle, FaBell, FaBars, FaTimes } from "react-icons/fa";
import { TbLogout } from "react-icons/tb";
import { Link, useNavigate } from "react-router-dom";

const PatientNavbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { name: "Dashboard", path: "dashboard" },
    { name: "Requests", path: "requests" },
    { name: "Haemoglobin", path: "haemoglobin" },
    { name: "Disease", path: "disease" }
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuVariants = {
    open: {
      opacity: 1,
      height: "auto",
      transition: { duration: 0.3 }
    },
    closed: {
      opacity: 0,
      height: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <header className="w-full bg-gray-100 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center space-x-3"
          >
            <img
              src="/Blood.png"
              alt="Logo"
              className="h-10 w-auto"
            />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-red-600">
              Bleed for a Cause
            </span>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-red-500 focus:outline-none"
            >
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.name}
                to={`/patient/${item.path}`}
              >
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <span className="text-gray-700 hover:text-red-500 font-medium">
                    {item.name}
                  </span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-red-500 scale-x-0 group-hover:scale-x-100 transition-transform" />
                </motion.div>
              </Link>
            ))}

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <Link to="/patient/profile">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <FaUserCircle className="h-6 w-6 text-gray-700 hover:text-red-500" />
                </motion.div>
              </Link>
              <Link to="/patient/notification">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <FaBell className="h-6 w-6 text-gray-700 hover:text-red-500" />
                </motion.div>
              </Link>
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                onClick={handleLogout}
                className="cursor-pointer"
              >
                <TbLogout className="h-6 w-6 text-gray-700 hover:text-red-500" />
              </motion.div>
            </div>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial="closed"
              animate="open"
              exit="closed"
              variants={menuVariants}
              className="md:hidden"
            >
              <div className="py-4 space-y-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={`/patient/${item.path}`}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.div
                      className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-500 rounded-md"
                      whileHover={{ x: 5 }}
                    >
                      {item.name}
                    </motion.div>
                  </Link>
                ))}
                <div className="flex justify-center space-x-6 pt-4 border-t border-gray-200">
                  <Link to="/patient/profile" onClick={() => setIsOpen(false)}>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <FaUserCircle className="h-6 w-6 text-gray-700 hover:text-red-500" />
                    </motion.div>
                  </Link>
                  <Link to="/patient/notification" onClick={() => setIsOpen(false)}>
                    <motion.div whileHover={{ scale: 1.1 }}>
                      <FaBell className="h-6 w-6 text-gray-700 hover:text-red-500" />
                    </motion.div>
                  </Link>
                  <motion.div 
                    whileHover={{ scale: 1.1 }} 
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="cursor-pointer"
                  >
                    <TbLogout className="h-6 w-6 text-gray-700 hover:text-red-500" />
                  </motion.div>
                </div>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default PatientNavbar;
