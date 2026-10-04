import React, { useState } from 'react';
import '../styles/AdminComponents.css';

export const SmartEnergyWaterPage: React.FC = () => {
  const [autoCutoffEnabled, setAutoCutoffEnabled] = useState(true);

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>⚡ Smart Energy & Water Management</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Automated power consumption optimization, leak detection, water tank level forecasting, and bill estimation
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Power Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#2b6cb0' }}>⚡ Electricity Analytics</h3>
            <span style={{ backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
              Live Load: 42.8 kW
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>Est. Monthly Bill: <strong style={{ color: '#2b6cb0' }}>₹1,24,500</strong> (↓ 8% vs last month)</div>
            <div>High Consumption Anomaly: <strong style={{ color: '#e53e3e' }}>Room 104 (2.8 kW - Heater detected)</strong></div>
          </div>

          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #edf2f7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: '#718096' }}>Empty Room Auto-Cutoff</span>
            <input
              type="checkbox"
              checked={autoCutoffEnabled}
              onChange={e => setAutoCutoffEnabled(e.target.checked)}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Water Card */}
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#319795' }}>💧 Water Supply & Tanks</h3>
            <span style={{ backgroundColor: '#e6fffa', color: '#319795', padding: '0.2rem 0.6rem', borderRadius: '1rem', fontSize: '0.75rem', fontWeight: 700 }}>
              Overhead Level: 84%
            </span>
          </div>

          <div style={{ fontSize: '0.9rem', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            <div>Daily Demand: <strong>14,200 Liters / day</strong></div>
            <div>Leak Detection AI: <span style={{ color: '#38a169', fontWeight: 600 }}>No active leaks detected</span></div>
            <div>Holiday Forecast: <span style={{ color: '#718096' }}>Water demand expected to drop 45% on upcoming weekend</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartEnergyWaterPage;
