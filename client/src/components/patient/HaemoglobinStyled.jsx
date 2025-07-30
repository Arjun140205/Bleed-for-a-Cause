import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { FaVial, FaChartLine, FaInfo, FaCheckCircle } from "react-icons/fa";
import BASE_URL from "../../apiConfig";
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout } from "./PatientComponents";

const HaemoglobinPredictor = () => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    weight: "",
    height: "",
    dietary_habits: "",
    medical_history: "",
    previous_haemoglobin: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch(
        `${BASE_URL}/api/predict/haemoglobin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      toast.success("Prediction successful!");
      setPrediction(data);
    } catch (error) {
      console.error("Error predicting haemoglobin:", error);
      toast.error("Failed to predict haemoglobin level. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getHaemoglobinStatus = (level) => {
    const numLevel = parseFloat(level);
    if (numLevel < 10) return { status: "Low", color: "text-red-500", bg: "bg-red-100" };
    if (numLevel < 12) return { status: "Below Average", color: "text-yellow-500", bg: "bg-yellow-100" };
    if (numLevel < 16) return { status: "Normal", color: "text-green-500", bg: "bg-green-100" };
    return { status: "Above Average", color: "text-blue-500", bg: "bg-blue-100" };
  };

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <AnimatedBlobs mouse={mouse.current} />
      
      <SectionTitle subtitle="Check your predicted haemoglobin levels based on your health parameters">
        Haemoglobin Level Predictor
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
            <FaVial className="text-blue-500" />
            Enter Your Details
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min="1"
                  max="120"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Your age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Weight in kg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  required
                  min="1"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Height in cm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Habits</label>
                <select
                  name="dietary_habits"
                  value={formData.dietary_habits}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="">Select Diet Type</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Previous Haemoglobin Level</label>
                <input
                  type="number"
                  name="previous_haemoglobin"
                  value={formData.previous_haemoglobin}
                  onChange={handleChange}
                  step="0.1"
                  className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  placeholder="Previous level (optional)"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical History</label>
              <textarea
                name="medical_history"
                value={formData.medical_history}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Any relevant medical conditions (anemia, etc.)"
                rows="3"
              ></textarea>
            </div>
            
            <div className="flex justify-end">
              <Button 
                disabled={isLoading}
                className="flex items-center gap-2 px-8"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaChartLine />
                    Predict Level
                  </>
                )}
              </Button>
            </div>
          </form>
        </GlassCard>
        
        <div>
          {prediction ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8 mb-6">
                <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
                  <FaCheckCircle className="text-blue-500" />
                  Your Results
                </h2>
                
                <div className="bg-white/60 rounded-xl border border-blue-100 p-6 mb-6">
                  <div className="text-center mb-4">
                    <p className="text-gray-600 mb-2">Estimated Haemoglobin Level</p>
                    <div className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                      {prediction.predicted_haemoglobin} g/dL
                    </div>
                    
                    {(() => {
                      const { status, color, bg } = getHaemoglobinStatus(prediction.predicted_haemoglobin);
                      return (
                        <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium mt-4 ${color} ${bg}`}>
                          {status}
                        </span>
                      );
                    })()}
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2.5 mb-6">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full" 
                      style={{ width: `${Math.min(100, (prediction.predicted_haemoglobin / 20) * 100)}%` }}
                    ></div>
                  </div>
                  
                  <div className="grid grid-cols-3 text-center text-sm">
                    <div>
                      <p className="text-gray-500">Low</p>
                      <p className="font-medium text-gray-800">&lt;12 g/dL</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Normal</p>
                      <p className="font-medium text-gray-800">12-16 g/dL</p>
                    </div>
                    <div>
                      <p className="text-gray-500">High</p>
                      <p className="font-medium text-gray-800">&gt;16 g/dL</p>
                    </div>
                  </div>
                </div>
                
                {prediction.recommendations && (
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-800">Recommendations</h3>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1"><FaInfo /></span>
                          <span className="text-gray-600">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center h-full">
              <FaVial className="text-6xl text-blue-300 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Prediction Yet</h3>
              <p className="text-gray-500 max-w-md">
                Complete the form to get your estimated haemoglobin level and personalized recommendations
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default HaemoglobinPredictor;
