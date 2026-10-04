import React, { useState } from 'react';
import { tenantService, initialTenants, type TenantInfo } from '../services/tenantService';
import '../styles/AdminComponents.css';

export const MultiCampusPage: React.FC = () => {
  const [activeTenant, setActiveTenant] = useState<TenantInfo>(tenantService.getActiveTenant());

  const handleSwitchTenant = (id: string) => {
    const updated = tenantService.setActiveTenant(id);
    setActiveTenant(updated);
    alert(`Active Tenant Context switched to: ${updated.name} (${updated.organization})`);
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🌐 Multi-Tenant SaaS Isolation & Organization Context</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Isolated data tenancy across multiple universities and hostels with centralized executive administration
        </p>
      </div>

      <div style={{ backgroundColor: '#ebf8ff', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #90cdf4', marginBottom: '1.5rem', color: '#2b6cb0' }}>
        🏢 <strong>Current Active Tenant Context:</strong> {activeTenant.name} | Organization: <strong>{activeTenant.organization}</strong> ({activeTenant.campusCity})
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {initialTenants.map(c => {
          const isSelected = c.tenantId === activeTenant.tenantId;
          return (
            <div
              key={c.tenantId}
              style={{
                backgroundColor: '#fff',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                border: isSelected ? '2px solid #3182ce' : '1px solid #e2e8f0',
                boxShadow: isSelected ? '0 4px 12px rgba(49, 130, 206, 0.15)' : 'none',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#667eea', backgroundColor: '#ebf8ff', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                  {c.campusCity}
                </span>
                {isSelected && (
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#c6f6d5', color: '#22543d', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                    ACTIVE TENANT
                  </span>
                )}
              </div>

              <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#2d3748' }}>{c.name}</h3>
              <div style={{ fontSize: '0.85rem', color: '#718096', marginBottom: '1rem' }}>
                Organization: <strong>{c.organization}</strong>
              </div>

              <button
                onClick={() => handleSwitchTenant(c.tenantId)}
                disabled={isSelected}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: isSelected ? '#e2e8f0' : '#3182ce',
                  color: isSelected ? '#a0aec0' : '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: 600,
                  cursor: isSelected ? 'default' : 'pointer',
                }}
              >
                {isSelected ? '✓ Currently Selected Tenant' : '🔄 Switch Active Tenant Context'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MultiCampusPage;
