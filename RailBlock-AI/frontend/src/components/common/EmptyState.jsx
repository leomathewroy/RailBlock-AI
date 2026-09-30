import React from 'react';

const EmptyState = ({ title = 'No Data Available', description = 'There is currently no data to display.', icon = '📭' }) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '4rem 2rem',
      color: 'var(--text-secondary)',
      textAlign: 'center'
    }}>
      <span style={{ fontSize: '4rem', opacity: 0.5, marginBottom: '1rem' }}>{icon}</span>
      <h3 style={{ color: 'var(--text-primary)', margin: '0 0 0.5rem 0' }}>{title}</h3>
      <p style={{ margin: 0, maxWidth: '300px' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
