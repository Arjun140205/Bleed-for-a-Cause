import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaSearch, FaMapMarkerAlt, FaUserFriends, 
  FaTint, FaExclamationCircle, FaSpinner 
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';
import { GlassCard, Button } from './PatientComponents';

const CompatibleDonorFinder = ({ patientBloodType }) => {
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [donors, setDonors] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Function to get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location permission denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
          }
          reject(new Error(errorMessage));
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };
  
  // Function to find compatible donors
  const findCompatibleDonors = async () => {
    setIsSearching(true);
    setLocationError(null);
    
    try {
      // Get current location
      const location = await getCurrentLocation();
      
      // Get auth token
      const authToken = localStorage.getItem('authToken');
      
      // Make API call
      const response = await fetch(`${BASE_URL}/donor/find-compatible`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          bloodType: patientBloodType,
          location,
          authToken
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to find donors');
      }
      
      setDonors(data.donors || []);
      setShowResults(true);
      
      if (data.donors.length === 0) {
        toast.info('No compatible donors found in your area');
      } else {
        toast.success(`Found ${data.donors.length} compatible donor(s) nearby!`);
      }
      
    } catch (error) {
      console.error('Error finding donors:', error);
      setLocationError(error.message);
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsSearching(false);
    }
  };
  
  const getBloodTypeIcon = (bloodType) => {
    const color = bloodType.includes('+') ? 'text-red-500' : 'text-blue-500';
    return (
      <div className={`font-bold flex items-center justify-center ${color}`}>
        <FaTint className="mr-1" />
        {bloodType.toUpperCase()}
      </div>
    );
  };
  
  return (
    <div>
      <GlassCard className="mb-6 p-5">
        <div className="flex flex-wrap justify-between items-center">
          <div>
            <h3 className="text-xl font-semibold flex items-center mb-2">
              <FaUserFriends className="text-red-500 mr-2" />
              Find Compatible Donors
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Locate nearby blood donors compatible with your blood type ({patientBloodType?.toUpperCase() || 'Unknown'})
            </p>
          </div>
          
          <Button 
            onClick={findCompatibleDonors}
            disabled={isSearching || !patientBloodType}
            className="flex items-center"
          >
            {isSearching ? (
              <>
                <FaSpinner className="animate-spin mr-2" /> 
                Searching...
              </>
            ) : (
              <>
                <FaSearch className="mr-2" /> 
                Find Donors Nearby
              </>
            )}
          </Button>
        </div>
        
        {/* Location error message */}
        {locationError && (
          <div className="mt-4 p-3 bg-yellow-100 border border-yellow-300 rounded-md flex items-start text-sm">
            <FaExclamationCircle className="text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Location Error:</strong> {locationError}
              <p className="mt-1">Please ensure location access is enabled in your browser settings.</p>
            </div>
          </div>
        )}
        
        {/* Results section */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}
            className="mt-6"
          >
            <h4 className="font-medium text-lg mb-3 flex items-center">
              <FaMapMarkerAlt className="text-red-500 mr-2" />
              Compatible Donors Nearby ({donors.length})
            </h4>
            
            {donors.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                {donors.map((donor, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white/60 rounded-lg p-4 border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-gray-600">
                        {donor.district}, {donor.state}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getBloodTypeIcon(donor.bloodType)}
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {donor.distance} km
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
                <FaUserFriends className="text-gray-400 text-3xl mx-auto mb-2" />
                <p className="text-gray-500">No compatible donors found within 10km of your location.</p>
                <p className="text-sm text-gray-400 mt-1">Try again later or contact a blood bank.</p>
              </div>
            )}
          </motion.div>
        )}
      </GlassCard>
    </div>
  );
};

export default CompatibleDonorFinder;
