// Multi-Tenant SaaS Data Isolation Service for HostelAI

export interface TenantInfo {
  tenantId: string;
  name: string;
  organization: string;
  campusCity: string;
}

export const initialTenants: TenantInfo[] = [
  { tenantId: 'TENANT-NORTH', name: 'Horizon Hostel - North Campus', organization: 'University of Delhi', campusCity: 'New Delhi' },
  { tenantId: 'TENANT-SOUTH', name: 'Technopark Residency - South Campus', organization: 'Mumbai University', campusCity: 'Mumbai' },
  { tenantId: 'TENANT-BLR', name: 'Silicon Valley Residency', organization: 'Bangalore Tech Institute', campusCity: 'Bengaluru' },
];

class TenantContextManager {
  private activeTenant: TenantInfo = initialTenants[0];

  getActiveTenant(): TenantInfo {
    return this.activeTenant;
  }

  setActiveTenant(tenantId: string): TenantInfo {
    const found = initialTenants.find(t => t.tenantId === tenantId);
    if (found) {
      this.activeTenant = found;
      localStorage.setItem('activeTenantId', tenantId);
    }
    return this.activeTenant;
  }
}

export const tenantService = new TenantContextManager();
