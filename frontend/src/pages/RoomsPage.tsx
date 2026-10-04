import React, { useState, useEffect } from 'react';
import { api, type RoomApiItem, type CreateRoomPayload } from '../services/api';
import '../styles/AdminComponents.css';

export const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState<CreateRoomPayload>({
    roomNumber: '',
    floor: 1,
    capacity: 2,
    roomType: 'Standard',
    status: 'Available',
  });

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await api.getRooms();
      setRooms(data);
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRoom(form);
      setShowModal(false);
      setForm({
        roomNumber: '',
        floor: 1,
        capacity: 2,
        roomType: 'Standard',
        status: 'Available',
      });
      loadRooms();
    } catch (err: any) {
      alert(err.message || 'Failed to create room');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return { bg: '#c6f6d5', color: '#22543d' };
      case 'occupied':
        return { bg: '#feebc8', color: '#744210' };
      case 'maintenance':
        return { bg: '#fed7d7', color: '#742a2a' };
      default:
        return { bg: '#edf2f7', color: '#4a5568' };
    }
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🏠 Room & Bed Management</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>Monitor capacity, bed allocations, and maintenance statuses</p>
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
          + Add New Room
        </button>
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#718096' }}>Loading room allocations...</div>
      ) : error ? (
        <div style={{ padding: '1rem', background: '#fed7d7', color: '#9b2c2c', borderRadius: '0.5rem' }}>{error}</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {rooms.map(room => {
            const badge = getStatusColor(room.status);
            return (
              <div
                key={room.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#2d3748' }}>Room {room.roomNumber}</span>
                  <span
                    style={{
                      padding: '0.25rem 0.6rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: badge.bg,
                      color: badge.color,
                    }}
                  >
                    {room.status}
                  </span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                  <div>Floor {room.floor} • {room.roomType}</div>
                </div>

                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.25rem' }}>
                    <span>Occupancy</span>
                    <span style={{ fontWeight: 600 }}>{room.occupiedBeds} / {room.capacity} Beds</span>
                  </div>
                  <div style={{ height: '6px', backgroundColor: '#edf2f7', borderRadius: '3px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: `${Math.min(100, (room.occupiedBeds / room.capacity) * 100)}%`,
                        backgroundColor: room.occupiedBeds === room.capacity ? '#e53e3e' : '#4299e1',
                        borderRadius: '3px',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
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
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', fontWeight: 700 }}>Add New Room</h2>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <input
                type="text"
                placeholder="Room Number (e.g. 101-A)"
                required
                value={form.roomNumber}
                onChange={e => setForm({ ...form, roomNumber: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
              />
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="number"
                  placeholder="Floor"
                  min={1}
                  required
                  value={form.floor}
                  onChange={e => setForm({ ...form, floor: parseInt(e.target.value) || 1 })}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
                />
                <input
                  type="number"
                  placeholder="Capacity (Beds)"
                  min={1}
                  required
                  value={form.capacity}
                  onChange={e => setForm({ ...form, capacity: parseInt(e.target.value) || 1 })}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
                />
              </div>

              <select
                value={form.roomType}
                onChange={e => setForm({ ...form, roomType: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
              >
                <option value="Standard">Standard</option>
                <option value="Deluxe">Deluxe</option>
                <option value="AC Double">AC Double</option>
                <option value="Single Private">Single Private</option>
              </select>

              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value })}
                style={{ padding: '0.6rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0', background: '#fff' }}
              >
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
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
                  Save Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsPage;
