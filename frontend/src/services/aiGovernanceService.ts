// AI Governance & Audit Trail Service (AIInference & AuditLog)
// Enforces Human-in-the-Loop (HITL) approval rules: AI recommends -> Human approves -> System executes

export interface AIInferenceAuditRecord {
  inferenceId: string;
  modelName: string;
  modelVersion: string;
  inputs: Record<string, any>;
  prediction: any;
  confidence: number;
  shapAttributions: Record<string, number>;
  humanApproved: boolean;
  approvedBy: string | null;
  timestamp: string;
  tenantId: string;
}

class AIGovernanceStore {
  private auditLogs: AIInferenceAuditRecord[] = [
    {
      inferenceId: 'INF-9041',
      modelName: 'IoT Predictive Maintenance (Logistic Regression)',
      modelVersion: 'v2.1',
      inputs: { tempC: 44, vibrationRms: 8.4, currentAmp: 11.2, daysSinceService: 210 },
      prediction: 'High Failure Risk (87%)',
      confidence: 94,
      shapAttributions: { Vibration: 38, Temp: 24, Age: 15 },
      humanApproved: true,
      approvedBy: 'Warden Davis (warden@hostelai.com)',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      tenantId: 'TENANT-NORTH',
    },
    {
      inferenceId: 'INF-9042',
      modelName: 'Complaint NLP Classifier (Naive Bayes)',
      modelVersion: 'v1.4',
      inputs: { description: 'Water leaking under sink in Room 104' },
      prediction: 'Plumbing (High Priority)',
      confidence: 92,
      shapAttributions: { 'leak': 45, 'sink': 30, 'water': 17 },
      humanApproved: true,
      approvedBy: 'Auto-Triage Warden',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      tenantId: 'TENANT-NORTH',
    },
  ];

  logInference(
    modelName: string,
    modelVersion: string,
    inputs: Record<string, any>,
    prediction: any,
    confidence: number,
    shapAttributions: Record<string, number>,
    tenantId = 'TENANT-NORTH'
  ): AIInferenceAuditRecord {
    const record: AIInferenceAuditRecord = {
      inferenceId: `INF-${Math.floor(1000 + Math.random() * 9000)}`,
      modelName,
      modelVersion,
      inputs,
      prediction,
      confidence,
      shapAttributions,
      humanApproved: false,
      approvedBy: null,
      timestamp: new Date().toISOString(),
      tenantId,
    };
    this.auditLogs.unshift(record);
    return record;
  }

  approveInference(inferenceId: string, approvedBy: string): boolean {
    const found = this.auditLogs.find(a => a.inferenceId === inferenceId);
    if (found) {
      found.humanApproved = true;
      found.approvedBy = approvedBy;
      return true;
    }
    return false;
  }

  getAuditLogs(): AIInferenceAuditRecord[] {
    return [...this.auditLogs];
  }
}

export const aiGovernance = new AIGovernanceStore();
