export interface CopilotQueryResult {
  query: string;
  answer: string;
  suggestedActions: string[];
  dataPoints?: Record<string, string | number>[];
  type: 'text' | 'chart' | 'action' | 'warning';
}

export function parseCopilotQuery(query: string): CopilotQueryResult {
  const q = query.toLowerCase();

  if (q.includes('maintenance') || q.includes('need maintenance') || q.includes('repair')) {
    return {
      query,
      answer: 'Based on IoT telemetry and complaint history, Rooms 104 (AC Compressor vibration) and 302 (Water pressure drop) are predicted to need maintenance within 5 days.',
      suggestedActions: ['Schedule Work Order for Room 104', 'Schedule Work Order for Room 302', 'Order Spare Parts'],
      dataPoints: [
        { room: 'Room 104', asset: 'AC Unit', riskScore: '89%', failureEst: '3 Days' },
        { room: 'Room 302', asset: 'Water Pump', riskScore: '74%', failureEst: '5 Days' },
      ],
      type: 'warning',
    };
  }

  if (q.includes('fee') || q.includes('overdue') || q.includes('pending payment')) {
    return {
      query,
      answer: 'There are currently 4 students with overdue hostel fees totaling ₹45,000. Automated SMS reminders were dispatched yesterday.',
      suggestedActions: ['Send Parent Reminder WhatsApp', 'Generate Fee Defaulter PDF Report', 'Apply Late Fee Penalty'],
      dataPoints: [
        { student: 'Rahul Verma (STU004)', due: '₹12,500', daysOverdue: 14 },
        { student: 'Sneha Patel (STU009)', due: '₹10,000', daysOverdue: 8 },
        { student: 'Vikram Singh (STU012)', due: '₹15,000', daysOverdue: 21 },
        { student: 'Ananya Roy (STU015)', due: '₹7,500', daysOverdue: 5 },
      ],
      type: 'chart',
    };
  }

  if (q.includes('report') || q.includes('complaint') || q.includes('summary')) {
    return {
      query,
      answer: 'Monthly Complaint Report generated: 160 total complaints logged this month (85% Plumbing & Wi-Fi). Average resolution time dropped to 4.2 hours.',
      suggestedActions: ['Export Monthly Report (PDF)', 'Email Summary to Director', 'View Category Breakdown'],
      dataPoints: [
        { category: 'Plumbing', count: 48, avgTime: '3.1 hrs' },
        { category: 'Wi-Fi / IT', count: 52, avgTime: '1.8 hrs' },
        { category: 'Electrical', count: 34, avgTime: '5.4 hrs' },
        { category: 'Cleanliness', count: 26, avgTime: '2.0 hrs' },
      ],
      type: 'chart',
    };
  }

  if (q.includes('occupancy') || q.includes('vacant') || q.includes('empty')) {
    return {
      query,
      answer: 'Current Hostel Occupancy is 98.5% (197 / 200 beds filled). 3 beds available in Block B (Standard Rooms).',
      suggestedActions: ['Run Smart Room Matcher for New Applicants', 'View Digital Twin 3D Layout'],
      type: 'text',
    };
  }

  return {
    query,
    answer: `Analysis complete for: "${query}". All hostel subsystems (IoT, Security, Financials) are operating within optimal parameters.`,
    suggestedActions: ['View Live 3D Digital Twin', 'Check AI Security Risk Matrix', 'Export Daily Log'],
    type: 'text',
  };
}
