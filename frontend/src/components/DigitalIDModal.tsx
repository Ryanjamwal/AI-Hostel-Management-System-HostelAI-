import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface DigitalIDModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalIDModal: React.FC<DigitalIDModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();

  if (!isOpen) return null;

  const qrData = `HOSTELAI-PASS:${user?.email}:${user?.role}:VALID-2026`;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
          color: '#fff',
          borderRadius: '1.25rem',
          padding: '2rem',
          width: '90%',
          maxWidth: '380px',
          border: '1px solid #4338ca',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative',
          textAlign: 'center',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#a5b4fc', fontSize: '1.2rem', cursor: 'pointer' }}
        >
          ✕
        </button>

        <div style={{ fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c7d2fe', marginBottom: '0.5rem' }}>
          HostelAI Digital Pass
        </div>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, margin: '0 0 1.5rem 0', color: '#e0e7ff' }}>
          {user?.fullName || 'Hostel Resident'}
        </h3>

        {/* Dynamic QR Display */}
        <div style={{ backgroundColor: '#fff', padding: '1.25rem', borderRadius: '1rem', display: 'inline-block', marginBottom: '1.5rem' }}>
          <svg width="150" height="150" viewBox="0 0 100 100">
            <rect width="100" height="100" fill="#fff" />
            <path d="M10,10 h30 v30 h-30 z M20,20 h10 v10 h-10 z" fill="#1e1b4b" />
            <path d="M60,10 h30 v30 h-30 z M70,20 h10 v10 h-10 z" fill="#1e1b4b" />
            <path d="M10,60 h30 v30 h-30 z M20,70 h10 v10 h-10 z" fill="#1e1b4b" />
            <rect x="45" y="45" width="10" height="10" fill="#6366f1" />
            <rect x="60" y="60" width="20" height="20" fill="#1e1b4b" />
            <rect x="45" y="75" width="15" height="15" fill="#4f46e5" />
          </svg>
        </div>

        <div style={{ fontSize: '0.85rem', color: '#a5b4fc', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
          <div>Role: <strong>{user?.role}</strong></div>
          <div>NFC Status: <span style={{ color: '#4ade80' }}>Active for Gate / Dining</span></div>
          <div style={{ fontSize: '0.75rem', color: '#818cf8', marginTop: '0.5rem', fontFamily: 'monospace' }}>
            {qrData}
          </div>
        </div>
      </div>
    </div>
  );
};
