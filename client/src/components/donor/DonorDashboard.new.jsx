import React, { useEffect, useState, useRef } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { FaTint, FaCalendarCheck, FaHospital, FaMapMarkerAlt, FaUserAlt, FaTasks } from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import TextInput from "../ui/TextInput";
import SelectInput from "../ui/SelectInput";
import DonorEligibility from "./DonorEligibility";
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout, InfoCard } from './DonorComponents';

// States list data here...
const statesList = [
  { value: "01", label: "Andhra Pradesh" },
  { value: "02", label: "Arunachal Pradesh" },
  // ... other states ...
];

const DonorDashboard = () => {
  const [donor, setDonor] = useState(null);
  const [missingInfo, setMissingInfo] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    bloodType: "",
    lastDonationDate: "",
    state: "",
    district: "",
    medicalCondition: "",
  });
  const [bloodBanks, setBloodBanks] = useState([]);
  const [showEligibility, setShowEligibility] = useState(true);
  
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  useEffect(() => {
    const fetchDonorInfo = async () => {
      try {
        const result = await checkDonorInfo();
        if (!result.success) {
          throw new Error(result.message || "Failed to fetch donor info");
        }

        if (result.missing) {
          setMissingInfo(true);
        } else if (result.user) {
          setDonor(result.user);
          setFormData({
            bloodType: result.user.bloodType || "",
            lastDonationDate: result.user.lastDonationDate || "",
            state: result.user.state || "",
            district: result.user.district || "",
            medicalCondition: result.user.medicalCondition || "",
          });
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDonorInfo();
  }, []);

  // District fetching effect
  useEffect(() => {
    if (formData.state) {
      getDistricts(formData.state);
    }
  }, [formData.state]);

  // Blood banks fetching effect
  useEffect(() => {
    if (formData.district) {
      getBloodBanks();
    }
  }, [districts, formData.district]);

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <AnimatedBlobs mouse={mouse.current} />
      
      <div className="container mx-auto px-4 py-8">
        <SectionTitle subtitle={missingInfo ? "Complete Your Profile" : "Welcome Back"}>
          {missingInfo ? "Complete Your Profile" : "Blood Donation Management"}
        </SectionTitle>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
            {error}
          </div>
        ) : (
          <div className="space-y-8">
            {missingInfo ? (
              <motion.div className="space-y-8">
                <motion.h1 
                  className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-4 leading-tight drop-shadow-lg"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.8 }}
                >
                  Complete Your Profile
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="max-w-2xl mx-auto text-lg text-gray-600"
                >
                  Please provide the following details to complete your profile
                </motion.p>

                <GlassCard className="max-w-xl mx-auto p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Form fields go here */}
                  </form>
                </GlassCard>
              </motion.div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <InfoCard
                    icon={FaTint}
                    title="Next Donation"
                    value={donor?.nextDonationDate || "Eligible Now"}
                  />
                  <InfoCard
                    icon={FaCalendarCheck}
                    title="Last Donation"
                    value={donor?.lastDonationDate || "No donations yet"}
                  />
                  <InfoCard
                    icon={FaTasks}
                    title="Total Donations"
                    value={donor?.totalDonations || 0}
                  />
                </div>

                {showEligibility && (
                  <GlassCard className="p-6">
                    <DonorEligibility />
                  </GlassCard>
                )}

                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-6">Nearby Blood Banks</h2>
                  {/* Blood banks list */}
                </GlassCard>
              </>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default DonorDashboard;
