import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import StarButton from "../ui/StarButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../apiConfig";
import TextInput from "../ui/TextInput";
import PasswordInput from "../ui/PasswordInput";

const LoginForm = ({ title, color, submit, userType }) => {
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
      
      // Call the submit function passed from parent if exists
      if (submit) {
        submit(data);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <div className="flex justify-center items-center bg-calm/5 h-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-[400px]"
      >
        <h2 className={`text-2xl font-bold text-center text-${color}-600 mb-6`}>
          {title}
        </h2>

        <div className="space-y-4">
          <motion.div 
            variants={inputVariants}
            whileFocus="focus"
            className="relative mb-4"
          >
            <TextInput
              label={null}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="pl-10 pr-3 py-3 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-red-500 transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaEnvelope className="h-5 w-5 text-red-400" />
            </div>
          </motion.div>

          <motion.div 
            variants={inputVariants}
            whileFocus="focus"
            className="relative mb-6"
          >
            <PasswordInput
              label={null}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="pl-10 pr-12 py-3 border-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-md rounded-xl focus:ring-2 focus:ring-red-500 transition-all duration-300"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaLock className="h-5 w-5 text-red-400" />
            </div>
          </motion.div>
        </div>

        <StarButton
          type="submit"
          disabled={isLoading}
          className="w-full text-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing in...
            </div>
          ) : (
            'Sign In'
          )}
        </StarButton>

        <div className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-red-500 transition-colors">Forgot your password?</a>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;