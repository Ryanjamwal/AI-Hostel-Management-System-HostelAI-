import React, { useState, useEffect } from 'react';
import { api, type StudentApiItem, type CreateStudentPayload } from '../services/api';
import '../styles/AdminComponents.css';

export const StudentsPage: React.FC = () => {
  const [students, setStudents] = useState<StudentApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<CreateStudentPayload>({
    fullName: '',
    email: '',
    studentCode: '',
    department: 'Computer Science',
    yearOfStudy: 1,
    phoneNumber: '',
    emergencyContact: '',
    medicalInfo: 'None',
  });

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getStudents();
      setStudents(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createStudent(form);
      setShowModal(false);
      setForm({
        fullName: '',
        email: '',
        studentCode: '',
        department: 'Computer Science',
        yearOfStudy: 1,
        phoneNumber: '',
        emergencyContact: '',
        medicalInfo: 'None',
      });
      loadStudents();
    } catch (err: any) {
      alert(err.message || 'Failed to create student');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this student record?')) return;
    try {
      await api.deleteStudent(id);
      loadStudents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete student');
    }
  };

  const filteredStudents = students.filter(s => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.studentCode.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesDept = deptFilter === 'All' || s.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(students.map(s => s.department)))];

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>👨‍🎓 Student Management</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Manage enrolled residents, personal records, and contact details</p>
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
          + Add New Student
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="🔍 Search by name, code, or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1,
            minWidth: '240px',
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            outline: 'none',
          }}
        />
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid #e2e8f0',
            backgroundColor: '#fff',
          }}
        >
          {departments.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading student directory...</div>
      ) : error ? (
        <div style={{ padding: '1rem', background: '#fed7d7', color: '#9b2c2c', borderRadius: '0.5rem' }}>{error}</div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead style={{ backgroundColor: '#f7fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '1rem' }}>Code</th>
                <th style={{ padding: '1rem' }}>Name</th>
                <th style={{ padding: '1rem' }}>Department</th>
                <th style={{ padding: '1rem' }}>Year</th>
                <th style={{ padding: '1rem' }}>Phone</th>
                <th style={{ padding: '1rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#a0aec0' }}>
                    No students found.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #edf2f7' }}>
                    <td style={{ padding: '1rem', fontWeight: 600, color: '#4a5568' }}>{s.studentCode}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 600, color: '#2d3748' }}>{s.fullName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a0aec0' }}>{s.email}</div>
                    </td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>{s.department}</td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>Yr {s.yearOfStudy}</td>
                    <td style={{ padding: '1rem', color: '#4a5568' }}>{s.phoneNumber || 'N/A'}</td>
                    <td style={{ padding: '1rem' }}>
                      <button
                        onClick={() => handleDelete(s.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#e53e3e',
                          cursor: 'pointer',
                          fontWeight: 600,
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
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
          <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '2rem', width: '90%', maxWidth: '500px' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Register New Student</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />
              <input
                type="text"
                placeholder="Student Code (e.g. STU009)"
                required
                value={form.studentCode}
                onChange={e => setForm({ ...form, studentCode: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Department"
                  required
                  value={form.department}
                  onChange={e => setForm({ ...form, department: e.target.value })}
                  style={{ flex: 2, padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
                />
                <input
                  type="number"
                  placeholder="Year"
                  min={1}
                  max={5}
                  value={form.yearOfStudy}
                  onChange={e => setForm({ ...form, yearOfStudy: parseInt(e.target.value) || 1 })}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
                />
              </div>
              <input
                type="text"
                placeholder="Phone Number"
                value={form.phoneNumber}
                onChange={e => setForm({ ...form, phoneNumber: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />
              <input
                type="text"
                placeholder="Emergency Contact"
                value={form.emergencyContact}
                onChange={e => setForm({ ...form, emergencyContact: e.target.value })}
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
                  style={{ padding: '0.5rem 1rem', borderRadius: '0.375rem', border: 'none', background: '#667eea', color: '#fff', fontWeight: 600 }}
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
