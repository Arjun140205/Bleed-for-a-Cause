import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTimesCircle,
  FaClock,
  FaHospital,
  FaTint,
} from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import { toast } from "react-toastify";
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout } from "./PatientComponents";
import CompatibleDonorFinder from "./CompatibleDonorFinder";

const Requests = () => {
  const navigate = useNavigate();
  const [requestHistory, setRequestHistory] = useState([]);
  const [activeRequests, setActiveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [patientData, setPatientData] = useState(null);

  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  const authToken = localStorage.getItem("authToken");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchPatientData = async () => {
      if (userType !== "patient" || !authToken) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/patient/dashboard`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        
        const data = await response.json();
        setPatientData(data.patient || {});
      } catch (error) {
        console.error("Error fetching patient data:", error);
        toast.error("Could not load your profile data");
      }
    };

    const fetchBloodHistory = async () => {
      setIsLoading(true);
      if (userType !== "patient") {
        navigate("/login");
        return;
      }

      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('Authentication token is required');
        }

        const response = await fetch(
          `${BASE_URL}/patient/request-history`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ patientId: localStorage.getItem('userId') }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.clear();
            navigate("/auth");
            throw new Error('Authentication required');
          }
          throw new Error(data.message || "Failed to fetch blood history");
        }

        if (data.success && Array.isArray(data.data)) {
          const processed = data.data.map(request => ({
            _id: request._id,
            bloodType: request.bloodType,
            units: request.units,
            status: request.status,
            hospital: request.hospital?.name || "Unknown Hospital",
            requestDate: new Date(request.createdAt).toLocaleDateString(),
            responseDate: request.updatedAt ? new Date(request.updatedAt).toLocaleDateString() : null,
          }));
          
          const active = processed.filter(r => r.status === 'pending');
          const history = processed.filter(r => r.status !== 'pending');
          
          setActiveRequests(active);
          setRequestHistory(history);
        } else {
          throw new Error("Failed to process request history");
        }
      } catch (error) {
        console.error("Error fetching history:", error);
        if (error.message === "Authentication required") {
          navigate("/auth");
        } else {
          toast.error(error.message || "Error fetching request history");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatientData();
    fetchBloodHistory();
  }, [authToken, userType, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <FaCheckCircle className="text-green-500 text-xl" />;
      case "pending":
        return <FaClock className="text-yellow-500 text-xl" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500 text-xl" />;
      default:
        return <FaExclamationCircle className="text-gray-500 text-xl" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <AnimatedBlobs mouse={mouse.current} />
      
      <SectionTitle subtitle="Track your blood unit requests and their status">
        Blood Request History
      </SectionTitle>
      
      {/* Compatible Donor Finder */}
      <CompatibleDonorFinder patientBloodType={patientData?.bloodGroup} />

      {/* Active Requests */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
          <FaTint className="text-blue-500" />
          Active Requests
        </h2>

        {activeRequests.length > 0 ? (
          <div className="space-y-4">
            {activeRequests.map((request) => (
              <GlassCard 
                key={request._id} 
                className="p-6 transition-transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <FaHospital className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {request.hospital}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaTint className="text-blue-500" />
                          {request.bloodType}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{request.units} units</span>
                        <span className="text-gray-400">•</span>
                        <span>Requested on {request.requestDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status === "pending" ? "In Progress" : request.status}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-center">
            <div className="flex flex-col items-center">
              <FaTint className="text-4xl text-blue-300 mb-2" />
              <p className="text-gray-600">No active requests</p>
            </div>
          </GlassCard>
        )}
      </div>

      {/* Request History */}
      <div>
        <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
          <FaCheckCircle className="text-blue-500" />
          Past Requests
        </h2>

        {requestHistory.length > 0 ? (
          <div className="space-y-4">
            {requestHistory.map((request) => (
              <GlassCard 
                key={request._id} 
                className="p-6"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-full bg-blue-100">
                      <FaHospital className="text-blue-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-gray-800">
                        {request.hospital}
                      </h3>
                      <div className="flex items-center flex-wrap gap-2 mt-1 text-gray-600">
                        <span className="flex items-center gap-1">
                          <FaTint className="text-blue-500" />
                          {request.bloodType}
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>{request.units} units</span>
                        <span className="text-gray-400">•</span>
                        <span>Requested on {request.requestDate}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        ) : (
          <GlassCard className="p-8 text-center">
            <div className="flex flex-col items-center">
              <FaTint className="text-4xl text-blue-300 mb-2" />
              <p className="text-gray-600">No request history</p>
            </div>
          </GlassCard>
        )}
      </div>
    </PageLayout>
  );
};

export default Requests;
