import { useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";

const LoginForm = ({ userType, onSuccess }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        toast.error("Please fill in all fields");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${BASE_URL}/auth/login/${userType.toLowerCase()}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailId: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Get the error message from the response if available
        const errorMessage = data.message || "Login failed";
        throw new Error(errorMessage);
      }

      // Validate the required data is present
      if (!data.token || !data.userType) {
        throw new Error("Invalid server response: Missing token or user type");
      }

      // Save auth token and user type
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userType", data.userType);
      localStorage.setItem("userId", data.userId);

      toast.success("Login successful!");
      
      // Navigate to the appropriate dashboard based on userType
      let dashboardPath;
      switch (userType.toLowerCase()) {
        case 'patient':
          dashboardPath = '/patient';
          break;
        case 'donor':
          dashboardPath = '/donor';
          break;
        case 'hospital':
          dashboardPath = '/hospital';
          break;
        default:
          dashboardPath = '/';
      }
      navigate(dashboardPath, { replace: true });
      
      // Call the onSuccess function if it exists
      if (onSuccess) {
        onSuccess(data.token, data.userType);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >

      {/* Email Input */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="relative"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaEnvelope className="h-5 w-5 text-red-400" />
        </div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
          placeholder="Email address"
        />
      </motion.div>

      {/* Password Input */}
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="relative"
      >
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <FaLock className="h-5 w-5 text-red-400" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full pl-12 pr-12 py-3 bg-white/50 backdrop-blur-md rounded-xl border-0 focus:ring-2 focus:ring-red-500 transition-all duration-300"
          placeholder="Password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-4 flex items-center"
        >
          {showPassword ? (
            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-red-400 transition-colors" />
          ) : (
            <FaEye className="h-5 w-5 text-gray-400 hover:text-red-400 transition-colors" />
          )}
        </button>
      </motion.div>

      {/* Forgot Password Link */}
      <div className="text-right text-sm">
        <a href="#" className="text-red-600 hover:text-red-800 transition-colors">
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={isLoading}
        className="w-full py-3 mt-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-semibold 
        shadow-lg shadow-red-500/30 hover:shadow-red-500/40 
        disabled:opacity-70 disabled:cursor-not-allowed
        transition-all duration-300"
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Signing in...
          </div>
        ) : (
          'Sign In'
        )}
      </motion.button>
    </motion.form>
  );
};

LoginForm.propTypes = {
  userType: PropTypes.string.isRequired,
  onSuccess: PropTypes.func
};

export default LoginForm;