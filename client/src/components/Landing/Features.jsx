import React from "react";
import { motion } from "framer-motion";
import { Heart, Building2, Users } from "lucide-react";
import Card from "../ui/Card";

const Features = () => {
  const features = [
    {
      icon: Heart,
      title: "Easy Blood Donations",
      text: "Find the nearest donation center and schedule a donation in minutes.",
    },
    {
      icon: Building2,
      title: "Hospital Support",
      text: "Real-time blood inventory tracking and AI-powered shortage forecasting.",
    },
    {
      icon: Users,
      title: "Community Impact",
      text: "Join a lifesaving network where every donation creates ripples of hope.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Reduced from 0.2
        delayChildren: 0.1, // Reduced from 0.3
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 }, // Reduced y distance from 30
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, // Reduced from 0.8
        ease: [0.25, 0.1, 0.25, 1], // Custom easing for smoother motion
      }
    },
  };

  return (
    <section className="relative py-20 overflow-hidden bg-gray-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute w-full h-full bg-gradient-to-br from-red-100 to-red-50" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
       
       <motion.h2
        initial={{ opacity: 0, y: 20 }} // Reduced y distance
        whileInView={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.4, // Reduced from 0.8
            ease: [0.25, 0.1, 0.25, 1], // Custom easing
          }
        }}
        whileHover={{ 
          scale: 1.02,
          transition: { duration: 0.2 }
        }}
        viewport={{ once: true, margin: "-50px" }} // Reduced margin for earlier trigger
        className="
          text-6xl md:text-6xl 
          font-bold text-center mb-25
          bg-gradient-to-r from-red-400 to-red-600 
          bg-clip-text text-transparent 
          hover:from-red-600 hover:to-red-700
          transition-all duration-300 cursor-pointer
        "
      >
        Why Choose Bleed for a Cause?
      </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="group relative p-8 bg-white/80 rounded-2xl border border-gray-200/70 backdrop-blur-lg shadow-lg hover:shadow-2xl hover:shadow-red-100/50 hover:border-red-500/80 transition-all duration-200 transform-gpu perspective-1000 hover:-translate-y-1">
                <Icon className="w-10 h-10 mb-4 text-red-500" />
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--accent)" }}>{feature.title}</h3>
                <p className="text-gray-700">{feature.text}</p>
              </Card>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Features;