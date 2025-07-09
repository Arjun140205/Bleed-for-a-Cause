import React, { useState, useEffect } from "react";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";
import HospitalNavbar from "./HospitalNavbar";

const BloodRequestManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBloodRequests();
  }, []);

  const fetchBloodRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/hospital/api/bloodRequests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: localStorage.getItem("authToken") }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch requests");
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      setError(err.message);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const response = await fetch(
        `${BASE_URL}/hospital/api/bloodRequests/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: localStorage.getItem("authToken"),
            status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      await fetchBloodRequests();
      toast.success(`Request ${status} successfully!`);
    } catch (err) {
      console.error("Update error:", err);
      toast.error(`Failed to update request status: ${err.message}`);
    }
  };

  return (
    <>
      <HospitalNavbar />
      <div className="relative min-h-screen bg-gradient-to-br from-red-100 via-white to-red-200 overflow-hidden pt-16">
        {/* Animated SVG blob background */}
        <svg className="absolute -top-20 -left-20 w-96 h-96 opacity-30 z-0" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill="#F87171" d="M44.8,-67.2C56.6,-59.2,63.7,-44.2,68.2,-29.2C72.7,-14.2,74.6,0.8,70.2,14.7C65.8,28.6,55.1,41.4,42.1,50.7C29.1,60,14.6,65.8,-0.7,66.7C-16,67.6,-32,63.6,-44.2,54.1C-56.4,44.6,-64.8,29.6,-68.2,13.7C-71.6,-2.2,-69.9,-19,-62.2,-32.7C-54.5,-46.4,-40.8,-57,-26.1,-63.7C-11.4,-70.4,4.3,-73.2,19.7,-71.1C35.1,-69,49.9,-62.1,44.8,-67.2Z" transform="translate(100 100)" />
        </svg>
        <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 sm:px-8">
          <div className="mb-10 p-8 rounded-3xl shadow-xl bg-white/70 backdrop-blur-md border border-red-200/40 flex flex-col items-center">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-400 to-red-700 drop-shadow-lg mb-2 text-center">Blood Request Management</h1>
            <p className="text-lg text-gray-700 mb-4 text-center">Manage and update all incoming blood requests for your hospital in a beautiful, interactive dashboard.</p>
          </div>
          <div className="space-y-8">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
              </div>
            ) : error ? (
              <div className="p-6 bg-red-100 text-red-700 rounded-xl shadow text-center font-semibold">{error}</div>
            ) : (
              <div className="grid gap-6">
                {requests.length === 0 ? (
                  <div className="p-8 bg-white/80 rounded-2xl shadow text-center text-gray-500 font-medium">No active blood requests at the moment.</div>
                ) : (
                  requests.map((req) => (
                    <div key={req._id} className="bg-white/80 rounded-2xl shadow-lg p-6 flex flex-col md:flex-row md:items-center justify-between border border-red-100 hover:shadow-xl transition-all">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="inline-block w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                          <span className="font-bold text-lg text-red-700">{req.bloodType}</span>
                          <span className="text-gray-500">{req.units} units</span>
                          <span className="text-gray-400 text-sm">{req.urgency}</span>
                        </div>
                        <div className="text-gray-700 text-sm">Requested on: <span className="font-medium">{new Date(req.requestDate).toLocaleDateString()}</span></div>
                        {req.hospital && (
                          <div className="text-gray-500 text-xs">Hospital: {req.hospital.name} ({req.hospital.city}, {req.hospital.state})</div>
                        )}
                      </div>
                      <div className="mt-4 md:mt-0 flex gap-3">
                        <button
                          onClick={() => updateStatus(req._id, "fulfilled")}
                          className="px-5 py-2 rounded-lg font-bold bg-gradient-to-r from-green-400 to-green-600 text-white shadow hover:scale-105 transition-transform"
                        >
                          Mark Fulfilled
                        </button>
                        <button
                          onClick={() => updateStatus(req._id, "cancelled")}
                          className="px-5 py-2 rounded-lg font-bold bg-gradient-to-r from-red-400 to-red-600 text-white shadow hover:scale-105 transition-transform"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default BloodRequestManagement;
