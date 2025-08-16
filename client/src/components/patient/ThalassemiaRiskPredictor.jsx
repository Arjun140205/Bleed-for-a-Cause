import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDna, FaInfoCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';
import { GlassCard, SectionTitle, Button, PageLayout } from './PatientComponents';
import { useNavigate } from 'react-router-dom';

const ThalassemiaRiskPredictor = () => {
  const navigate = useNavigate();
  const [motherStatus, setMotherStatus] = useState('normal');
  const [fatherStatus, setFatherStatus] = useState('normal');
  const [prediction, setPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('Please log in to use this feature');
        navigate('/auth');
        return;
      }

      const response = await fetch(`${BASE_URL}/thalassemia/risk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motherStatus, fatherStatus }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          toast.error('Session expired. Please login again.');
          navigate('/auth');
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to get risk prediction");
      }

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to calculate risk");
      }
      setPrediction(data.result);
      toast.success("Risk prediction calculated successfully!");
    } catch (error) {
      console.error("Error getting thalassemia risk prediction:", error);
      if (error.message.includes('JSON')) {
        toast.error("Server error. Please try again later.");
      } else {
        toast.error(error.message || "Failed to calculate risk. Please try again.");
      }
      setError(error.message || "Failed to calculate risk. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Get risk level color based on risk prediction
  const getRiskColor = () => {
    if (!prediction) return 'bg-gray-200';
    
    switch (prediction.risk) {
      case 'No risk':
        return 'bg-green-100 border-green-500';
      case 'Carrier (Minor)':
        return 'bg-yellow-100 border-yellow-500';
      case 'High Risk of Thalassemia Major':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-200';
    }
  };

  return (
    <PageLayout>
      <div className="relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-20 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-10 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        
        <div className="container mx-auto px-4 py-8">
          <SectionTitle 
            title="Thalassemia Risk Predictor" 
            icon={<FaDna className="mr-2" />}
            description="Predict the risk of thalassemia in offspring based on parents' status"
          />

          <div className="mt-8 grid gap-8 md:grid-cols-2">
            {/* Input Form */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaDna className="mr-2 text-red-500" /> Enter Parental Status
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mother&apos;s Status:
                    </label>
                    <select
                      value={motherStatus}
                      onChange={(e) => setMotherStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="normal">Normal</option>
                      <option value="minor">Thalassemia Minor (Carrier)</option>
                      <option value="major">Thalassemia Major</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Father&apos;s Status:
                    </label>
                    <select
                      value={fatherStatus}
                      onChange={(e) => setFatherStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      required
                    >
                      <option value="">Select Status</option>
                      <option value="normal">Normal</option>
                      <option value="minor">Thalassemia Minor (Carrier)</option>
                      <option value="major">Thalassemia Major</option>
                    </select>
                  </div>
                </div>
                
                <Button 
                  type="submit"
                  disabled={isLoading || !motherStatus || !fatherStatus}
                  className="w-full"
                >
                  {isLoading ? "Calculating..." : "Calculate Risk"}
                </Button>
                
                {error && (
                  <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
              </form>
            </GlassCard>

            {/* Results Display */}
            <GlassCard className={`p-6 ${prediction ? getRiskColor() : ''} border-2 transition-all duration-300`}>
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <FaInfoCircle className="mr-2 text-red-500" /> Prediction Results
              </h3>
              
              {prediction ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-lg font-medium">Risk Assessment:</h4>
                    <p className="text-2xl font-bold mt-1">
                      {prediction.risk}
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium">Description:</h4>
                    <p className="mt-1">{prediction.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-medium">Risk Breakdown:</h4>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <span className="w-32">Normal:</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-green-500 h-4 rounded-full" 
                            style={{ width: prediction.riskPercentages.normal }}
                          ></div>
                        </div>
                        <span className="ml-2">{prediction.riskPercentages.normal}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32">Minor (Carrier):</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-yellow-500 h-4 rounded-full" 
                            style={{ width: prediction.riskPercentages.minor }}
                          ></div>
                        </div>
                        <span className="ml-2">{prediction.riskPercentages.minor}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-32">Major:</span>
                        <div className="flex-grow bg-gray-200 rounded-full h-4">
                          <div 
                            className="bg-red-500 h-4 rounded-full" 
                            style={{ width: prediction.riskPercentages.major }}
                          ></div>
                        </div>
                        <span className="ml-2">{prediction.riskPercentages.major}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-64 flex flex-col items-center justify-center text-center text-gray-500">
                  <FaDna className="text-5xl mb-4 opacity-30" />
                  <p>Complete the form and submit to see the thalassemia risk prediction.</p>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <GlassCard className="p-6 bg-blue-50">
              <h3 className="text-xl font-semibold mb-3">About Thalassemia</h3>
              <div className="space-y-3 text-gray-700">
                <p>
                  <strong>Thalassemia</strong> is an inherited blood disorder that affects the body&apos;s ability to produce hemoglobin and red blood cells. People with thalassemia make less hemoglobin and have fewer circulating red blood cells than normal, which results in mild or severe anemia.
                </p>
                <p>
                  <strong>Thalassemia Minor (Trait):</strong> Carriers have one defective gene but usually show no symptoms.
                </p>
                <p>
                  <strong>Thalassemia Major:</strong> Individuals inherit two defective genes and have severe symptoms that usually appear before a child&apos;s second birthday.
                </p>
                <p>
                  <strong>Inheritance Pattern:</strong> Thalassemia is passed from parents to children through genes. Understanding your risk can help with family planning and early interventions.
                </p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ThalassemiaRiskPredictor;
