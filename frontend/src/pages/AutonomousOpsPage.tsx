import React, { useState } from 'react';
import { runCopilotAgentPipeline, type AgentExecutionResult } from '../services/copilotAgent';
import { explainMaintenanceRiskSHAP } from '../services/xaiEngine';
import { aiGovernance } from '../services/aiGovernanceService';
import '../styles/AdminComponents.css';

export const AutonomousOpsPage: React.FC = () => {
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [result, setResult] = useState<AgentExecutionResult | null>(null);
  const [isApproved, setIsApproved] = useState(false);

  const handleRunKillerPipeline = async () => {
    setPipelineRunning(true);
    setIsApproved(false);
    setResult(null);

    // Simulate real-time execution steps
    setTimeout(async () => {
      const res = await runCopilotAgentPipeline('Identify abnormal electricity/vibration telemetry and schedule maintenance');
      setResult(res);
      setPipelineRunning(false);
    }, 1500);
  };

  const handleApproveWarden = () => {
    if (result?.inferenceId) {
      aiGovernance.approveInference(result.inferenceId, 'Head Warden (warden@hostelai.com)');
    }
    setIsApproved(true);
    alert('Warden Approval Verified! Maintenance Work Order Dispatched to HVAC Technician.');
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>⚡ Autonomous Operations Center — Killer End-to-End Pipeline</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Seamless closed-loop demonstration: Sensor (MQTT) → Z-Score Anomaly → EventBus Alert → ML Failure Risk → SHAP XAI → Digital Twin → Copilot Agent → Warden HITL Approval → Work Order Dispatch → Verification
        </p>
      </div>

      <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #1e293b', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: 0, color: '#38bdf8', fontSize: '1.3rem' }}>🎯 Trigger Autonomous End-to-End Operations Pipeline</h3>
            <p style={{ margin: '0.2rem 0 0 0', color: '#94a3b8', fontSize: '0.85rem' }}>
              Executes the complete cross-subsystem pipeline with Human-in-the-Loop Warden safety gate
            </p>
          </div>

          <button
            onClick={handleRunKillerPipeline}
            disabled={pipelineRunning}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: pipelineRunning ? '#475569' : '#0284c7',
              color: '#fff',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: pipelineRunning ? 'default' : 'pointer',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)',
            }}
          >
            {pipelineRunning ? '⏳ Executing Closed-Loop Pipeline...' : '🚀 Execute Killer Pipeline'}
          </button>
        </div>

        {result && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 700, color: '#38bdf8', marginBottom: '0.5rem' }}>📍 Pipeline Execution Steps:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                {result.steps.map((st, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#0f172a', padding: '0.5rem 0.75rem', borderRadius: '0.375rem' }}>
                    <span style={{ color: st.status === 'Completed' ? '#4ade80' : '#fbbf24', fontWeight: 700 }}>
                      {st.status === 'Completed' ? '✓' : '⏳'}
                    </span>
                    <span style={{ fontWeight: 600, color: '#f1f5f9', minWidth: '180px' }}>{st.stepName}:</span>
                    <span style={{ color: '#94a3b8' }}>{st.detail}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* SHAP Attribution Card inside Pipeline */}
            <div style={{ backgroundColor: '#1e293b', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #334155' }}>
              <div style={{ fontWeight: 700, color: '#fbbf24', marginBottom: '0.5rem' }}>🔍 SHAP Feature Attribution (Failure Risk: {result.riskScore}%):</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {explainMaintenanceRiskSHAP(44, 8.4, 11.2, 210).attributions.map((attr, idx) => (
                  <div key={idx} style={{ backgroundColor: '#0f172a', padding: '0.4rem 0.6rem', borderRadius: '0.25rem', fontSize: '0.8rem' }}>
                    <span style={{ color: '#cbd5e1' }}>{attr.featureName}: </span>
                    <strong style={{ color: attr.shapValue > 0 ? '#f87171' : '#4ade80' }}>
                      {attr.shapValue > 0 ? `+${attr.shapValue}%` : `${attr.shapValue}%`}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            {/* Human-in-the-Loop Warden Approval Gate */}
            <div style={{ backgroundColor: isApproved ? '#064e3b' : '#7c2d12', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #9a3412', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: '0 0 0.2rem 0', color: '#fff', fontSize: '1rem' }}>
                  {isApproved ? '✓ Human Warden Approval Confirmed' : '⚠️ Action Pending Warden Safety Gate'}
                </h4>
                <p style={{ margin: 0, color: '#fca5a5', fontSize: '0.8rem' }}>
                  Recommendation: {result.recommendation}
                </p>
              </div>

              {!isApproved ? (
                <button
                  onClick={handleApproveWarden}
                  style={{ backgroundColor: '#f97316', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', borderRadius: '0.375rem', fontWeight: 700, cursor: 'pointer' }}
                >
                  🛡️ Warden Approve & Dispatch
                </button>
              ) : (
                <span style={{ color: '#34d399', fontWeight: 700, fontSize: '0.9rem' }}>
                  ✓ Work Order Dispatched to Maintenance Team
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutonomousOpsPage;
