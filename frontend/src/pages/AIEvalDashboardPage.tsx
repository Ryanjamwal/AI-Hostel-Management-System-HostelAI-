import React, { useState } from 'react';
import { evaluateComplaintClassifier, evaluatePredictiveMaintenanceModel, evaluateOccupancyForecaster, type ModelMetricResult } from '../services/aiEvalService';
import { aiGovernance, type AIInferenceAuditRecord } from '../services/aiGovernanceService';
import '../styles/AdminComponents.css';

export const AIEvalDashboardPage: React.FC = () => {
  const [metrics] = useState<ModelMetricResult[]>([
    evaluateComplaintClassifier(),
    evaluatePredictiveMaintenanceModel(),
    evaluateOccupancyForecaster(),
  ]);

  const [auditLogs, setAuditLogs] = useState<AIInferenceAuditRecord[]>(aiGovernance.getAuditLogs());

  const handleApprove = (id: string) => {
    aiGovernance.approveInference(id, 'Head Warden (warden@hostelai.com)');
    setAuditLogs(aiGovernance.getAuditLogs());
    alert(`AI Inference ${id} officially approved by Warden! Workflow executed.`);
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>📊 AI Evaluation, Accuracy & Governance Dashboard</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Defensible model benchmarks: F1-Score, Precision, Recall, MAE, RMSE, MAPE + Human-in-the-Loop Audit Logs
        </p>
      </div>

      {/* Model Benchmark Metric Cards */}
      <h3 style={{ fontSize: '1.2rem', color: '#2d3748', marginBottom: '1rem' }}>🏆 AI Model Evaluation Benchmarks</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {metrics.map((m, idx) => (
          <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#3182ce', backgroundColor: '#ebf8ff', padding: '0.2rem 0.5rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '0.5rem' }}>
              {m.category}
            </div>
            <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '1.1rem', color: '#2d3748' }}>{m.modelName}</h4>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
              <div style={{ backgroundColor: '#f7fafc', padding: '0.5rem', borderRadius: '0.375rem' }}>
                <span style={{ color: '#718096' }}>F1-Score / Accuracy:</span>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38a169' }}>{m.f1Score}%</div>
              </div>

              <div style={{ backgroundColor: '#f7fafc', padding: '0.5rem', borderRadius: '0.375rem' }}>
                <span style={{ color: '#718096' }}>Precision / Recall:</span>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#2d3748' }}>{m.precision}% / {m.recall}%</div>
              </div>
            </div>

            {m.mae !== undefined && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#4a5568', backgroundColor: '#fffaf0', padding: '0.5rem', borderRadius: '0.375rem', border: '1px solid #feebc8' }}>
                📈 <strong>Time-Series Errors:</strong> MAE: <strong>{m.mae}</strong> | RMSE: <strong>{m.rmse}</strong> | MAPE: <strong>{m.mape}%</strong>
              </div>
            )}

            <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.75rem' }}>
              Evaluated on {m.evaluationDatasetSize} ground-truth test samples
            </div>
          </div>
        ))}
      </div>

      {/* AI Governance Audit Logs */}
      <h3 style={{ fontSize: '1.2rem', color: '#2d3748', marginBottom: '1rem' }}>🛡️ AI Governance & Inference Audit Logs (HITL)</h3>
      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {auditLogs.map(log => (
            <div key={log.inferenceId} style={{ padding: '1rem', borderRadius: '0.5rem', border: '1px solid #edf2f7', backgroundColor: '#f7fafc', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#3182ce' }}>{log.inferenceId}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#2d3748' }}>{log.modelName}</span>
                  <span style={{ fontSize: '0.75rem', color: '#718096' }}>({log.modelVersion})</span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#4a5568' }}>
                  Prediction: <strong>{log.prediction}</strong> ({log.confidence}% confidence)
                </div>
                <div style={{ fontSize: '0.75rem', color: '#a0aec0', marginTop: '0.2rem' }}>
                  {new Date(log.timestamp).toLocaleString()} • Tenant: {log.tenantId}
                </div>
              </div>

              <div>
                {log.humanApproved ? (
                  <span style={{ backgroundColor: '#c6f6d5', color: '#22543d', padding: '0.4rem 0.8rem', borderRadius: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>
                    ✓ Approved by {log.approvedBy}
                  </span>
                ) : (
                  <button
                    onClick={() => handleApprove(log.inferenceId)}
                    style={{ backgroundColor: '#dd6b20', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '0.375rem', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    Warden Review & Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AIEvalDashboardPage;
