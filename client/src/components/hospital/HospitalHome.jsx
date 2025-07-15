import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import MainGraph from "./charts/MainGraph";
import BASE_URL from "../../apiConfig";
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
];

const HospitalHome = () => {
  const [inventory, setInventory] = useState(initialInventory);
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedBloodType, setSelectedBloodType] = useState("All");
  const [activeAlert, setActiveAlert] = useState(null);

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

  const getStatusColor = (units) => {
    if (units < 5) return "bg-red-500";
    if (units < 15) return "bg-amber-400";
    return "bg-emerald-500";
  };

  const BloodInventoryCard = ({ type, data }) => (
    <div className="group p-4 border border-gray-200 rounded-xl bg-white shadow-sm hover:shadow-md transition-all">
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
    </div>
  );

  const [isAuthenticating, setIsAuthenticating] = useState(true);
  const navigate = useNavigate();

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

  if (isAuthenticating) {
    return (
      <div className="text-center text-gray-600">
        Verifying authentication...
      </div>
    );
  }

  return (
    <>
      <HospitalNavbar />
      <div className="relative min-h-screen bg-gradient-to-br from-red-100 via-white to-red-200 overflow-hidden pt-16">
        {/* Animated SVG blob background */}
        <svg className="absolute -top-20 -left-20 w-96 h-96 opacity-30 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#F87171" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.1,50.7C29.1,60,14.6,65.8,-0.7,66.7C-16,67.6,-32,63.6,-44.2,54.1C-56.4,44.6,-64.8,29.6,-68.2,13.7C-71.6,-2.2,-69.9,-19,-62.2,-32.7C-54.5,-46.4,-40.8,-57,-26.1,-63.7C-11.4,-70.4,4.3,-73.2,19.7,-71.1C35.1,-69,49.9,-62.1,44.8,-67.2Z" transform="translate(100 100)" />
        </svg>
        <div className="relative z-10 max-w-6xl mx-auto py-12 px-4 sm:px-8">
          <header className="mb-10 flex flex-col md:flex-row justify-between items-center bg-white/70 backdrop-blur-md rounded-3xl shadow-xl border border-red-200/40 p-8 relative overflow-hidden">
            {/* Animated SVG blob background for header */}
            <svg className="absolute -top-10 -right-10 w-60 h-60 opacity-20 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#F87171" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.1,50.7C29.1,60,14.6,65.8,-0.7,66.7C-16,67.6,-32,63.6,-44.2,54.1C-56.4,44.6,-64.8,29.6,-68.2,13.7C-71.6,-2.2,-69.9,-19,-62.2,-32.7C-54.5,-46.4,-40.8,-57,-26.1,-63.7C-11.4,-70.4,4.3,-73.2,19.7,-71.1C35.1,-69,49.9,-62.1,44.8,-67.2Z" transform="translate(100 100)" />
            </svg>
            <div className="relative z-10 flex-1">
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-red-700 drop-shadow-lg mb-2 text-center md:text-left">
            Blood Management Dashboard
          </h1>
              <div className="flex items-center gap-3 text-base justify-center md:justify-start">
                <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg border-2 border-white" />
                <span className="px-3 py-1 bg-white/70 text-green-700 font-semibold rounded-full shadow border border-green-200 animate-fade-in">
            Real-time data updates
                </span>
          </div>
        </div>
            <a href="/hospital/requestmanagement" className="relative z-10 mt-6 md:mt-0">
              <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:scale-105 transition-transform border-2 border-orange-600/70">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 17l4 4 4-4m0-5V3m-8 9v6a2 2 0 002 2h4a2 2 0 002-2v-6" /></svg>
                Request Management
              </button>
        </a>
      </header>
          {/* Main dashboard content glassy card */}
          <div className="mb-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {Object.entries(inventory).map(([type, data]) => (
          <BloodInventoryCard key={type} type={type} data={data} />
        ))}
      </div>
          {/* Analytics and alerts glassy card */}
          <div className="mb-10 bg-white/80 rounded-3xl shadow-xl border border-red-100">
            <div className="p-6 border-b border-red-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-900">
            Blood Analytics
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({timeRange.replace("d", " day").toUpperCase()})
            </span>
          </h2>
          <div className="flex gap-2">
            <select
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="24h">Last 24h</option>
              <option value="7d">Last 7d</option>
              <option value="30d">Last 30d</option>
            </select>
            <select
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white"
              value={selectedBloodType}
              onChange={(e) => setSelectedBloodType(e.target.value)}
            >
              <option value="All">All Types</option>
              {Object.keys(inventory).map((type) => (
                <option key={type} value={type}>
                  {type}+
                </option>
              ))}
            </select>
          </div>
        </div>
            <div className="p-6 h-fit">
          <MainGraph timeRange={timeRange} bloodType={selectedBloodType} />
        </div>
      </div>
          {/* Shortage predictions and recent donations glassy cards */}
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="bg-white/80 p-6 rounded-2xl shadow-lg border border-red-100">
          <h3 className="text-lg font-semibold mb-4">Shortage Predictions</h3>
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 rounded-lg flex items-center gap-4">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-amber-700">
                  High Risk of O+ Shortage
                </p>
                <p className="text-sm text-amber-600">
                  Predicted 40% demand increase in next 7 days
                </p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="font-medium text-blue-700">
                  Donor Availability Alert
                </p>
                <p className="text-sm text-blue-600">
                  12 compatible donors available within 50km radius
                </p>
              </div>
            </div>
          </div>
        </div>
            <div className="bg-white/80 p-6 rounded-2xl shadow-lg border border-red-100">
          <h3 className="text-lg font-semibold mb-4">Recent Donations</h3>
          <div className="space-y-3">
            {recentDonations.map((donation) => (
              <div
                key={donation.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{donation.name}</p>
                  <p className="text-sm text-gray-500">{donation.type}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{donation.units} units</p>
                  <p className="text-sm text-gray-500">{donation.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
      </div>
    </>
  );
};

export default HospitalHome;
