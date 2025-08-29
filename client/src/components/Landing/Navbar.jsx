import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import StarButton from "../ui/StarButton";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight);
    };

    // Check authentication status on component mount
    const checkAuthStatus = () => {
      const authToken = localStorage.getItem("authToken");
      const storedUserType = localStorage.getItem("userType");
      
      if (authToken && storedUserType) {
        setIsLoggedIn(true);
        setUserType(storedUserType);
      } else {
        setIsLoggedIn(false);
        setUserType("");
      }
    };

    window.addEventListener("scroll", handleScroll);
    checkAuthStatus();

    // Listen for storage changes (in case user logs in/out in another tab)
    window.addEventListener("storage", checkAuthStatus);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  const navItems = ["Home","banks","eligibility", "about", "campaigns", "FAQ", "contact"];

  // Helper function to get the correct path for each nav item
  const getNavPath = (item) => {
    return item.toLowerCase() === "home" ? "/" : `/${item.toLowerCase()}`;
  };

  const handleClick = (path) => {
    navigate(path);
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out of your account",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, logout!"
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userType");
        setIsLoggedIn(false);
        setUserType("");
        
        Swal.fire({
          icon: "success",
          title: "Logged Out",
          text: "You have been successfully logged out!",
          timer: 2000,
          showConfirmButton: false
        });
        
        navigate("/");
      }
    });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? "bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl backdrop-saturate-150 shadow-lg" : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <img src="/Blood.png" alt="Bleed for a Cause" className="h-8 w-auto" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-red-800 dark:from-red-500 dark:to-red-300">
                Bleed for a Cause
              </span>
            </Link>
          </div>

          {/* Navigation Items - Desktop */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {navItems.map((item) => {
              const path = getNavPath(item);
              return (
                <StarButton
                  key={item}
                  onClick={() => handleClick(path)}
                  className="text-sm"
                  isActive={location.pathname === path}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </StarButton>
              );
            })}

            {/* Auth Buttons */}
            {isLoggedIn ? (
              <StarButton onClick={handleLogout}>
                Logout
              </StarButton>
            ) : (
              <StarButton onClick={handleLogin}>
                Login
              </StarButton>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-colors duration-200 text-gray-600 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400"
            >
              <span className="sr-only">Open main menu</span>
              <div className="w-6 h-6 flex items-center justify-center">
                <span
                  className={`transform transition-transform duration-300 ${
                    isOpen ? "rotate-45 translate-y-1.5" : ""
                  } block absolute h-0.5 w-6 bg-current`}
                />
                <span
                  className={`block absolute h-0.5 w-6 bg-current transition-opacity duration-300 ${
                    isOpen ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`transform transition-transform duration-300 ${
                    isOpen ? "-rotate-45 -translate-y-1.5" : ""
                  } block absolute h-0.5 w-6 bg-current`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden bg-white/95 backdrop-blur-xl backdrop-saturate-150 border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <StarButton
                  key={item}
                  as={Link}
                  to={getNavPath(item)}
                  className={`group w-full text-base !py-2 !px-4 ${
                    location.pathname === getNavPath(item)
                      ? "text-red-600 font-semibold"
                      : "text-gray-700 hover:text-red-600"
                  }`}
                  color="#ef4444"
                  speed="4s"
                  isActive={location.pathname === getNavPath(item)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.charAt(0).toUpperCase() + item.slice(1)}
                </StarButton>
              ))}
              {isLoggedIn ? (
                <div className="space-y-2 pt-2">
                  <StarButton
                    as={Link}
                    to={`/${userType.toLowerCase()}/dashboard`}
                    className="w-full text-base !py-2 !px-4"
                    color="#ef4444"
                    speed="5s"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </StarButton>
                  <StarButton
                    onClick={() => {
                      setIsOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-base !py-2 !px-4"
                    color="#ef4444"
                    speed="5s"
                  >
                    Logout
                  </StarButton>
                </div>
              ) : (
                <StarButton
                  onClick={() => {
                    setIsOpen(false);
                    handleLogin();
                  }}
                  className="w-full text-base !py-2 !px-4 mt-2"
                  color="#ef4444"
                  speed="5s"
                >
                  Login
                </StarButton>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;