import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaTint, 
  FaUserMd, 
  FaBell, 
  FaCalendarCheck,
  FaChartLine,
  FaExclamationTriangle
} from "react-icons/fa";
import BASE_URL from "../../apiConfig";

// Import updated chart components
import MainGraph from "./charts/updated/MainGraph";
import BloodTypeDonut from "./charts/updated/BloodTypeDonut";
import BloodSupplyForecast from "./charts/updated/BloodSupplyForecast";
import DonationTrends from "./charts/updated/DonationTrends";
import HospitalNavbar from "./HospitalNavbar";

const initialInventory = {
  A: { units: 15, capacity: 40, donors: 8 },
  B: { units: 25, capacity: 40, donors: 12 },
  AB: { units: 5, capacity: 40, donors: 3 },
  O: { units: 35, capacity: 40, donors: 15 },
};

const criticalAlerts = [
  { id: 1, type: "AB+", level: "critical", message: "Only 2 units remaining" },
  { id: 2, type: "A-", level: "warning", message: "Below safety threshold" },
];

const recentDonations = [
  { id: 1, name: "John Doe", type: "O+", date: "2024-03-15", units: 2 },
  { id: 2, name: "Jane Smith", type: "A+", date: "2024-03-14", units: 1.5 },
  { id: 3, name: "Michael Brown", type: "B+", date: "2024-03-12", units: 1 },
  { id: 4, name: "Sarah Wilson", type: "AB+", date: "2024-03-10", units: 2.5 },
];

// SVG Blob background component
const AnimatedBlobs = ({ mouse }) => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 opacity-10">
      <svg
        viewBox="0 0 1000 1000"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute w-full h-full"
      >
        <defs>
          <linearGradient id="blob1-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" />
            <stop offset="100%" stopColor="#b91c1c" />
          </linearGradient>
          <linearGradient id="blob2-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f87171" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>
        </defs>
        
        {/* Blob 1 */}
        <path
          fill="url(#blob1-gradient)"
          d="M827.5,670.3C740.8,774.6,654,878.9,546.6,903.7C439.2,928.4,311.2,873.7,229.7,782.3C148.2,690.9,113.2,562.7,152,456.8C190.8,350.9,303.4,267.2,416,208.9C528.7,150.6,641.4,117.6,711,160.9C780.5,204.1,806.9,323.6,826,434.5C845.2,545.4,857.1,647.5,827.5,670.3Z"
          style={{ transform: `translate(${mouse?.x * 0.02}px, ${mouse?.y * 0.02}px)` }}
        />
        
        {/* Blob 2 */}
        <path
          fill="url(#blob2-gradient)"
          d="M796.6,628.8C746.1,736,695.6,843.1,603.6,889.6C511.5,936.2,378,922.1,278.1,851.5C178.2,780.8,112,653.5,108.4,530.8C104.9,408.1,164,290,249.9,228.1C335.8,166.2,448.5,160.5,546.6,132.8C644.8,105.1,728.5,55.3,779.1,162.8C829.7,270.3,847.2,521.5,796.6,628.8Z"
          style={{ transform: `translate(${mouse?.x * -0.03}px, ${mouse?.y * -0.03}px)` }}
        />
      </svg>
    </div>
  );
};

