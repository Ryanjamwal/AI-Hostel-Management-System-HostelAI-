import React from 'react';
import { explainRoommateMatchSHAP } from '../services/xaiEngine';
import '../styles/AdminComponents.css';

export const ResearchLabPage: React.FC = () => {
  const sampleXai = explainRoommateMatchSHAP(
    { sleepHour: 24, wakeHour: 8, studyNoiseTolerance: 1, cleanlinessImportance: 5, socialIndex: 2 },
    { sleepHour: 24, wakeHour: 8, studyNoiseTolerance: 1, cleanlinessImportance: 5, socialIndex: 3 }
  );

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🔬 AI Research & Innovation Extensions Lab</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Explore advanced academic & portfolio extensions: Federated Learning, Explainable AI (XAI), Edge AI, and Privacy-Preserving Analytics
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#667eea', fontSize: '1.15rem' }}>🌐 1. Federated Learning Engine</h3>
          <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Allows multiple partner university hostels to collectively train global predictive models without sharing raw student PII data.
          </p>
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#f7fafc', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#718096' }}>
            Model Aggregation Status: <strong style={{ color: '#38a169' }}>Round 14 Complete (FedAvg)</strong>
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#dd6b20', fontSize: '1.15rem' }}>🔍 2. Explainable AI (XAI) Attribution</h3>
          <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
            SHAP / LIME feature attribution showing transparent reasons behind AI roommate matches and maintenance failure predictions.
          </p>
          <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.8rem' }}>
            <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.4rem' }}>Live SHAP Waterfall: Roommate Compatibility (96%)</div>
            {sampleXai.attributions.map((attr: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e293b', padding: '0.2rem 0' }}>
                <span style={{ color: '#cbd5e1' }}>{attr.featureName}</span>
                <strong style={{ color: attr.shapValue > 0 ? '#4ade80' : '#f87171' }}>
                  {attr.shapValue > 0 ? `+${attr.shapValue}%` : `${attr.shapValue}%`}
                </strong>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', color: '#319795', fontSize: '1.15rem' }}>⚡ 3. Edge AI Camera & Sensor Processing</h3>
          <p style={{ color: '#4a5568', fontSize: '0.85rem', lineHeight: 1.5 }}>
            Runs computer vision models directly on local NPU edge devices (e.g. Raspberry Pi / Jetson) to prevent video streaming over networks and guarantee privacy.
          </p>
          <div style={{ marginTop: '0.75rem', padding: '0.5rem', backgroundColor: '#f7fafc', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#718096' }}>
            Edge NPU Latency: <strong style={{ color: '#319795' }}>12ms (Zero Cloud Transmission)</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchLabPage;
