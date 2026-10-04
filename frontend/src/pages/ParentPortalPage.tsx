import React, { useState } from 'react';
import '../styles/AdminComponents.css';

export const ParentPortalPage: React.FC = () => {
  const [studentCode, setStudentCode] = useState('STU001');

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>👨‍👩‍👧 Parent Portal & Transparency View</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Secure portal for parents to review student fee statuses, approved leave passes, official notices, and payment receipts
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Student Pass Key / Code"
            value={studentCode}
            onChange={e => setStudentCode(e.target.value)}
            style={{ padding: '0.6rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', minWidth: '220px' }}
          />
          <button
            onClick={() => alert(`Loading Parent View for ${studentCode}...`)}
            style={{ padding: '0.6rem 1.25rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
          >
            🔑 Access Student Records
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          <div style={{ backgroundColor: '#f7fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #edf2f7' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#2b6cb0' }}>💰 Fee & Receipt Summary</h4>
            <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
              <div>Current Term Dues: <strong>₹0.00 (All Fees Paid)</strong></div>
              <div>Last Payment: <strong>₹4,500 on Aug 05, 2026</strong></div>
              <button
                onClick={() => alert('Downloading official PDF receipt...')}
                style={{ marginTop: '0.75rem', padding: '0.4rem 0.8rem', backgroundColor: '#e2e8f0', border: 'none', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: 'pointer' }}
              >
                📥 Download Receipt PDF
              </button>
            </div>
          </div>

          <div style={{ backgroundColor: '#f7fafc', padding: '1.25rem', borderRadius: '0.5rem', border: '1px solid #edf2f7' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#276749' }}>✈️ Approved Outpass & Leaves</h4>
            <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
              <div>Latest Leave: <strong>Aug 15 - Aug 18 (Weekend Visit)</strong></div>
              <div>Status: <span style={{ color: '#22543d', fontWeight: 700 }}>Approved by Warden</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParentPortalPage;
