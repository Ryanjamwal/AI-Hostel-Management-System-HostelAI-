import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/Auth.css';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@hostelai.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Password@123');
    setError('');
    setIsLoading(true);
    try {
      await login(demoEmail, 'Password@123');
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="auth-header">
          <h1 className="auth-title">HostelAI</h1>
          <p className="auth-subtitle">Smart Hostel Management Platform</p>
        </div>

        {/* Quick Demo Login Chips */}
        <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#718096', marginBottom: '0.5rem' }}>
            ⚡ Quick 1-Click Demo Login:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
            {[
              { label: '👑 Admin', email: 'admin@hostelai.com' },
              { label: '🛡️ Warden', email: 'warden@hostelai.com' },
              { label: '💼 Accountant', email: 'accountant@hostelai.com' },
              { label: '👮 Security', email: 'security@hostelai.com' },
              { label: '🎓 Student', email: 'student@hostelai.com' },
            ].map(chip => (
              <button
                key={chip.email}
                type="button"
                onClick={() => handleQuickLogin(chip.email)}
                style={{
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '1rem',
                  border: '1px solid #cbd5e0',
                  backgroundColor: '#edf2f7',
                  color: '#2d3748',
                  cursor: 'pointer',
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="form-input"
            />
          </div>

          {error && <div className="error-message" style={{ color: '#e53e3e', fontSize: '0.85rem', marginTop: '0.5rem' }}>{error}</div>}

          <button type="submit" disabled={isLoading} className="submit-button" style={{ marginTop: '1rem' }}>
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
