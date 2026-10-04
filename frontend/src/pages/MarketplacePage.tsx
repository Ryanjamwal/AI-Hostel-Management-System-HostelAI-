import React, { useState } from 'react';
import '../styles/AdminComponents.css';

interface Listing {
  id: number;
  title: string;
  category: 'Textbooks' | 'Electronics' | 'Cab Share' | 'Equipment';
  price: string;
  seller: string;
  location: string;
}

export const MarketplacePage: React.FC = () => {
  const [listings] = useState<Listing[]>([
    { id: 1, title: 'Data Structures & Algorithms textbook (Cormen 3rd ed)', category: 'Textbooks', price: '₹450', seller: 'STU003 (Rohan)', location: 'Room 102' },
    { id: 2, title: 'Shared Taxi to New Delhi Airport - Aug 15 Morning', category: 'Cab Share', price: '₹350 / seat', seller: 'STU009 (Sneha)', location: 'Block B' },
    { id: 3, title: 'Study Desk Lamp & Extension Cord', category: 'Electronics', price: '₹200', seller: 'STU004 (Rahul)', location: 'Room 201' },
  ]);

  return (
    <div className="admin-page">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#1a202c' }}>🛍️ Student Marketplace & Cab Pool</h1>
          <p style={{ color: '#718096', fontSize: '0.9rem' }}>
            Peer-to-peer textbook exchange, shared airport rides, study equipment borrowing, and AI recommendations
          </p>
        </div>
        <button
          onClick={() => alert('Opening New Listing Form...')}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#38a169', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}
        >
          + Post New Listing
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {listings.map(l => (
          <div key={l.id} style={{ backgroundColor: '#fff', borderRadius: '0.75rem', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.2rem 0.5rem', borderRadius: '1rem' }}>
                  {l.category}
                </span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#276749' }}>{l.price}</span>
              </div>
              <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.05rem', color: '#2d3748' }}>{l.title}</h4>
              <div style={{ fontSize: '0.8rem', color: '#718096' }}>Posted by {l.seller} • {l.location}</div>
            </div>

            <button
              onClick={() => alert(`Contact request sent to ${l.seller}`)}
              style={{ marginTop: '1rem', width: '100%', padding: '0.5rem', backgroundColor: '#3182ce', color: '#fff', border: 'none', borderRadius: '0.375rem', fontWeight: 600, cursor: 'pointer' }}
            >
              💬 Contact Seller
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplacePage;
