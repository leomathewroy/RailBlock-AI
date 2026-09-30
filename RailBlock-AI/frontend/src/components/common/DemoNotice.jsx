import React, { useState } from 'react';

const DemoNotice = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div style={{
      backgroundColor: 'rgba(212, 168, 71, 0.1)',
      borderBottom: '1px solid var(--accent-gold)',
      padding: '0.5rem 1rem',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '1rem',
      position: 'relative',
      zIndex: 10
    }}>
      <span style={{ fontSize: '0.875rem', color: 'var(--accent-gold)' }}>
        <strong style={{ marginRight: '0.5rem' }}>DEMO MODE:</strong>
        This application is running with simulated data. Changes will not affect production systems.
      </span>
      <button 
        onClick={() => setVisible(false)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--text-secondary)',
          cursor: 'pointer',
          position: 'absolute',
          right: '1rem',
          fontSize: '1.2rem'
        }}
      >
        &times;
      </button>
    </div>
  );
};

export default DemoNotice;
