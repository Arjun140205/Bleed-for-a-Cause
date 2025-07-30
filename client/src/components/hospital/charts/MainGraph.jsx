import { useState, useEffect } from "react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

const MainGraph = ({ timeRange = "7d", bloodType = "All" }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate data based on timeRange
    const generateData = () => {
      let days;
      switch(timeRange) {
        case "24h": days = 24; break;
        case "7d": days = 7; break;
        case "30d": days = 30; break;
        default: days = 7;
      }
      
      const result = [];
      const bloodTypes = ["A", "B", "AB", "O"];
      
      // For 24h, use hours instead of days
      if (timeRange === "24h") {
        for (let i = 0; i < 24; i++) {
          const hour = i;
          const entry = {
            time: `${hour}:00`,
          };
          
          bloodTypes.forEach(type => {
            // More realistic inventory levels that change gradually
            const baseValue = type === "AB" ? 10 : type === "O" ? 35 : 20;
            const fluctuation = Math.sin(i / 4) * 3 + Math.random() * 2 - 1;
            entry[type] = Math.max(0, Math.round(baseValue + fluctuation));
          });
          
          result.push(entry);
        }
      } else {
        // For days
        for (let i = 0; i < days; i++) {
          const date = new Date();
          date.setDate(date.getDate() - (days - i - 1));
          
          const entry = {
            time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          };
          
          bloodTypes.forEach(type => {
            const baseValue = type === "AB" ? 10 : type === "O" ? 35 : 20;
            const fluctuation = Math.sin(i / 2) * 2 + (Math.random() * 4 - 2);
            entry[type] = Math.max(0, Math.round(baseValue + fluctuation));
          });
          
          result.push(entry);
        }
      }
      
      return result;
    };

    setData(generateData());
  }, [timeRange]);

  const colors = {
    A: "#ef4444", // red
    B: "#3b82f6", // blue
    AB: "#10b981", // green
    O: "#f59e0b"  // amber
  };

  const filteredTypes = bloodType === "All" 
    ? ["A", "B", "AB", "O"] 
    : [bloodType];

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="time" 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis 
            stroke="#6b7280" 
            tick={{ fontSize: 12 }}
            tickLine={{ stroke: '#e5e7eb' }}
            domain={[0, 'dataMax + 5']}
            label={{ 
              value: 'Units', 
              angle: -90, 
              position: 'insideLeft', 
              style: { textAnchor: 'middle', fill: '#6b7280', fontSize: 12 } 
            }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.95)', 
              borderRadius: '0.5rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              border: '1px solid #f3f4f6'
            }}
          />
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle"
            iconSize={10}
            formatter={(value) => <span className="text-sm font-medium">{value}+</span>}
          />
          
          {filteredTypes.map(type => (
            <Line
              key={type}
              type="monotone"
              dataKey={type}
              stroke={colors[type]}
              strokeWidth={3}
              activeDot={{ r: 6, strokeWidth: 1, stroke: "#fff" }}
              dot={{ r: 0 }}
              animationDuration={1500}
              animationEasing="ease-in-out"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MainGraph;
