import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const ThalassemiaPatients = ({ token }) => {
  const [patients, setPatients] = useState([]);
  
  const fetchThalassemiaPatients = async () => {
    try {
      const response = await fetch(`/api/bloodRequests?condition=Thalassemia&token=${token}`);
      const data = await response.json();
      setPatients(data.requests || []);
    } catch (error) {
      console.error('Failed to fetch Thalassemia patients:', error);
    }
  };

  const handlePrioritize = async (patientId) => {
    try {
      const response = await fetch('/api/hospital/auto-prioritize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          patientId
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Patient request prioritized successfully');
        if (data.matchingDonors?.length > 0) {
          toast.info(`Found ${data.matchingDonors.length} potential donors nearby`);
        }
        fetchThalassemiaPatients(); // Refresh list
      } else {
        toast.error(data.message || 'Failed to prioritize request');
      }
    } catch (error) {
      toast.error('Failed to process request');
    }
  };

  useEffect(() => {
    fetchThalassemiaPatients();
    // Refresh every 3 minutes
    const interval = setInterval(fetchThalassemiaPatients, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-4">Thalassemia Patients</h2>
      
      <div className="space-y-4">
        {patients.map((patient) => (
          <div key={patient._id} className="border p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold">{patient.patientName}</h3>
                <p className="text-gray-600">Blood Type: {patient.bloodType}</p>
                <p className="text-gray-600">
                  Status: <span className={
                    patient.priority === 'URGENT' 
                      ? 'text-red-600 font-semibold'
                      : 'text-yellow-600'
                  }>
                    {patient.priority || 'NORMAL'}
                  </span>
                </p>
              </div>
              
              <button
                onClick={() => handlePrioritize(patient._id)}
                className={`px-4 py-2 rounded-md ${
                  patient.priority === 'URGENT'
                    ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
                disabled={patient.priority === 'URGENT'}
              >
                {patient.priority === 'URGENT' ? 'Prioritized' : 'Prioritize'}
              </button>
            </div>
          </div>
        ))}

        {patients.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No Thalassemia patient requests at the moment
          </p>
        )}
      </div>
    </div>
  );
};

export default ThalassemiaPatients;
