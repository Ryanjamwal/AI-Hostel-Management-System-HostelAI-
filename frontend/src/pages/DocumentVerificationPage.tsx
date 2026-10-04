import React, { useState } from 'react';
import '../styles/AdminComponents.css';

interface DocScanResult {
  fileName: string;
  documentType: string;
  extractedFields: Record<string, string>;
  validityScore: number;
  status: 'Verified' | 'Flagged' | 'Incomplete';
}

export const DocumentVerificationPage: React.FC = () => {
  const [scans, setScans] = useState<DocScanResult[]>([
    {
      fileName: 'student_id_card_STU001.jpg',
      documentType: 'University Identification Card',
      extractedFields: { Name: 'Aarav Sharma', RollNo: 'CS-2024-001', Validity: '2028' },
      validityScore: 98,
      status: 'Verified',
    },
    {
      fileName: 'medical_fitness_cert.pdf',
      documentType: 'Medical Fitness Certificate',
      extractedFields: { DoctorReg: 'MCI-88912', IssueDate: '2026-07-12', BloodGroup: 'O+' },
      validityScore: 92,
      status: 'Verified',
    },
  ]);

  const handleUploadSim = () => {
    alert('Simulating AI OCR document scan...');
    setScans([
      ...scans,
      {
        fileName: 'passport_scan_new.pdf',
        documentType: 'Identity Passport Scan',
        extractedFields: { Name: 'Sneha Patel', PassportNo: 'Z984120', Expiry: '2031' },
        validityScore: 96,
        status: 'Verified',
      },
    ]);
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>📄 AI Document Verification & OCR</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>
            Automated OCR data extraction, validity verification, and consistency checking for admission documents
          </p>
        </div>
        <button
          onClick={handleUploadSim}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#667eea', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
        >
          📤 Upload & Verify Document
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {scans.map((doc, idx) => (
          <div key={idx} style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '1.05rem', color: '#2d3748' }}>{doc.documentType}</span>
              <span
                style={{
                  padding: '0.2rem 0.6rem',
                  borderRadius: '1rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backgroundColor: doc.status === 'Verified' ? '#c6f6d5' : '#fed7d7',
                  color: doc.status === 'Verified' ? '#22543d' : '#9b2c2c',
                }}
              >
                {doc.status} ({doc.validityScore}%)
              </span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
              File: <code>{doc.fileName}</code>
            </div>

            <div style={{ backgroundColor: '#f7fafc', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
              <div style={{ fontWeight: 700, color: '#4a5568', marginBottom: '0.4rem' }}>Extracted OCR Metadata:</div>
              {Object.entries(doc.extractedFields).map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', color: '#2d3748', borderBottom: '1px solid #edf2f7', padding: '0.2rem 0' }}>
                  <span style={{ color: '#718096' }}>{k}</span>
                  <span>{v}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentVerificationPage;
