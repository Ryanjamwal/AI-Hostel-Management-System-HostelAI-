import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ProfileCard } from '../components/ProfileCard';
import '../styles/AdminComponents.css';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>👤 User Profile & Settings</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>Account permissions, active role attributes, and security credentials</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div>
          <ProfileCard />
        </div>

        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Role Permissions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #edf2f7' }}>
              <span>Assigned Role</span>
              <strong style={{ color: '#667eea' }}>{user?.role}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #edf2f7' }}>
              <span>Authentication Token</span>
              <span style={{ color: '#38a169', fontWeight: 600 }}>Active (JWT)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #edf2f7' }}>
              <span>Email</span>
              <span style={{ color: '#4a5568' }}>{user?.email}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>User ID</span>
              <span style={{ color: '#718096' }}>#{user?.userId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
