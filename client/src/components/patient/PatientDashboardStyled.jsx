import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartPie, FaCalendarCheck, FaUserMd, FaClipboardList, FaHeartbeat, FaVial } from 'react-icons/fa';
import BASE_URL from '../../apiConfig';
import { toast } from 'react-toastify';
import { AnimatedBlobs, GlassCard, SectionTitle, Button, PageLayout, InfoCard } from './PatientComponents';
import TransfusionReminder from './TransfusionReminder';
import { authenticatedFetch, isAuthenticated } from '../../utils/auth';

const PatientDashboard = () => {
  const navigate = useNavigate();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
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
    // Check authentication first
    if (!isAuthenticated()) {
      navigate('/auth');
      return;
    }

    // Fetch patient data
    const fetchPatientData = async () => {
      try {
        const data = await authenticatedFetch(`${BASE_URL}/patient/dashboard`);
        setPatientData(data);
        setError(null);
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        if (error.message === 'Authentication required') {
          navigate('/auth');
        } else {
          setError('Failed to load dashboard data. Please try again.');
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatientData();
    
    // For demo, set mock data if API not available
    setTimeout(() => {
      if (loading) {
        setPatientData({
          name: 'John Smith',
          bloodGroup: 'O+',
          totalRequests: 3,
          pendingRequests: 1,
          upcomingAppointment: '2023-12-15',
          latestHaemoglobin: 13.5,
          recentPredictions: [
            { disease: 'Common Cold', date: '2023-12-01', confidence: 85 },
            { disease: 'Allergies', date: '2023-11-15', confidence: 92 }
          ],
          bloodRequestHistory: [
            { date: '2023-12-01', units: 2, status: 'pending', hospital: 'City Medical Center' },
            { date: '2023-11-10', units: 1, status: 'fulfilled', hospital: 'General Hospital' },
            { date: '2023-10-25', units: 2, status: 'approved', hospital: 'Community Clinic' }
          ]
        });
        setLoading(false);
      }
    }, 2000);
  }, [loading]);

  return (
    <PageLayout onMouseMove={handleMouseMove}>
      <AnimatedBlobs mouse={mouse.current} />
      
      <SectionTitle subtitle="Welcome to your healthcare management portal">
        Patient Dashboard
      </SectionTitle>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 text-center p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      ) : patientData ? (
        <div className="space-y-8">
          {/* Welcome section */}
          <GlassCard className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-5xl font-bold flex-shrink-0">
                {patientData.name ? patientData.name[0].toUpperCase() : 'P'}
              </div>
              
              <div className="text-center md:text-left">
                <h2 className="text-3xl font-bold text-gray-800">Welcome back, {patientData.name}</h2>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    <FaHeartbeat className="mr-1" />
                    Blood Group: {patientData.bloodGroup}
                  </span>
                  
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    <FaUserMd className="mr-1" />
                    Patient ID: {patientData._id?.slice(-6) || 'P12345'}
                  </span>
                  
                  {patientData.upcomingAppointment && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                      <FaCalendarCheck className="mr-1" />
                      Next Appointment: {new Date(patientData.upcomingAppointment).toLocaleDateString()}
                    </span>
                  )}
                </div>
                
                <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-3">
                  <Button 
                    onClick={() => navigate('/patient/requests')}
                    className="text-sm px-4 py-2"
                  >
                    Request Blood
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/patient/haemoglobin')}
                    className="text-sm px-4 py-2"
                    primary={false}
                  >
                    Check Haemoglobin
                  </Button>
                  
                  <Button 
                    onClick={() => navigate('/patient/disease')}
                    className="text-sm px-4 py-2"
                    primary={false}
                  >
                    Disease Predictor
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
          
          {/* Stats section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InfoCard
              icon={<FaClipboardList className="text-white text-lg" />}
              title="Total Blood Requests"
              value={patientData.totalRequests || 0}
              color="bg-blue-500"
            />
            
            <InfoCard
              icon={<FaHeartbeat className="text-white text-lg" />}
              title="Pending Requests"
              value={patientData.pendingRequests || 0}
              color="bg-yellow-500"
            />
            
            <InfoCard
              icon={<FaVial className="text-white text-lg" />}
              title="Latest Haemoglobin"
              value={patientData.latestHaemoglobin ? `${patientData.latestHaemoglobin} g/dL` : 'N/A'}
              color="bg-green-500"
            />
            
            <InfoCard
              icon={<FaChartPie className="text-white text-lg" />}
              title="Health Score"
              value={patientData.healthScore || "Good"}
              color="bg-indigo-500"
            />
          </div>
          
          {/* Transfusion Reminder */}
          <TransfusionReminder />
          
          {/* Recent activity section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Blood request history */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-6">Recent Blood Requests</h3>
              
              {patientData.bloodRequestHistory && patientData.bloodRequestHistory.length > 0 ? (
                <div className="space-y-4">
                  {patientData.bloodRequestHistory.slice(0, 3).map((request, index) => (
                    <div key={index} className="bg-white/60 rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium text-gray-800">{request.hospital}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(request.date).toLocaleDateString()} • {request.units} unit(s)
                          </p>
                        </div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                          ${request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            request.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                            request.status === 'fulfilled' ? 'bg-green-100 text-green-800' : 
                            'bg-red-100 text-red-800'}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No blood requests yet</p>
              )}
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/patient/requests')} 
                  className="w-full"
                  primary={false}
                >
                  View All Requests
                </Button>
              </div>
            </GlassCard>
            
            {/* Recent disease predictions */}
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-blue-800 mb-6">Recent Health Predictions</h3>
              
              {patientData.recentPredictions && patientData.recentPredictions.length > 0 ? (
                <div className="space-y-4">
                  {patientData.recentPredictions.map((prediction, index) => (
                    <div key={index} className="bg-white/60 rounded-lg p-4 border border-gray-100">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{prediction.disease}</p>
                          <p className="text-sm text-gray-500">
                            {new Date(prediction.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-sm font-medium text-blue-800">
                          {prediction.confidence}% match
                        </div>
                      </div>
                      
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                        <div 
                          className="bg-blue-500 h-1.5 rounded-full" 
                          style={{ width: `${prediction.confidence}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No health predictions yet</p>
              )}
              
              <div className="mt-6">
                <Button 
                  onClick={() => navigate('/patient/disease')} 
                  className="w-full"
                  primary={false}
                >
                  Check Disease Predictor
                </Button>
              </div>
            </GlassCard>
          </div>
        </div>
      ) : null}
    </PageLayout>
  );
};

export default PatientDashboard;
