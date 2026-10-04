import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AICopilotModal } from './AICopilotModal';
import { DigitalIDModal } from './DigitalIDModal';
import '../styles/Sidebar.css';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  roles?: string[];
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showCopilot, setShowCopilot] = useState(false);
  const [showDigitalId, setShowDigitalId] = useState(false);

  const menuStructure: MenuSection[] = [
    {
      title: 'MAIN OPERATIONS',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
        { id: 'digital-twin', label: '3D Digital Twin', icon: '🏢', path: '/digital-twin' },
        { id: 'students', label: 'Students', icon: '👨‍🎓', path: '/students' },
        { id: 'rooms', label: 'Rooms & Beds', icon: '🏠', path: '/rooms' },
        { id: 'complaints', label: 'Maintenance', icon: '⚠️', path: '/complaints' },
        { id: 'payments', label: 'Financials & Fees', icon: '💳', path: '/payments' },
      ],
    },
    {
      title: 'SMART CAMPUS & IOT',
      items: [
        { id: 'predictive-maintenance', label: 'Predictive IoT', icon: '⚙️', path: '/predictive-maintenance' },
        { id: 'energy-water', label: 'Energy & Water', icon: '⚡', path: '/energy-water' },
        { id: 'cctv-security', label: 'AI CCTV & Risk', icon: '📹', path: '/cctv-security' },
        { id: 'emergency-response', label: 'Emergency SOS', icon: '🚨', path: '/emergency-response' },
        { id: 'autonomous-ops', label: 'Auto Ops Center', icon: '🤖', path: '/autonomous-ops' },
      ],
    },
    {
      title: 'STUDENT LIFE & COMMUNITY',
      items: [
        { id: 'room-matcher', label: 'Roommate Matcher', icon: '🧩', path: '/room-matcher' },
        { id: 'meal-optimization', label: 'Mess & Meal AI', icon: '🍽️', path: '/meal-optimization' },
        { id: 'marketplace', label: 'Marketplace', icon: '🛍️', path: '/marketplace' },
        { id: 'community', label: 'Hostel Clubs', icon: '🎉', path: '/community' },
        { id: 'parent-portal', label: 'Parent Portal', icon: '👨‍👩‍👧', path: '/parent-portal' },
        { id: 'welfare-support', label: 'Wellbeing Support', icon: '❤️', path: '/welfare-support' },
      ],
    },
    {
      title: 'ADVANCED & AI RESEARCH',
      items: [
        { id: 'doc-verification', label: 'Doc OCR Verify', icon: '📄', path: '/doc-verification' },
        { id: 'blockchain', label: 'Blockchain Ledger', icon: '🔗', path: '/blockchain' },
        { id: 'sustainability', label: 'Carbon Footprint', icon: '🌱', path: '/sustainability' },
        { id: 'multi-campus', label: 'Multi-Campus', icon: '🌐', path: '/multi-campus' },
        { id: 'research-lab', label: 'Research AI Lab', icon: '🔬', path: '/research-lab' },
        { id: 'ai-eval', label: 'AI Benchmarks & Eval', icon: '📊', path: '/ai-eval' },
        { id: 'profile', label: 'Profile & Settings', icon: '👤', path: '/profile' },
      ],
    },
  ];

  const filteredMenu = menuStructure
    .map(section => ({
      ...section,
      items: section.items.filter(item => !item.roles || item.roles.includes(user?.role || '')),
    }))
    .filter(section => section.items.length > 0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="sidebar-mobile-toggle"
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        aria-label="Toggle sidebar"
      >
        ☰
      </button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : 'collapsed'} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🏨</span>
            {isOpen && <span className="logo-text">HostelAI</span>}
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle sidebar width"
          >
            {isOpen ? '◀' : '▶'}
          </button>
        </div>

        {/* User Card */}
        {isOpen && (
          <div className="sidebar-user-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="user-avatar">👤</div>
              <div className="user-info">
                <p className="user-name">{user?.fullName || 'User'}</p>
                <p className="user-role">{user?.role || 'Guest'}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
              <button
                onClick={() => setShowCopilot(true)}
                style={{
                  flex: 1,
                  padding: '0.3rem 0.5rem',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🤖 Copilot
              </button>
              <button
                onClick={() => setShowDigitalId(true)}
                style={{
                  flex: 1,
                  padding: '0.3rem 0.5rem',
                  backgroundColor: '#4f46e5',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.25rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                🪪 Digital ID
              </button>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="sidebar-nav">
          {filteredMenu.map(section => (
            <div key={section.title} className="nav-section">
              {isOpen && <h4 className="nav-section-title">{section.title}</h4>}
              <ul className="nav-items">
                {section.items.map(item => (
                  <li key={item.id}>
                    <button
                      className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                      onClick={() => handleMenuClick(item.path)}
                      title={item.label}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      {isOpen && <span className="nav-label">{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="logout-btn"
            onClick={handleLogout}
            title="Logout"
          >
            <span className="logout-icon">🚪</span>
            {isOpen && <span className="logout-label">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Modals */}
      <AICopilotModal isOpen={showCopilot} onClose={() => setShowCopilot(false)} />
      <DigitalIDModal isOpen={showDigitalId} onClose={() => setShowDigitalId(false)} />
    </>
  );
};
