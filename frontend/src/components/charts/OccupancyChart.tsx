import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { OccupancyData } from '../../utils/analyticsData';

interface OccupancyChartProps {
  data: OccupancyData[];
}

export const OccupancyChart: React.FC<OccupancyChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Room Occupancy Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="occupancy"
            stroke="#667eea"
            name="Occupied"
            strokeWidth={2}
            dot={{ fill: '#667eea' }}
          />
          <Line
            type="monotone"
            dataKey="capacity"
            stroke="#f093fb"
            name="Capacity"
            strokeWidth={2}
            dot={{ fill: '#f093fb' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
