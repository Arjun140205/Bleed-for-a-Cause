import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSearch, FaMapMarkerAlt, FaTint, FaUserCircle, FaVial, FaNotesMedical, FaHistory } from "react-icons/fa";
import { indianStates, citiesByState } from "../../utils/constants";
import { FiClock } from "react-icons/fi";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useState({
    bloodType: "",
    state: "",
    city: ""
  });

  // Feature cards data
  const quickActions = [
    {
      title: "Blood Search",
      icon: <FaSearch className="text-3xl text-red-500" />,
      description: "Search for blood availability in hospitals",
      link: "#search-section",
      color: "bg-red-50"
    },
    {
      title: "My Requests",
      icon: <FaHistory className="text-3xl text-blue-500" />,
      description: "View and manage your blood requests",
      link: "/patient/requests",
      color: "bg-blue-50"
    },
    {
      title: "Haemoglobin Check",
      icon: <FaVial className="text-3xl text-purple-500" />,
      description: "Check your haemoglobin levels",
      link: "/patient/haemoglobin",
      color: "bg-purple-50"
    },
    {
      title: "Disease Analysis",
      icon: <FaNotesMedical className="text-3xl text-green-500" />,
      description: "Analyze your symptoms",
      link: "/patient/disease",
      color: "bg-green-50"
    }
  ];

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch(`${BASE_URL}/auth/verify/patient`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ token })
        });

        const data = await response.json();
        if (response.ok) {
          setUserData(data.user);
        } else {
          throw new Error(data.message);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        toast.error('Please login again');
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    verifyUser();
  }, [navigate]);

  // Clear city when state changes
  useEffect(() => {
    setSearchParams(prev => ({ ...prev, city: "" }));
  }, [searchParams.state]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchResults([]);

    try {
      const queryParams = new URLSearchParams({
        bloodType: searchParams.bloodType,
        state: searchParams.state,
        city: searchParams.city,
      }).toString();

      const response = await fetch(`${BASE_URL}/hospital/search-blood?${queryParams}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.success) {
        setSearchResults(data.hospitals);
        if (data.hospitals.length === 0) {
          toast.info("No hospitals found with matching criteria");
        }
      } else {
        toast.error(data.message || "Failed to search for blood availability");
      }
    } catch (error) {
      console.error("Search error:", error);
      toast.error("Failed to connect to the server. Please try again later.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleActionClick = (link) => {
    if (link.startsWith('#')) {
      const element = document.getElementById(link.substring(1));
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate(link);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-6"
        >
          <div className="flex items-center space-x-4">
            <FaUserCircle className="text-4xl text-red-500" />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome, {userData?.name || 'User'}
              </h1>
              <p className="text-gray-600">
                Manage your blood donation requests and health analysis
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleActionClick(action.link)}
              className={`${action.color} rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer`}
            >
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  {action.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {action.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Blood Search Section */}
        <div id="search-section" className="bg-white rounded-2xl shadow-lg p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <FaSearch className="text-red-500" />
            Find Blood Availability
          </h2>
          
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Type
                </label>
                <select
                  value={searchParams.bloodType}
                  onChange={(e) => setSearchParams({ ...searchParams, bloodType: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select Blood Type</option>
                  {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  value={searchParams.state}
                  onChange={(e) => setSearchParams({ ...searchParams, state: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                >
                  <option value="">Select State</option>
                  {indianStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <select
                  value={searchParams.city}
                  onChange={(e) => setSearchParams({ ...searchParams, city: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-red-500 focus:border-red-500"
                  required
                  disabled={!searchParams.state}
                >
                  <option value="">Select City</option>
                  {searchParams.state && citiesByState[searchParams.state]?.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
                {!searchParams.state && (
                  <p className="text-sm text-gray-500 mt-1">Please select a state first</p>
                )}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSearching}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSearching ? (
                  <>
                    <FiClock className="animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <FaSearch />
                    Search
                  </>
                )}
              </button>
            </div>
          </form>

          {searchResults.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Search Results</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {searchResults.map((hospital) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-4 rounded-lg shadow border border-gray-100"
                  >
                    <h4 className="font-semibold text-gray-800">{hospital.name}</h4>
                    <div className="mt-2 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <FaMapMarkerAlt />
                        {hospital.city}, {hospital.state}
                      </p>
                      <p className="flex items-center gap-1 mt-1">
                        <FaTint className="text-red-500" />
                        {hospital.availableUnits} units of {searchParams.bloodType} available
                      </p>
                      <div className="mt-3">
                        <a
                          href={`tel:${hospital.phoneNumber}`}
                          className="inline-flex items-center gap-2 text-red-500 hover:text-red-600"
                        >
                          Contact Hospital
                        </a>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {searchResults.length === 0 && isSearching === false && (
            <div className="text-center py-8 text-gray-600">
              <FaTint className="mx-auto text-4xl text-red-500 mb-2" />
              <p>No matching blood units found. Please try different search criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
