export interface BlockchainBlock {
  blockIndex: number;
  timestamp: string;
  recordType: 'Fee Payment' | 'Hostel Agreement' | 'Maintenance Log' | 'Digital Certificate';
  referenceId: string;
  dataHash: string;
  previousHash: string;
  validator: string;
}

export function generateHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return '0x' + Math.abs(hash).toString(16).padStart(16, '0') + Math.abs(hash * 31).toString(16).padStart(16, '0');
}

export const initialLedger: BlockchainBlock[] = [
  {
    blockIndex: 1,
    timestamp: '2026-08-01 09:15:00',
    recordType: 'Hostel Agreement',
    referenceId: 'AGR-2026-001',
    dataHash: generateHash('AGR-2026-001-AaravSharma'),
    previousHash: '0x00000000000000000000000000000000',
    validator: 'Node-Admin-01',
  },
  {
    blockIndex: 2,
    timestamp: '2026-08-05 14:22:10',
    recordType: 'Fee Payment',
    referenceId: 'TXN-984210',
    dataHash: generateHash('TXN-984210-₹4500'),
    previousHash: generateHash('AGR-2026-001-AaravSharma'),
    validator: 'Node-Financial-02',
  },
  {
    blockIndex: 3,
    timestamp: '2026-08-09 11:05:44',
    recordType: 'Maintenance Log',
    referenceId: 'MNT-8812',
    dataHash: generateHash('MNT-8812-AC-Fixed'),
    previousHash: generateHash('TXN-984210-₹4500'),
    validator: 'Node-Warden-01',
  },
];
