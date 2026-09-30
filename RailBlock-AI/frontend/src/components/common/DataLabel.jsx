import React from 'react';

const DataLabel = ({ label, value, unit, highlight = false }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem' }}>
        <span style={{ 
          fontSize: '1.25rem', 
          fontWeight: 600, 
          color: highlight ? 'var(--accent-gold)' : 'var(--text-primary)' 
        }}>
          {value}
        </span>
        {unit && <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{unit}</span>}
      </div>
    </div>
  );
};

export default DataLabel;
