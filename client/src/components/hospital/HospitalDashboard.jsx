import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaHospital, FaUserMd, FaTint, FaCalendarCheck, FaClipboardList, FaChartLine } from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import HospitalNavbar from "./HospitalNavbar";
import BloodInventory from "./BloodInventory";
import ThalassemiaPatients from "./ThalassemiaPatients";
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout, InfoCard } from "./HospitalComponents";

// Import charts
import MainGraph from "./charts/updated/MainGraph";
import BloodTypeDonut from "./charts/updated/BloodTypeDonut";
import BloodSupplyForecast from "./charts/updated/BloodSupplyForecast";
import DonationTrends from "./charts/updated/DonationTrends";

// Sample data
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

const HospitalDashboard = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedBloodType] = useState("All");
  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // For animated background
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  // Authentication
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

  // Loading state
  if (isAuthenticating) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <HospitalNavbar />
      <AnimatedBlobs mouse={mouse.current} />

      <SectionTitle subtitle="Welcome to Hospital Dashboard">
        Blood Management Center
      </SectionTitle>

      {isAuthenticating ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-blue-500 text-center p-4 bg-blue-50 rounded-lg">
          {error}
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <InfoCard
              icon={FaTint}
              title="Total Blood Units"
              value={Object.values(inventory).reduce((acc, cur) => acc + cur.units, 0)}
            />
            <InfoCard
              icon={FaUserMd}
              title="Active Donors"
              value={Object.values(inventory).reduce((acc, cur) => acc + cur.donors, 0)}
            />
            <InfoCard
              icon={FaClipboardList}
              title="Critical Alerts"
              value={criticalAlerts.length}
            />
          </div>

          {/* Critical Alerts */}
          {criticalAlerts.length > 0 && (
            <GlassCard className="mb-8">
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaClipboardList className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Critical Alerts</h3>
                      <p className="text-sm text-gray-600">
                        {criticalAlerts.map((alert) => alert.message).join(" • ")}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => {}} className="text-sm">
                    View Details
                  </Button>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Blood Inventory Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Object.entries(inventory).map(([type, data]) => (
              <GlassCard key={type} className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className={`text-2xl font-bold text-blue-600`}>
                      {type}+
                    </h3>
                    <p className="text-sm text-gray-500">{data.donors} active donors</p>
                  </div>
                  <span className="text-lg font-semibold">{data.units} Units</span>
                </div>
                <div className="w-full bg-blue-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-500"
                    style={{ width: `${(data.units / data.capacity) * 100}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-sm text-gray-600">
                  <span>{Math.round((data.units / data.capacity) * 100)}% capacity</span>
                  <span>{data.capacity - data.units} remaining</span>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Blood Inventory Management */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Blood Inventory</h2>
              <BloodInventory 
                hospitalId={hospitalId} 
                token={localStorage.getItem("authToken")} 
              />
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Thalassemia Patients</h2>
              <ThalassemiaPatients 
                token={localStorage.getItem("authToken")} 
              />
            </GlassCard>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Blood Donations Overview</h2>
                <div className="flex gap-2">
                  {["7d", "30d", "90d"].map((range) => (
                    <Button
                      key={range}
                      onClick={() => setTimeRange(range)}
                      className={`px-3 py-1 text-sm ${
                        timeRange === range
                          ? "bg-blue-600"
                          : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                      }`}
                    >
                      {range}
                    </Button>
                  ))}
                </div>
              </div>
              <MainGraph />
            </GlassCard>

            <GlassCard className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Blood Type Distribution</h2>
              <BloodTypeDonut />
            </GlassCard>
          </div>

          {/* Recent Donations */}
          <GlassCard className="mt-8 p-6">
            <h2 className="text-xl font-semibold mb-6 text-gray-900">Recent Donations</h2>
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
                <tbody className="divide-y divide-gray-200 bg-white/50">
                  {recentDonations.map((donation) => (
                    <tr key={donation.id} className="hover:bg-blue-50/50">
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
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          Processed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </>
      )}
    </PageLayout>
  );
};

export default HospitalDashboard;
