import React, { useState } from 'react';
import { calculateCosineSimilarity, type StudentFeatureVector } from '../services/mlEngine';
import { explainRoommateMatchSHAP } from '../services/xaiEngine';
import '../styles/AdminComponents.css';

interface StudentProfile {
  code: string;
  name: string;
  vector: StudentFeatureVector;
}

const mockStudents: StudentProfile[] = [
  { code: 'STU001', name: 'Aarav Sharma', vector: { sleepHour: 24, wakeHour: 8, studyNoiseTolerance: 1, cleanlinessImportance: 5, socialIndex: 2 } },
  { code: 'STU003', name: 'Rohan Mehta', vector: { sleepHour: 24, wakeHour: 8, studyNoiseTolerance: 1, cleanlinessImportance: 5, socialIndex: 3 } },
  { code: 'STU007', name: 'Kabir Nair', vector: { sleepHour: 23, wakeHour: 7, studyNoiseTolerance: 2, cleanlinessImportance: 4, socialIndex: 4 } },
  { code: 'STU012', name: 'Vikram Singh', vector: { sleepHour: 22, wakeHour: 5, studyNoiseTolerance: 5, cleanlinessImportance: 2, socialIndex: 5 } },
];

export const RoomMatcherPage: React.FC = () => {
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile>(mockStudents[0]);

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🧩 Cosine Vector Roommate Matcher & XAI Explanation</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Mathematical Cosine Similarity vector matching combined with SHAP feature attribution waterfall charts
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
          <label style={{ fontWeight: 600 }}>Select Target Resident:</label>
          <select
            value={selectedStudent.code}
            onChange={e => setSelectedStudent(mockStudents.find(s => s.code === e.target.value) || mockStudents[0])}
            style={{ padding: '0.6rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
          >
            {mockStudents.map(s => (
              <option key={s.code} value={s.code}>{s.code} - {s.name}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {mockStudents
            .filter(s => s.code !== selectedStudent.code)
            .map(candidate => {
              const simScore = calculateCosineSimilarity(selectedStudent.vector, candidate.vector);
              const xai = explainRoommateMatchSHAP(selectedStudent.vector, candidate.vector);

              return (
                <div key={candidate.code} style={{ padding: '1.25rem', border: '1px solid #edf2f7', borderRadius: '0.75rem', backgroundColor: '#f7fafc' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#2d3748' }}>Match Candidate: {candidate.name} ({candidate.code})</h4>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.8rem', fontWeight: 800, color: simScore > 85 ? '#38a169' : simScore > 70 ? '#d69e2e' : '#e53e3e' }}>
                        {simScore}%
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#718096' }}>Cosine Vector Similarity</span>
                    </div>
                  </div>

                  {/* SHAP Feature Attribution Waterfall */}
                  <div style={{ backgroundColor: '#fff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4a5568', marginBottom: '0.5rem' }}>
                      SHAP Explainable AI Feature Attribution:
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                      {xai.attributions.map((attr: any, i: number) => (
                        <div key={i} style={{ fontSize: '0.8rem', backgroundColor: '#f7fafc', padding: '0.4rem 0.6rem', borderRadius: '0.25rem', border: '1px solid #edf2f7' }}>
                          <span style={{ color: '#718096' }}>{attr.featureName}: </span>
                          <strong style={{ color: attr.shapValue > 0 ? '#38a169' : '#e53e3e' }}>
                            {attr.shapValue > 0 ? `+${attr.shapValue}%` : `${attr.shapValue}%`}
                          </strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default RoomMatcherPage;
