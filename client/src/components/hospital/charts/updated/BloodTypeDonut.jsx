import { useState, useEffect } from "react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";
import { motion } from "framer-motion";

const BloodTypeDonut = ({ inventory }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Transform inventory data for the pie chart
    if (inventory) {
      const chartData = Object.entries(inventory).map(([type, info]) => ({
        name: `${type}+`,
        value: info.units,
        color: getColorForBloodType(type),
        capacity: info.capacity
      }));
      setData(chartData);
    }
  }, [inventory]);

  // Custom colors for blood types
  const getColorForBloodType = (type) => {
    switch(type) {
      case 'A': return '#ef4444'; // red
      case 'B': return '#3b82f6'; // blue
      case 'AB': return '#10b981'; // green
      case 'O': return '#f59e0b'; // amber
      default: return '#9333ea'; // purple (fallback)
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = Math.round((data.value / data.capacity) * 100);
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-sm text-gray-600">{data.value} units of {data.capacity}</p>
          <div className="mt-2 w-full bg-gray-100 h-2 rounded-full">
            <div
              className="h-2 rounded-full"
              style={{ width: `${percentage}%`, backgroundColor: data.color }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">{percentage}% of capacity</p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px]"
    >
      <h3 className="text-lg font-medium mb-2 text-center text-gray-700">Blood Type Distribution</h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
            animationDuration={1000}
            animationBegin={200}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            verticalAlign="middle" 
            align="right" 
            wrapperStyle={{ fontSize: 12 }}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BloodTypeDonut;
