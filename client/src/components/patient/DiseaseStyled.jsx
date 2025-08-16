import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FaVirus, FaHeartbeat, FaSearch, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout } from './PatientComponents';

const Disease = () => {
  const [symptoms, setSymptoms] = useState([]);
  const [availableSymptoms, setAvailableSymptoms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Mouse position for parallax effect
  const mouse = useRef({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    mouse.current = {
      x: e.clientX - window.innerWidth / 2,
      y: e.clientY - window.innerHeight / 2,
    };
  };

  useEffect(() => {
    // Fetch available symptoms from backend
    const fetchSymptoms = async () => {
      let currentResponse;
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error("Authentication required");
        }

        currentResponse = await fetch(`${BASE_URL}/api/symptoms`, {
          headers: {
            "Authorization": `Bearer ${authToken}`
          }
        });
        
        if (!currentResponse.ok) {
          if (currentResponse.status === 404) {
            // If the symptoms endpoint is not found, use fallback symptoms
            throw new Error("Symptoms service unavailable");
          }
          if (currentResponse.status === 401) {
            localStorage.clear();
            window.location.href = '/auth';
            throw new Error("Authentication required");
          }
          throw new Error("Failed to fetch symptoms");
        }
        
        const data = await currentResponse.json();
        if (!data.symptoms) {
          throw new Error("Invalid response format");
        }
        setAvailableSymptoms(data.symptoms);
      } catch (error) {
        console.error("Error fetching symptoms:", error);
        if (error.message === "Authentication required") {
          window.location.href = '/auth';
          return;
        }
        setError("Failed to load symptom data. Using offline data.");
        // Fallback to common symptoms if API fails
        const commonSymptoms = [
          "fever", "headache", "cough", "fatigue", "nausea", 
          "vomiting", "diarrhea", "chills", "body ache", "sore throat",
          "shortness of breath", "chest pain", "abdominal pain", "dizziness",
          "rash", "joint pain", "weakness", "loss of appetite", "sneezing"
        ];
        setAvailableSymptoms(commonSymptoms);
      }
    };

    fetchSymptoms();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const addSymptom = (symptom) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom]);
    }
    setSearchTerm("");
  };

  const removeSymptom = (symptom) => {
    setSymptoms(symptoms.filter(s => s !== symptom));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (symptoms.length < 3) {
      toast.warning("Please select at least 3 symptoms for accurate prediction");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${BASE_URL}/api/predict/disease`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to get prediction");
      }
      
      const data = await response.json();
      setPrediction(data);
      toast.success("Disease prediction successful!");
    } catch (error) {
      console.error("Error predicting disease:", error);
      setError("Failed to predict disease. Please try again.");
      toast.error("Prediction failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSymptoms = searchTerm 
    ? availableSymptoms.filter(symptom => 
        symptom.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <AnimatedBlobs mouse={mouse.current} />
      
      <SectionTitle subtitle="Check potential health conditions based on your symptoms">
        Disease Predictor
      </SectionTitle>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <GlassCard className="p-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-6 flex items-center gap-3">
            <FaVirus className="text-blue-500" />
            Select Your Symptoms
          </h2>
          
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search symptoms..."
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/60 border border-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
            
            {searchTerm && (
              <div className="mt-2 p-2 max-h-48 overflow-y-auto bg-white/80 rounded-lg border border-blue-100 shadow-sm">
                {filteredSymptoms.length > 0 ? (
                  filteredSymptoms.slice(0, 8).map((symptom, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                      className="p-2 hover:bg-blue-50 rounded-md cursor-pointer flex items-center justify-between"
                      onClick={() => addSymptom(symptom)}
                    >
                      <span>{symptom}</span>
                      <span className="text-blue-500 text-sm">Add</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-500 p-2">No symptoms found</p>
                )}
              </div>
            )}
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Symptoms ({symptoms.length})</h3>
            {symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {symptoms.map((symptom, index) => (
                  <motion.span
                    key={index}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                  >
                    {symptom}
                    <button
                      onClick={() => removeSymptom(symptom)}
                      className="ml-1 text-blue-500 hover:text-blue-700 focus:outline-none"
                    >
                      ×
                    </button>
                  </motion.span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No symptoms selected yet</p>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm mb-4 p-3 bg-red-50 rounded-md">
              {error}
            </div>
          )}
          
          <div className="flex justify-end mt-4">
            <Button
              onClick={handleSubmit}
              disabled={symptoms.length < 3 || isLoading}
              className="flex items-center gap-2 px-8"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaHeartbeat />
                  Predict Disease
                </>
              )}
            </Button>
          </div>
          
          <div className="mt-6 text-sm text-gray-500 flex items-center gap-2">
            <FaInfoCircle />
            Select at least 3 symptoms for more accurate predictions
          </div>
        </GlassCard>
        
        <div>
          {prediction ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-blue-800 mb-6">Prediction Results</h2>
                
                <div className="bg-white/60 rounded-xl border border-blue-100 p-6 mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-1">Potential Condition</h3>
                  <div className="text-3xl font-bold text-blue-700 mb-4">
                    {prediction.predicted_disease}
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Confidence Level</h4>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                      <div 
                        className="bg-blue-500 h-2.5 rounded-full" 
                        style={{ width: `${prediction.confidence}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-sm text-gray-500">
                      {prediction.confidence}%
                    </div>
                  </div>
                </div>
                
                {prediction.description && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-800 mb-2">About this condition</h3>
                    <p className="text-gray-600">{prediction.description}</p>
                  </div>
                )}
                
                {prediction.recommendations && (
                  <div>
                    <h3 className="font-medium text-gray-800 mb-3">Recommendations</h3>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-600">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-8 text-sm text-gray-500 bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium mb-1 flex items-center gap-2">
                    <FaInfoCircle className="text-blue-500" />
                    Important Note
                  </div>
                  <p>
                    This prediction is based on machine learning models and should not replace 
                    professional medical advice. Please consult with a healthcare professional
                    for proper diagnosis and treatment.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          ) : (
            <GlassCard className="p-8 flex flex-col items-center justify-center text-center h-full">
              <div className="mb-6 text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Prediction Yet</h3>
              <p className="text-gray-500 max-w-md">
                Select at least 3 symptoms from the list to get a prediction of potential health conditions
              </p>
            </GlassCard>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Disease;
