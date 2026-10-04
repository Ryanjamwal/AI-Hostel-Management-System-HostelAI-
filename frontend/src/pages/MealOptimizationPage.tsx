import React from 'react';
import '../styles/AdminComponents.css';

export const MealOptimizationPage: React.FC = () => {
  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🍽️ AI Meal & Mess Optimization</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Predictive meal demand forecasting, food wastage minimization, dynamic inventory procurement, and menu ratings
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>Expected Dinner Attendance</span>
          <h2 style={{ fontSize: '2rem', color: '#2b6cb0', margin: '0.4rem 0 0 0', fontWeight: 800 }}>182 / 200 Students</h2>
          <p style={{ fontSize: '0.8rem', color: '#38a169', margin: '0.4rem 0 0 0' }}>↓ 18 students on Leave / Outpass</p>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>Food Wastage Prediction</span>
          <h2 style={{ fontSize: '2rem', color: '#38a169', margin: '0.4rem 0 0 0', fontWeight: 800 }}>4.2 kg (Low)</h2>
          <p style={{ fontSize: '0.8rem', color: '#718096', margin: '0.4rem 0 0 0' }}>Saved ~₹12,400 this week in procurement</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', color: '#2d3748' }}>💡 AI Menu & Purchasing Recommendations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div style={{ padding: '0.75rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem', borderLeft: '4px solid #4299e1' }}>
            🛒 <strong>Raw Material Order Suggestion:</strong> Reduce rice purchasing by 15kg for Friday dinner due to weekend home departures.
          </div>
          <div style={{ padding: '0.75rem', backgroundColor: '#f7fafc', borderRadius: '0.5rem', borderLeft: '4px solid #48bb78' }}>
            🌟 <strong>Popular Dish Rating:</strong> Paneer Butter Masala received 94% positive student feedback. Recommended for Wednesday menu.
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealOptimizationPage;
