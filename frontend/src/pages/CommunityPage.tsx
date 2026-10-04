import React from 'react';
import '../styles/AdminComponents.css';

export const CommunityPage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🎉 Hostel Community & Clubs</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Inter-hostel sports tournaments, interest clubs, community polls, and activity recommendations
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#805ad5' }}>🏆 Inter-Hostel Premier League</h3>
          <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>Annual Cricket & Football championship starting Aug 22. Register teams now.</p>
          <button
            onClick={() => alert('Registration form opened.')}
            style={{ marginTop: '0.75rem', padding: '0.5rem 1rem', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
          >
            ⚽ Register Team
          </button>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#dd6b20' }}>🗳️ Live Student Poll</h3>
          <p style={{ fontSize: '0.85rem', color: '#4a5568' }}>"Which movie should we screen for Saturday Open Air Movie Night?"</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.75rem' }}>
            <button onClick={() => alert('Voted for Interstellar')} style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #cbd5e0', background: '#fff', cursor: 'pointer', textAlign: 'left' }}>🚀 Interstellar (64% votes)</button>
            <button onClick={() => alert('Voted for Inception')} style={{ padding: '0.4rem', borderRadius: '0.25rem', border: '1px solid #cbd5e0', background: '#fff', cursor: 'pointer', textAlign: 'left' }}>🌀 Inception (36% votes)</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
