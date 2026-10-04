import React, { useState, useEffect } from 'react';
import { api, type PaymentApiItem, type CreatePaymentPayload } from '../services/api';
import '../styles/AdminComponents.css';

export const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<PaymentApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<CreatePaymentPayload>({
    studentCode: 'STU001',
    amount: 4500,
    type: 'Hostel Fee',
    status: 'Completed',
    paymentDate: new Date().toISOString(),
    referenceNumber: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
  });

  const loadPayments = async () => {
    try {
      setLoading(true);
      const data = await api.getPayments();
      setPayments(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createPayment(form);
      setShowModal(false);
      setForm({
        studentCode: 'STU001',
        amount: 4500,
        type: 'Hostel Fee',
        status: 'Completed',
        paymentDate: new Date().toISOString(),
        referenceNumber: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      });
      loadPayments();
    } catch (err: any) {
      alert(err.message || 'Failed to process payment');
    }
  };

  const totalCollected = payments.reduce((acc, p) => acc + (p.status === 'Completed' ? p.amount : 0), 0);

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>💳 Financial Transactions & Fees</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Track hostel dues, mess charges, and payment histories</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            color: '#1a202c',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(67, 233, 123, 0.3)',
          }}
        >
          + Record Payment
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>Total Collected</span>
          <h2 style={{ fontSize: '1.8rem', color: '#276749', margin: '0.5rem 0 0 0', fontWeight: 800 }}>₹{totalCollected.toLocaleString()}</h2>
        </div>
        <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
          <span style={{ fontSize: '0.85rem', color: '#718096', fontWeight: 600 }}>Transactions</span>
          <h2 style={{ fontSize: '1.8rem', color: '#2b6cb0', margin: '0.5rem 0 0 0', fontWeight: 800 }}>{payments.length} Records</h2>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading financial ledger...</div>
      ) : error ? (
        <div style={{ padding: '1rem', background: '#fed7d7', color: '#9b2c2c', borderRadius: '0.5rem' }}>{error}</div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Reference #</th>
                <th style={{ padding: '1rem' }}>Student</th>
                <th style={{ padding: '1rem' }}>Type</th>
                <th style={{ padding: '1rem' }}>Amount</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>
                    No payment records found.
                  </td>
                </tr>
              ) : (
                payments.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '1rem', fontFamily: 'monospace', fontWeight: 600, color: '#4a5568' }}>{p.referenceNumber}</td>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#2d3748' }}>{p.studentCode}</td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>{p.type}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#2b6cb0' }}>₹{p.amount.toLocaleString()}</td>
                    <td style={{ padding: '1rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.6rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: p.status === 'Completed' ? '#c6f6d5' : '#feebc8',
                          color: p.status === 'Completed' ? '#22543d' : '#744210',
                        }}
                      >
                        {p.status}
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
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Record Fee Payment</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="Student Code (e.g. STU001)"
                required
                value={form.studentCode}
                onChange={e => setForm({ ...form, studentCode: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <input
                type="number"
                placeholder="Amount (₹)"
                required
                min={1}
                value={form.amount}
                onChange={e => setForm({ ...form, amount: parseFloat(e.target.value) || 0 })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <select
                value={form.type}
                onChange={e => setForm({ ...form, type: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
              >
                <option value="Hostel Fee">Hostel Fee</option>
                <option value="Mess Charge">Mess Charge</option>
                <option value="Security Deposit">Security Deposit</option>
                <option value="Late Penalty">Late Penalty</option>
              </select>

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
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: '#43e97b', color: '#1a202c', fontWeight: 700 }}
                >
                  Confirm Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;
