import React, { useState } from 'react';
import { initialLedger, generateHash, type BlockchainBlock } from '../services/blockchainService';
import '../styles/AdminComponents.css';

export const BlockchainPage: React.FC = () => {
  const [blocks, setBlocks] = useState<BlockchainBlock[]>(initialLedger);
  const [refInput, setRefInput] = useState('');

  const handleAddRecord = () => {
    if (!refInput) return;
    const lastBlock = blocks[blocks.length - 1];
    const newBlock: BlockchainBlock = {
      blockIndex: lastBlock.blockIndex + 1,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      recordType: 'Fee Payment',
      referenceId: refInput,
      dataHash: generateHash(refInput + Date.now()),
      previousHash: lastBlock.dataHash,
      validator: 'Node-Admin-01',
    };
    setBlocks([...blocks, newBlock]);
    setRefInput('');
  };

  return (
    <div className="admin-page">
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🔗 Cryptographic Blockchain Immutable Ledger</h1>
        <p style={{ color: '#718096', fontSize: '0.9rem' }}>
          Tamper-evident record hashing for fee payment confirmations, hostel lease agreements, and maintenance logs
        </p>
      </div>

      <div style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <input
            type="text"
            placeholder="Enter Reference ID or Contract Text"
            value={refInput}
            onChange={e => setRefInput(e.target.value)}
            style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '0.375rem', border: '1px solid #cbd5e0' }}
          />
          <button
            onClick={handleAddRecord}
            style={{ padding: '0.6rem 1.25rem', backgroundColor: '#805ad5', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
          >
            ⛏️ Mine Block & Commit
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {blocks.map(b => (
            <div key={b.blockIndex} style={{ backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.25rem', borderRadius: '0.5rem', fontFamily: 'monospace', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#38bdf8', marginBottom: '0.5rem' }}>
                <span>Block #{b.blockIndex} • {b.recordType}</span>
                <span>Validator: {b.validator}</span>
              </div>
              <div>Ref: {b.referenceId} ({b.timestamp})</div>
              <div style={{ color: '#4ade80', margin: '0.4rem 0' }}>Data Hash: {b.dataHash}</div>
              <div style={{ color: '#94a3b8' }}>Previous Block Hash: {b.previousHash}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlockchainPage;
