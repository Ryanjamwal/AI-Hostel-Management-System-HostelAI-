import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { ComplaintData } from '../../utils/analyticsData';

interface ComplaintChartProps {
  data: ComplaintData[];
}

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe', '#43e97b'];

export const ComplaintChart: React.FC<ComplaintChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Complaints by Category</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, count }) => `${category}: ${count}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} complaints`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
