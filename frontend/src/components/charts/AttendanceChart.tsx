import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AttendanceData } from '../../utils/analyticsData';

interface AttendanceChartProps {
  data: AttendanceData[];
}

export const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
  return (
    <div className="chart-container">
      <h3 className="chart-title">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="present" fill="#43e97b" name="Present" />
          <Bar dataKey="absent" fill="#fa709a" name="Absent" />
          <Bar dataKey="late" fill="#feca57" name="Late" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
