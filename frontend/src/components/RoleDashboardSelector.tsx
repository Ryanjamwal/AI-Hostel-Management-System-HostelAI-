import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ProfileCard } from './ProfileCard';
import '../styles/RoleDashboards.css';

export const RoleDashboardSelector: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="role-dashboard">
      {/* Admin Dashboard */}
      {user?.role === 'Admin' && (
        <div className="admin-dashboard">
          <div className="dashboard-top">
            <div className="greeting">
              <h1>Welcome back, {user?.fullName || 'User'}</h1>
              <p>Here's what's happening with your hostel today</p>
            </div>
            <div className="quick-stats">
              <div className="stat-box">
                <span className="stat-icon">📊</span>
                <span className="stat-text">Occupancy 98.5%</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">💰</span>
                <span className="stat-text">Revenue ↑ 12%</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">⚠️</span>
                <span className="stat-text">36 Complaints</span>
              </div>
            </div>
          </div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Warden Dashboard */}
      {user?.role === 'Warden' && (
        <div className="warden-dashboard">
          <div className="dashboard-top">
            <div className="greeting">
              <h1>Warden Dashboard</h1>
              <p>Manage day-to-day operations and student matters</p>
            </div>
            <div className="quick-stats">
              <div className="stat-box">
                <span className="stat-icon">👥</span>
                <span className="stat-text">200 Students</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">🔔</span>
                <span className="stat-text">12 Notifications</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📝</span>
                <span className="stat-text">5 Tasks Due</span>
              </div>
            </div>
          </div>
          <AnalyticsDashboard />
        </div>
      )}

      {/* Accountant Dashboard */}
      {user?.role === 'Accountant' && (
        <div className="accountant-dashboard">
          <div className="dashboard-top">
            <div className="greeting">
              <h1>Financial Dashboard</h1>
              <p>Manage payments, expenses, and financial reports</p>
            </div>
            <div className="quick-stats">
              <div className="stat-box">
                <span className="stat-icon">💳</span>
                <span className="stat-text">₹45K Pending</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📊</span>
                <span className="stat-text">178.5K Revenue</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">📈</span>
                <span className="stat-text">↑ 12% This Month</span>
              </div>
            </div>
          </div>

          <div className="financial-section">
            <div className="section-header">
              <h2>Recent Transactions</h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="transaction-list">
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">Tuition Fee</span>
                  <span className="transaction-date">Today</span>
                </div>
                <span className="transaction-amount income">+₹15,000</span>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">Maintenance</span>
                  <span className="transaction-date">Yesterday</span>
                </div>
                <span className="transaction-amount expense">-₹5,000</span>
              </div>
              <div className="transaction-item">
                <div className="transaction-info">
                  <span className="transaction-type">Utility Bills</span>
                  <span className="transaction-date">2 days ago</span>
                </div>
                <span className="transaction-amount expense">-₹8,500</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Staff Dashboard */}
      {user?.role === 'SecurityStaff' && (
        <div className="security-dashboard">
          <div className="dashboard-top">
            <div className="greeting">
              <h1>Security Dashboard</h1>
              <p>Monitor access and security incidents</p>
            </div>
            <div className="quick-stats">
              <div className="stat-box">
                <span className="stat-icon">🔓</span>
                <span className="stat-text">12 Check-ins</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">👤</span>
                <span className="stat-text">3 Visitors</span>
              </div>
              <div className="stat-box">
                <span className="stat-icon">✓</span>
                <span className="stat-text">0 Incidents</span>
              </div>
            </div>
          </div>

          <div className="security-section">
            <div className="section-header">
              <h2>Recent Activity</h2>
            </div>
            <div className="activity-timeline">
              <div className="activity-item">
                <span className="activity-time">2:45 PM</span>
                <span className="activity-icon">✓</span>
                <span className="activity-text">STU001 - Check-in</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">2:30 PM</span>
                <span className="activity-icon">👤</span>
                <span className="activity-text">Visitor - John Doe (STU042)</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">2:15 PM</span>
                <span className="activity-icon">✓</span>
                <span className="activity-text">STU015 - Check-in</span>
              </div>
              <div className="activity-item">
                <span className="activity-time">1:50 PM</span>
                <span className="activity-icon">✓</span>
                <span className="activity-text">STU089 - Check-out</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Student Dashboard */}
      {user?.role === 'Student' && (
        <div className="student-dashboard">
          <div className="dashboard-top">
            <div className="greeting">
              <h1>My Dashboard</h1>
              <p>Your hostel information and details</p>
            </div>
          </div>

          <div className="student-section">
            <ProfileCard />
          </div>

          <div className="student-info-grid">
            <div className="info-card">
              <h3>Room Information</h3>
              <p className="info-detail">
                <span className="label">Room Number:</span>
                <span className="value">302</span>
              </p>
              <p className="info-detail">
                <span className="label">Floor:</span>
                <span className="value">3rd Floor</span>
              </p>
              <p className="info-detail">
                <span className="label">Check-in Date:</span>
                <span className="value">15 Jan 2024</span>
              </p>
            </div>

            <div className="info-card">
              <h3>Payment Status</h3>
              <p className="info-detail">
                <span className="label">Pending Amount:</span>
                <span className="value highlight">₹4,500</span>
              </p>
              <p className="info-detail">
                <span className="label">Due Date:</span>
                <span className="value">15 Sep 2024</span>
              </p>
              <button className="pay-btn">Pay Now</button>
            </div>

            <div className="info-card">
              <h3>Attendance</h3>
              <p className="info-detail">
                <span className="label">This Month:</span>
                <span className="value">28/30 (93%)</span>
              </p>
              <p className="info-detail">
                <span className="label">Absent:</span>
                <span className="value">2 days</span>
              </p>
            </div>

            <div className="info-card">
              <h3>Complaints</h3>
              <p className="info-detail">
                <span className="label">Open:</span>
                <span className="value">1</span>
              </p>
              <p className="info-detail">
                <span className="label">Resolved:</span>
                <span className="value">3</span>
              </p>
              <button className="complaint-btn">File Complaint</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
