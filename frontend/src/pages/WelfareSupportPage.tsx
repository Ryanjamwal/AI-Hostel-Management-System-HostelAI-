import React from 'react';
import '../styles/AdminComponents.css';

export const WelfareSupportPage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>❤️ Mental Wellbeing & Student Welfare</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Non-clinical sentiment detection in support tickets, automated encouragement prompts, and welfare escalation triage
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#2b6cb0' }}>🤗 Campus Support Counseling</h3>
          <p style={{ color: '#4a5568', fontSize: '0.9rem', lineHeight: 1.5 }}>
            Need someone to talk to? The University Health & Student Care Helpline is available 24/7. Confidential and compassionate guidance.
          </p>
          <button
            onClick={() => alert('Connected to Campus Welfare Counselor Call Line: 1800-HOSTEL-HELP')}
            style={{ marginTop: '1rem', padding: '0.6rem 1.25rem', backgroundColor: '#319795', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
          >
            📞 Request Confidential Counselor Callback
          </button>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', color: '#805ad5' }}>🛡️ Welfare Escalation Monitor</h3>
          <div style={{ fontSize: '0.85rem', color: '#4a5568', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div>Active Distress Flags: <strong style={{ color: '#38a169' }}>0 Active Alerts</strong></div>
            <div>Automated Wellness Prompts Dispatched: <strong>14 this week</strong></div>
            <div>Privacy Protocol: <strong>Strict Anonymization Active</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfareSupportPage;
