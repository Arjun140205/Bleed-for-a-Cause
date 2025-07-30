import { useState, useEffect } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer
} from "recharts";
import { motion } from "framer-motion";

const BloodSupplyForecast = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate mock forecast data
    const generateForecastData = () => {
      const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
      
      return bloodTypes.map(type => {
        const currentLevel = Math.floor(Math.random() * 20) + 5;
        const forecastedDemand = Math.floor(Math.random() * 25) + 10;
        const surplus = currentLevel - forecastedDemand;
        
        return {
          type,
          currentLevel,
          forecastedDemand,
          surplus,
          needsDonation: surplus < 0
        };
      });
    };
    
    setData(generateForecastData());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[350px]"
    >
      <h3 className="text-lg font-medium mb-4 text-center text-gray-700">7-Day Supply Forecast</h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 40,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
          <XAxis 
            type="number" 
            domain={['dataMin', 'dataMax + 5']}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            dataKey="type" 
            type="category" 
            tick={{ fontSize: 12 }}
            width={40}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}
            formatter={(value, name) => {
              const displayNames = {
                currentLevel: 'Current Stock',
                forecastedDemand: 'Expected Demand',
                surplus: 'Projected Surplus'
              };
              return [value, displayNames[name] || name];
            }}
          />
          <Bar 
            dataKey="currentLevel" 
            name="Current Stock"
            fill="#4ade80"
            radius={[0, 4, 4, 0]}
          />
          <Bar 
            dataKey="forecastedDemand" 
            name="Expected Demand"
            fill="#f87171"
            radius={[0, 4, 4, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BloodSupplyForecast;
