import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarCheck, FaBell, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';

const DonorEligibility = () => {
  const [eligibilityData, setEligibilityData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [preferences, setPreferences] = useState({
    smsEnabled: false,
    emailEnabled: false,
    radius: 10
  });
  const [isUpdating, setIsUpdating] = useState(false);

  // Check eligibility
  const checkEligibility = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/donor/eligibility`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check eligibility');
      }

      const data = await response.json();
      setEligibilityData(data.eligibility);
      toast.success('Eligibility status updated');
    } catch (error) {
      console.error('Error checking eligibility:', error);
      toast.error('Could not check eligibility');
    } finally {
      setIsLoading(false);
    }
  };

  // Update notification preferences
  const updatePreferences = async () => {
    setIsUpdating(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${BASE_URL}/donor/update-preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(preferences)
      });

      if (!response.ok) {
        throw new Error('Failed to update preferences');
      }

      const data = await response.json();
      toast.success('Notification preferences updated');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Could not update preferences');
    } finally {
      setIsUpdating(false);
    }
  };

  // Load preferences on mount
  useEffect(() => {
    checkEligibility();
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Eligibility Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold flex items-center">
            <FaCalendarCheck className="text-red-500 mr-2" />
            Donation Eligibility
          </h3>
          <button
            onClick={checkEligibility}
            disabled={isLoading}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              isLoading
                ? 'bg-gray-100 text-gray-400'
                : 'bg-red-50 text-red-500 hover:bg-red-100'
            }`}
          >
            {isLoading ? 'Checking...' : 'Check Now'}
          </button>
        </div>

        {eligibilityData ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${
              eligibilityData.isEligible
                ? 'bg-green-50 border border-green-100'
                : 'bg-yellow-50 border border-yellow-100'
            }`}>
              <div className="flex items-center">
                {eligibilityData.isEligible ? (
                  <FaCalendarCheck className="text-green-500 text-xl mr-3" />
                ) : (
                  <FaClock className="text-yellow-500 text-xl mr-3" />
                )}
                <div>
                  <p className="font-medium">
                    {eligibilityData.message}
                  </p>
                  {eligibilityData.lastDonationDate && (
                    <p className="text-sm text-gray-600 mt-1">
                      Last donation: {new Date(eligibilityData.lastDonationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {eligibilityData.nextDonationDate && (
              <div className="text-sm text-gray-600">
                <p>Next eligible donation date:</p>
                <p className="font-medium text-gray-800">
                  {new Date(eligibilityData.nextDonationDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Click "Check Now" to see your donation eligibility status
          </div>
        )}
      </motion.div>

      {/* Notification Preferences Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
      >
        <h3 className="text-lg font-semibold flex items-center mb-6">
          <FaBell className="text-red-500 mr-2" />
          Notification Preferences
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.emailEnabled}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  emailEnabled: e.target.checked
                }))}
                className="rounded text-red-500 focus:ring-red-500"
              />
              <span>Email Notifications</span>
            </label>

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={preferences.smsEnabled}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  smsEnabled: e.target.checked
                }))}
                className="rounded text-red-500 focus:ring-red-500"
              />
              <span>SMS Notifications</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notification Radius (km)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="1"
                max="50"
                value={preferences.radius}
                onChange={(e) => setPreferences(prev => ({
                  ...prev,
                  radius: parseInt(e.target.value)
                }))}
                className="flex-grow"
              />
              <span className="w-12 text-center">{preferences.radius}km</span>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={updatePreferences}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isUpdating
                  ? 'bg-gray-100 text-gray-400'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Save Preferences'}
            </button>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-start">
              <FaMapMarkerAlt className="text-blue-500 mt-1 mr-3" />
              <p className="text-sm text-blue-800">
                You will be notified when Thalassemia patients within {preferences.radius}km of your location need blood matching your type. Notifications will be sent via {
                  [
                    preferences.emailEnabled && 'email',
                    preferences.smsEnabled && 'SMS'
                  ].filter(Boolean).join(' and ')
                }.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DonorEligibility;
