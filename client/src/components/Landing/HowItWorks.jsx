import React from "react";
import { motion } from "framer-motion";
import { UserPlus, Heart, Truck } from "lucide-react";
import Card from "../ui/Card";

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      title: "Step 1: Sign Up",
      text: "Create your profile as a donor, healthcare provider, or patient in seconds",
      color: "from-red-400 to-red-600",
      bgGradient: "from-red-100 to-red-200",
      shadowColor: "shadow-red-200/80",
      hoverBorder: "hover:border-red-600/80",
      iconBg: "from-red-500 to-red-600",
    },
    {
      icon: Heart,
      title: "Step 2: Request or Donate",
      text: "Hospitals post needs, donors schedule donations, AI matches supply",
      color: "from-orange-400 to-orange-600",
      bgGradient: "from-orange-100 to-orange-200",
      shadowColor: "shadow-orange-200/60",
      hoverBorder: "hover:border-orange-600/80",
      iconBg: "from-orange-500 to-orange-600",
    },
    {
      icon: Truck,
      title: "Step 3: Save a Life",
      text: "Automated logistics ensure timely delivery where it's needed most",
      color: "from-amber-500 to-amber-600",
      bgGradient: "from-amber-100 to-amber-200",
      shadowColor: "shadow-amber-200/60",
      hoverBorder: "hover:border-amber-600/80",
      iconBg: "from-amber-500 to-amber-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50, rotateX: -15 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15,
        duration: 0.8 
      }
    },
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 }
      }
    }
  };

  return (
    <section className="relative pt-10 pb-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Animated background patterns */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-72 h-72 bg-red-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
 
 <motion.h2
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }}
  whileHover={{ 
    scale: 1.02,
    transition: { duration: 0.2 }
  }}
  viewport={{ once: true, margin: "-100px" }}
  className="
    text-6xl md:text-6xl 
    font-bold text-center mb-25
    bg-gradient-to-r from-red-400 to-red-600 
    bg-clip-text text-transparent 
    hover:from-red-600 hover:to-red-700
    transition-all duration-300
  "
>
  How It Works
</motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-12 relative"
        >
          {/* Animated connecting path */}
          <div className="hidden md:block absolute top-24 left-0 right-0 h-2">
            <svg className="w-full h-full" viewBox="0 0 800 8" fill="none">
              <motion.path
                d="M50 4 Q400 -20 750 4"
                stroke="url(#pathGradient)"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                variants={pathVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              />
              <defs>
                <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#f97316" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className={`relative group cursor-pointer p-8 bg-white/90 rounded-3xl border-2 border-gray-200/50 backdrop-blur-xl shadow-xl ${step.shadowColor} ${step.hoverBorder} transition-all duration-300  h-full transform-gpu`} style={{ transformStyle: 'preserve-3d' }}>
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${step.bgGradient} opacity-0 group-hover:opacity-60 transition-all duration-500`} />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="absolute inset-0 rounded-3xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 transform rotate-12" />
                </div>
                <Icon className={`w-10 h-10 mb-4 text-red-500`} />
                <h3 className="text-xl font-bold mb-2" style={{ color: "var(--accent)" }}>{step.title}</h3>
                <p className="text-gray-700">{step.text}</p>
              </Card>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;