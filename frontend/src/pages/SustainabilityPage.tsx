import React from 'react';
import '../styles/AdminComponents.css';

export const SustainabilityPage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🌱 Carbon Footprint & Sustainability Score</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Tracking hostel energy usage, water conservation, recycling rates, and eco-impact scores
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', textAlign: 'center' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>Campus Sustainability Index</span>
          <h2 style={{ fontSize: '2.5rem', color: '#38a169', margin: '0.5rem 0', fontWeight: 800 }}>88 / 100</h2>
          <span style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
            Rank A+ (Eco Hostel)
          </span>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>Monthly CO2 Offset</span>
          <h2 style={{ fontSize: '2rem', color: '#2b6cb0', margin: '0.4rem 0 0 0', fontWeight: 800 }}>12.4 Metric Tons</h2>
          <p style={{ fontSize: '0.8rem', color: '#38a169', margin: '0.4rem 0 0 0' }}>↓ 14% reduction due to solar water heaters</p>
        </div>
      </div>
    </div>
  );
};

export default SustainabilityPage;
