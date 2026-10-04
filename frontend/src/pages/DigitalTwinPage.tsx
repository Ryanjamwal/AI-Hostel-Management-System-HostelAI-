import React from 'react';
import { DigitalTwin3D } from '../components/DigitalTwin3D';
import '../styles/AdminComponents.css';

export const DigitalTwinPage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🏢 Real-Time 3D Digital Twin</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Live operational view monitoring occupancy, ambient temperatures, power draw, water pressure, and emergency indicators
        </p>
      </div>

      <DigitalTwin3D />
    </div>
  );
};

export default DigitalTwinPage;
