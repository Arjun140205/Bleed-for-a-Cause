import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const BloodInventory = ({ hospitalId, token }) => {
  const [inventory, setInventory] = useState({});
  const [alerts, setAlerts] = useState([]);

  const fetchInventory = async () => {
    try {
      const response = await fetch(`/api/hospital/stock-alerts?token=${token}`);
      const data = await response.json();
      
      if (data.alerts) {
        setAlerts(data.alerts);
        data.alerts.forEach(alert => {
          if (alert.severity === 'CRITICAL') {
            toast.error(alert.message, {
              position: "top-right",
              autoClose: 5000
            });
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    // Refresh every 5 minutes
    const interval = setInterval(fetchInventory, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [token]);

  const getStatusColor = (units) => {
    if (units <= 2) return 'bg-red-100 text-red-800';
    if (units <= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Blood Inventory Status</h2>
      
      <div className="grid grid-cols-4 gap-4">
        {Object.entries(inventory).map(([bloodType, units]) => (
          <div 
            key={bloodType}
            className={`p-4 rounded-lg ${getStatusColor(units)}`}
          >
            <div className="text-lg font-semibold">{bloodType}</div>
            <div className="text-2xl font-bold">{units} units</div>
          </div>
        ))}
      </div>

      {alerts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-3">Critical Alerts</h3>
          <div className="space-y-2">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-3 rounded-md ${
                  alert.severity === 'CRITICAL' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {alert.message}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodInventory;