// Glassmorphism Card Component
const GlassCard = ({ className, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className={`relative backdrop-blur-md bg-white/90 border border-white/20 shadow-xl rounded-xl overflow-hidden ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.4 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 text-xs ${trend.positive ? "text-green-600" : "text-red-500"}`}>
            <span>{trend.positive ? "↑" : "↓"} {trend.percentage}%</span>
            <span className="ml-1 text-gray-400">from last month</span>
          </div>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="text-white" size={20} />
      </div>
    </div>
  </motion.div>
);

const HospitalHome = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedBloodType, setSelectedBloodType] = useState("All");
  const [activeAlert, setActiveAlert] = useState(null);
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  
  // For animated blobs
  const mouse = useRef({ x: 0, y: 0 });
  
  const navigate = useNavigate();

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setInventory((prev) =>
        Object.entries(prev).reduce(
          (acc, [type, data]) => ({
            ...acc,
            [type]: {
              ...data,
              units: Math.max(
                0,
                data.units + Math.floor(Math.random() * 3 - 1)
              ),
            },
          }),
          {}
        )
      );
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const authenticateUser = async () => {
      const userType = localStorage.getItem("userType");
      const authToken = localStorage.getItem("authToken");

      if (userType !== "hospital" || !authToken) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/auth/verify/hospital`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: authToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Authentication failed");
        }

        setIsAuthenticating(false);
      } catch (error) {
        console.error("Authentication error:", error);
        localStorage.clear();
        navigate("/login");
      }
    };

    authenticateUser();
  }, [navigate]);

  const getStatusColor = (units) => {
    if (units < 5) return "bg-red-500";
    if (units < 15) return "bg-amber-400";
    return "bg-emerald-500";
  };

  const BloodInventoryCard = ({ type, data }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
      className="p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3
            className={`text-2xl font-bold ${getStatusColor(data.units).replace(
              "bg",
              "text"
            )}`}
          >
            {type}+
          </h3>
          <p className="text-sm text-gray-500">{data.donors} active donors</p>
        </div>
        <span className="text-lg font-semibold">{data.units} Units</span>
      </div>
      <div className="w-full bg-gray-100 h-2 rounded-full">
        <div
          className={`${getStatusColor(
            data.units
          )} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${(data.units / data.capacity) * 100}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-600">
        <span>{Math.round((data.units / data.capacity) * 100)}% capacity</span>
        <span>{data.capacity - data.units} remaining</span>
      </div>
    </motion.div>
  );

  if (isAuthenticating) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen relative">
      {/* Background blobs */}
      <AnimatedBlobs mouse={mouse.current} />
      
      {/* Content */}
      <div className="relative z-10">
        <HospitalNavbar />
        
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="mb-8">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold text-gray-800"
            >
              Blood Management Dashboard
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-gray-600"
            >
              Monitor inventory, donations and requests
            </motion.p>
          </header>

          {/* Status Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon={FaTint} 
              label="Total Blood Units" 
              value="215" 
              color="bg-red-500"
              trend={{ positive: true, percentage: 12 }}
            />
            <StatCard 
              icon={FaUserMd} 
              label="Available Donors" 
              value="42" 
              color="bg-blue-500" 
              trend={{ positive: true, percentage: 8 }}
            />
            <StatCard 
              icon={FaBell} 
              label="Critical Alerts" 
              value={criticalAlerts.length.toString()} 
              color="bg-amber-500" 
              trend={{ positive: false, percentage: 15 }}
            />
            <StatCard 
              icon={FaCalendarCheck} 
              label="Donations Today" 
              value="7" 
              color="bg-emerald-500" 
              trend={{ positive: true, percentage: 24 }}
            />
          </div>

          {/* Alerts */}
          {criticalAlerts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-10 h-10 bg-red-100 rounded-full text-red-500">
                  <FaExclamationTriangle />
                </span>
                <div>
                  <h3 className="font-semibold text-red-700">Critical Alerts</h3>
                  <p className="text-sm text-red-600">
                    {criticalAlerts.length} blood types require immediate attention
                  </p>
                </div>
              </div>
              <button
                className="px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-100 rounded-lg flex items-center gap-1"
                onClick={() => setActiveAlert("alerts")}
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </motion.div>
          )}

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Chart */}
            <GlassCard className="p-6 lg:col-span-2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">Blood Inventory Status</h2>
                <div className="flex space-x-2">
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      timeRange === "24h"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setTimeRange("24h")}
                  >
                    24H
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      timeRange === "7d"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setTimeRange("7d")}
                  >
                    7D
                  </button>
                  <button
                    className={`px-3 py-1 rounded text-sm ${
                      timeRange === "30d"
                        ? "bg-red-500 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    onClick={() => setTimeRange("30d")}
                  >
                    30D
                  </button>
                </div>
              </div>
              <div className="h-[350px]">
                <MainGraph timeRange={timeRange} bloodType={selectedBloodType} />
              </div>
            </GlassCard>

            {/* Blood Type Distribution */}
            <GlassCard className="p-6">
              <BloodTypeDonut inventory={inventory} />
            </GlassCard>
          </div>

          {/* Blood Unit Cards */}
          <div className="mb-8 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(inventory).map(([type, data]) => (
              <BloodInventoryCard key={type} type={type} data={data} />
            ))}
          </div>

          {/* Lower Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Supply Forecast */}
            <GlassCard className="p-6">
              <BloodSupplyForecast />
            </GlassCard>

            {/* Donation Trends */}
            <GlassCard className="p-6">
              <DonationTrends />
            </GlassCard>
          </div>

          {/* Recent Donations */}
          <GlassCard className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Donations</h2>
            {recentDonations.length === 0 ? (
              <p className="text-gray-500">No recent donations</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Donor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Blood Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Units
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentDonations.map((donation) => (
                      <motion.tr 
                        key={donation.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ backgroundColor: "rgba(249, 250, 251, 0.5)" }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {donation.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {donation.units}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Processed
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default HospitalHome;
