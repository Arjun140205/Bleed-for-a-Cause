import React, { useEffect, useState, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { FaTint, FaCalendarCheck, FaHospital, FaMapMarkerAlt } from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import TextInput from "../ui/TextInput";
import SelectInput from "../ui/SelectInput";

const checkDonorInfo = async () => {
  const token = localStorage.getItem("authToken");
  if (!token) return { error: "No auth token found" };

  const response = await fetch(`${BASE_URL}/donor/checkInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  return response.json();
};

const updateDonorInfo = async (donorData) => {
  const token = localStorage.getItem("authToken");
  if (!token) return { error: "No auth token found" };

  const response = await fetch(`${BASE_URL}/donor/updateInfo`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, ...donorData }),
  });

  return response.json();
};

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

const statesList = [
  { value: "35", label: "Andaman and Nicobar Islands" },
  { value: "28", label: "Andhra Pradesh" },
  { value: "12", label: "Arunachal Pradesh" },
  { value: "18", label: "Assam" },
  { value: "10", label: "Bihar" },
  { value: "94", label: "Chandigarh" },
  { value: "22", label: "Chhattisgarh" },
  { value: "25", label: "Dadra And Nagar Haveli And Daman And Diu" },
  { value: "97", label: "Delhi" },
  { value: "30", label: "Goa" },
  { value: "24", label: "Gujarat" },
  { value: "96", label: "Haryana" },
  { value: "92", label: "Himachal Pradesh" },
  { value: "91", label: "Jammu and Kashmir" },
  { value: "20", label: "Jharkhand" },
  { value: "29", label: "Karnataka" },
  { value: "32", label: "Kerala" },
  { value: "37", label: "Ladakh" },
  { value: "31", label: "Lakshadweep" },
  { value: "23", label: "Madhya Pradesh" },
  { value: "27", label: "Maharashtra" },
  { value: "14", label: "Manipur" },
  { value: "17", label: "Meghalaya" },
  { value: "15", label: "Mizoram" },
  { value: "13", label: "Nagaland" },
  { value: "21", label: "Odisha" },
  { value: "34", label: "Puducherry" },
  { value: "93", label: "Punjab" },
  { value: "98", label: "Rajasthan" },
  { value: "11", label: "Sikkim" },
  { value: "33", label: "Tamil Nadu" },
  { value: "36", label: "Telangana" },
  { value: "16", label: "Tripura" },
  { value: "95", label: "Uttarakhand" },
  { value: "99", label: "Uttar Pradesh" },
  { value: "19", label: "West Bengal" },
];

const DonorDashboard = () => {
  const [donor, setDonor] = useState(null);
  const [missingInfo, setMissingInfo] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [formData, setFormData] = useState({
    bloodType: "",
    lastDonationDate: "",
    state: "",
    district: "",
    medicalCondition: "",
  });
  const [bloodBanks, setBloodBanks] = useState([]);
  
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

  useEffect(() => {
    const fetchDonorInfo = async () => {
      const result = await checkDonorInfo();
      if (result.error) {
        console.error(result.error);
        return;
      }

      if (result.missing) {
        setMissingInfo(true);
      } else {
        setDonor(result.user);
        setFormData({
          bloodType: result.user.bloodType || "",
          lastDonationDate: result.user.lastDonationDate || "",
          state: result.user.state || "",
          district: result.user.district || "",
          medicalCondition: result.user.medicalCondition || "",
        });

        if (result.user.state) {
          getDistricts(result.user.state);
        }
      }
    };

    fetchDonorInfo();
  }, []);

  useEffect(() => {
    if (formData.district) {
      getBloodBanks();
    }
  }, [districts, formData.district]);

  const getDistricts = async (selectedState) => {
    if (!selectedState) return;

    const state = statesList.find((s) => s.label === selectedState);
    if (!state) return;

    const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETDISTRICTLIST&abfhttf=%5Cu0057%5Cu0031%5Cu0030%5Cu003d&selectedStateCode=${state.value}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched Districts:", data);

      if (data.records && Array.isArray(data.records)) {
        setDistricts(
          data.records.map((record) => ({
            district: record.id,
            value: record.value,
          }))
        );
      } else {
        setDistricts([]);
      }
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
    }
  };

  const getBloodBanks = async () => {
    const state = statesList.find((s) => s.label === formData.state);
    const selectedDistrict = districts.find(
      (district) => district.district === formData.district
    );

    if (!state || !selectedDistrict) return;

    const url = `https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/nearbyBB.cnt?hmode=GETNEARBYBLOODBANK&stateCode=${state.value}&districtCode=${selectedDistrict.value}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("Fetched Blood Banks:", data);

      if (data.data && Array.isArray(data.data)) {
        const bloodBankList = data.data.map((entry) => ({
          id: entry[0],
          name: entry[1],
          address: entry[2],
          contact: entry[3],
          email: entry[4],
          type: entry[5],
          links: entry[6],
        }));
        setBloodBanks(bloodBankList);
      } else {
        setBloodBanks([]);
      }
    } catch (error) {
      console.error("Error fetching blood banks:", error.message);
      setBloodBanks([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "state") {
      getDistricts(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await updateDonorInfo(formData);
    if (result.success) {
      setMissingInfo(false);
      setDonor(formData);
    } else {
      console.error("Failed to update donor info");
    }
  };

  return (
    <div 
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-6 shadow-lg shadow-red-300/40"
            style={{ letterSpacing: 2 }}
          >
            {missingInfo ? "COMPLETE YOUR PROFILE" : "DONOR DASHBOARD"}
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-4 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {missingInfo ? "Complete Your Profile" : "Nearby Blood Banks"}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="max-w-2xl mx-auto text-lg text-gray-600"
          >
            {missingInfo 
              ? "Please provide the following details to complete your profile" 
              : "Find blood banks in your area and schedule your next donation"
            }
          </motion.p>
        </motion.div>

        {missingInfo ? (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className={`${glass} rounded-2xl overflow-hidden max-w-xl mx-auto`}
          >
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="mr-2 text-red-500"
                    >
                      <FaTint size={18} />
                    </motion.div>
                    <label className="text-gray-800 font-medium">Blood Type:</label>
                  </div>
                  <SelectInput
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    required
                    options={["A_positive","A_negative","B_positive","B_negative","AB_positive","AB_negative","O_positive","O_negative"]}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="mr-2 text-red-500"
                    >
                      <FaCalendarCheck size={18} />
                    </motion.div>
                    <label className="text-gray-800 font-medium">Last Donation Date:</label>
                  </div>
                  <TextInput
                    type="date"
                    name="lastDonationDate"
                    value={formData.lastDonationDate}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="mr-2 text-red-500"
                    >
                      <FaMapMarkerAlt size={18} />
                    </motion.div>
                    <label className="text-gray-800 font-medium">State:</label>
                  </div>
                  <SelectInput
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    options={statesList.map(state => state.label)}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="mr-2 text-red-500"
                    >
                      <FaMapMarkerAlt size={18} />
                    </motion.div>
                    <label className="text-gray-800 font-medium">District:</label>
                  </div>
                  <SelectInput
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    required
                    options={districts.length > 0 ? districts.map(d => d.district) : ["No districts found"]}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
                
                <div>
                  <div className="flex items-center mb-2">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="mr-2 text-red-500"
                    >
                      <FaHospital size={18} />
                    </motion.div>
                    <label className="text-gray-800 font-medium">Medical Condition:</label>
                  </div>
                  <TextInput
                    type="text"
                    name="medicalCondition"
                    value={formData.medicalCondition}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/50 border border-red-100 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                  />
                </div>
                
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full px-6 py-4 font-bold text-white bg-gradient-to-r from-red-500 to-red-700 rounded-lg hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 shadow-lg shadow-red-500/30"
                >
                  Complete Profile
                </motion.button>
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bloodBanks.length > 0 ? (
              bloodBanks.map((bank, index) => (
                (bank.contact || bank.email) ? (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                    className={`${glass} rounded-2xl overflow-hidden`}
                  >
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 truncate">
                          {bank.name || "Unnamed Blood Bank"}
                        </h3>
                        <div
                          className="w-2 h-2 rounded-full bg-green-500"
                          title="Open"
                        ></div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-3 h-[13vh] overflow-auto">
                          <MapPin className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                          <p className="text-gray-600">
                            {bank.address || "No address available"}
                          </p>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Mail className="w-5 h-5 text-red-500 flex-shrink-0" />
                          {bank.email ? (
                            <a
                              href={`mailto:${bank.email}`}
                              className="text-red-600 hover:text-red-800 transition-colors duration-200"
                            >
                              {bank.email}
                            </a>
                          ) : (
                            <span className="text-gray-500">
                              No email available
                            </span>
                          )}
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="w-5 h-5 text-red-500 flex-shrink-0" />
                          <p className="text-gray-600">
                            {bank.contact || "No contact available"}
                          </p>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-6 bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-red-700 transition-colors duration-300 font-medium shadow-md shadow-red-200"
                      >
                        Book Appointment
                      </motion.button>
                    </div>
                  </motion.div>
                ) : null
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className={`${glass} rounded-xl p-8 text-center col-span-1 md:col-span-3`}
              >
                <p className="text-gray-600 text-lg">
                  No blood banks found in your area
                </p>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorDashboard;
