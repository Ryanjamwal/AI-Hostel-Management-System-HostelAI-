import React, { useState } from 'react';
import { calculateFailureRisk } from '../services/mlEngine';
import { explainMaintenanceRiskSHAP } from '../services/xaiEngine';
import '../styles/AdminComponents.css';

interface SensorTelemetry {
  id: string;
  name: string;
  location: string;
  tempC: number;
  vibrationRms: number;
  currentAmp: number;
  daysSinceService: number;
  status: 'Normal' | 'Warning' | 'Critical';
}

const mockSensors: SensorTelemetry[] = [
  { id: 'SENS-AC-104', name: 'AC Compressor Sensor', location: 'Room 104', tempC: 44, vibrationRms: 8.4, currentAmp: 11.2, daysSinceService: 210, status: 'Critical' },
  { id: 'SENS-PUMP-MAIN', name: 'Main Water Pump 2', location: 'Basement Pump House', tempC: 38, vibrationRms: 5.2, currentAmp: 8.5, daysSinceService: 140, status: 'Warning' },
  { id: 'SENS-ELEC-PANEL-B', name: 'Main Electrical Panel B', location: 'Block B Ground Floor', tempC: 32, vibrationRms: 1.1, currentAmp: 6.0, daysSinceService: 45, status: 'Normal' },
  { id: 'SENS-TANK-ROOF', name: 'Roof Water Overhead Tank', location: 'Roof Level', tempC: 28, vibrationRms: 0.5, currentAmp: 2.0, daysSinceService: 20, status: 'Normal' },
];

export const PredictiveMaintenancePage: React.FC = () => {
  const [sensors, setSensors] = useState<SensorTelemetry[]>(mockSensors);
  const [selectedXaiSensor, setSelectedXaiSensor] = useState<SensorTelemetry | null>(mockSensors[0]);

  const handleWorkOrder = (id: string) => {
    alert(`Work order generated for sensor ${id}. Technician dispatched.`);
    setSensors(sensors.map(s => (s.id === id ? { ...s, status: 'Normal', vibrationRms: 1.2, tempC: 29, daysSinceService: 0 } : s)));
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>⚙️ IoT Predictive Maintenance & SHAP XAI</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Real mathematical risk equation f(temp, vibration, current, age) combined with SHAP feature attribution
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '1.5rem', alignItems: 'start' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
          {sensors.map(s => {
            const risk = calculateFailureRisk(s.tempC, s.vibrationRms, s.currentAmp, s.daysSinceService);
            return (
              <div
                key={s.id}
                onClick={() => setSelectedXaiSensor(s)}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  border: selectedXaiSensor?.id === s.id ? '2px solid #3182ce' : '1px solid #e2e8f0',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2d3748' }}>{s.name}</span>
                  <span
                    style={{
                      padding: '0.2rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: risk > 75 ? '#fed7d7' : risk > 50 ? '#feebc8' : '#c6f6d5',
                      color: risk > 75 ? '#9b2c2c' : risk > 50 ? '#744210' : '#22543d',
                    }}
                  >
                    Risk: {risk}%
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <div>Location: {s.location}</div>
                  <div>Temp: {s.tempC}°C • Vib: {s.vibrationRms} RMS</div>
                  <div>Current: {s.currentAmp} A • Age: {s.daysSinceService} days</div>
                </div>

                <button
                  onClick={e => {
                    e.stopPropagation();
                    handleWorkOrder(s.id);
                  }}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    backgroundColor: risk > 75 ? '#e53e3e' : '#3182ce',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '0.375rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Dispatch Predictive Work Order
                </button>
              </div>
            );
          })}
        </div>

        {/* Explainable AI SHAP Waterfall Card */}
        {selectedXaiSensor && (
          <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #1e293b' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#38bdf8', fontWeight: 700 }}>
              🔍 SHAP Explainable AI Breakdown
            </h3>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '0 0 1rem 0' }}>
              Feature attribution explaining why <strong>{selectedXaiSensor.name}</strong> has a failure risk of {calculateFailureRisk(selectedXaiSensor.tempC, selectedXaiSensor.vibrationRms, selectedXaiSensor.currentAmp, selectedXaiSensor.daysSinceService)}%.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
              {explainMaintenanceRiskSHAP(selectedXaiSensor.tempC, selectedXaiSensor.vibrationRms, selectedXaiSensor.currentAmp, selectedXaiSensor.daysSinceService).attributions.map((attr: any, idx: number) => (
                <div key={idx} style={{ backgroundColor: '#1e293b', padding: '0.75rem', borderRadius: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: '#e2e8f0', fontWeight: 600 }}>{attr.featureName}</span>
                    <strong style={{ color: attr.shapValue > 0 ? '#f87171' : '#4ade80' }}>
                      {attr.shapValue > 0 ? `+${attr.shapValue}%` : `${attr.shapValue}%`}
                    </strong>
                  </div>
                  <div style={{ height: '4px', backgroundColor: '#334155', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${attr.percentageImpact}%`, backgroundColor: attr.shapValue > 0 ? '#ef4444' : '#22c55e' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictiveMaintenancePage;
