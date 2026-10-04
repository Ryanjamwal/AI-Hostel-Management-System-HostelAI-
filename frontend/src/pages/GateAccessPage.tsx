import React, { useState, useEffect } from 'react';
import { api, type VisitorApiItem, type CreateVisitorPayload } from '../services/api';
import '../styles/AdminComponents.css';

export const GateAccessPage: React.FC = () => {
  const [visitors, setVisitors] = useState<VisitorApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<CreateVisitorPayload>({
    studentCode: 'STU001',
    visitorName: '',
    visitorPhone: '',
    checkInTime: new Date().toISOString(),
    approved: true,
    purpose: 'Personal Visit',
  });

  const loadVisitors = async () => {
    try {
      setLoading(true);
      const data = await api.getVisitors();
      setVisitors(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load visitor logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVisitors();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createVisitor(form);
      setShowModal(false);
      setForm({
        studentCode: 'STU001',
        visitorName: '',
        visitorPhone: '',
        checkInTime: new Date().toISOString(),
        approved: true,
        purpose: 'Personal Visit',
      });
      loadVisitors();
    } catch (err: any) {
      alert(err.message || 'Failed to log visitor entry');
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🔓 Gate Access & Visitor Security</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Log campus entries, verify visitor authorizations, and track check-out times</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)',
            color: '#1a202c',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(254, 202, 87, 0.3)',
          }}
        >
          + Log Gate Entry
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading gate logs...</div>
      ) : error ? (
        <div style={{ padding: '1rem', background: '#fed7d7', color: '#9b2c2c', borderRadius: '0.5rem' }}>{error}</div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Visitor Name</th>
                <th style={{ padding: '1rem' }}>Visiting Student</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Purpose</th>
                <th style={{ padding: '1rem' }}>Check-in</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {visitors.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>
                    No gate entries logged today.
                  </td>
                </tr>
              ) : (
                visitors.map(v => (
                  <tr key={v.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#2d3748' }}>{v.visitorName}</td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>{v.studentCode}</td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>{v.visitorPhone}</td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>{v.purpose}</td>
                    <td style={{ padding: '1rem', color: '#718096', fontSize: '0.85rem' }}>
                      {new Date(v.checkInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: v.approved ? '#c6f6d5' : '#fed7d7',
                          color: v.approved ? '#22543d' : '#9b2c2c',
                        }}
                      >
                        {v.approved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
        >
          <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '450px' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Log Visitor Entry</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="Visitor Full Name"
                required
                value={form.visitorName}
                onChange={e => setForm({ ...form, visitorName: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <input
                type="text"
                placeholder="Visitor Phone Number"
                required
                value={form.visitorPhone}
                onChange={e => setForm({ ...form, visitorPhone: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <input
                type="text"
                placeholder="Student Code Being Visited"
                required
                value={form.studentCode}
                onChange={e => setForm({ ...form, studentCode: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <input
                type="text"
                placeholder="Purpose of Visit"
                required
                value={form.purpose}
                onChange={e => setForm({ ...form, purpose: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: '#feca57', color: '#1a202c', fontWeight: 700 }}
                >
                  Confirm Gate Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GateAccessPage;
