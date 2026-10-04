import React, { useState, useEffect } from 'react';
import { OccupancyChart } from './charts/OccupancyChart';
import { RevenueChart } from './charts/RevenueChart';
import { ComplaintChart } from './charts/ComplaintChart';
import { AttendanceChart } from './charts/AttendanceChart';
import { RoomStatusChart } from './charts/RoomStatusChart';
import { StatCard } from './StatCard';
import { api, type DashboardMetrics } from '../services/api';
import {
  getOccupancyData,
  getRevenueData,
  getComplaintData,
  getAttendanceData,
  getRoomStatusData,
  getFinancialStats,
  getOperationalStats,
} from '../utils/analyticsData';
import '../styles/Analytics.css';

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');
  const [liveMetrics, setLiveMetrics] = useState<DashboardMetrics | null>(null);

  useEffect(() => {
    api
      .getDashboard()
      .then(data => setLiveMetrics(data))
      .catch(() => {
        // Soft fallback to mock metrics if backend API is unfulfilled
      });
  }, []);

  const financialStats = getFinancialStats();
  const operationalStats = getOperationalStats();

  return (
    <div className="analytics-dashboard">
      <div className="analytics-header">
        <div>
          <h2 className="analytics-title">{liveMetrics?.hostelName || 'Analytics Dashboard'}</h2>
          <p className="analytics-subtitle">Real-time hostel operations & AI monitoring insights</p>
        </div>
        <div className="time-range-selector">
          {(['week', 'month', 'year'] as const).map(range => (
            <button
              key={range}
              className={`range-button ${timeRange === range ? 'active' : ''}`}
              onClick={() => setTimeRange(range)}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Financial Stats Row */}
      <section className="stats-section">
        <h3 className="section-title">Financial Overview</h3>
        <div className="stats-grid">
          <StatCard
            icon="💰"
            title="Total Revenue"
            value={liveMetrics ? liveMetrics.monthlyRevenue : `₹${financialStats.totalRevenue.toLocaleString()}`}
            trend={{ value: 12, direction: 'up' }}
            backgroundColor="#f0f5ff"
          />
          <StatCard
            icon="💳"
            title="Pending Payments"
            value={`₹${financialStats.pendingPayments.toLocaleString()}`}
            trend={{ value: 5, direction: 'down' }}
            backgroundColor="#fff0f5"
          />
          <StatCard
            icon="📊"
            title="Total Expenses"
            value={`₹${financialStats.totalExpenses.toLocaleString()}`}
            trend={{ value: 3, direction: 'up' }}
            backgroundColor="#f5fff0"
          />
          <StatCard
            icon="📈"
            title="Net Profit"
            value={`₹${financialStats.netProfit.toLocaleString()}`}
            trend={{ value: 8, direction: 'up' }}
            backgroundColor="#fffaf0"
          />
        </div>
      </section>

      {/* Operational Stats Row */}
      <section className="stats-section">
        <h3 className="section-title">Operational Metrics</h3>
        <div className="stats-grid">
          <StatCard
            icon="👥"
            title="Total Students"
            value={operationalStats.totalStudents}
            trend={{ value: 2, direction: 'up' }}
            backgroundColor="#f0f5ff"
          />
          <StatCard
            icon="🏠"
            title="Total Rooms"
            value={liveMetrics ? liveMetrics.totalRooms : operationalStats.totalRooms}
            subtitle={liveMetrics ? `${liveMetrics.occupiedRooms} Occupied (${liveMetrics.occupancy}%)` : undefined}
            trend={{ value: 0, direction: 'up' }}
            backgroundColor="#fff0f5"
          />
          <StatCard
            icon="⚠️"
            title="Open Complaints"
            value={liveMetrics ? liveMetrics.complaints : operationalStats.totalComplaints}
            subtitle={`${operationalStats.resolvedComplaints} resolved`}
            backgroundColor="#f5fff0"
          />
          <StatCard
            icon="👔"
            title="Staff Members"
            value={operationalStats.staffCount}
            backgroundColor="#fffaf0"
          />
        </div>
      </section>

      {/* Charts Section */}
      <section className="charts-section">
        <div className="charts-row">
          <div className="chart-wrapper chart-large">
            <OccupancyChart data={getOccupancyData()} />
          </div>
          <div className="chart-wrapper chart-large">
            <RevenueChart data={getRevenueData()} />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-wrapper chart-medium">
            <ComplaintChart data={getComplaintData()} />
          </div>
          <div className="chart-wrapper chart-medium">
            <RoomStatusChart data={getRoomStatusData()} />
          </div>
        </div>

        <div className="charts-row">
          <div className="chart-wrapper chart-full">
            <AttendanceChart data={getAttendanceData()} />
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="info-section">
        <div className="info-card">
          <h4>💡 Quick Insights</h4>
          <ul>
            <li>Occupancy rate is at {liveMetrics ? liveMetrics.occupancy : 98.5}%, indicating strong demand</li>
            <li>Revenue exceeded target by 12% in the last month</li>
            <li>Maintenance complaints: {liveMetrics?.complaints ?? 160} active tickets</li>
            <li>Attendance rate averaged {liveMetrics?.attendanceRate ?? 95}% across all students</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>⚡ Action Items</h4>
          <ul>
            <li>Follow up on {liveMetrics?.complaints ?? 36} pending complaints</li>
            <li>Collect ₹45,000 in pending payments</li>
            <li>Schedule maintenance for rooms marked for service</li>
            <li>Review room allocation for upcoming term</li>
          </ul>
        </div>

        <div className="info-card">
          <h4>📅 Upcoming Events</h4>
          <ul>
            <li>Student induction ceremony - Next Friday</li>
            <li>Quarterly financial audit - Next Month</li>
            <li>Maintenance checkup - Week 3 of August</li>
            <li>Parent-student meet - End of August</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default AnalyticsDashboard;
