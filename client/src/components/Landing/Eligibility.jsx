import React, { useState, useRef } from 'react';
import { format, differenceInMonths } from "date-fns";
import { motion } from 'framer-motion';
// Artistic blood donation PNG from Vecteezy (example):
// https://static.vecteezy.com/system/resources/previews/009/749/564/original/blood-donation-blood-bag-and-blood-drop-png.png
const artisticBloodImg = '/bloodDonation.png';

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

import TextInput from "../ui/TextInput";
import SelectInput from "../ui/SelectInput";

const Eligibility = () => {
  const [formData, setFormData] = useState({
    age: "", weight: "", lastDonation: "", chronicDisease: "No", diseaseName: "", recentProcedure: "No", feelingHealthy: "Yes",
  });
  const [eligibility, setEligibility] = useState(null);
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const checkEligibility = () => {
    if (!formData.age || !formData.weight || !formData.lastDonation) {
      setEligibility("Please fill out all required fields.");
      return;
    }
    const age = Number(formData.age);
    const weight = Number(formData.weight);
    const lastDonationDate = new Date(formData.lastDonation);
    const monthsSinceLastDonation = differenceInMonths(new Date(), lastDonationDate);
    if (age < 18 || age > 65) {
      setEligibility("Not eligible: Age must be between 18 and 65.");
    } else if (weight < 50) {
      setEligibility("Not eligible: Minimum weight should be more than 50 kg.");
    } else if (formData.chronicDisease === "Yes" && !formData.diseaseName.trim()) {
      setEligibility("Not eligible: Please specify your chronic disease.");
    } else if (formData.chronicDisease === "Yes") {
      setEligibility("Not eligible: You have a chronic disease.");
    } else if (formData.recentProcedure === "Yes") {
      setEligibility("Not eligible: Wait 6 months after tattoo/piercing/surgery.");
    } else if (formData.feelingHealthy === "No") {
      setEligibility("Not eligible: You must be in good health to donate.");
    } else if (monthsSinceLastDonation < 3) {
      setEligibility("Not eligible: You must wait at least 3 months between donations.");
    } else {
      setEligibility("Eligible: You meet the requirements to donate blood.");
    }
  };

  // Glassmorphism style
  const glass = 'bg-white/30 backdrop-blur-lg border border-red-200/40 shadow-2xl shadow-red-200/30';

  return (
    <div
      className="relative min-h-screen pt-24 px-4 pb-20 overflow-x-hidden"
      style={{ background: "var(--bg-main)", color: "var(--text-main)" }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <motion.h1
        className="text-5xl md:text-6xl font-extrabold text-center mb-3 p-6 bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 drop-shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Blood Donation Eligibility Test
      </motion.h1>
      <motion.p
        className="text-center max-w-3xl mx-auto text-lg font-medium mb-10 pb-5 text-red-900/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Donating blood is a simple, safe, and life-saving act, but not everyone is eligible at all times.
        To ensure both your safety and the safety of the patient receiving your blood, take our Donor Eligibility Test for a quick self-assessment.
      </motion.p>
      <div className="flex flex-col md:flex-row gap-8 items-start max-w-6xl mx-auto">
        <motion.div
          className={`w-full md:w-1/2 p-1`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className={`p-8 space-y-4 rounded-3xl ${glass}`}
            style={{ color: "var(--text-main)" }}
          >
            <div className="space-y-1">
              <label className="block font-medium">Age</label>
              <TextInput
                name="age"
                type="number"
                value={formData.age}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  borderColor: "rgba(200,0,0,0.13)"
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Weight (kg)</label>
              <TextInput
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  borderColor: "rgba(200,0,0,0.13)"
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Last Donation Date</label>
              <TextInput
                name="lastDonation"
                type="date"
                value={formData.lastDonation}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  borderColor: "rgba(200,0,0,0.13)"
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Do you have any chronic diseases?</label>
              <SelectInput
                name="chronicDisease"
                value={formData.chronicDisease}
                onChange={handleChange}
                options={["No", "Yes"]}
                className="w-full border p-2 rounded"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  borderColor: "rgba(200,0,0,0.13)"
                }}
              />
            </div>
            {formData.chronicDisease === "Yes" && (
              <div className="space-y-1">
                <label className="block font-medium">If Yes, please specify</label>
                <TextInput
                  name="diseaseName"
                  value={formData.diseaseName}
                  onChange={handleChange}
                  className="w-full border p-2 rounded"
                  style={{
                    background: "var(--bg-main)",
                    color: "var(--text-main)",
                    borderColor: "rgba(200,0,0,0.13)"
                  }}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="block font-medium">Have you had a tattoo, piercing, or surgery in the last 6 months?</label>
              <SelectInput
                name="recentProcedure"
                value={formData.recentProcedure}
                onChange={handleChange}
                options={["No", "Yes"]}
                className="w-full border p-2 rounded"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  borderColor: "rgba(200,0,0,0.13)"
                }}
              />
            </div>
            <div className="space-y-1">
              <label className="block font-medium">Are you currently feeling healthy?</label>
              <SelectInput
                name="feelingHealthy"
                value={formData.feelingHealthy}
                onChange={handleChange}
                options={["Yes", "No"]}
                className="w-full border p-2 rounded"
                style={{
                  background: "var(--bg-main)",
                  color: "var(--text-main)",
                  borderColor: "rgba(200,0,0,0.13)"
                }}
              />
            </div>
            <motion.button
              className="w-full mt-4 py-3 px-4 rounded-xl font-bold text-xl bg-gradient-to-r from-red-500 via-red-400 to-red-700 hover:bg-red-700 transition-colors shadow-lg shadow-red-200/40 text-white relative overflow-hidden"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={checkEligibility}
            >
              <span className="relative z-10">Check Eligibility</span>
              <motion.span
                className="absolute inset-0 bg-white/10 rounded-xl pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
            {eligibility && (
              <motion.div
                className="mt-4 p-4 rounded-xl text-center font-medium shadow-md"
                style={{
                  background: "var(--bg-main)",
                  color: eligibility.startsWith("Eligible") ? "var(--accent)" : "var(--text-muted)"
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {eligibility}
              </motion.div>
            )}
          </div>
        </motion.div>
        <motion.div
          className="w-full md:w-1/2 flex justify-center items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="flex flex-col justify-center items-center w-full h-full relative">
          <img
              src={artisticBloodImg}
              alt="Artistic Blood Donation"
              className="h-[500px] md:h-[600px] w-auto object-contain rounded-3xl bg-white/30 backdrop-blur-lg"
              style={{ mixBlendMode: 'multiply', maxHeight: '80vh', border: 'none', boxShadow: 'none' }}
            />
            {/* Subtle white-to-transparent gradient overlay at the bottom for effect */}
            <div
              className="absolute bottom-0 left-0 w-full h-24 rounded-b-3xl pointer-events-none"
              style={{
                background: 'linear-gradient(to top, rgba(255,255,255,0.7), rgba(255,255,255,0))',
              }}
            ></div>
        </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Eligibility;