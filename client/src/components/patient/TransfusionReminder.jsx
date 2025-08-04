import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCalendarPlus, FaCalendarCheck, FaExclamationTriangle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import BASE_URL from '../../apiConfig';
import { GlassCard } from './PatientComponents';

const TransfusionReminder = () => {
  const [reminderData, setReminderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [newTransfusionDate, setNewTransfusionDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  // Function to fetch transfusion status
  const checkTransfusionStatus = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('You must be logged in');
        return;
      }

      const response = await fetch(`${BASE_URL}/patient/transfusion-reminder`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch transfusion status');
      }

      const data = await response.json();
      setReminderData(data);
      toast.success('Transfusion status updated');
    } catch (error) {
      console.error('Error fetching transfusion reminder:', error);
      toast.error('Could not check transfusion status');
    } finally {
      setLoading(false);
    }
  };

  // Function to update last transfusion date
  const updateTransfusionDate = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        toast.error('You must be logged in');
        return;
      }

      const response = await fetch(`${BASE_URL}/patient/update-transfusion-date`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ transfusionDate: newTransfusionDate }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transfusion date');
      }

      const data = await response.json();
      toast.success('Transfusion date updated successfully');
      
      // Refresh the reminder data
      checkTransfusionStatus();
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error updating transfusion date:', error);
      toast.error('Could not update transfusion date');
    } finally {
      setLoading(false);
    }
  };

  // Function to get appropriate status icon
  const getStatusIcon = () => {
    if (!reminderData) return null;
    
    switch (reminderData.status) {
      case 'urgent':
        return <FaExclamationTriangle className="text-red-500 text-3xl" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500 text-3xl" />;
      case 'normal':
        return <FaCalendarCheck className="text-green-500 text-3xl" />;
      default:
        return <FaCalendarCheck className="text-gray-500 text-3xl" />;
    }
  };

  // Function to get appropriate status color
  const getStatusColor = () => {
    if (!reminderData) return 'bg-gray-100';
    
    switch (reminderData.status) {
      case 'urgent':
        return 'bg-red-100 border-red-300';
      case 'warning':
        return 'bg-yellow-100 border-yellow-300';
      case 'normal':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100';
    }
  };

  return (
    <div className="mb-8">
      <GlassCard className="p-5">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FaCalendarCheck className="mr-2 text-red-500" /> 
          Transfusion Reminder
        </h3>

        {!reminderData ? (
          <div className="text-center py-4">
            <p className="text-gray-600 mb-4">
              Check your transfusion status to get personalized reminders
            </p>
            <button
              onClick={checkTransfusionStatus}
              disabled={loading}
              className={`px-5 py-2 rounded-full font-medium transition-all ${
                loading
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600 hover:shadow-lg'
              }`}
            >
              {loading ? 'Checking...' : 'Check My Transfusion Status'}
            </button>
          </div>
        ) : (
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg border ${getStatusColor()} flex items-center mb-4`}
            >
              <div className="mr-4">{getStatusIcon()}</div>
              <div className="flex-1">
                <h4 className="font-medium text-lg">{reminderData.message}</h4>
                {reminderData.lastTransfusionDate ? (
                  <p className="text-sm text-gray-600">
                    Last transfusion: {new Date(reminderData.lastTransfusionDate).toLocaleDateString()}
                    {reminderData.daysElapsed && (
                      <span> ({reminderData.daysElapsed} days ago)</span>
                    )}
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    No previous transfusion record found
                  </p>
                )}
              </div>
            </motion.div>

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={checkTransfusionStatus}
                disabled={loading}
                className={`px-4 py-2 text-sm rounded-full font-medium transition-all ${
                  loading
                    ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow'
                }`}
              >
                Refresh Status
              </button>
              <button
                onClick={() => setShowUpdateForm(!showUpdateForm)}
                className="px-4 py-2 text-sm rounded-full font-medium transition-all bg-green-500 text-white hover:bg-green-600 hover:shadow flex items-center"
              >
                <FaCalendarPlus className="mr-1" /> 
                {showUpdateForm ? 'Cancel Update' : 'Update Transfusion Date'}
              </button>
            </div>

            {showUpdateForm && (
              <motion.form 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 border rounded-lg bg-gray-50"
                onSubmit={updateTransfusionDate}
              >
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Transfusion Date:
                  </label>
                  <input
                    type="date"
                    value={newTransfusionDate}
                    onChange={(e) => setNewTransfusionDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-4 py-2 rounded-md font-medium transition-all w-full ${
                    loading
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  {loading ? 'Updating...' : 'Save New Date'}
                </button>
              </motion.form>
            )}
          </div>
        )}
      </GlassCard>
    </div>
  );
};

export default TransfusionReminder;
