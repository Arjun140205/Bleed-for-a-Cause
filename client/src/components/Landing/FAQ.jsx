import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import ListItem from "../ui/ListItem";

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

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [activeCategory, setActiveCategory] = useState('donors');
  
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

  const faqCategories = {
    donors: {
      title: "For Donors",
      faqs: [
        {
          question: " Eligibility",
          answer: "",
          isCategory: true
        },
        {
          question: "Can I donate if I have a tattoo or piercing?",
          answer: "Yes, you can donate if the tattoo or piercing was done using sterile needles and has healed fully, typically after 6 months."
        },
        {
          question: "Can people with diabetes donate blood?",
          answer: "Yes, if your diabetes is well controlled and you are otherwise healthy."
        },
        {
          question: "Can I donate if I'm on medication?",
          answer: "It depends on the medication. Consult with the donation center for a complete list of restricted drugs."
        },
        {
          question: " Donation Frequency",
          answer: "",
          isCategory: true
        },
        {
          question: "How often can I donate whole blood?",
          answer: "Every 56 days (8 weeks)."
        },
        {
          question: "How often can I donate platelets or plasma?",
          answer: "Platelets: Every 7 days, up to 24 times a year.\nPlasma: Every 28 days."
        },
        {
          question: " During Donation",
          answer: "",
          isCategory: true
        },
        {
          question: "How long does the blood donation process take?",
          answer: "The entire process takes about 30 to 45 minutes, with the actual donation taking 8–10 minutes."
        },
        {
          question: "Is blood donation painful?",
          answer: "Only a slight pinch is felt when the needle is inserted — most donors report minimal discomfort."
        },
        {
          question: " After Donation",
          answer: "",
          isCategory: true
        },
        {
          question: "What should I do after donating blood?",
          answer: "Rest for a few minutes, drink fluids, and avoid heavy physical activity for the rest of the day."
        },
        {
          question: "Can I drive after donating blood?",
          answer: "Yes, but rest for 10–15 minutes post-donation before doing so."
        }
      ]
    },
    patients: {
      title: "For Patients",
      faqs: [
        {
          question: "How can I request blood?",
          answer: "You can request blood through your hospital or directly on our platform by creating a blood request"
        },
        {
          question: "What information do I need to provide?",
          answer: "You'll need to provide your blood type, required units, hospital details, and contact information"
        },
        {
          question: "How long does it take to find a donor?",
          answer: "Response time varies, but our system prioritizes urgent cases and typically finds matches within 24-48 hours"
        }
      ]
    },
    hospitals: {
      title: "For Hospitals",
      faqs: [
        {
          question: "How can my hospital register?",
          answer: "Hospitals can register through our platform by providing necessary documentation and verification"
        },
        {
          question: "What verification is required?",
          answer: "We require hospital registration certificates, blood bank licenses, and other relevant medical certifications"
        },
        {
          question: "How do we manage blood inventory?",
          answer: "Our platform provides real-time inventory management tools and automated alerts for low stock"
        }
      ]
    },
    organizers: {
      title: "For Campaign Organizers",
      faqs: [
        {
          question: "How do I organize a blood drive?",
          answer: "Register as an organizer, set up your campaign details, and use our tools to manage donors and logistics"
        },
        {
          question: "What support do you provide?",
          answer: "We provide promotional materials, donor management tools, and technical support for your campaign"
        },
        {
          question: "Can I track campaign progress?",
          answer: "Yes, our platform provides real-time analytics and tracking tools for your blood drive"
        }
      ]
    }
  };

  return (
    <div
      className="relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 overflow-x-hidden"
      style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}
      onMouseMove={handleMouseMove}
    >
      <AnimatedBlobs mouse={mouse.current} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white text-sm font-semibold px-6 py-2 rounded-full inline-block mb-6 shadow-lg shadow-red-300/40"
            style={{ letterSpacing: 2 }}
          >
            GET ANSWERS
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-400 to-red-800 mb-6 leading-tight drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Frequently Asked Questions
          </motion.h1>
          
          <motion.p
            className="text-xl max-w-3xl mx-auto text-red-900/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Find answers to common questions about blood donation, requests, and our services
          </motion.p>
        </motion.div>
        
        {/* Category Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {Object.keys(faqCategories).map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveCategory(category)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-full transition-all duration-300 font-semibold shadow-lg ${
                activeCategory === category
                  ? 'bg-gradient-to-r from-red-500 to-red-700 text-white shadow-red-300/40'
                  : 'bg-white/80 text-red-900/80 hover:bg-white shadow-red-200/30 backdrop-blur-sm'
              }`}
            >
              {faqCategories[category].title}
            </motion.button>
          ))}
        </motion.div>

        {/* FAQ Items */}
        <motion.div 
          className="space-y-4 relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {faqCategories[activeCategory].faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <ListItem
                className={`${glass} rounded-xl overflow-hidden transition-all duration-300 ${
                  faq.isCategory
                    ? 'bg-gradient-to-r from-red-50/80 to-red-100/80 border-red-200/50'
                    : 'hover:shadow-red-200/40 hover:scale-[1.02]'
                }`}
                style={{
                  background: faq.isCategory 
                    ? "linear-gradient(135deg, rgba(254,226,226,0.8), rgba(254,202,202,0.8))"
                    : "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.3))",
                  borderColor: "rgba(254,226,226,0.4)",
                  color: "var(--text-main)"
                }}
              >
                <button
                  className={`w-full p-4 text-left flex justify-between items-center ${
                    faq.isCategory ? 'cursor-default' : ''
                  }`}
                  onClick={() =>
                    !faq.isCategory && setActiveIndex(activeIndex === index ? null : index)
                  }
                >
                  <span
                    className={`font-medium ${
                      faq.isCategory
                        ? 'text-red-700 text-lg'
                        : ''
                    }`}
                    style={{
                      color: faq.isCategory
                        ? "var(--accent)"
                        : "var(--text-main)"
                    }}
                  >
                    {faq.question}
                  </span>
                  {!faq.isCategory &&
                    (activeIndex === index ? <FiChevronUp /> : <FiChevronDown />)}
                </button>
                {!faq.isCategory && activeIndex === index && (
                  <div
                    className="p-4 pt-0 border-t"
                    style={{
                      color: "var(--text-muted)",
                      borderColor: "rgba(200,200,200,0.13)"
                    }}
                  >
                    {faq.answer}
                  </div>
                )}
              </ListItem>
            </motion.div>
          ))}
        </motion.div>

        <div
          className="mt-12 rounded-lg p-6 text-center"
          style={{
            background: "var(--bg-surface)"
          }}
        >
          <h2
            className="text-xl font-semibold mb-4"
            style={{ color: "var(--accent)" }}
          >
            Still have questions?
          </h2>
          <button
            className="px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            style={{
              background: "var(--accent)",
              color: "#fff"
            }}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default FAQ;