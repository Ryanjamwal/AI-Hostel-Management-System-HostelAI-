import React, { useState, useEffect } from 'react';
import { api, type ComplaintApiItem, type CreateComplaintPayload } from '../services/api';
import { classifyComplaintText } from '../services/mlEngine';
import '../styles/AdminComponents.css';

export const ComplaintsPage: React.FC = () => {
  const [complaints, setComplaints] = useState<ComplaintApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState('All');

  const [form, setForm] = useState<CreateComplaintPayload>({
    studentCode: 'STU001',
    category: 'Plumbing',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: 'Maintenance Team',
  });

  const [aiPrediction, setAiPrediction] = useState<{ category: string; priority: string; confidence: number } | null>(null);

  const loadComplaints = async () => {
    try {
      setLoading(true);
      const data = await api.getComplaints();
      setComplaints(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComplaints();
  }, []);

  const handleDescriptionChange = (text: string) => {
    setForm({ ...form, description: text });
    if (text.length > 5) {
      const pred = classifyComplaintText(text);
      setAiPrediction(pred);
      setForm(f => ({ ...f, description: text, category: pred.category, priority: pred.priority, status: 'Open' }));
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createComplaint(form);
      setShowModal(false);
      alert('✅ Maintenance complaint filed successfully! Ticket created.');
      setForm({
        studentCode: 'STU001',
        category: 'Plumbing',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assignedTo: 'Maintenance Team',
      });
      setAiPrediction(null);
      await loadComplaints();
    } catch (err: any) {
      alert(err.message || 'Failed to create complaint');
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.updateComplaintStatus(id, newStatus);
      loadComplaints();
    } catch (err: any) {
      alert(err.message || 'Failed to update complaint status');
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return { bg: '#fed7d7', color: '#9b2c2c' };
      case 'medium':
        return { bg: '#feebc8', color: '#744210' };
      default:
        return { bg: '#e2e8f0', color: '#4a5568' };
    }
  };

  const filteredComplaints = complaints.filter(c =>
    statusFilter === 'All' ? true : c.status.toLowerCase() === statusFilter.toLowerCase()
  );

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>⚠️ Maintenance & Naive Bayes NLP Classifier</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Track tickets with real-time NLP category and priority auto-prediction</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
          }}
        >
          + File Complaint
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['All', 'Open', 'In Progress', 'Resolved'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: statusFilter === st ? 'none' : '1px solid #e2e8f0',
              backgroundColor: statusFilter === st ? '#4a5568' : '#fff',
              color: statusFilter === st ? '#fff' : '#4a5568',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading tickets...</div>
      ) : error ? (
        <div style={{ padding: '1rem', background: '#fed7d7', color: '#9b2c2c', borderRadius: '0.5rem' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {filteredComplaints.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#a0aec0', background: '#fff', borderRadius: '0.75rem' }}>
              No complaints found in this view.
            </div>
          ) : (
            filteredComplaints.map(c => {
              const pStyle = getPriorityStyle(c.priority);
              return (
                <div
                  key={c.id}
                  style={{
                    backgroundColor: '#fff',
                    borderRadius: '0.75rem',
                    padding: '1.25rem',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    flexWrap: 'wrap',
                  }}
                >
                  <div style={{ flex: 1, minWidth: '240px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1.1rem', color: '#2d3748' }}>{c.category}</span>
                      <span
                        style={{
                          padding: '0.2rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          backgroundColor: pStyle.bg,
                          color: pStyle.color,
                        }}
                      >
                        {c.priority} Priority
                      </span>
                    </div>
                    <p style={{ color: '#4a5568', margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}>{c.description}</p>
                    <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>
                      Reported by <strong style={{ color: '#718096' }}>{c.studentCode}</strong> • Assigned to: {c.assignedTo}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <select
                      value={c.status}
                      onChange={e => handleStatusChange(c.id, e.target.value)}
                      style={{
                        padding: '0.4rem 0.75rem',
                        borderRadius: '0.375rem',
                        border: '1px solid #cbd5e0',
                        fontWeight: 600,
                        backgroundColor: c.status === 'Resolved' ? '#c6f6d5' : c.status === 'In Progress' ? '#feebc8' : '#edf2f7',
                      }}
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
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
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Log Maintenance Ticket</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="Student Code (e.g. STU001)"
                required
                value={form.studentCode}
                onChange={e => setForm({ ...form, studentCode: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              <textarea
                placeholder="Describe the issue (NLP will auto-detect category & priority)..."
                required
                rows={3}
                value={form.description}
                onChange={e => handleDescriptionChange(e.target.value)}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />

              {aiPrediction && (
                <div style={{ backgroundColor: '#ebf8ff', padding: '0.6rem', borderRadius: '0.375rem', fontSize: '0.8rem', color: '#2b6cb0', borderLeft: '3px solid #3182ce' }}>
                  🤖 <strong>AI NLP Auto-Classifier:</strong> Predicted Category: <strong>{aiPrediction.category}</strong> | Priority: <strong>{aiPrediction.priority}</strong> ({aiPrediction.confidence}% confidence)
                </div>
              )}

              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
              >
                <option value="Plumbing">Plumbing</option>
                <option value="Electrical">Electrical</option>
                <option value="Carpentry">Carpentry</option>
                <option value="Cleanliness">Cleanliness / Hygiene</option>
                <option value="Wi-Fi / IT">Wi-Fi / IT</option>
              </select>

              <select
                value={form.priority}
                onChange={e => setForm({ ...form, priority: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
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
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: '#667eea', color: '#fff', fontWeight: 600 }}
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
