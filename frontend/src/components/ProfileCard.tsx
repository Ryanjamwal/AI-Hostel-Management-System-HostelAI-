import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminComponents.css';

export const ProfileCard: React.FC = () => {
  const { user } = useAuth();

  const getRoleIcon = (role: string): string => {
    const icons: Record<string, string> = {
      Admin: '👨‍💼',
      Warden: '👮‍♂️',
      Accountant: '💼',
      SecurityStaff: '👮',
      Student: '👨‍🎓',
    };
    return icons[role] || '👤';
  };

  const getRoleColor = (role: string): string => {
    const colors: Record<string, string> = {
      Admin: '#667eea',
      Warden: '#764ba2',
      Accountant: '#43e97b',
      SecurityStaff: '#feca57',
      Student: '#fa709a',
    };
    return colors[role] || '#667eea';
  };

  return (
    <div className="profile-card">
      <div className="profile-header" style={{ borderTopColor: getRoleColor(user?.role || '') }}>
        <div className="profile-avatar">
          <span className="avatar-icon">{getRoleIcon(user?.role || '')}</span>
        </div>
        <div className="profile-info">
          <h3 className="profile-name">{user?.fullName || 'User'}</h3>
          <p className="profile-email">{user?.email}</p>
          <span className="profile-role" style={{ background: getRoleColor(user?.role || '') }}>
            {user?.role}
          </span>
        </div>
      </div>
      <div className="profile-stats">
        <div className="stat">
          <span className="stat-label">Status</span>
          <span className="stat-value online">● Online</span>
        </div>
        <div className="stat">
          <span className="stat-label">Member Since</span>
          <span className="stat-value">Jan 2024</span>
        </div>
      </div>
    </div>
  );
};
