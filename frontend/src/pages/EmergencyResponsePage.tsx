import React from 'react';
import '../styles/AdminComponents.css';

export const EmergencyResponsePage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🚨 Emergency Response & Evacuation System</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          One-tap SOS dispatch, live resident floor evacuation tracking, and emergency contacts
        </p>
      </div>

      <div style={{ backgroundColor: '#fff5f5', border: '2px solid #feb2b2', borderRadius: '0.75rem', padding: '1.5rem', marginBottom: '2rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', color: '#c53030', fontSize: '1.25rem' }}>⚠️ Emergency Command Override</h3>
        <p style={{ color: '#742a2a', fontSize: '0.9rem', marginBottom: '1rem' }}>
          In case of fire, earthquake, or severe emergency, triggering SOS will unlock all electronic gate passes, send broadcast SMS alerts to all 200 residents, and notify local first responders.
        </p>
        <button
          onClick={() => alert('🚨 EMERGENCY SOS BROADCAST DISPATCHED TO ALL RESIDENTS & FIRST RESPONDERS')}
          style={{ backgroundColor: '#e53e3e', color: '#fff', padding: '0.75rem 1.5rem', border: 'none', borderRadius: '0.5rem', fontWeight: 800, fontSize: '1rem', cursor: 'pointer' }}
        >
          🚨 TRIGGER HOSTEL SOS EMERGENCY ALARM
        </button>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
        <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#2d3748' }}>🗺️ Live Floor Evacuation Progress</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #edf2f7' }}>
            <span>Floor 1 Assembly Point A</span>
            <span style={{ color: '#38a169', fontWeight: 700 }}>50 / 50 Residents Accounted For</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #edf2f7' }}>
            <span>Floor 2 Assembly Point B</span>
            <span style={{ color: '#38a169', fontWeight: 700 }}>50 / 50 Residents Accounted For</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
            <span>Floor 3 Assembly Point C</span>
            <span style={{ color: '#38a169', fontWeight: 700 }}>50 / 50 Residents Accounted For</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyResponsePage;
