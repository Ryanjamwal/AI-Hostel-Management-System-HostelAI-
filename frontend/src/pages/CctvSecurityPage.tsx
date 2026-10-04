import React from 'react';
import '../styles/AdminComponents.css';

export const CctvSecurityPage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>📹 AI CCTV Analytics & Risk Scoring</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Computer vision event detection (overcrowding, smoke/fire indicators, fall detection, unattended objects) & Security Risk Index
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* CCTV Feed 1 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ position: 'relative', backgroundColor: '#1a202c', height: '180px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>📹 CAM-01: Main Gate</span>
            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#38a169', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 700 }}>LIVE</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
            AI Status: <strong style={{ color: '#38a169' }}>Clear - Normal Flow</strong>
          </div>
        </div>

        {/* CCTV Feed 2 */}
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1rem', border: '1px solid #e2e8f0' }}>
          <div style={{ position: 'relative', backgroundColor: '#1a202c', height: '180px', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2rem' }}>📹 CAM-04: Common Mess Lounge</span>
            <span style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: '#dd6b20', color: '#fff', fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontWeight: 700 }}>AI ALERT</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
            AI Status: <strong style={{ color: '#dd6b20' }}>⚠️ Overcrowding Warning (34 people in 20sqm)</strong>
          </div>
        </div>
      </div>

      {/* Security Risk Score Index */}
      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#2d3748' }}>🛡️ Composite Security Risk Index</h3>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#38a169' }}>94 / 100</div>
            <span style={{ fontSize: '0.85rem', color: '#718096' }}>Low Risk Level</span>
          </div>
          <div style={{ flex: 1, fontSize: '0.85rem', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div>• Gate Entry Compliance: <strong>99.2%</strong></div>
            <div>• Unverified Visitors: <strong>0 Active</strong></div>
            <div>• Unusual Movement Score: <strong>Normal</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CctvSecurityPage;
