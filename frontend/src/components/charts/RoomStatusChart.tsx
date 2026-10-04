import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts';
import type { RoomStatusData } from '../../utils/analyticsData';

interface RoomStatusChartProps {
  data: RoomStatusData[];
}

const COLORS = ['#43e97b', '#fa709a', '#feca57'];

export const RoomStatusChart: React.FC<RoomStatusChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Room Status Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ status, count }) => `${status}: ${count}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} rooms`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
