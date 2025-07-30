import { useState, useEffect } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { motion } from "framer-motion";

const DonationTrends = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Generate mock donation trend data
    const generateTrendData = () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
      
      // Show current month and previous 5 months
      const currentMonthIndex = new Date().getMonth();
      const relevantMonths = [];
      
      for (let i = 5; i >= 0; i--) {
        const monthIndex = (currentMonthIndex - i + 12) % 12;
        relevantMonths.push(months[monthIndex]);
      }
      
      return relevantMonths.map(month => {
        const donationCount = Math.floor(Math.random() * 50) + 25;
        const regularDonors = Math.floor(donationCount * 0.7);
        const newDonors = donationCount - regularDonors;
        
        return {
          month,
          donationCount,
          regularDonors,
          newDonors,
        };
      });
    };
    
    setData(generateTrendData());
  }, []);

  const gradientOffset = () => {
    const dataMax = Math.max(...data.map((i) => i.donationCount));
    const dataMin = Math.min(...data.map((i) => i.donationCount));
    
    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }
    
    return dataMax / (dataMax - dataMin);
  };
  
  const offset = gradientOffset();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[350px]"
    >
      <h3 className="text-lg font-medium mb-4 text-center text-gray-700">Monthly Donation Trends</h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
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
                donationCount: 'Total Donations',
                regularDonors: 'Regular Donors',
                newDonors: 'New Donors'
              };
              return [value, displayNames[name] || name];
            }}
          />
          <defs>
            <linearGradient id="totalGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor="#ef4444" stopOpacity={0.8} />
              <stop offset={offset} stopColor="#ef4444" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="regularGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset={offset} stopColor="#3b82f6" stopOpacity={0.2} />
            </linearGradient>
            <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset={offset} stopColor="#10b981" stopOpacity={0.8} />
              <stop offset={offset} stopColor="#10b981" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="donationCount"
            stroke="#ef4444"
            fillOpacity={1}
            fill="url(#totalGradient)"
            strokeWidth={2}
            name="Total Donations"
          />
          <Area
            type="monotone"
            dataKey="regularDonors"
            stroke="#3b82f6"
            fillOpacity={0.6}
            fill="url(#regularGradient)"
            strokeWidth={2}
            name="Regular Donors"
          />
          <Area
            type="monotone"
            dataKey="newDonors"
            stroke="#10b981"
            fillOpacity={0.6}
            fill="url(#newGradient)"
            strokeWidth={2}
            name="New Donors"
          />
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default DonationTrends;
